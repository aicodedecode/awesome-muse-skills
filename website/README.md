# Website — Awesome Muse Skills catalog

Static catalog site (Next.js App Router + TypeScript), deployable to Vercel as a fully static export.

## Run locally

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New Project → Import** the repo.
3. Set the **Root Directory** to `website`.
4. Framework preset: Next.js. No extra config needed — `next.config.mjs` uses `output: 'export'`, so Vercel serves it as static files.
5. Deploy.

## How the data flows

- The catalog reads `website/data/skills.json`.
- That file is generated from the source of truth (`skills/*/SKILL.md`) by:
  ```bash
  python3 scripts/sync-skills-json.py   # run from repo root
  ```
- It writes both `skills.json` (repo root, machine-readable index) and `website/data/skills.json`. **Never edit the JSON by hand** — edit the `SKILL.md` files and re-run the script.

## Replacing the placeholder GitHub URL

Search the repo for `aicodedecode` and replace with your GitHub username/org:

- `README.md` (Quickstart clone URL)
- `website/app/layout.tsx` (header GitHub link)
- `website/app/skills/[name]/page.tsx` (`REPO_URL`)
- `scripts/sync-skills-json.py` (`GITHUB_PLACEHOLDER`)

Then re-run `python3 scripts/sync-skills-json.py` so `skills.json` carries the real links.
