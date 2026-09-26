---
name: nextjs-pro
description: Idiomatic Next.js: App Router, Server Components, data fetching/caching, and production deployment. Use when writing, reviewing, or structuring Next.js applications.
category: development
---

# Next.js Pro

## Overview

Next.js App Router's model — **React Server Components by default, client components as
opt-in, and granular caching** — rewards thinking carefully about where code runs. Professional
Next.js means mastering the server/client boundary, using the caching model deliberately (not
accidentally), colocating data fetching with the components that need it, and treating Server
Actions as the mutation story.

The through-line: server by default, client by necessity, cached by design.

## When to use

- Writing or reviewing Next.js App Router code.
- Designing server/client component boundaries.
- Debugging caching issues (stale data, over-fetching) or hydration errors.
- Structuring routes, layouts, data fetching, and mutations.
- Optimizing Next.js performance and deployment.

## Core concepts

- **Server Components by default.** Async components fetching data directly (`await db.query()`
  in the component) — no useEffect waterfalls, no API round-trip for your own database. Client
  components (`'use client'`) only for interactivity, browser APIs, and hooks — pushed to the
  leaves, not the root.
- **The caching model, deliberate.** `fetch` caching, route segment config (`revalidate`,
  `dynamic`), and `unstable_cache` — understand what caches what, or you'll debug stale data
  forever. Default to static where possible; opt into dynamic explicitly; revalidate with
  `revalidatePath`/`revalidateTag` on mutation.
- **Colocated data fetching.** Fetch next to the component that renders the data; parallelize
  independent fetches (same-tick promises); Suspense boundaries for streaming independent
  sections. Request waterfalls are a design smell — hoist and parallelize.
- **Server Actions for mutations.** `'use server'` functions called directly from client
  components — form submissions, updates — with `revalidatePath` after mutation and
  `useFormStatus`/`useActionState` for pending/error UI. Validate inputs server-side (zod);
  never trust the client.
- **Route groups and layouts.** `(group)` for organization without URL impact; layouts for
  persistent UI; `loading.tsx`/`error.tsx` per segment for granular states; `not-found.tsx`
  for 404s. Parallel/intercepting routes for advanced patterns (modals over pages) — powerful
  but only when the UX demands it.
- **Middleware sparingly.** Auth checks, redirects, A/B headers — middleware runs on every
  matched request (edge runtime limits apply). Don't put business logic there; it's a gate,
  not a service layer.

## Practical workflow

1. **Scaffold:** `create-next-app` with TypeScript, App Router, and your styling choice;
   strict TS; ESLint with Next.js rules in CI.
2. **Draw the server/client boundary.** Page shells and data components → server; interactive
   widgets → client leaves. Props cross the boundary (serializable only — no functions, no class
   instances).
3. **Fetch deliberately.** Server components fetch directly; parallelize with `Promise.all` or
   same-tick awaits; wrap independent sections in `<Suspense>` for streaming; set revalidation
   per data freshness needs.
4. **Mutate with Server Actions.** Validate → mutate → revalidate → redirect/return state;
   optimistic updates via `useOptimistic` where rollback is well-defined.
5. **Handle all states per segment.** `loading.tsx` skeletons, `error.tsx` with reset, and
   `not-found.tsx` — users should never see a blank segment or raw error.
6. **Deploy and observe.** Vercel or self-hosted (standalone output); monitor Core Web Vitals,
   server action errors, and cache hit rates; set up ISR/revalidation monitoring for stale-data
   detection.

Server/client sketch:

```tsx
// app/orders/page.tsx — Server Component: fetches directly
export default async function OrdersPage({ searchParams }) {
  const orders = await getOrders(searchParams.status); // runs on server
  return (
    <>
      <FilterBar /> {/* 'use client' leaf: interactive */}
      <Suspense fallback={<OrdersSkeleton />}>
        <OrderTable orders={orders} />
      </Suspense>
    </>
  );
}
```

## Common pitfalls

- **`'use client'` at the root.** Making the whole page client-rendered "to use hooks" —
  forfeits SSR, streaming, and direct data access. Push the boundary to the leaves.
- **Waterfall fetching.** Sequential awaits for independent data, or client components fetching
  in effects what the server component could fetch directly. Parallelize; colocate.
- **Cache confusion.** Stale data blamed on "Next.js bugs" that's actually default static caching;
  or `revalidate = 0` everywhere "to be safe," forfeiting the performance story. Learn the model;
  set it per route deliberately.
- **Non-serializable props across the boundary.** Passing functions, Dates-as-class-instances, or
  complex objects from server to client components — serialization errors or subtle bugs. Plain
  data only.
- **Hydration mismatches.** `new Date()`, `Math.random()`, or `typeof window` checks rendering
  different HTML on server vs client. Render deterministically; defer client-only bits.
- **Server Actions without validation.** Trusting client-submitted data in actions. Validate
  every input server-side; authorize every mutation (the action runs with server privileges).
- **Middleware bloat.** Business logic, DB queries, and heavy computation in middleware —
  it runs on every request at the edge. Keep it to routing/auth decisions.
