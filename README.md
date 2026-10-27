# AI-Resistant Roadmaps

An interactive tool for Computer Science and Data Science students: search a job role, see the technical skills employers ask for, and get an **AI-Resistant Learning Roadmap** that flags where students typically over-rely on ChatGPT/Copilot — with an off-AI verification challenge for every skill.

**Live site:** https://sraote.github.io/ai-resistant-roadmap/

## Flow

1. **Search** — type a role; the bar autocompletes the closest match inline (Tab or → to accept) and lists suggestions, matching alternate titles ("SDET", "iOS Developer") and typos.
2. **Select your role** — pick from matching role cards.
3. **Generating** — a short transition while the roadmap is assembled.
4. **Roadmap dashboard** — a staged flowchart of skills. Click any node for:
   - 📋 **Key Technical Requirements**: how many real postings for the role mention the skill, with quoted excerpts linked to the original listings
   - ⚠️ **The AI Trap** — how students shortcut the skill, plus warning signs
   - 🛡️ **The Independent Verification Challenge** — a timed, off-AI drill with pass criteria you check off to mark the skill verified

19 roles across data, software, web, mobile, infrastructure, security, QA, embedded and AI.

Extras: dark/light mode, filters (high AI-risk, not yet verified), a challenge timer, keyboard navigation (← → Esc), and progress saved in your browser.

## Stack

Plain HTML, vanilla JavaScript and Tailwind CSS. No backend.

## Data

- **Job postings (real):** `scripts/collect_jobs.py` pulls every open posting from the public Greenhouse, Lever and Ashby job boards of ~180 tech companies, matches postings to roles by title, keeps only internships and junior roles (junior title, or a level-neutral title asking for ≤ 2 years of experience), and counts skill mentions with a keyword taxonomy. It writes `jobs-data.js`. The `refresh-data.yml` workflow runs it every Monday, commits the result and redeploys.
- **Learning content (editorial):** roadmaps, AI-trap write-ups, verification challenges and the AI-trap risk rubric live in `data.js` and are hand-written. Risk = sum of three 1–3 scores (AI fluency, silent failure, live-tested): 8–9 high, 6–7 medium, 3–5 low.

See the site's Methodology page for details and limitations.

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, header, side panel |
| `app.js` | Hash router, the four pages, roadmap wiring, panel, progress |
| `data.js` | Roles, roadmaps, AI traps, challenges, risk rubric (editorial) |
| `jobs-data.js` | Generated posting statistics and excerpts (do not edit) |
| `scripts/collect_jobs.py` | Job-posting collector |
| `input.css` / `tailwind.config.js` | Tailwind source, compiled to `styles.css` on deploy |

## Run locally

```bash
npx tailwindcss@3 -i input.css -o styles.css   # build the stylesheet
python3 -m http.server 8000                     # then open http://localhost:8000
```

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`, which compiles Tailwind and publishes to GitHub Pages.
