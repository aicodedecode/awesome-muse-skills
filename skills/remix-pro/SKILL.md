---
name: remix-pro
description: Idiomatic Remix: loaders/actions, progressive enhancement, nested routing, and web-standard patterns. Use when writing, reviewing, or structuring Remix applications.
category: development
---

# Remix Pro

## Overview

Remix's philosophy — **embrace web standards: forms, HTTP semantics, and progressive enhancement** —
produces apps that work without JavaScript and get faster *with* it. Professional Remix means
designing around loaders (data in) and actions (mutations), using nested routes for parallel data
loading and persistent UI, and treating the network tab as the source of truth.

The through-line: the web platform already solved most of this — Remix just gets out of its way.

## When to use

- Writing or reviewing Remix (React Router v7) applications.
- Designing loaders, actions, and form-based mutations.
- Structuring nested routes and shared layouts.
- Debugging data loading, revalidation, or fetcher issues.
- Choosing between Remix patterns and client-side state.

## Core concepts

- **Loaders: data in.** Route `loader` functions run server-side, return data to the component via
  `useLoaderData`. Parallel across matched routes (no waterfalls by default), revalidate on
  navigation and action completion. Throw `Response` objects (404/403) for HTTP-correct errors —
  `ErrorBoundary` + status codes, not client-side error states.
- **Actions: mutations.** Route `action` functions handle form submissions and mutations —
  validate, mutate, then redirect (PRG pattern) or return validation errors. `<Form>` works
  without JS (real POST) and enhances with JS (no full reload). This is the core interaction model.
- **Nested routing.** Parent routes render layouts + load shared data; child routes load in
  parallel and render in `<Outlet>`. Persistent navigation/sidebars that don't refetch, granular
  error boundaries per segment, and parallel data loading fall out of the route tree design.
- **Fetchers for non-navigation mutations.** `useFetcher` for like buttons, inline edits, and
  optimistic UI without changing the URL. `fetcher.Form` + `useFetchers` for global pending states.
- **Optimistic UI, deliberately.** `useNavigation().formData` / fetcher submission state for
  instant feedback; roll back on action error. Optimistic updates only where the failure path is
  well-defined.
- **Web standards as features.** Real `<form>`s (accessible, no-JS baseline), HTTP status codes
  and redirects, cache headers on loader responses, and URL as state (search params for filters —
  shareable, bookmarkable, back-button-correct).

## Practical workflow

1. **Scaffold with the standard template.** React Router v7 (Remix's evolution) with TypeScript;
   routes in `app/routes/`; strict mode; type-safe loader/action data.
2. **Design the route tree first.** URLs → nested routes → which data each segment loads. Shared
   layout data (current user, nav) in parent loaders; page-specific in leaves.
3. **Write loaders that return what's rendered.** Validate params, authorize, fetch in parallel
   (`Promise.all` for independent queries), throw Responses for 404/403. Type the return; consume
   with `useLoaderData<typeof loader>`.
4. **Write actions as transactions.** Parse + validate form data (zod) → authorize → mutate →
   redirect on success / return field errors with 400 on validation failure. `useActionData` renders
   errors next to fields.
5. **Enhance progressively.** Every mutation works as a plain form POST first; then add
   optimistic UI and pending states. Test with JS disabled — the app should still function.
6. **Observe and tune.** Monitor loader performance (they're your API now), set cache headers on
   CDN-cacheable loaders, and watch action error rates — failed mutations are UX failures.

Loader/action sketch:

```tsx
// app/routes/orders.$id.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const order = await db.order.findUnique({ where: { id: params.id } });
  if (!order) throw new Response("Not found", { status: 404 });
  return { order }; // typed via useLoaderData<typeof loader>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const result = CancelSchema.safeParse(Object.fromEntries(form));
  if (!result.success) return { errors: result.error.flatten() }; // 400-ish, rendered inline
  await cancelOrder(params.id!, result.data);
  return redirect(`/orders/${params.id}`); // PRG: no resubmit on refresh
}
```

## Common pitfalls

- **Client-side fetching for route data.** `useEffect(fetch(...))` in components for what a
  loader should provide — loses parallel loading, SSR, and revalidation. Loaders are the data layer.
- **Actions without validation.** Trusting `formData` directly. Parse + validate (zod) and
  authorize — actions run server-side with full privileges.
- **Skipping the redirect after mutation.** Returning data instead of redirecting causes
  resubmission on refresh. PRG (Post/Redirect/Get) is the default for a reason.
- **useState for URL-statable things.** Filters, tabs, pagination in component state — unshareable,
  lost on refresh. Search params via `useSearchParams` — the URL is the state manager.
- **Fetcher misuse.** Using fetchers for navigation-changing operations (use `<Form>`/navigation),
  or ignoring fetcher error states in optimistic UI (stuck "saved" indicators on failure).
- **No-JS baseline broken.** JavaScript-dependent interactions with no form fallback — defeats
  Remix's core value. Build the form first, enhance second.
- **Loader waterfalls by design.** Parent loader awaiting child data it shouldn't own, or
  sequential awaits for independent queries. Keep loaders parallel and segment-scoped.
