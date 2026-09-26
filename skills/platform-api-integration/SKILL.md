---
name: platform-api-integration
description: Integrate with SaaS platform APIs — authentication, rate limits, webhooks, SDK patterns, and robust client design.
category: curviate
---

## Overview

Integrating with a SaaS platform's API means: authenticating securely, handling rate limits, processing webhooks, and building clients that survive real-world failures. This skill covers general API integration patterns for SaaS platforms — vendor-neutral principles applicable to any REST/GraphQL API.


Integrating with SaaS platform APIs connects your product to the ecosystems where customers work: syncing data, embedding workflows, and extending capabilities.
Good integrations feel native; bad ones feel bolted-on.
This skill covers API integration strategy, implementation patterns, and the operational discipline of maintaining integrations over time.
## When to use

- Integrating with a third-party SaaS API
- Designing API clients
- Handling OAuth flows
- Debugging rate limit issues
- Building webhook receivers
- Planning API version upgrades

- Building native integrations with popular SaaS tools
- Syncing data bidirectionally between platforms
- Embedding third-party functionality via APIs
- Designing integration marketplaces or app directories
## Core concepts

**Authentication.** API keys (simple, server-to-server — store securely, rotate regularly), OAuth 2.0 (user-delegated access — authorization code flow for web, PKCE for mobile/SPA), and token management (secure storage, refresh before expiry, handle revocation). Never expose secrets client-side.

**Rate limits.** Understand: limits per window, per endpoint, per token. Handle 429s with exponential backoff + jitter, respect Retry-After headers, implement client-side throttling (token buckets), and batch requests where the API supports it. Design for limits from day one — retrofitting is painful.

**Pagination.** Cursor-based (preferred for large/changing datasets), offset-based (simple, breaks with concurrent writes), and page-size tuning. Always handle "more pages" loops defensively (max iterations, progress logging).

**Error handling.** Retry transient errors (5xx, 429, timeouts) with backoff; don't retry client errors (4xx — fix the request); parse error bodies for actionable codes; implement circuit breakers for cascading failures; and log request IDs for support.

**Webhooks.** Verify signatures, respond fast (2xx immediately, process async), dedupe on event IDs (at-least-once delivery), handle out-of-order events (idempotent processing), and build replay tooling. See webhook-patterns for depth.

**Versioning and change management.** Pin API versions, monitor deprecation notices, test against beta/sandbox before upgrades, and abstract version differences behind your client layer. Subscribe to API changelogs — breaking changes announced there first.


**Integration patterns.** Polling (simple, delayed, API-heavy) → webhooks (real-time, requires receiver infrastructure) → streaming (high-volume, ordered) → batch sync (large datasets, scheduled).
Choose by freshness requirements and volume — webhooks for real-time needs, batch for analytics.
Most integrations combine patterns: webhooks for events, batch for backfill.
**Authentication.** OAuth 2.0 (user-delegated, standard for SaaS), API keys (server-to-server, simple), webhooks signatures (verify sender).
Implement OAuth properly: secure token storage, refresh handling, scope minimization, and graceful re-auth flows.
Token expiry mid-workflow is a top integration failure — handle refresh transparently.
**Rate limits and quotas.** Every API throttles: understand limits (requests/minute, daily caps), implement backoff with jitter, queue and batch requests, cache aggressively.
Design for the limit from day one — retrofitting throttling under load causes outages.
**Data mapping.** Field-level mapping between systems with transformation rules, conflict resolution (last-write-wins? source priority?), and handling of custom fields.
Document mappings explicitly; implicit mappings break silently when either API changes.
## Practical workflow

1. **Read the docs.** Authentication, rate limits, pagination, webhooks, error codes, versioning policy. Build a mental model before writing code.
2. **Design the client.** Wrapper library with: auth handling, retry/backoff, rate-limit awareness, pagination helpers, error translation (API errors → domain exceptions), and request logging. One client, used everywhere — no ad-hoc HTTP calls scattered around.
3. **Implement auth.** Secure credential storage (vaults, not env files in repos), token refresh logic, and scope minimization (request only needed permissions).
4. **Build defensively.** Timeouts on every call, retries with backoff, circuit breakers, idempotency keys for writes, and graceful degradation (what happens when the API is down?).
5. **Handle data sync.** Decide: real-time (webhooks), polling (for APIs without webhooks — respect intervals), or hybrid. Reconcile periodically (webhooks get missed; nightly syncs catch drift).
6. **Operate.** Monitor: error rates, latency, rate-limit hits, webhook delivery. Alert on anomalies. Review API changelogs monthly; test version upgrades in sandbox first.

**Client checklist:** auth + refresh → retries with backoff → rate-limit handling → pagination helpers → timeout per call → error translation → request logging → idempotent writes → webhook verification.


**Integration development:** study API docs and changelog → prototype auth flow → map data models → build happy path → handle errors and edge cases → implement webhooks → build sync engine (initial + incremental) → test with real accounts → beta with design partners → launch with monitoring.
Budget 40% of time for edge cases and error handling — happy paths are the easy part.
**Maintenance program:** monitor API changelogs → track deprecation timelines → maintain version compatibility → handle credential expiry proactively → audit sync health daily.
APIs change constantly; integrations are living systems, not shipped features.
## Common pitfalls

- **Secrets in code.** API keys committed to repos. Vaults + rotation, always.
- **No retry logic.** Single attempt, fail loudly. Transient failures are normal — retry intelligently.
- **Ignoring rate limits.** Hammering until banned. Backoff, throttle, batch.
- **Sync without reconciliation.** Trusting webhooks alone. Periodic full syncs catch missed events.
- **No timeouts.** Hanging requests consuming resources. Timeout everything.
- **Version drift.** Running against deprecated versions until forced migration. Track versions proactively.
- **Scattered integration code.** Ad-hoc API calls across the codebase. Centralize behind one client.
- **Underestimating API quality variance.** Some APIs are excellent; others are buggy, slow, or poorly documented. Prototype early to discover reality before committing roadmaps.
- **No sync observability.** Silent sync failures corrupting data for weeks. Monitor sync lag, error rates, and data consistency continuously.
- **Ignoring API terms.** Rate limit violations, prohibited use cases, or data storage restrictions. Read the terms; violations get API access revoked.
- **Building on undocumented endpoints.** They change without notice. Use public APIs only — or accept the maintenance burden explicitly.
