---
name: inngest
description: Build durable serverless workflows with Inngest: step functions, event-driven flows, retries, and scheduling. Use when background work must survive failures and run to completion.
category: workflow-automation
---

# Inngest

## Overview

Inngest adds durable execution to serverless: functions with steps that automatically retry, sleep, and wait for events — surviving restarts and failures.

The model: event-driven functions, each step independently retried and resumable. A 3-day workflow with waits and retries becomes straightforward code.

Use cases: onboarding sequences, payment flows, AI agent pipelines, scheduled jobs, webhook processing — anything multi-step and failure-prone.

## When to use

- Multi-step background workflows in serverless apps
- Replacing fragile cron + queue combinations
- Event-driven sequences (signup -> emails -> provisioning)
- AI pipelines with retries and human-in-the-loop waits
- Scheduled jobs with observability

## Core concepts

- **Durable steps.**
  Each step is independently executed, retried, and resumable. Failures resume from the failed step, not from scratch — the core durability guarantee.
- **Events as triggers.**
  Functions triggered by named events from your app. Event-driven architecture without managing queues or brokers.
- **Step tools.**
  step.run (compute), step.sleep (durable delays), step.waitForEvent (pause until something happens), step.sendEvent (fan-out). Compose complex flows from these.
- **Retries with backoff.**
  Per-step retry configuration. Transient failures (API flakiness) resolve automatically; permanent failures surface clearly.
- **Idempotency.**
  Event IDs dedupe; design steps idempotent anyway. Retried steps must be safe — check-before-act for external effects.
- **Concurrency controls.**
  Throttle per key (e.g., per user) to protect downstream APIs and ensure ordering where needed.
- **Scheduling.**
  Cron functions for periodic work with the same durability and observability as event functions.
- **Observability.**
  Every run, step, and retry visible in the dashboard. Debug production flows from the run timeline, not log archaeology.

## Practical workflow

1. **Model the workflow.**
   Events, steps, waits, failure modes — sketched before coding. Identify what must be idempotent.
2. **Define functions and events.**
   Named events with schemas; functions per workflow. Keep functions focused; compose via events.
3. **Build with step tools.**
   step.run for work, step.sleep for delays, step.waitForEvent for human/external waits. Let the platform handle durability.
4. **Make steps idempotent.**
   Each step safe on retry: validate, check-before-act, idempotency keys on external calls.
5. **Configure retries.**
   Per-step retry counts and backoff matched to failure modes. Alert on exhausted retries.
6. **Add concurrency controls.**
   Throttle keys where ordering or rate limits matter (per-user, per-tenant).
7. **Test failure modes.**
   Simulate step failures, event delays, and timeouts in dev. Verify resume-from-failure works before production.
8. **Monitor runs.**
   Dashboard review cadence; failure alerts to a watched channel. First weeks: watch closely, tune retries.

## Common pitfalls

- **Non-idempotent steps.**
  Durable retries + side effects without idempotency = duplicates. The most important design rule in the system.
- **Giant single steps.**
  One step doing 10 things loses granular retry. Break into steps at natural retry boundaries.
- **Sleep as polling.**
  Using sleeps to wait for external events instead of waitForEvent. Event-driven waits are precise; sleeps are guesses.
- **Unbounded fan-out.**
  sendEvent loops creating thousands of runs without concurrency controls. Throttle by design.
- **Ignoring dead runs.**
  Exhausted retries sitting unexamined. Dead-letter review cadence or failures accumulate silently.
- **No event schemas.**
  Unvalidated event payloads crashing functions. Schema-validate at the boundary.
- **Secrets in code.**
  Keys in function code or logs. Environment secrets; never log sensitive payloads.
- **Over-durableizing.**
  Simple synchronous request-response forced into durable steps. Use durability where failure recovery matters, not everywhere.
