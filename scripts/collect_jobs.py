#!/usr/bin/env python3
"""Collect real job postings from public company job boards and summarize
which skills each role asks for.

Sources: the public, unauthenticated job-board APIs that companies expose for
embedding their careers pages (Greenhouse, Lever, Ashby). Each posting is
matched to zero or more roles by title, then scanned for skill mentions with
the regex taxonomy below. Output: jobs-data.js (window.JOBDATA = {...}).

Runs in GitHub Actions (see .github/workflows/refresh-data.yml). Stdlib only.
"""
import concurrent.futures as cf
import datetime as dt
import hashlib
import html
import json
import re
import sys
import time
import urllib.request
from collections import defaultdict
from pathlib import Path

UA = "ai-resistant-roadmap-data-collector (+https://github.com/Sraote/ai-resistant-roadmap)"

GREENHOUSE = """airbnb stripe databricks figma dropbox discord reddit robinhood coinbase instacart lyft
pinterest gitlab hubspot twilio okta datadog elastic mongodb cloudflare gusto brex affirm chime asana
airtable duolingo squarespace peloton grammarly samsara scaleai anthropic webflow flexport faire klaviyo
toast betterment sofi nerdwallet opendoor thumbtack udemy coursera khanacademy wikimedia mozilla fivetran
dbtlabsinc hashicorp newrelic pagerduty launchdarkly amplitude mixpanel contentful intercom buzzfeed
voxmedia nytimes etsy wayfair doordashusa roblox unity3d twitch block carta gemini chainalysis benchling
flatironhealth oscar ziprecruiter justworks warbyparker seatgeek alation collibra sigmacomputing hex
montecarlodata starburst cockroachlabs singlestore clickhouse postman grafanalabs sourcegraph vercel
netlify temporaltechnologies honeycomb cribl rubrik tanium abnormalsecurity verkada andurilindustries
relativityspace nuro aurorainnovation waymo lucidmotors gleanwork calendly squarespace zocdoc goodrx
hellofresh spotify yext appnexus marqeta navan lattice highspot dataiku tripadvisor expedia
ziprecruiter tempus guildeducation headway commonroom vimeo bumble medallia nextdoor quora""".split()

LEVER = """netflix palantir plaid attentive kraken outreach mistral shieldai zoox whoop color ro eventbrite
quizlet lucidsoftware nielsen jumpcloud wealthfront arcadia veeva""".split()

ASHBY = """openai notion ramp linear replit posthog supabase deel retool mercury vanta modal langchain
pinecone cohere runway elevenlabs sierra decagon confluent snowflake hightouch census airbyte
dagster prefect astronomer motherduck neon planetscale render railway clerk resend""".split()

# Lever and Ashby don't return a company name; map slugs to display names.
NAMES = {"openai": "OpenAI", "posthog": "PostHog", "elevenlabs": "ElevenLabs", "langchain": "LangChain",
         "motherduck": "MotherDuck", "planetscale": "PlanetScale", "shieldai": "Shield AI", "ro": "Ro",
         "jumpcloud": "JumpCloud", "lucidsoftware": "Lucid Software", "whoop": "WHOOP", "airbyte": "Airbyte",
         "hightouch": "Hightouch", "supabase": "Supabase", "netflix": "Netflix", "palantir": "Palantir",
         "plaid": "Plaid", "kraken": "Kraken", "mistral": "Mistral AI", "zoox": "Zoox", "color": "Color Health",
         "eventbrite": "Eventbrite", "quizlet": "Quizlet", "nielsen": "Nielsen", "wealthfront": "Wealthfront",
         "arcadia": "Arcadia", "veeva": "Veeva Systems", "attentive": "Attentive", "outreach": "Outreach",
         "notion": "Notion", "ramp": "Ramp", "linear": "Linear", "replit": "Replit", "deel": "Deel",
         "retool": "Retool", "mercury": "Mercury", "vanta": "Vanta", "modal": "Modal", "pinecone": "Pinecone",
         "cohere": "Cohere", "runway": "Runway", "sierra": "Sierra", "decagon": "Decagon", "confluent": "Confluent",
         "snowflake": "Snowflake", "census": "Census", "dagster": "Dagster Labs", "prefect": "Prefect",
         "astronomer": "Astronomer", "neon": "Neon", "render": "Render", "railway": "Railway", "clerk": "Clerk",
         "resend": "Resend"}
name_of = lambda slug: NAMES.get(slug, slug.capitalize())

# ---------------------------------------------------------------- roles
SENIOR = re.compile(r"\b(senior|sr\.?|staff|principal|lead|manager|director|head|vp|vice president|"
                    r"architect|distinguished|chief|president|fellow|iii|iv)\b", re.I)
