#!/usr/bin/env python3
"""Check every learning-resource URL in resources.js. Stdlib only.

Prints one line per URL: OK / REDIRECT / BLOCKED (403/429, likely bot protection;
check by hand) / BROKEN. Exits 1 if any link is BROKEN.
"""
import concurrent.futures as cf
import os
import re
import sys
import urllib.error
import urllib.request

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124.0 Safari/537.36 ai-resistant-roadmap-link-check")

def check(url):
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, method=method, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
            with urllib.request.urlopen(req, timeout=25) as r:
                return url, r.status, r.geturl()
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (400, 403, 404, 405, 429, 500, 501, 503):
                continue  # some servers reject HEAD; retry with GET
            return url, e.code, url
        except Exception as e:
            if method == "HEAD":
                continue
            return url, f"ERR {type(e).__name__}: {e}"[:120], url
    return url, "ERR", url

def main(path):
    urls = list(dict.fromkeys(re.findall(r'\bu:\s*"([^"]+)"', open(path, encoding="utf-8").read())))
    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        results = list(ex.map(check, urls))
    broken = blocked = 0
    lines = []
    for url, status, final in results:
        if isinstance(status, int) and status < 400:
            norm = lambda u: u.rstrip("/").split("#")[0]
            tag = "OK" if norm(final) == norm(url) else "REDIRECT"
        elif status in (401, 403, 429):
            tag, blocked = "BLOCKED", blocked + 1
        else:
            tag, broken = "BROKEN", broken + 1
        lines.append(f"{tag:8} {status} {url}" + (f" -> {final}" if tag == "REDIRECT" else ""))
    order = {"BROKEN": 0, "BLOCKED": 1, "REDIRECT": 2, "OK": 3}
    lines.sort(key=lambda l: order[l.split()[0]])
    print("\n".join(lines))
    print(f"\n{len(urls)} links: {broken} broken, {blocked} blocked (check by hand)")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
            f.write(f"### Resource links\n{len(urls)} checked · **{broken} broken** · {blocked} blocked\n\n```\n"
                    + "\n".join(l for l in lines if not l.startswith("OK")) + "\n```\n")
    if os.environ.get("GITHUB_ACTIONS"):
        # One annotation with the full non-OK report (readable through the checks API).
        body = "\n".join(l for l in lines if not l.startswith("OK")) or "all links OK"
        body = body.replace("%", "%25").replace("\r", "").replace("\n", "%0A")
        print(f"::notice title=Link report ({len(urls)} links, {broken} broken, {blocked} blocked)::{body}")
    return 1 if broken else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "resources.js"))
