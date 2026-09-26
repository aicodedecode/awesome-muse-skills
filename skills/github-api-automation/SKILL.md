---
name: github-api-automation
description: Automate GitHub via its native REST API and Actions: scripts, bulk operations, and integrations without middleware. Use when you need programmatic control over repositories, issues, and PRs.
category: workflow-automation
---

# GitHub API Automation

## Overview

GitHub's REST API (plus GraphQL for complex queries) exposes nearly everything: repos, issues, PRs, actions, users, orgs, and settings.

Combined with Actions (event-driven compute inside GitHub) and the official `gh` CLI, you can automate without any third-party middleware.

Patterns: bulk repo management, issue/PR scripting, custom reports, ChatOps, and provisioning — all with tokens you control.

## When to use

- Bulk operations across many repositories
- Custom issue/PR workflows beyond Actions' built-ins
- Reports and dashboards from GitHub data
- Repository provisioning and settings enforcement
- Scripts that need GitHub data or actions

## Core concepts

- **REST vs. GraphQL.**
  REST: simple, well-documented, great for CRUD. GraphQL: complex nested queries in one request (e.g., PRs with reviews + checks). Choose by query shape.
- **Authentication.**
  Fine-grained PATs (least privilege, expiry), GitHub Apps (for integrations, better rate limits), GITHUB_TOKEN (in Actions, scoped per workflow).
- **Rate limits.**
  5,000 req/hr (authenticated REST); GraphQL uses points. Check headers, back off on 429/403, use conditional requests (ETags) to save quota.
- **gh CLI.**
  Official CLI covering most API operations with clean scripting (`gh api`, `gh pr list --json`). Often simpler than raw curl + jq.
- **Pagination.**
  Most list endpoints paginate (30-100/page). Handle pagination in every script or silently process partial data.
- **Webhooks vs. polling.**
  Webhooks for real-time reactions (PR opened -> label); API polling for periodic audits. Actions often replace webhook receivers.
- **github-script.**
  Run JS against the API inside Actions workflows (actions/github-script). No external runner needed for API-driven workflow steps.
- **Idempotency.**
  Check-before-create for issues/labels/comments. Scripts re-run safely — especially scheduled ones.

## Practical workflow

1. **Define the task.**
   What GitHub objects, what operations, what trigger (event, schedule, manual)? Scope precisely.
2. **Choose auth.**
   Actions context -> GITHUB_TOKEN (scoped). Cross-repo/org scripts -> fine-grained PAT or GitHub App. Least privilege always.
3. **Prototype with gh.**
   Use `gh api` to explore endpoints and shape responses. Faster iteration than writing the full script first.
4. **Handle pagination + limits.**
   Paginate fully; respect rate limits with backoff; use ETags for repeated reads.
5. **Write idempotent scripts.**
   Check existence before creating; upsert patterns. Scheduled scripts must be re-runnable.
6. **Run via Actions or schedule.**
   Event-driven -> workflow with github-script. Periodic -> scheduled workflow or local cron with PAT.
7. **Log and alert.**
   Script output to workflow logs; failures notify. Bulk operations: dry-run mode first, always.
8. **Document.**
   README: purpose, auth needed, how to run, what it changes. Scripts without docs become mysteries.

## Common pitfalls

- **Ignoring pagination.**
  Processing only the first 30 issues of 500. Every list script must paginate — no exceptions.
- **Rate limit blindness.**
  Hammering the API in a loop, hitting 429s, failing halfway. Backoff + ETags + GraphQL for heavy reads.
- **Overbroad tokens.**
  Classic PAT with every scope 'to be safe.' Fine-grained, minimal scopes, expiry dates.
- **Non-idempotent bulk scripts.**
  Re-running creates duplicate issues/comments/labels. Check-before-create, always.
- **Polling when webhooks fit.**
  Cron hitting the API every 5 min for events webhooks push instantly. Use the right mechanism.
- **Secrets in scripts.**
  Tokens hardcoded in scripts or committed. Environment variables + secret stores only.
- **No dry-run.**
  Bulk scripts run live on first execution. Dry-run mode showing planned changes is mandatory for destructive ops.
- **GraphQL overkill.**
  Complex GraphQL for what REST does simply. Match the tool to the query shape.
