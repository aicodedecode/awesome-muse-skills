---
name: webhook-patterns
description: Design robust webhook systems — delivery guarantees, retries, idempotency, security, and event versioning.
category: doordash
---

## Overview

Webhooks let platforms notify external systems of events in real time: order created, payment completed, delivery updated. This skill covers designing webhook systems that are reliable, secure, and evolvable — delivery semantics, retry strategies, idempotency, signature verification, and event versioning. General integration-pattern guidance, platform-neutral.


Webhooks are how delivery platforms notify merchants, couriers, and integrators about order events in real time: order created, accepted, picked up, delivered, cancelled. Getting webhook design right — reliability, ordering, security, replayability — determines whether partners can build on your platform or drown in integration pain.
## When to use

- Designing a webhook system for a platform or API
- Integrating with third-party webhooks
- Debugging missed or duplicate webhook events
- Securing webhook endpoints
- Versioning event payloads
- Building retry and dead-letter handling

- Building order-status integrations for merchants or POS systems
- Designing event notifications for a logistics platform
- Debugging missed or duplicate webhook deliveries
- Designing multi-tenant webhook systems
- Migrating webhook infrastructure
## Core concepts

**At-least-once delivery.** Webhooks can be lost (network issues) or duplicated (retries). Design for at-least-once: receivers must be idempotent (processing the same event twice has no extra effect — use event IDs for dedup).

**Retry strategy.** Exponential backoff with jitter (e.g., 1min, 5min, 30min, 2h, 12h), maximum attempts (then dead-letter), and honoring receiver signals (429 → back off longer; 410 → stop, endpoint gone). Never retry indefinitely on 4xx errors (except 429).

**Signature verification.** Sign payloads with HMAC (shared secret) so receivers can verify authenticity. Include timestamps and reject stale signatures (replay protection). Rotate secrets with overlap periods. Never trust unverified webhooks for sensitive actions.

**Event design.** Events should be: well-named (order.created, past tense), self-contained (include enough data to act without extra API calls — but not sensitive data unnecessarily), versioned, and ordered where it matters (sequence numbers per entity).

**Endpoint management.** Let receivers register URLs, select event types, test with sample payloads, view delivery logs, and manually replay. Provide a dashboard — debugging webhooks without visibility is miserable.

**Versioning.** Never break existing payloads: add fields (never remove or rename without a version bump), support multiple versions during migration, communicate deprecations with long lead times, and version via event type suffix or header.


**At-least-once delivery with idempotency.** Webhooks must retry (with exponential backoff) because networks fail — so receivers will get duplicates. Every event carries a unique ID; receivers deduplicate on it. Document this contract explicitly: "we retry until 2xx; you must handle duplicates." Without idempotency keys, retries become double-charges and double-orders.

**Signature verification.** Sign every payload (HMAC-SHA256 with a per-endpoint secret) and include the signature in headers with a timestamp. Receivers verify before processing — this prevents spoofed events. Rotate secrets with a dual-secret transition period so rotation never breaks receivers.

**Event design.** Version your event schema (never break existing fields — only add); include both the event and the full current object state (receivers should not need a follow-up API call); provide event-type filtering so receivers subscribe only to what they need; maintain an event catalog with examples and a changelog.

**Multi-tenancy.** Per-tenant endpoints, secrets, rate limits, and delivery isolation.
One tenant's failing endpoint must not affect others — isolate queues per tenant.
Tenant-level dashboards let customers self-serve debugging.
**Schema evolution.** Additive changes only; version events (v1, v2); support old versions during migration windows.
Communicate deprecations 90+ days ahead with migration guides.
## Practical workflow

1. **Define the event catalog.** What events do integrators need? Name consistently, document payload schemas, and mark which are critical (order/payment) vs. informational.
2. **Design delivery.** Queue-based dispatch (never send synchronously from the request path), per-endpoint queues, retry policy with backoff, dead-letter queue with alerting, and delivery attempt logging.
3. **Secure it.** HMAC signatures with timestamps, HTTPS-only endpoints, secret rotation support, IP allowlisting as an option (not requirement — IPs change), and payload minimization.
4. **Build receiver tooling.** Registration API/dashboard, event type subscriptions, test events, delivery logs with request/response bodies, manual replay, and disable/enable controls.
5. **Document for integrators.** Quickstart, signature verification code samples (multiple languages), retry behavior expectations ("expect duplicates — dedupe on event ID"), event catalog with examples, and versioning policy.
6. **Operate.** Monitor delivery success rates per endpoint, alert on systemic failures, track dead-letter volume, and review event schemas before any change.

**Receiver checklist:** verify signature → check timestamp freshness → dedupe on event ID → process idempotently → return 2xx quickly (process async if slow) → log everything.


**Reliability checklist:** retry with exponential backoff (e.g., 1m, 5m, 30m, 2h, 12h) → dead-letter queue after max retries with alerting → per-endpoint circuit breakers (pause failing endpoints, do not hammer them) → delivery dashboard (success rate, latency, retry volume per endpoint) → manual replay tool for partners (re-send any event by ID) → sandbox endpoint for integration testing.

**Partner onboarding for webhooks:** provide a test console (fire sample events at their URL) → show delivery logs they can inspect → document retry behavior and expected response codes → give them the signature-verification code sample in 3 languages. Integration time drops dramatically with good tooling.
## Common pitfalls

- **Assuming exactly-once.** Designing receivers that break on duplicates. Idempotency is mandatory.
- **Synchronous sending.** Blocking the main request on webhook delivery. Always queue.
- **No signatures.** Unsigned webhooks are spoofable. Sign everything.
- **Infinite retries.** Hammering dead endpoints forever. Cap attempts, dead-letter, alert.
- **Breaking payload changes.** Renaming fields without versioning. Additive changes only; version the rest.
- **Slow receivers.** Taking 30 seconds to respond, causing timeouts and retries. Acknowledge fast, process async.
- **No visibility.** Integrators can't see deliveries, failures, or payloads. Build the dashboard — it halves support load.
- **Missing event IDs.** No dedup key means receivers can't handle duplicates safely. Every event gets a unique ID.
- **No retry strategy.** Fire-and-forget delivery. The first network blip silently loses order updates — and merchants miss orders.
- **Breaking schema changes.** Renaming fields without versioning. Every breaking change orphans integrations; additive-only evolution is the rule.
- **Missing replay capability.** When things go wrong, partners need historical events re-sent. Without replay, incident recovery becomes manual chaos.
- **No per-tenant rate limiting.** One tenant's burst starving others. Isolate and limit per tenant.
- **Inadequate testing tools.** Partners cannot test without sandbox events. Provide event simulators — integration quality follows tooling quality.
