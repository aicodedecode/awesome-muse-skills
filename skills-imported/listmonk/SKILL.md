---
name: listmonk
description: Self-hosted newsletter and mailing-list manager (open-source Mailchimp alternative). Use when the user wants to run newsletters, manage subscribers, send campaigns or transactional email without per-email SaaS costs — e.g. reviving the RaahUPSC or museaicodes newsletters. Single Go binary + PostgreSQL, full REST API.
---

# listmonk

Standalone, self-hosted newsletter and mailing-list manager by Kailash Nadh
(Zerodha). Fast, feature-rich, packed into a single Go binary (Vue/Buefy
dashboard). 23k+ stars. License: **AGPLv3**.

## When to use

- Reviving the RaahUPSC daily-CA newsletter (currently parked; Resend code
  exists but needs a paid `RESEND_API_KEY`) — listmonk replaces it with zero
  per-email cost.
- museaicodes newsletter (currently needs `BUTTONDOWN_API_KEY` in Vercel env)
  — same replacement.
- Any future project needing: subscriber lists, campaigns, templates,
  transactional email, bounce handling, multi-list management.

## Hard requirement

**PostgreSQL ≥ 12.** Non-negotiable — listmonk will not run on MySQL/SQLite.
This is the blocker on the current Hostinger Business *shared* plan (MySQL
only). Deployment needs one of:

1. A VPS / container host with Docker (official `docker-compose.yml` bundles
   listmonk + Postgres) — simplest.
2. Any host providing PostgreSQL + a place to run the binary.
3. Binary install: download release, `./listmonk --new-config`, edit
   `config.toml`, `./listmonk --install` (creates tables), run `./listmonk`
   → dashboard at `:9000`.

## API (all dashboard features are REST)

Base `http://host:9000/api`, JSON in/out. Auth: BasicAuth
`curl -u "api_user:token"` or header `Authorization: token api_user:token`.
API users/tokens are created in the admin UI (Admin → Users) with granular
user roles and per-list roles.

Key surfaces (full OpenAPI spec ships in the repo at `docs/swagger/`):

| Area | Use for |
| ---- | ------- |
| Subscribers | CRUD, manage subscriptions |
| Lists | mailing lists, per-list permissions |
| Import | bulk subscriber import |
| Campaigns | create/send newsletters, track status |
| Templates | Go-template email templates |
| Transactional | single transactional sends via API |
| Media | uploaded assets |
| Bounces | bounce management |
| Public | public subscribe/unsubscribe endpoints |

Success responses: `200 {"data": {...}}`. Errors: 4xx/5xx with `{"message": ...}`.

## Notes for our projects

- The daily-CA pipeline's `send-newsletter.ts` currently targets Resend;
  retargeting it to listmonk's transactional/campaign API is straightforward
  when the newsletter revives.
- Self-hosting email means owning deliverability: SPF/DKIM/DMARC on the
  sending domain, warm-up, bounce handling (listmonk tracks bounces
  natively). Don't skip this — it's the difference between inbox and spam.

---
## Provenance (system note, 2026-09-30)

- Source: https://github.com/knadh/listmonk (knadh), docs read from the repo
  2026-09-30 (installation.md, apis.md, swagger spec).
- License: AGPLv3. Self-hosting our own instance for our own newsletters is
  fine; distributing modified versions would require source disclosure.
- Not installed anywhere yet — no Postgres available on the current hosting.
  This skill is the "know how" for when the newsletter revives.
