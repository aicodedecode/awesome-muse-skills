---
name: trigger-dev
description: Build reliable background jobs with Trigger.dev: task definition, scheduling, retries, and observability. Use when adding durable background work to a TypeScript application.
category: workflow-automation
---

# Trigger.dev

## Overview

Trigger.dev is an open-source background job platform for TypeScript: define tasks in code, trigger via events/schedules, get retries and observability built in.

It solves the classic pain: background work (emails, webhooks, data syncs, AI pipelines) that's reliable, visible, and retryable — without building job infrastructure.

Model: tasks as code, runs as durable executions, dashboard for monitoring, schedules and event triggers built in.

## When to use

- Adding background jobs to a TypeScript/Next.js app
- Replacing fragile cron scripts or queue DIY
- Scheduled tasks (reports, syncs, cleanups) with monitoring
- Event-driven workflows (on signup -> onboard sequence)
- Long-running tasks (AI pipelines, video processing, bulk ops)

## Core concepts

- **Tasks as code.**
  Define tasks with schemas (e.g., zod) for type-safe payloads. Tasks live with your app code — versioned, reviewed, tested like the rest.
- **Triggers.**
  Event triggers (from your app), schedules (cron), and manual. One task, multiple trigger sources — reuse the logic.
- **Retries and idempotency.**
  Automatic retries with backoff; design task bodies idempotent (safe on retry). Use idempotency keys for external side effects.
- **Concurrency and queues.**
  Control parallelism per task; queues for ordering and rate-limiting. Protect downstream APIs from thundering herds.
- **Runs dashboard.**
  Every execution visible: inputs, logs, timing, retries. Debugging production jobs without SSH-ing into servers.
- **Schedules.**
  Cron-like scheduling with timezone support. Replace scattered cron jobs with visible, monitored scheduled tasks.
- **Environments.**
  Dev/staging/prod separation for tasks. Test tasks safely before they touch production data.
- **Self-hosting option.**
  Open source — self-host for data control. Managed cloud for zero ops. Choose by your constraints.

## Practical workflow

1. **Identify background work.**
   List: what runs async today (crons, scripts, queue hacks)? What should? Prioritize by pain (failures, invisibility).
2. **Define tasks.**
   One task per job with typed payload schema. Name clearly (`send-welcome-email`, `sync-crm-contacts`). Keep tasks focused.
3. **Wire triggers.**
   Events from app code, schedules for periodic work. Start with one trigger per task; add more as patterns emerge.
4. **Build idempotent bodies.**
   Each task: validate input, check-before-act where possible, external calls with idempotency keys, structured logging.
5. **Configure retries/queues.**
   Retry policy per task criticality; concurrency limits protecting downstream APIs; queues where ordering matters.
6. **Test in dev.**
   Run tasks locally/with dev environment using real-shaped payloads. Verify retries by simulating failures.
7. **Deploy and monitor.**
   Ship with dashboard bookmarks; set up failure alerts to a watched channel. First week: watch runs closely.
8. **Migrate crons gradually.**
   Move one cron/script at a time. Keep old and new running in parallel briefly; verify parity, then cut over.

## Common pitfalls

- **Non-idempotent tasks.**
  Retries creating duplicate emails/charges/records. Idempotency isn't optional with automatic retries.
- **No payload validation.**
  Untrusted event data crashing tasks. Schema-validate at the boundary, every time.
- **Unbounded concurrency.**
  1,000 parallel tasks hammering a rate-limited API. Concurrency limits and queues exist — use them.
- **Ignoring the dashboard.**
  Failures visible in the dashboard, nobody watching. Alerts to a real channel, reviewed daily.
- **Cron sprawl migration.**
  Moving 30 crons at once. One at a time, verified, or you'll debug 30 new failure modes simultaneously.
- **Secrets in task code.**
  API keys hardcoded in task definitions. Environment secrets, never in code or logs.
- **No dev/prod separation.**
  Testing tasks against production data/APIs. Environments exist for a reason — use them.
- **Fire-and-forget events.**
  Triggering without confirming the task ran. For critical flows, verify completion or alert on absence.
