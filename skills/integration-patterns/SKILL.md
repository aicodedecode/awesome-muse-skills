---
name: integration-patterns
description: Design SaaS integrations — data sync strategies, embedded experiences, marketplace apps, and partner ecosystems.
category: curviate
---

## Overview

Integrations make SaaS products stickier: connecting to the tools customers already use. This skill covers integration strategy and design — build vs. partner, data sync patterns, embedded experiences, integration marketplaces, and developer ecosystems. General platform guidance, vendor-neutral.


Integration patterns are the reusable designs for connecting systems: how data flows, how services communicate, and how failures are contained.
Whether integrating SaaS tools, internal services, or partner APIs, the same patterns recur — sync vs. async, orchestration vs. choreography, polling vs. events.
Knowing the patterns (and their trade-offs) is what separates robust integrations from fragile ones.
## When to use

- Planning an integration roadmap
- Choosing sync strategies (real-time vs. batch)
- Designing embedded integrations
- Building an integration marketplace
- Evaluating build vs. buy vs. partner
- Creating developer documentation

- Connecting SaaS tools into automated workflows
- Designing microservice communication
- Building data pipelines between systems
- Choosing between REST, webhooks, and message queues
- Diagnosing flaky or failing integrations
## Core concepts

**Integration strategy.** Prioritize by: customer demand (what do deals require?), strategic value (which integrations win deals?), and effort. Common tiers: native deep integrations (top 5–10 tools), partner-built (long tail via APIs), and platform marketplaces (let others build). You can't build everything — choose the wedge.

**Sync patterns.** Real-time (webhooks/events — for time-sensitive data), scheduled batch (hourly/daily — for reporting, bulk), on-demand (user-triggered refresh), and hybrid (real-time for critical, batch for the rest). Match pattern to data freshness needs — real-time everything is expensive overkill.

**Data mapping.** Field mapping (their schema ↔ yours), transformation rules, conflict resolution (last-write-wins? source-of-truth hierarchy?), and dedup keys. Document mappings explicitly — implicit assumptions break silently.

**Embedded experiences.** In-app integration UIs: OAuth connect flows, configuration screens, sync status indicators, and error states with recovery actions. The integration should feel native, not bolted-on. Handle disconnects gracefully (data preserved, clear re-auth path).

**Marketplace.** App directory with: listings (clear value props, screenshots), installation flows, reviews/ratings, categories, and developer revenue share if applicable. Marketplaces scale ecosystems — but need curation to avoid junk.

**Developer experience.** For partner-built integrations: great API docs, sandbox environments, SDKs, webhook support, and responsive developer support. Your API's usability determines your ecosystem's size.


**Synchronous vs. asynchronous.** Sync (request/response): simple, immediate, but couples systems — slowness cascades.
Async (queues, events): decoupled, resilient, but eventually consistent and harder to debug.
Rule: sync for queries needing immediate answers; async for commands and notifications.
Never chain more than 2–3 sync calls — latency and failure multiply.
**Orchestration vs. choreography.** Orchestration: a central controller calls services in sequence (explicit, easier to trace).
Choreography: services react to events independently (decoupled, harder to follow).
Orchestrate complex multi-step flows; choreograph simple event reactions.
**Polling vs. webhooks vs. streaming.** Polling: simple, delayed, wasteful at scale.
Webhooks: real-time, efficient, requires receiver infrastructure and retry design.
Streaming (Kafka, Kinesis): high-volume, ordered, replayable — for serious data infrastructure.
Match the pattern to freshness needs and volume.
**Idempotency.** Operations safe to retry: use idempotency keys for writes, design consumers to handle duplicates.
Networks fail — retries are inevitable, so duplicates must be harmless.
Every integration contract should state its delivery semantics explicitly.
**Circuit breakers and bulkheads.** Breakers: stop calling failing services (fail fast, recover automatically).
Bulkheads: isolate failures so one bad integration cannot sink the whole system.
Timeouts on every call — no timeout means one slow dependency freezes everything.
## Practical workflow

1. **Prioritize.** Survey customers and sales: which integrations block deals? Score by demand × strategic value ÷ effort. Roadmap the top 5–10; API-enable the rest.
2. **Design sync.** Per integration: data direction (one-way/two-way), freshness requirements → sync pattern, field mappings, conflict resolution, and error handling. Document the contract.
3. **Build the UX.** Connect flow (OAuth, permissions clearly explained), configuration (mapping UI where needed), status visibility (last sync, health), and error recovery (re-auth prompts, retry).
4. **Handle the hard parts.** Initial historical sync (backfill), ongoing delta sync, deletes (how do deletions propagate?), rate limits on both sides, and schema changes (version tolerance).
5. **Launch and support.** Beta with friendly customers, docs and troubleshooting guides, monitoring (sync success rates, error patterns), and a feedback channel for integration issues.
6. **Grow the ecosystem.** Marketplace launch, partner program (co-marketing, revenue share), developer docs and support, and integration health dashboards.

**Integration spec template:** systems → direction → sync pattern → field mappings → conflict rules → error handling → monitoring → owner → review date.


**Integration design checklist:** map data flows (what moves where, how often) → choose patterns per flow → define contracts (schemas, auth, errors) → design failure handling (retries, dead-letters, alerts) → build observability (trace IDs across systems) → test failure modes (not just happy paths) → document for operators.
**Debugging playbook:** check the integration's health dashboard → inspect recent payloads and errors → verify credentials and rate limits → test the remote API directly → check for upstream changes (APIs change!) → review logs with correlation IDs.
Most integration failures are: expired credentials, rate limits, or upstream API changes — check these first.
## Common pitfalls

- **Two-way sync naivety.** Bidirectional sync without conflict resolution creates data corruption. Define source-of-truth per field.
- **Ignoring deletes.** Syncing creates/updates but not deletions. Decide delete propagation explicitly.
- **No backfill plan.** "It'll sync going forward" isn't enough. Historical data matters — plan the initial sync.
- **Silent failures.** Syncs breaking without alerts. Monitor success rates; alert on drops.
- **Schema change blindness.** Partner APIs change; integrations break. Version tolerance + change monitoring.
- **Bolted-on UX.** Integrations hidden in settings with no status. Native-feeling UX with visibility.
- **Building everything.** Native integrations for 50 tools. Prioritize; API-enable the long tail.
- **No timeout configuration.** Default timeouts (or none) letting slow dependencies cascade. Set aggressive timeouts with retries — fail fast, recover faster.
- **Ignoring upstream changelogs.** APIs deprecate fields and change behavior. Monitor changelogs; version-pin where possible.
- **Sync chains.** Five services calling each other synchronously. One slowdown becomes a total outage — break chains with async boundaries.
- **Missing dead-letter queues.** Failed messages vanishing silently. Every queue needs a dead-letter path and alerts.
- **No end-to-end tracing.** Failures untraceable across systems. Propagate correlation IDs through every hop.