NOT_PY_SWE = re.compile(r"front[- ]?end|ios|android|mobile|embedded|firmware|hardware|data |machine learning|"
                        r"\bml\b|\bai\b|security|site reliability|\bsre\b|qa\b|test|support|sales|solutions", re.I)

ROLES = {
    "junior-data-analyst": {
        "title": re.compile(r"\b(data|product|analytics|marketing|growth|operations|reporting|insights?|"
                            r"people|finance|financial|customer|risk|strategy) analyst\b|\bdata analytics\b", re.I),
        "exclude": re.compile(r"business intelligence|\bbi\b|security|soc\b|threat", re.I),
    },
    "junior-python-developer": {
        "title": re.compile(r"\b(software|python|backend|back[- ]end|full[- ]?stack|application) "
                            r"(engineer|developer)\b|\bpython developer\b", re.I),
        "exclude": NOT_PY_SWE,
        "requires": re.compile(r"\bPython\b"),
    },
    "data-engineer": {
        "title": re.compile(r"\bdata (platform |infrastructure |integration )?engineer", re.I),
        "exclude": re.compile(r"machine learning|\bml\b", re.I),
    },
    "bi-analyst": {
        "title": re.compile(r"business intelligence|\bBI (analyst|developer|engineer)\b|\breporting analyst\b|"
                            r"\bdashboard", re.I),
    },
    "ml-engineer": {
        "title": re.compile(r"machine learning engineer|\bml engineer|\bmle\b|\bai engineer|\bai/ml engineer|"
                            r"\bml/ai engineer|\bmlops|machine learning (platform|infrastructure)", re.I),
    },
    "data-scientist": {
        "title": re.compile(r"\bdata scien", re.I),
    },
    "backend-developer": {
        "title": re.compile(r"(?=.*\bback[- ]?end\b)(?=.*\b(engineer|developer)\b)|\bserver[- ]side\b|\bapi (engineer|developer)", re.I),
        "exclude": re.compile(r"front[- ]?end only|ios|android", re.I),
        "requires": re.compile(r"\bPython\b"),
    },
    "analytics-engineer": {
        "title": re.compile(r"\banalytics engineer", re.I),
    },
}

