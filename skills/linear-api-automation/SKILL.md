---
name: linear-api-automation
description: Automate Linear via its native GraphQL API: issues, projects, cycles, and integrations without middleware. Use when scripting Linear workflows or syncing it with other tools.
category: workflow-automation
---

# Linear API Automation

## Overview

Linear's GraphQL API exposes issues, projects, cycles, teams, users, and comments — everything the UI does, scriptable.

Use cases: bulk issue management, custom triage, syncing with GitHub/Sentry/CRMs, reporting beyond Linear's views, and enforcing conventions.

This skill uses Linear's native GraphQL API directly — scripts you control, no middleware required.

## When to use

- Bulk creating, updating, or triaging Linear issues
- Custom reports and exports from Linear data
- Syncing Linear with GitHub, Sentry, or other tools
- Enforcing labeling and workflow conventions
- Automating issue lifecycle (stale, assignment, prioritization)

## Core concepts

- **GraphQL API.**
  Single endpoint, typed schema, efficient nested queries. Use the playground/docs to explore; generate typed clients where it pays off.
- **API keys.**
  Personal API keys per automation (service account where possible). Scoped by the key owner's permissions — least privilege.
- **Issues core.**
  Create, update, comment, label, assign, set priority/status, link (blocks/related/duplicate). Most automation lives here.
- **Cycles and projects.**
  Query active cycles, move issues between cycles, track project progress programmatically.
- **Webhooks.**
  Real-time events (issue created/updated) to your endpoint. For reactive automation; API polling for periodic jobs.
- **Rate limits.**
  Linear enforces rate limits; batch operations and back off on errors. Bulk work: pace requests, don't hammer.
- **Teams and workflows.**
  Team IDs, workflow states per team — states differ by team, so resolve state IDs dynamically, don't hardcode.
- **Idempotency.**
  Check-before-create for synced issues; dedupe keys in descriptions or external IDs. Re-runs must be safe.

## Practical workflow

1. **Define the automation.**
   What Linear objects, what operations, what trigger? Write the equivalent manual flow first.
2. **Set up auth.**
   API key for a service account with minimal team access. Secrets manager; never in code.
3. **Explore the schema.**
   Use the GraphQL playground to shape queries/mutations. Resolve team IDs, state IDs, label IDs dynamically.
4. **Prototype small.**
   Test mutations on a test team/project with 2-3 issues. Verify states, labels, notifications.
5. **Build idempotent scripts.**
   Check-before-create, upsert patterns, external ID tracking for synced items.
6. **Wire triggers.**
   Webhooks for real-time; scheduled scripts for periodic (triage, stale, reports). Log every run.
7. **Respect limits.**
   Pace bulk operations; exponential backoff on errors; cache team/state metadata.
8. **Document.**
   README: purpose, scope, auth, schedule, what it changes, how to disable. Future maintainers need the map.

## Common pitfalls

- **Hardcoded state IDs.**
  Workflow states differ per team and change. Resolve dynamically by name; never hardcode IDs.
- **No idempotency.**
  Sync scripts creating duplicate issues on re-run. Check-before-create with external IDs.
- **Rate limit hammering.**
  Bulk updates in tight loops hitting limits and failing halfway. Pace + backoff.
- **Overprivileged keys.**
  Personal key with admin everywhere for a triage script. Service account, minimal teams.
- **Notification storms.**
  Bulk operations pinging everyone. Use quiet options where available; batch during off-hours for big jobs.
- **Polling when webhooks fit.**
  Cron every minute for events webhooks push instantly. Match mechanism to need.
- **Ignoring team differences.**
  One script assuming all teams share workflow states. Linear teams customize — handle per-team.
- **No disable path.**
  Automation misbehaving, nobody knows how to stop it. Document the off switch; keep key access handy.
