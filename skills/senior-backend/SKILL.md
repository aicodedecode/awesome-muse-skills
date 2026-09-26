---
name: senior-backend
description: Senior backend engineer perspective: API design, data modeling, concurrency, reliability, and scalability trade-offs. Use when designing services, data models, or reviewing server-side code.
category: development
---

# Senior Backend Engineer

## Overview

A senior backend engineer optimizes for **correctness under load and change**: data that stays
consistent, services that degrade gracefully, and APIs that don't paint clients into corners. This
skill captures that perspective — how to model data, where to put logic, how to think about
concurrency and failure, and which trade-offs (consistency vs availability, normalization vs
read-speed) to make deliberately rather than accidentally.

The through-line: every backend decision is a bet about the future. Make bets you can reverse.

## When to use

- Designing a new service, endpoint set, or database schema.
- Reviewing backend code for correctness, concurrency, or failure-handling issues.
- Choosing between sync vs async processing, SQL vs NoSQL, monolith vs services.
- Debugging production issues: race conditions, deadlocks, cascading failures, data corruption.
- Capacity planning and setting SLOs, timeouts, retries, and rate limits.

## Core concepts

- **API design is promise design.** Version your contracts, never break them silently. Prefer
  additive changes; deprecate with sunset headers and timelines. Pagination, filtering, and error
  shapes should be consistent across every endpoint — clients automate against your consistency.
- **Data modeling follows access patterns.** Model for the queries you'll run, not for abstract
  purity. Normalize for write integrity; denormalize deliberately for read hotspots — and document
  which copies are authoritative vs derived.
- **Idempotency everywhere it matters.** Retries are inevitable; design operations so repeating them
  is safe (idempotency keys, upserts, conditional writes). "Exactly once" delivery is a myth —
  "effectively once" via idempotency is the engineering answer.
- **Failure is the normal case.** Timeouts, retries with jittered backoff, circuit breakers, bulkheads,
  and graceful degradation are not extras. Every external call gets a timeout; every retry gets a
  budget; every dependency gets a fallback story.
- **Concurrency control.** Understand your isolation levels, use optimistic locking or compare-and-set
  for contested writes, and keep transactions short. Long transactions are where deadlocks live.
- **Observability first.** Structured logs with correlation IDs, metrics on the golden signals
  (latency, traffic, errors, saturation), and traces across service boundaries. If you can't see it,
  you can't run it.

## Practical workflow

1. **Define the contract first.** Write the API shape (endpoints, payloads, error codes) and get
   client-team agreement before building. A one-page API doc prevents a month of rework.
2. **Model the data for the top 5 queries.** List the actual access patterns, then choose tables,
   indexes, and denormalization to serve them. Add the index *before* the slow query ships.
3. **Design the failure matrix.** For each dependency ask: what happens when it's slow? down?
   returning garbage? Write the timeout, retry, fallback, and alert for each.
4. **Make writes safe.** Idempotency keys on mutating endpoints, database constraints as the last
   line of defense (uniqueness, foreign keys, check constraints — the DB doesn't trust your code),
   and migrations that are backward-compatible (expand then contract).
5. **Load-test the critical path** before launch, not after the incident. Know your breaking point
   and what breaks first (it's usually the database connection pool).
6. **Review backend PRs against this list:**
   - N+1 queries eliminated or justified; indexes exist for new query patterns.
   - No unbounded result sets — pagination or streaming everywhere.
   - Timeouts and retries configured on every outbound call.
   - Secrets via secret manager, never in code or logs; PII minimized in logs.
   - Migrations are reversible and safe to run with old code still deployed.

Example timeout/retry budget:

```text
Outbound call: payment gateway
- timeout: 3s connect, 10s total (p99 of gateway is 1.2s; 10s bounds the tail)
- retries: 2, exponential backoff with jitter (100ms → 400ms), only on idempotent ops
- circuit breaker: open after 50% failure over 30s window, half-open probe after 15s
- fallback: queue the charge attempt, surface "processing" state to the user
```

## Common pitfalls

- **Synchronous everything.** Doing slow work (emails, thumbnails, webhooks) inside the request
  path. If the user doesn't need the result to continue, it belongs on a queue.
- **Retry storms.** Retrying without backoff, jitter, or budgets turns one outage into a
  self-inflicted DDoS. Always bound retries and shed load when saturated.
- **Trusting the application layer for integrity.** Uniqueness enforced only in code races under
  concurrency — put the constraint in the database and handle the conflict error.
- **Leaky abstractions in APIs.** Exposing database IDs' internals, internal error stack traces, or
  requiring clients to understand your sharding. The API is a product; design it like one.
- **No backpressure.** Accepting unlimited work into an unbounded queue. Queues need depth limits,
  TTLs, dead-letter handling, and alerts — otherwise they're just delayed outages.
- **Optimizing before measuring.** Adding caches, read replicas, or microservices for imagined
  scale. A single well-indexed database handles astonishing load; complexity must be earned.
- **Deploying migrations and code together** in ways that break rolling deploys. Expand (add
  nullable column) → deploy code that tolerates both → migrate data → contract (drop old column).
