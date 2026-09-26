---
name: pocketbase-hooks
description: Extending PocketBase with hooks — validation, side effects, and custom routes in Go/JavaScript.
category: pocketbase
---

## Overview

Hooks let you run custom logic around PocketBase's request lifecycle: validate
records before save, trigger side effects (emails, webhooks), enforce custom
authorization, or add entirely new API routes. Available in Go (compiled) and
JavaScript (via the JS VM), hooks turn PocketBase from a backend-in-a-box into
a programmable platform. This skill covers the hook patterns that matter.

## When to use

- Adding validation beyond field types (cross-field, uniqueness with conditions)
- Triggering side effects on record changes (notifications, sync, webhooks)
- Implementing custom authorization logic API rules can't express
- Creating custom API endpoints (aggregations, integrations, proxies)
- Choosing between Go and JavaScript hooks

## Core concepts

**Hook points wrap the lifecycle.** Record hooks fire on create/update/delete
(before and after); request hooks wrap HTTP handling; auth hooks wrap login/
token flows; cron hooks run scheduled jobs. "Before" hooks can validate,
modify, or abort the operation; "after" hooks react to committed changes.

**Validate in before-hooks, act in after-hooks.** Before-save hooks enforce
invariants and reject bad data (returning an error aborts the operation).
Side effects (sending email, calling webhooks) belong in after-hooks — only
fire them once the change is committed, and make them idempotent since
retries happen.

**Go vs JavaScript.** Go hooks compile into the binary: full standard library,
best performance, type safety — but require a Go toolchain and rebuilds.
JavaScript hooks run in an embedded VM: faster iteration, no build step,
adequate for most logic — but with a smaller standard library surface and
less performance headroom. Prototype in JS, move hot paths to Go if needed.

**Custom routes extend the API.** Register handlers for new endpoints when
you need logic that doesn't map to CRUD: dashboards aggregations, third-party
proxies (keeping secrets server-side), or composite operations. Apply the
same auth checks you'd write in API rules — custom routes don't inherit
collection rules automatically.

**Keep hooks fast and non-blocking.** Hooks run in the request path; slow
hooks (external API calls, heavy computation) add latency to every affected
request. Offload slow side effects to a queue or background job; hooks should
validate quickly and enqueue work.

## Practical workflow

1. **Map the requirement to a hook point:** validation → before record hook;
   notification/sync → after record hook; new endpoint → custom route;
   scheduled → cron hook.
2. **Write the smallest hook that works:** focused logic, clear error
   messages on validation failure (clients see these), and no business logic
   duplicated from elsewhere.
3. **Handle errors explicitly:** validation errors return 400-class responses
   with useful messages; unexpected errors log with context and fail safely
   (fail closed on auth/security paths).
4. **Make side effects idempotent:** after-hooks may run twice on retries;
   use idempotency keys or check-before-act for emails, charges, and
   external calls.
5. **Test hooks in isolation:** unit-test the logic with fixture records,
   then integration-test through the API (valid input passes, invalid input
   rejected with the right error).
6. **Version hooks with the app:** hooks live in version control alongside
   migrations and client code; deploy them together.

## Common pitfalls

- **Business logic only in hooks, invisible to the team** — hooks are
  powerful but hidden; document what each hook does and why, or the next
  maintainer will be blindsided.
- **Slow synchronous side effects** — sending email inside a before-hook
  blocks the request; enqueue and return fast.
- **Custom routes without auth checks** — new endpoints bypass collection
  API rules; re-implement authorization deliberately.
- **Non-idempotent after-hooks** — duplicate emails/charges on retry;
  design for at-least-once delivery.
- **Secrets in hook code committed to git** — API keys for webhooks and
  third parties belong in environment config, not source.
- **JS VM limitations discovered late** — missing stdlib modules or
  performance cliffs; spike risky logic early to validate the runtime
  choice.
