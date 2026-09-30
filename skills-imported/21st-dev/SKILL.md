# 21st.dev — UI component registry skill

21st.dev is a community registry of 12,000+ production-ready React components,
templates, shadcn themes and SVG logos. Code is copied into the repo (not a
dependency) — search first, install what fits, hand-write UI only when nothing
matches.

## Docs (official, fetched 2026-09-30 from https://21st.dev/api/skills/)

- `21st-cli-use.md` — search/get/add components via the `21st` CLI; auth, metering, logos
- `21st-ai.md` — generate/iterate sketch loop with hosted 21st AI
- `21st-registry.md` — publishing components/themes/templates
- `21st-design-sync.md` — publish a project's design tokens as a theme

Read the relevant doc before acting.

## CLI

`npx -y @21st-dev/cli` (bin `21st`). Verified runnable 2026-09-30.

## Auth

- **Secure Vault (connected 2026-09-30):** `custom.21st` holds the API key.
  Never read the real key. Fetch a short-lived surrogate and pass it where the
  key goes — authd swaps it at egress:
  ```bash
  export TWENTYFIRST_TOKEN="$(authdc cred surrogate custom.21st | python3 -c 'import json,sys; print(json.load(sys.stdin)["credentials"][0]["surrogate"])')"
  npx -y @21st-dev/cli search "animated hero" --limit 5
  ```
  Never print or log the surrogate. If the API returns 401/403, ask the user to
  reconnect the key via the Secure Vault rather than retrying blindly.
- Fallbacks: `npx @21st-dev/cli login` (interactive), or `--api-key` /
  `TWENTYFIRST_TOKEN` / `API_KEY_21ST` env var.
- Check `21st usage` before retrieving code or generating.

## Metering (free tier)

- Search, previews, theme CSS: free.
- Component code retrieval (`21st get`, `21st add`): free daily quota.
- 21st AI generation: needs AI explicitly enabled + credits; never retry after
  `ai_subscription_required`.
- Logo search (`21st logo`): free, no login (open svgl.app library).

## Workflow (user's directive 2026-09-30: build it myself)

1. `21st search "<intent>"` — free, unlimited. Use search + previews as
   **inspiration and reference**, not as a shopping trip.
2. **Decide the taste first** — run the `frontend-design-direction` skill to set
   the visual direction (the UI equivalent of the taste skills' "decide the
   genre before the first render"). One direction, executed coherently, beats a
   mix of borrowed looks.
3. **Build the component myself** in the project's own stack (Tailwind, shadcn
   patterns, GSAP skill for motion). I have the knowledge — treat 21st.dev as
   the design reference, my own code as the implementation.
4. Spend one of the 2/day free code retrievals (`21st get` / `21st add`) ONLY
   when a component is genuinely complex (shaders, intricate animation
   choreography) and adapting it by hand would cost more than the quota slot.
5. Adapt tokens/props to the project's design system; match Tailwind config and
   the `impeccable` skill workflow for visual builds (the video `taste` /
   `taste-distillation` / `taste-application` skills are the same
   decide-first discipline for video edits — use those when the work is reels
   or music videos, not UI).

## Standing rules

- **FREE TIER ONLY (user's standing rule, 2026-09-30):** never purchase or
  unlock premium templates/components, never enable or call 21st AI generation
  (`generate` / `iterate`), never attach a payment method. If a component is
  premium-only, skip it and find a free alternative.
- Check `21st usage` before every retrieval; stop for the day when the free
  quota (2/day) is exhausted — never work around it.
- API key connected 2026-09-30 as `custom.21st` (Secure Vault) — verified live
  via catalog search. Free-tier metering applies: search/previews free, code
  retrieval has a free daily quota.
