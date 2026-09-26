---
name: microservices-pro
description: Design and operate microservices: decomposition, inter-service communication, data ownership, and operational maturity. Use when decomposing systems or reviewing service architectures.
category: development
---

# Microservices Pro

## Overview

Microservices trade **one complex deployable for many simpler ones** — buying independent scaling
and team autonomy at the price of distributed-systems problems (network failures, eventual
consistency, observability complexity). Professional microservices work means decomposing along the
right seams, owning data per service, communicating deliberately, and operating with the maturity
distributed systems demand.

The through-line: microservices are an organizational scaling pattern with a distributed-systems
tax — pay it only when the organization needs it.

## When to use

- Decomposing a monolith (or deciding not to).
- Designing service boundaries, APIs, and data ownership.
- Choosing inter-service communication (sync vs async).
- Reviewing a microservices architecture for coupling or operational gaps.
- Debugging distributed issues (cascading failures, consistency, tracing).

## Core concepts

- **Decompose by bounded context, not by layer.** Services own business capabilities (orders,
  payments, inventory) — not technical layers (a "database service" or "UI service"). Each service
  owns its data, its logic, and its deployment. If two services always deploy together, they're
  one service.
- **Data ownership is absolute.** Each service owns its database; no shared tables, no direct
  cross-service DB reads. Integration via APIs or events. Shared databases are the fastest way to
  build a distributed monolith.
- **Communication, chosen per interaction.** Synchronous (REST/gRPC) for queries needing immediate
  answers — with timeouts, retries, circuit breakers. Asynchronous (events/message broker) for
  state changes others react to — with idempotent consumers, schema versioning, dead-letter queues.
  Default to async for cross-domain updates; sync creates temporal coupling.
- **Design for failure.** Every remote call can fail, hang, or return garbage. Bulkheads (isolate
  failure), circuit breakers (fail fast when downstream is down), timeouts + retry budgets,
  graceful degradation (what does the user see when recommendations are down? the page, minus
  recommendations).
- **Observability is mandatory, not nice.** Distributed tracing (trace IDs across services),
  correlated structured logs, per-service golden signals, and dependency maps. Debugging without
  tracing is archaeology.
- **Independent deployability is the test.** If you can't deploy service A without coordinating
  with teams B, C, D, you have a distributed monolith — all of the pain, none of the benefit.
  Backward-compatible API evolution (expand-contract) preserves independence.

## Practical workflow

1. **Start from the monolith (usually).** Build the modular monolith first with clean internal
   boundaries; extract services when a boundary shows independent scaling, team, or failure-domain
   needs. Premature distribution is the costliest mistake.
2. **Draw the service map.** Bounded contexts → candidate services; for each: owned data, public
   API/events, team owner. Challenge every service: what justifies its network boundary?
3. **Define contracts first.** API schemas (OpenAPI/Protobuf) and event schemas (with versioning
   policy) reviewed like code. Breaking changes go through expand-contract migration.
4. **Build the platform basics.** Service discovery/registry, centralized config, secret management,
   CI/CD per service (build once, deploy independently), and the observability stack (tracing,
   metrics, logs) *before* the service count grows.
5. **Harden each service.** Timeouts on every outbound call, circuit breakers, bulkheads, retry
   budgets with jitter, health checks (liveness vs readiness), graceful shutdown, and runbooks.
6. **Operate as a system.** Chaos testing (kill services in staging, verify degradation),
   end-to-end tracing reviews, dependency audits, and blameless postmortems for cross-service
   incidents.

Service readiness checklist:

```text
[ ] Owns its data; no shared DB access with other services
[ ] API versioned; backward-compatible changes only (or expand-contract plan)
[ ] Timeouts + retries + circuit breaker on every outbound call
[ ] Emits/consumes versioned events idempotently; DLQ configured
[ ] Distributed tracing + correlated logs + golden-signal dashboards
[ ] Deploys independently; rollback tested; health checks wired
[ ] Runbook exists: failure modes, degradation behavior, escalation
```

## Common pitfalls

- **Distributed monolith.** Services sharing a database, deploying in lockstep, and calling each
  other synchronously in deep chains — all the operational cost, none of the autonomy.
- **Chatty synchronous chains.** Service A → B → C → D per request: latency adds up, and one
  slow service cascades. Async events and denormalized read models break the chains.
- **No data ownership.** "Just read their table, it's faster" — until their migration breaks you
  at 2am. APIs and events are the contract; the database is private.
- **Eventual consistency surprises.** Assuming immediate consistency across services (read-your-
  write across boundaries). Design UX for it (optimistic UI, "processing" states) or choose
  sync where strong consistency is truly required.
- **Missing distributed tracing.** Debugging a slow request across 8 services via 8 separate log
  systems. Trace IDs from edge to database, or you're flying blind.
- **Versioning neglect.** Breaking API changes deployed without coordination — the "independent
  deployability" was fictional. Expand-contract; deprecate with timelines.
- **Too many services too soon.** 40 services for a 5-person team — each service has fixed
  operational overhead. Service count should roughly track team topology (Conway, constructively).
