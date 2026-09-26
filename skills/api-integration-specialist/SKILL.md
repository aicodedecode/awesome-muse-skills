---
name: api-integration-specialist
description: Integrate third-party APIs reliably: auth, pagination, retries, webhooks, rate limits, and contract testing. Use when connecting to external REST/GraphQL APIs or building resilient API clients.
category: development
---

# API Integration Specialist

## Overview

Integrating a third-party API looks easy in the docs and gets hard in production: auth token
expiry, rate limits, flaky endpoints, silently changing schemas, and webhooks that arrive twice —
or never. This skill is the discipline of **treating external APIs as hostile dependencies**:
wrap them in a client layer with retries, timeouts, and observability; verify webhooks; version
your assumptions; and degrade gracefully when the provider has a bad day.

The through-line: their uptime is not your uptime. Design for their failure.

## When to use

- Integrating a new third-party REST or GraphQL API (payments, CRM, email, maps, etc.).
- Building webhook receivers (signature verification, idempotency, ordering).
- Debugging flaky integrations, rate-limit errors, or auth failures.
- Reviewing integration code for resilience gaps.
- Planning for a provider outage or migration between providers.

## Core concepts

- **Client wrapper, not scattered calls.** All interaction with a provider lives in one module:
  auth, base URL, headers, serialization, error mapping. Scattered `fetch` calls to a provider
  across the codebase guarantee inconsistent handling.
- **Auth lifecycle.** Tokens expire — handle refresh proactively (refresh before expiry, single
  refresh under concurrency via lock), store secrets in a secret manager, and never log tokens.
  Prefer OAuth with refresh tokens or API keys with rotation over long-lived static secrets.
- **Resilience primitives.** Every outbound call gets: timeout (connect + total), retries with
  exponential backoff + jitter (only for idempotent/safe operations), and a circuit breaker for
  sustained failure. Map provider errors to your domain errors (`RateLimited`, `AuthFailed`,
  `NotFound`, `ProviderDown`).
- **Rate limits as a budget.** Track quota usage (headers like `X-RateLimit-Remaining`), queue
  and pace non-urgent calls, and prioritize: user-facing sync calls first, background sync last.
  Hitting 429s in production means you didn't plan the budget.
- **Webhooks: verify, dedupe, acknowledge fast.** Verify signatures with the provider's secret
  (constant-time compare); handle duplicates via idempotency keys (providers retry); respond 200
  *before* doing slow work (queue it); tolerate out-of-order delivery.
- **Contract vigilance.** Providers change schemas without telling you. Validate responses against
  expected shapes (fail loudly on unexpected changes in staging), pin API versions via headers
  when supported, and monitor for new error codes or deprecated fields.

## Practical workflow

1. **Read the docs skeptically.** Note: auth flow, rate limits (per key? per endpoint?), pagination
   style, webhook guarantees (ordering? retries? signing?), error code catalog, and versioning policy.
2. **Build the client layer.** One module: configured HTTP client with timeouts, auth injection +
   refresh, retry policy, error mapping, request/response logging (redacted), and metrics
   (latency, error rate per endpoint).
3. **Implement pagination correctly.** Follow cursors, not page numbers, when available; handle
   empty pages and duplicates; back off when approaching rate limits; make full syncs resumable.
4. **Build the webhook receiver.** Signature verification → idempotency check → 200 OK → enqueue
   work. Test with the provider's replay/fixture tools; simulate duplicates and out-of-order events.
5. **Add contract tests.** Record real (sanitized) responses as fixtures; run them in CI to catch
   drift. Alert on unexpected response shapes in production (sampled validation).
6. **Plan the outage.** Feature-flag the integration; define degraded behavior (queue work, show
   cached data, disable the feature cleanly); document the runbook: how to detect provider issues,
   who to contact, how to fail over.

Resilient client sketch (pseudocode):

```text
client = HttpClient(timeout=10s, retries=3 with jittered backoff on 429/5xx GETs)
client.on_auth_expired -> refresh_token(singleflight) -> retry once
every call:
  - inject auth header (from secret manager, never logged)
  - map status -> domain error (401 AuthFailed, 429 RateLimited(retry_after), 5xx ProviderDown)
  - emit metrics: provider.latency, provider.errors{endpoint, code}
  - circuit breaker: open after N failures in window, probe with single request
```

## Common pitfalls

- **No timeouts.** A hung provider call holding your request thread is how one slow dependency
  takes down your whole service. Every call gets a deadline.
- **Retrying non-idempotent operations.** Retrying a `POST /charges` without an idempotency key
  double-charges customers. Retry only safe methods, or send idempotency keys on mutating calls.
- **Trusting webhook payloads.** Processing webhooks without signature verification lets anyone
  forge events. Verify first, always — and still treat the payload as untrusted input.
- **Synchronous dependence on slow providers.** Doing a 2-second provider call inside your
  request path. If the user doesn't need the result now, queue it.
- **Hardcoding provider specifics everywhere.** Provider field names and error codes scattered
  through business logic make migration hell. The wrapper translates; the app speaks domain language.
- **Ignoring pagination edge cases.** Assuming page numbers are stable, or that "last page" means
  what you think during concurrent writes. Cursors + dedup by ID.
- **No plan for provider downtime.** Discovering during their outage that your checkout hard-fails
  when the address-validation API is down. Every integration needs a degraded mode, decided in
  advance — not invented during the incident.