# ---------------------------------------------------------------- skills
I = re.I
SKILLS = {
    "sql-basics":     (r"\bSQL\b|PostgreSQL|Postgres\b|MySQL", I),
    "sql-joins":      (r"\bjoins\b|joining (tables|data)|complex (SQL )?quer(y|ies)|advanced SQL|multi-table", I),
    "sql-window":     (r"window functions?|\bCTEs?\b|common table expressions?|advanced SQL", I),
    "excel":          (r"\bExcel\b|[Ss]preadsheets?|Google Sheets|[Pp]ivot tables?", 0),
    "python-core":    (r"\bPython\b", 0),
    "pandas":         (r"\bpandas\b|NumPy|\bdata ?frames?\b|\bPolars\b", I),
    "data-cleaning":  (r"data (cleaning|cleansing|quality|validation|integrity|wrangling|hygiene)|"
                       r"clean(ing)? (data|datasets)|messy data", I),
    "stats":          (r"statistic|A/B test|experiment(al)? design|experimentation|hypothesis test|causal inference", I),
    "viz":            (r"visuali[sz]|matplotlib|seaborn|plotly|ggplot|\bD3\b", I),
    "bi-tools":       (r"Tableau|Power ?BI|Looker|Qlik|Metabase|Superset|Mode Analytics|dashboards?", I),
    "dax":            (r"\bDAX\b", 0),
    "data-modeling":  (r"data model(l)?ing|dimensional model|star schema|Kimball|data models?\b|semantic layer", I),
    "git":            (r"\bgit\b|GitHub|GitLab|Bitbucket|version control", I),
    "cli":            (r"\bLinux\b|\bUnix\b|\bbash\b|shell script|command[- ]line", I),
    "testing":        (r"unit tests?|unit testing|pytest|test[- ]driven|\bTDD\b|automated tests?|"
                       r"integration tests?|testing frameworks?|writing tests", I),
    "oop":            (r"object[- ]oriented|\bOOP\b|design patterns|clean code|SOLID principles|maintainable code", I),
    "api":            (r"\bAPIs?\b|\bREST(ful)?\b|third[- ]party integrations?|webhooks|GraphQL", 0),
    "api-build":      (r"FastAPI|Flask|Django|(build|design|develop)(ing)? (RESTful |REST )?APIs|API design|"
                       r"microservices|web services", I),
    "dsa":            (r"data structures|algorithms|computer science fundamentals|CS fundamentals|"
                       r"time complexity|Big[- ]O\b", I),
    "debugging":      (r"debug|troubleshoot|root cause", I),
    "etl":            (r"\bETL\b|\bELT\b|data pipelines?|data ingestion", I),
    "airflow":        (r"Airflow|Dagster|Prefect|Luigi|orchestration", I),
    "spark":          (r"\bSpark\b|PySpark|Databricks|Hadoop|\bFlink\b|distributed (data )?processing", I),
    "cloud":          (r"\bAWS\b|Azure|\bGCP\b|Google Cloud|\bcloud\b", I),
    "docker":         (r"Docker|Kubernetes|\bk8s\b|containeri[sz]|\bcontainers?\b", I),
    "async":          (r"asyncio|\basync\b|asynchronous|concurren|multi-?thread|parallel processing", I),
    "db-design":      (r"PostgreSQL|Postgres\b|MySQL|relational databases?|database design|schema design|SQL Server", I),
    "linear-algebra": (r"linear algebra|calculus|probability|mathematic|\bmath\b", I),
    "sklearn":        (r"scikit|sklearn|machine learning|\bML\b", I),
    "model-eval":     (r"model (evaluation|validation|performance)|cross[- ]validation|evaluation metrics|"
                       r"offline evaluation|\bevals\b", I),
    "feature-eng":    (r"feature (engineering|selection|stores?|extraction)", I),
    "deep-learning":  (r"PyTorch|TensorFlow|Keras|\bJAX\b|deep learning|neural net", I),
    "mlops":          (r"MLOps|model deployment|deploy(ing)? (ML |machine learning )?models|MLflow|Kubeflow|"
                       r"SageMaker|Vertex AI|model serving|ML infrastructure|models? (in|into|to) production", I),
    "storytelling":   (r"communicat|present(ing|ations?)\b|storytelling|non-technical (audiences?|stakeholders)|"
                       r"stakeholders", I),
}
EXTRAS = {
    "Snowflake":      (r"Snowflake", 0),
    "BigQuery":       (r"BigQuery", I),
    "Redshift":       (r"Redshift", I),
    "dbt":            (r"\bdbt\b", I),
    "Kafka":          (r"Kafka", I),
    "Java":           (r"\bJava\b(?!Script)", 0),
    "Scala":          (r"\bScala\b", 0),
    "JavaScript / TypeScript": (r"JavaScript|TypeScript|Node\.js", I),
    "React":          (r"\bReact\b", 0),
    "Terraform":      (r"Terraform|infrastructure as code", I),
    "CI/CD":          (r"CI/CD|continuous (integration|delivery|deployment)", I),
    "NoSQL":          (r"NoSQL|MongoDB|Cassandra|DynamoDB|Redis", I),
    "LLMs / GenAI":   (r"\bLLMs?\b|large language models?|generative AI|\bGenAI\b|\bRAG\b", I),
}
SKILL_RX = {k: re.compile(p, f) for k, (p, f) in SKILLS.items()}
EXTRA_RX = {k: re.compile(p, f) for k, (p, f) in EXTRAS.items()}
REQ_WORDS = re.compile(r"experience|proficien|familiar|knowledge|ability|skill|understanding|strong|"
                       r"comfortable|expert|fluency|fluent|hands-on|you will|you'll|you have", I)

