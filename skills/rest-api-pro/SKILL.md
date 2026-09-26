---
name: rest-api-pro
description: REST API design guidance — resource modeling, versioning, pagination, auth, error formats, and documentation.
category: development
---

## Overview

REST remains the default style for public and internal HTTP APIs because its constraints — resources, uniform interface, statelessness — produce APIs that are predictable, cacheable, and easy to debug. Good REST design is mostly discipline: nouns not verbs, consistent shapes, and honest status codes. This skill covers designing REST APIs that age well, from resource modeling to versioning strategy to the operational details (idempotency, rate limiting) that separate toy APIs from production ones.

## When to use

- Designing a new REST API's resources and endpoints.
- Reviewing an existing API for consistency and usability.
- Choosing versioning, pagination, and error-format strategies.
- Adding auth, rate limiting, and idempotency to an API.
- Writing API documentation (OpenAPI) developers actually enjoy.
- Deciding between REST, GraphQL, gRPC, and tRPC.
- Evolving an API without breaking clients.

## Core concepts

- **Resources, not actions.** URLs name nouns (`/orders/123`), HTTP methods name the operation (`GET/POST/PUT/PATCH/DELETE`). RPC-style verbs in URLs (`/getOrder`) signal a design that will sprawl; model the occasional true action as a sub-resource (`POST /orders/123/cancel`).
- **Status codes mean something.** `200/201/204` for success, `400` for client errors, `401` vs `403` (unauthenticated vs unauthorized), `404` for missing resources, `409` for conflicts, `422` for semantic validation failures, `429` for rate limits, `5xx` only when the server is at fault. Clients program against these — be consistent.
- **Consistent envelopes.** Pick one response shape and use it everywhere: data fields, error objects with machine-readable `code`s, and pagination metadata. Inconsistency across endpoints is the top API usability complaint.
- **Pagination for every list.** Cursor-based for large/changing datasets, offset acceptable for small stable ones. Always include total counts or page info, default limits, and max page sizes — unbounded lists are a DoS vector.
- **Versioning strategy.** URL versioning (`/v1/`) is the most explicit and debuggable; header versioning is purer but harder to use. Whatever you choose, never break a shipped version — deprecate with `Sunset` headers and advance notice.
- **Idempotency.** `POST` retries (network failures, client timeouts) must not double-create. Accept `Idempotency-Key` headers on mutating endpoints; store key→result and replay it.
- **Filtering, sorting, sparse fieldsets.** Standardize query params (`?status=paid&sort=-created_at&fields=id,total`) so clients can be efficient without a dozen custom endpoints.
- **HATEOAS, pragmatically.** Full hypermedia is overkill for most APIs, but including `links` (self, related actions) in responses guides clients and eases evolution.
- **OpenAPI as contract.** Write or generate an OpenAPI spec and treat it as the source of truth: generate clients, validate requests/responses in tests, and publish interactive docs from it.
- **Rate limiting and quotas.** Token bucket per API key/principal; return `429` with `Retry-After`; communicate limits in headers (`X-RateLimit-*`) and docs. Design for fair use before abuse forces it.
- **Caching semantics.** `ETag`/`Last-Modified` with conditional requests, `Cache-Control` headers, and cacheable `GET`s — HTTP caching is free performance most APIs ignore.
- **Content negotiation.** `Accept`/`Content-Type` headers for multiple representations (JSON default, CSV export via `Accept: text/csv`) — one endpoint, several formats, no URL sprawl.
- **Webhooks.** For event delivery, design webhook contracts like APIs: signed payloads, retries with backoff, idempotency on receipt, and a delivery log for debugging.

## Practical workflow

1. **Model resources.** List the domain nouns, their relationships, and lifecycle actions; sketch the URL tree before writing code. Keep nesting shallow (max 2-3 levels).
   ```
   GET    /v1/orders?status=paid&sort=-created_at
   POST   /v1/orders            (Idempotency-Key header)
   GET    /v1/orders/{id}
   PATCH  /v1/orders/{id}
   POST   /v1/orders/{id}/cancel
   ```
2. **Define the contract.** Write the OpenAPI spec (or generate from code annotations); standardize the error shape across all endpoints:
   ```json
   { "error": { "code": "order_already_paid", "message": "Order 123 is already paid.", "details": {} } }
   ```
3. **Implement consistently.** Shared middleware for auth, request IDs, logging, error mapping; validate input at the boundary (schemas/DTOs); never leak stack traces or DB errors.
4. **Add idempotency.** `Idempotency-Key` on POST/unsafe endpoints; persist key + request fingerprint + response; return the stored response on replay with the same key.
   ```python
   # idempotency middleware sketch
   key = request.headers.get("Idempotency-Key")
   if key and (cached := store.get(key)):
       return replay(cached)  # same status + body as the first call
   response = await handler(request)
   if key:
       store.set(key, response, ttl=24 * 3600)
   ```
5. **Paginate and filter.** Cursor pagination for feeds, offset for admin lists; standardize filter/sort/field-selection params; cap page sizes.
6. **Secure it.** Auth (API keys, OAuth2, JWT) on every non-public route; authorization checks per resource (ownership, roles); rate limiting per principal; CORS locked to known origins.
7. **Document for humans.** Interactive docs from the OpenAPI spec, runnable examples, auth guide, error-code catalog, and a changelog per version. Docs are a feature — stale docs are a bug.
8. **Evolve safely.** Additive changes freely; deprecate with headers and timelines; monitor usage of deprecated fields/endpoints before removal; never repurpose a field's meaning.

## Common pitfalls

- **Verbs in URLs** (`/api/getUsers`) — RPC creep that destroys predictability; model resources and use HTTP methods.
- **Wrong status codes** — `200` with an error body, or `500` for validation failures; clients can't program against lies.
- **Unpaginated list endpoints** — fine at 100 rows, an outage at 10 million; paginate from day one.
- **No idempotency on POST** — retried requests double-charging customers; require idempotency keys on money-moving endpoints.
- **Breaking changes in minor versions** — renaming fields or changing semantics without a version bump; additive-only within a version.
- **Inconsistent error shapes** — every endpoint inventing its own error format; standardize one envelope.
- **Leaking internals** — stack traces, SQL, and internal IDs in responses; map to safe, documented errors.
- **`401` vs `403` confusion** — unauthenticated (log in) vs unauthorized (no permission); clients handle them differently.
- **Ignoring caching headers** — every GET hitting origin; `ETag` + conditional requests are nearly free.
- **No rate limiting until abuse** — designing limits after an incident; ship with sane defaults and per-key quotas.
- **PUT vs PATCH confusion** — using PUT for partial updates and wiping unset fields; PUT replaces, PATCH merges — document and enforce the difference.
- **No request IDs** — undebuggable failures across services; generate and propagate `X-Request-Id` on every request.
- **Webhooks without signatures** — receivers can't verify authenticity; sign every payload and document verification.
- **Actions as query params** (`POST /orders?cancel=true`) — hidden RPC; model actions as sub-resources instead.
