# Awesome Muse Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Skills](https://img.shields.io/badge/skills-899-blue.svg)](skills/)

A community catalog of **agent skills for Meta's Muse** personal assistant — curated, safety-reviewed, and free to use.

## What are Muse skills?

A skill is a portable markdown file (`SKILL.md`) that teaches an AI assistant a reusable workflow: when to trigger it, what steps to follow, and what good output looks like. Skills use the open Agent Skills format — YAML frontmatter (`name` + `description`) followed by markdown instructions — so the same skill works across assistants that support the format, including Meta's Muse.

## Quickstart

No installers, no packages. Meta's Muse doesn't have an official skill-install flow yet, so using a skill takes seconds right in chat:

1. **Open the skill** — on the [website catalog](https://aimuse-rho.vercel.app/) or on GitHub at `skills/<name>/SKILL.md`.
2. **Paste the `SKILL.md` content into a chat with Muse**, and add: *"Please use this skill whenever I ask about \<topic\>. Remember it for our future conversations."*
3. **That's it.** A skill is just text instructions — Muse follows them for relevant tasks, and you approve anything it does.

New to skills? Start with [`getting-started-with-muse-skills`](skills/getting-started-with-muse-skills/SKILL.md), which explains the format and the workflow in full. When Meta ships native skill support, these `SKILL.md` files are already in the right format.

## Catalog

**899 original skills across 31 categories.** Browse and search them all on the [website catalog](https://aimuse-rho.vercel.app/) — the table below is a category-level summary.

| Category | Skills | Scope |
|---|---|---|
| ai-maestro | 6 | Agent fleet management — planning, memory search, agent messaging, docs search, code-graph query |
| ai-research | 145 | LLM & agent R&D — frameworks, RAG, evals, alignment, model and inference-provider guides |
| analytics | 1 | Product analytics with Google Analytics 4 |
| business-marketing | 48 | Marketing & business playbooks — SEO, content, growth, sales, PR, finance |
| career | 21 | Career tooling — resumes, interviews, negotiation, leadership |
| creative-design | 33 | Design practice — UI/UX, brand, typography, illustration, handoff |
| curviate | 9 | SaaS platform operations — onboarding, APIs, automations, analytics (vendor-neutral) |
| database | 13 | Databases — SQL/NoSQL modeling, tuning, ORMs, MCP access patterns |
| development | 205 | Software engineering — languages, frontend, backend, DevOps, data/AI, practices |
| document-processing | 18 | Document workflows — PDF, Office formats, OCR, parsing, translation |
| doordash | 5 | On-demand delivery & ordering platform patterns (vendor-neutral) |
| enterprise-communication | 33 | Team communication — chat, email, SMS, meetings, webinars, incident comms |
| everyday-assistant | 14 | Everyday life with a personal AI assistant — briefings, inbox, calendar, travel, meals, habits, reviews |
| git | 3 | Git mastery — branching, commit messages, worktrees |
| marketing | 1 | Ethical social-media scraping patterns |
| media | 5 | Media processing — image, video, audio, FFmpeg, Pillow |
| muse | 1 | Muse-specific — getting started with skills on Meta's Muse assistant |
| open-banking-io | 1 | Open-banking concepts — AIS/PIS flows, consent, PSD2 |
| operations | 6 | SRE & operations — SLOs, incidents, on-call, runbooks, chaos engineering |
| pocketbase | 6 | PocketBase backend — auth, realtime, migrations, hooks, deploy |
| productivity | 53 | Productivity systems — notes, tasks, focus, OS tooling, workspaces |
| railway | 12 | PaaS deployment patterns — deploys, managed data, networking, cost control (vendor-neutral) |
| scientific | 135 | Scientific computing — life sciences, physical sciences, research communication |
| security | 50 | App & infra security — AppSec, SOC, identity, network, GRC (defensive framing) |
| sentry | 6 | Application observability — error tracking, performance, alerts, releases (vendor-neutral) |
| sports | 1 | Statistical sports match-prediction methodology |
| utilities | 12 | Everyday utilities — QR, regex, JSON, UUID, cron, diff |
| video | 4 | Video workflows — editing, screen recording, subtitles, thumbnails |
| web-data | 5 | Web data extraction — scraping, browser automation, SERP APIs |
| web-development | 30 | Modern web development — frameworks, UI, auth, performance, accessibility |
| workflow-automation | 17 | Automation — n8n, GitHub Actions, GitOps, platform APIs, skill curation |

Every skill is an original work: `skills/<name>/SKILL.md` with `name`, `description`, and `category` frontmatter, validated by `scripts/validate.py`. The machine-readable index is [`skills.json`](skills.json).

## Curated from the ecosystem

Original skills live in this repo (MIT). The wider skills ecosystem is worth knowing — these are the major community and official collections, **linked with attribution, not copied**:

- **[anthropics/skills](https://github.com/anthropics/skills)** — Anthropic's official Agent Skills reference (document skills, creative tools, the Agent Skills spec).
- **[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)** — the 800+ skill catalog behind [aitmpl.com](https://www.aitmpl.com/skills/), installable via CLI.
- **[harshsinghmp/skills](https://github.com/harshsinghmp/skills)** — community aggregator hub syncing 170+ agent skills from multiple upstreams, installable via `npx skills add`.
- **[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)** — Vercel's official skills for React and web-design best practices.
- **[google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills)** — Google's official Gemini skills.
- **[openai/skills](https://github.com/openai/skills)** — OpenAI's skills catalog for Codex agents.
- **[microsoft/skills](https://github.com/microsoft/skills)** — Microsoft's official skills (Azure, enterprise dev patterns).
- **[huggingface/skills](https://github.com/huggingface/skills)** — Hugging Face's official skills for models, datasets, and inference.

## Roadmap

- [x] Complete original catalog — 899 skills across 31 categories (done 2026-09-26)
- The [website catalog](https://aimuse-rho.vercel.app/) — browse, search, and preview skills online (live)
- Community submissions — see [CONTRIBUTING.md](CONTRIBUTING.md)

## Contributing

We welcome new skills and improvements! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first — every submission must pass `scripts/validate.py` and the safety rules.

## Disclaimer

This is an **unofficial community project**. It is not affiliated with, endorsed by, or sponsored by Meta. "Muse" is a trademark of Meta Platforms, Inc. Skills in this repo are original works by their contributors, shared under the MIT license; third-party collections listed above belong to their respective owners under their own licenses.
