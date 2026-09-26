---
name: senior-fullstack
description: Senior fullstack perspective: end-to-end feature ownership, API/UI contracts, data flow across the stack, and pragmatic stack choices. Use when building features spanning frontend and backend or reviewing fullstack code.
category: development
---

# Senior Fullstack Engineer

## Overview

A senior fullstack engineer owns features **end to end**: from the database row to the pixel, from
the API contract to the loading state. The superpower isn't knowing two stacks — it's seeing the
whole request path at once and putting each piece of logic where it belongs, so neither side
compensates for the other's shortcuts.

This skill captures that end-to-end discipline: contract-first development, pushing logic to the
right layer, and keeping the seam between client and server clean as the product grows.

## When to use

- Building a feature that spans UI, API, and database.
- Reviewing fullstack code for layering violations or duplicated logic.
- Choosing a stack or deciding what runs where (client vs server vs edge).
- Debugging issues that cross the client/server boundary (stale data, auth, CORS, caching).
- Simplifying a codebase where frontend and backend have drifted apart.

## Core concepts

- **Contract first.** The API shape is the handshake between your two halves. Define it (types,
  errors, pagination, auth) before building either side — and generate shared types from one source
  of truth (OpenAPI, tRPC, GraphQL codegen) so the contract can't silently drift.
- **Logic placement rule.** Put logic where its data lives: validation of shape on both sides
  (client for UX, server for trust), business rules and authorization on the server, presentation
  logic on the client. Duplicated business logic across the seam is a bug waiting to diverge.
- **The seam is a product.** Error formats, loading semantics, retry behavior, and cache
  invalidation are part of the API's UX. A 500 with an HTML stack trace is a broken contract.
- **Minimize round trips.** Design endpoints around use cases, not tables. A screen that needs
  seven requests needs a better endpoint (or a batched query layer), not a loading-spinner orchestra.
- **Own the data lifecycle.** From migration to cache invalidation to archival: the fullstack
  engineer thinks about what happens to data a year later, not just on the happy-path POST.
- **Boring stack, sharp edges.** Prefer one well-understood stack over best-of-breed everything.
  Fullstack leverage comes from moving fast across the seam, not from exotic tooling.

## Practical workflow

1. **Sketch the user journey** as a sequence of states, then map each state to the data it needs.
2. **Write the contract.** Endpoints/operations, request/response shapes, error codes, auth
   requirements. Share the draft with "the other side" (even if that's future-you) and agree.
3. **Build server-first for the critical path**: schema migration → domain logic with tests →
   endpoint with contract tests. The UI can mock the contract while the server is built.
4. **Build the client against the contract**, implementing all four async states (loading, error,
   empty, success) and optimistic updates only where rollback is well-defined.
5. **Wire observability across the seam**: correlation IDs from client to server logs, client-side
   error reporting tied to backend traces, and metrics on the endpoints the UI actually calls.
6. **Review the full path** before shipping: run the feature with throttled network, expired auth,
   and validation failures. The seam is where assumptions die — test it directly.

Contract-first checklist:

```text
[ ] Shared types generated from one source (no hand-copied interfaces)
[ ] Error shape consistent: { code, message, details? } on every endpoint
[ ] Auth: who can call what, enforced server-side, documented
[ ] Pagination/filtering conventions identical across list endpoints
[ ] Breaking-change policy: additive only; versioned when removing
[ ] Client handles 401 (re-auth), 403 (explain), 429 (backoff), 5xx (retry/fallback)
```

## Common pitfalls

- **Frontend doing backend's job.** Business rules or price calculations in client JS that the
  server doesn't re-verify. The client is a user agent, not a trusted tier.
- **Backend doing frontend's job.** Endpoints shaped for one screen's convenience that ossify into
  unmaintainable bespoke queries. Serve use cases, but keep the domain model clean underneath.
- **Chatty APIs.** N+1 at the HTTP layer: screens firing dozens of requests. Fix with batching,
  inclusion params, or a query layer — not with faster spinners.
- **Type drift.** Hand-maintained TS interfaces copied from backend DTOs, silently diverging until
  runtime. Generate; don't transcribe.
- **Ignoring the unhappy path across the seam.** Timeouts, partial failures, and stale caches are
  integration concerns — test the feature under degraded conditions, not just green ones.
- **Two codebases, two conventions.** Different error styles, naming, and auth patterns per side.
  One team, one set of conventions, documented once.
- **Over-abstracting early.** A shared "framework" for CRUD across the stack before you have three
  real use cases. Build the third feature, then extract the pattern.
