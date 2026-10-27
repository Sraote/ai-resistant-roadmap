# AI-Resistant Roadmaps

An interactive tool for Computer Science and Data Science students: search a job role, see the technical skills employers ask for, and get an **AI-Resistant Learning Roadmap** that flags where students typically over-rely on ChatGPT/Copilot — with an off-AI verification challenge for every skill.

**Live site:** https://sraote.github.io/ai-resistant-roadmap/

## Flow

1. **Search** — type a role (e.g. "Junior Data Analyst", "Python Developer", "ML Engineer").
2. **Select your role** — pick from matching role cards.
3. **Generating** — a short transition while the roadmap is assembled.
4. **Roadmap dashboard** — a staged flowchart of skills. Click any node for:
   - 📋 **Key Technical Requirements** drawn from (mock) job descriptions
   - ⚠️ **The AI Trap** — how students shortcut the skill, plus warning signs
   - 🛡️ **The Independent Verification Challenge** — a timed, off-AI drill with pass criteria you check off to mark the skill verified

Extras: dark/light mode, filters (high AI-risk, not yet verified), a challenge timer, keyboard navigation (← → Esc), and progress saved in your browser.

## Stack

Plain HTML, vanilla JavaScript and Tailwind CSS. No backend — all role and skill data is mocked in `data.js`.

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, header, side panel |
| `app.js` | Hash router, the four pages, roadmap wiring, panel, progress |
| `data.js` | Mock roles and skills (requirements, AI traps, challenges) |
| `input.css` / `tailwind.config.js` | Tailwind source, compiled to `styles.css` on deploy |

## Run locally

```bash
npx tailwindcss@3 -i input.css -o styles.css   # build the stylesheet
python3 -m http.server 8000                     # then open http://localhost:8000
```

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`, which compiles Tailwind and publishes to GitHub Pages.