# ---------------------------------------------------------------- fetching
def get_json(url, tries=2):
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.loads(r.read().decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code in (404, 400, 401, 403):
                return None
        except Exception:
            pass
        time.sleep(1.5 * (attempt + 1))
    return None

def html_to_text(s):
    s = html.unescape(s or "")
    s = re.sub(r"(?i)<\s*(br|/p|/li|/h\d|/div|/ul|/ol|/tr)\s*/?>", "\n", s)
    s = re.sub(r"(?i)<\s*li[^>]*>", "\n", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t ]+", " ", s)
    return re.sub(r"\n\s*\n+", "\n", s).strip()

def from_greenhouse(slug):
    d = get_json(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true")
    if not d or "jobs" not in d:
        return slug, []
    company = None
    out = []
    for j in d["jobs"]:
        company = company or (j.get("company_name") or slug)
        out.append({"title": j.get("title", ""), "url": j.get("absolute_url", ""),
                    "location": (j.get("location") or {}).get("name", ""),
                    "text": html_to_text(j.get("content", "")), "company": j.get("company_name") or slug})
    return slug, out

def from_lever(slug):
    d = get_json(f"https://api.lever.co/v0/postings/{slug}?mode=json")
    if not isinstance(d, list):
        return slug, []
    out = []
    for j in d:
        parts = [j.get("descriptionPlain") or html_to_text(j.get("description", ""))]
        for l in j.get("lists") or []:
            parts.append(l.get("text", ""))
            parts.append(html_to_text(l.get("content", "")))
        parts.append(j.get("additionalPlain") or "")
        out.append({"title": j.get("text", ""), "url": j.get("hostedUrl", ""),
                    "location": (j.get("categories") or {}).get("location", ""),
                    "text": "\n".join(p for p in parts if p), "company": name_of(slug)})
    return slug, out

def from_ashby(slug):
    d = get_json(f"https://api.ashbyhq.com/posting-api/job-board/{slug}?includeCompensation=false")
    if not d or "jobs" not in d:
        return slug, []
    out = []
    for j in d["jobs"]:
        if j.get("isListed") is False:
            continue
        text = j.get("descriptionPlain") or html_to_text(j.get("descriptionHtml", ""))
        out.append({"title": j.get("title", ""), "url": j.get("jobUrl", ""),
                    "location": j.get("location", ""), "text": text, "company": name_of(slug)})
    return slug, out

# ---------------------------------------------------------------- analysis
def lines_of(text):
    for line in text.split("\n"):
        line = line.strip(" •-*·–—\t")
        if len(line) > 260:
            for sent in re.split(r"(?<=[.!?])\s+", line):
                yield sent.strip()
        elif line:
            yield line

def excerpt_candidates(text, rx):
    for line in lines_of(text):
        if 35 <= len(line) <= 240 and rx.search(line):
            score = (2 if REQ_WORDS.search(line) else 0) + (1 if 50 <= len(line) <= 180 else 0)
            yield score, line, rx.search(line).group(0)

def main(out_path):
    jobs, ok_sources = [], []
    tasks = [(from_greenhouse, s, "Greenhouse") for s in dict.fromkeys(GREENHOUSE)] + \
            [(from_lever, s, "Lever") for s in dict.fromkeys(LEVER)] + \
            [(from_ashby, s, "Ashby") for s in dict.fromkeys(ASHBY)]
    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(fn, slug): (slug, src) for fn, slug, src in tasks}
        for f in cf.as_completed(futs):
            slug, src = futs[f]
            try:
                _, items = f.result()
            except Exception as e:
                print(f"! {src}/{slug}: {e}", file=sys.stderr)
                items = []
            if items:
                ok_sources.append({"slug": slug, "board": src, "company": items[0]["company"], "jobs": len(items)})
                jobs.extend(items)
    print(f"Fetched {len(jobs)} postings from {len(ok_sources)} of {len(tasks)} boards")

    # De-duplicate the same posting listed in several locations.
    seen, uniq = set(), []
    for j in jobs:
        key = hashlib.sha1((j["company"].lower() + "|" + j["title"].lower() + "|" + j["text"][:2000]).encode()).hexdigest()
        if key not in seen and len(j["text"]) > 200:
            seen.add(key)
            uniq.append(j)
    print(f"{len(uniq)} unique postings with descriptions")

    roles_out = {}
    for rid, spec in ROLES.items():
        matched = [j for j in uniq if spec["title"].search(j["title"])
                   and not (spec.get("exclude") and spec["exclude"].search(j["title"]))
                   and not (spec.get("requires") and not spec["requires"].search(j["text"]))]
        junior = [j for j in matched if not SENIOR.search(j["title"])]
        # Prefer non-senior postings; fall back to all levels if the sample is too thin.
        sample, includes_senior = (junior, False) if len(junior) >= 25 else (matched, True)
        n = len(sample)
        skills, extras = {}, {}
        for sid, rx in SKILL_RX.items():
            hits = [j for j in sample if rx.search(j["text"])]
            cands = []
            for j in hits:
                best = max(excerpt_candidates(j["text"], rx), default=None)
                if best:
                    cands.append((best[0], hashlib.md5(j["url"].encode()).hexdigest(), best[1], best[2], j))
            cands.sort(key=lambda c: (-c[0], c[1]))
            picked, companies = [], set()
            for _, _, line, match, j in cands:
                if j["company"] in companies:
                    continue
                companies.add(j["company"])
                picked.append({"text": line, "match": match, "company": j["company"], "title": j["title"], "url": j["url"]})
                if len(picked) == 3:
                    break
            skills[sid] = {"count": len(hits), "pct": round(100 * len(hits) / n) if n else 0, "excerpts": picked}
        for name, rx in EXTRA_RX.items():
            c = sum(1 for j in sample if rx.search(j["text"]))
            extras[name] = {"count": c, "pct": round(100 * c / n) if n else 0}
        roles_out[rid] = {
            "n": n, "nAllLevels": len(matched), "nNonSenior": len(junior), "includesSenior": includes_senior,
            "companies": len({j["company"] for j in sample}),
            "skills": skills, "extras": extras,
        }
        print(f"  {rid:26s} n={n:4d} (non-senior {len(junior)}, all levels {len(matched)})")

    data = {
        "collectedAt": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d"),
        "totalPostings": len(uniq),
        "boards": sorted(ok_sources, key=lambda s: -s["jobs"]),
        "roles": roles_out,
    }
    Path(out_path).write_text("// Generated by scripts/collect_jobs.py — do not edit by hand.\n"
                              "window.JOBDATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"Wrote {out_path}")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "jobs-data.js")
