---
name: jira-api-automation
description: Automate Jira via its native REST API: bulk issue operations, custom reports, and integrations without middleware. Use when Jira's UI and built-in automation can't do what you need.
category: workflow-automation
---

# Jira API Automation

## Overview

Jira's REST API (v3 for Cloud) exposes issues, projects, boards, users, and workflows programmatically.

Use cases: bulk issue creation/updates, custom reports beyond JQL, syncing with other tools, enforcing conventions, and data cleanup.

This skill uses Jira's native API directly — scripts and small services you control, no middleware platform required.

## When to use

- Bulk creating or updating Jira issues
- Custom reports and exports beyond Jira's UI
- Syncing Jira with other systems (CRM, code, docs)
- Enforcing issue conventions programmatically
- Jira data cleanup and migration tasks

## Core concepts

- **REST API v3.**
  Issues, search (JQL via API), projects, users, transitions, attachments, comments. Paginated; auth via API token (Cloud) or PAT (Server/DC).
- **JQL via API.**
  Search endpoint accepts JQL — reuse your JQL skills programmatically. Paginate results; respect the 100-per-page max.
- **Transitions, not just edits.**
  Moving issues through workflow = transition API with transition IDs, not field edits. Fetch available transitions first.
- **Webhooks.**
  Jira webhooks fire on issue events to your endpoint. For real-time reactions; API polling for periodic jobs.
- **Rate limits.**
  Jira Cloud enforces rate limiting (varies by plan). Back off on 429s; batch operations; cache aggressively.
- **API tokens.**
  Atlassian API tokens per user (Cloud); scoped by that user's permissions. Service account for automations, least privilege.
- **Bulk endpoints.**
  Bulk create/update endpoints exist — use them instead of 500 individual calls. Dramatically faster and kinder to limits.
- **Custom fields.**
  Addressed by customfield_XXXXX IDs, not names. Map IDs once; names change, IDs don't.

## Practical workflow

1. **Define the operation.**
   What issues, what changes, what trigger? Write the JQL first in the UI to verify scope before scripting.
2. **Set up auth.**
   API token for a service account with minimal project permissions. Store in a secrets manager, never in code.
3. **Map the fields.**
   Resolve custom field IDs, transition IDs, and project keys. Document the mapping — it's the fragile part.
4. **Prototype carefully.**
   Test on 2-3 issues in a test project. Verify transitions, field values, and notifications behavior.
5. **Build with bulk + backoff.**
   Bulk endpoints where available; pagination everywhere; exponential backoff on 429s.
6. **Dry-run destructive ops.**
   Preview mode listing what would change. Review the list before the real run — especially for bulk transitions/deletes.
7. **Schedule or trigger.**
   Cron for periodic jobs; webhooks for event-driven. Log every run with counts and errors.
8. **Document.**
   README: purpose, JQL scope, auth, schedule, rollback plan. Jira scripts without docs are landmines.

## Common pitfalls

- **No pagination.**
  Processing the first 50 of 2,000 issues. Paginate every search — the API won't warn you.
- **Rate limit storms.**
  Tight loops hammering Cloud API, 429s cascading. Backoff, batch, and cache.
- **Editing instead of transitioning.**
  Setting status via field edit (doesn't work / bypasses workflow). Use transitions with valid IDs.
- **Custom field name guessing.**
  Using display names instead of customfield_ IDs. Names change; IDs are stable. Map once, use IDs.
- **Notification spam.**
  Bulk updates firing 500 notification emails. Use notify=false / quiet options on bulk ops.
- **Overprivileged tokens.**
  Service account with admin everywhere. Least privilege per project; audit token usage.
- **No dry-run on bulk.**
  First live run of a bulk transition script. Preview mode is mandatory for anything destructive or wide.
- **Hardcoded IDs everywhere.**
  Project keys and field IDs scattered in code. Central config; document the mapping.
