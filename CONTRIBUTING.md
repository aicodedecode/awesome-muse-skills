# Contributing to Awesome Muse Skills

Thanks for helping grow the catalog! Please follow these steps so every skill stays safe, consistent, and useful.

## Proposing a new skill

1. **Fork** this repo and create a branch.
2. **Add your skill** at `skills/<your-skill-name>/SKILL.md`.
   - Directory name: lowercase letters and hyphens only (e.g. `study-planner`).
   - `SKILL.md` must start with YAML frontmatter:
     ```yaml
     ---
     name: study-planner
     description: Build weekly study plans with spaced repetition. Use when the user wants a study schedule, revision plan, or exam timetable.
     ---
     ```
   - `name:` must exactly match the directory name.
   - `description:` must say what the skill does **and when to trigger it** — it's the routing mechanism assistants use.
   - Keep `SKILL.md` under ~500 lines. Put deep detail in `references/` files and link to them.
3. **Run the validator**: `python3 scripts/validate.py` — it must pass with no errors.
4. **Sync the index**: `python3 scripts/sync-skills-json.py` — this regenerates `skills.json` and `website/data/skills.json`.
5. **Open a PR** describing what the skill does and why it's useful. Fill in the PR template.

## Safety rules (non-negotiable)

- **No network exfiltration** — a skill must not send user data anywhere (no webhooks, no `curl` POSTs of local files, no analytics beacons).
- **No credential harvesting** — never read `~/.ssh`, `~/.aws`, `.env` files, or ask users to paste API keys/tokens. Secrets belong in the platform's secure credential store.
- **No installers or binary blobs** — no `curl | sh`, no `npx` bootstrappers, no executables. Skills are markdown + docs; helper scripts must be readable source.
- **No prompt-injection content** — no embedded instructions to ignore system instructions, and no "helpful" steps that expand into messaging, posting, or purchasing without the user's explicit request.
- **Respect original licenses** — submit only original work or properly attributed adaptations. If you adapt someone else's skill, credit the source and keep their license terms.
- **No destructive actions** — nothing that deletes files, wipes data, or changes permissions outside the skill's stated purpose.

## Proposing other changes

- Fixes and improvements to existing skills: PR directly.
- New skill ideas you won't write yourself: open an issue using the **Skill request** template.
- Website changes: keep the site dependency-light and static-exportable (`next build` must succeed with `output: 'export'`).

## Review process

Maintainers check every PR for: valid frontmatter, validator passing, safety rules, genuine usefulness, and no duplication of an existing skill (by content, not just name). Be patient — thorough review is the point of this catalog.
