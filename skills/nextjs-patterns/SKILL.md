---
name: nextjs-patterns
description: Build with Next.js App Router: routing, server/client components, data fetching, caching, metadata, and deployment. Use when developing Next.js applications.
category: web-development
---

# Next.js Patterns

A practical guide to Next.js (App Router): the file-system router, Server vs Client Components, data fetching and caching, metadata/SEO, and production deployment patterns.

## Overview

Next.js App Router splits your app into **Server Components** (default: render on the server, zero client JS, direct backend access) and **Client Components** (`'use client'`: interactivity, hooks, browser APIs). The key skill is knowing which to use where: push data fetching and rendering to the server, keep client components small and leaf-ward. Everything else — caching, streaming, metadata — follows from that split.

## When to use

- Full-stack React apps: marketing sites, dashboards, SaaS.
- SSR/SSG/ISR rendering strategies per route.
- API routes (Route Handlers) colocated with the frontend.
- Migrating Pages Router → App Router.
- Optimizing Next.js bundle size and caching behavior.

## Core concepts

- **App Router files.** `app/page.tsx` (route UI), `layout.tsx` (shared shell), `loading.tsx` (Suspense fallback), `error.tsx` (error boundary), `not-found.tsx`, `route.ts` (API endpoint), `page.tsx` dynamic via `[slug]`.
- **Server Components (default).** Async components that fetch directly: `const data = await db.query(...)` in the component. No `useState`/`useEffect`/browser APIs. Ship zero JS for their subtree.
- **Client Components.** `'use client'` at the top — needed for interactivity. Keep them small; pass server-fetched data as props rather than re-fetching client-side.
- **Data fetching.** `fetch` in Server Components is cached by default; `cache: 'no-store'` for dynamic, `next: { revalidate: 60 }` for ISR. `generateStaticParams` for static dynamic routes.
- **Streaming.** `loading.tsx` + `<Suspense>` stream parts of the page as they resolve — fast TTFB with slow data. Wrap slow components, not whole pages.
- **Server Actions.** `'use server'` functions called from client components — mutations without an API layer. Validate inputs (Zod), check auth, revalidate with `revalidatePath`.
- **Metadata.** `export const metadata = {...}` / `generateMetadata()` per route — title, description, Open Graph. The SEO story.
- **Caching layers.** Request memoization → Data Cache → Full Route Cache → Router Cache. Know which layer you're invalidating (`revalidatePath` vs `revalidateTag`).

## Practical workflow

**1. Route structure.**
```
app/
  layout.tsx            # <html>, fonts, providers
  page.tsx              # /
  blog/[slug]/page.tsx  # /blog/:slug
  blog/[slug]/loading.tsx
  dashboard/layout.tsx  # nested layout
  api/webhooks/route.ts # API endpoint
```

**2. Server-first data.**
```tsx
// app/blog/[slug]/page.tsx — Server Component
export async function generateMetadata({ params }) { ... }

export default async function Post({ params }) {
  const post = await getPost(params.slug); // direct DB/CMS call
  if (!post) notFound();
  return <article><h1>{post.title}</h1><LikeButton id={post.id} /></article>; // LikeButton is 'use client'
}
```

**3. Client islands.** Interactive pieces (`LikeButton`, forms, charts) become small Client Components receiving props. Never make the whole page `'use client'` for one button.

**4. Mutations via Server Actions.**
```ts
'use server';
export async function likePost(id: string) {
  const session = await auth(); if (!session) throw new Error('Unauthorized');
  await db.like(id, session.user.id);
  revalidatePath(`/blog/${id}`);
}
```

**5. Caching strategy.** Static marketing pages: default (static). Dashboards: `dynamic = 'force-dynamic'` or `no-store` fetches. Mixed: static shell + Suspense for dynamic islands. Revalidate with tags after mutations.

**6. Deploy.** `next build` → Vercel (zero-config) or Node standalone output / Docker. Set env vars per environment; `next start` for self-hosted.

## Common pitfalls

- **`'use client'` at the page root.** One interactive element drags the whole page to the client. Push the directive to leaves.
- **Waterfalls.** Sequential awaits in nested Server Components serialize. Parallelize with `Promise.all` or colocate fetches.
- **Over-fetching in layouts.** Layouts fetch on every navigation within their subtree — keep layout data minimal or cache aggressively.
- **Cache confusion.** Stale data after mutation = forgot `revalidatePath`/`revalidateTag`. Unwanted caching = fetch defaults. Learn the four cache layers.
- **Secrets in Client Components.** Anything imported by a client component ships to the browser. Keep keys/queries server-side; pass only results as props.
- **Metadata in client components.** `metadata` exports only work in Server Components. Client pages need a server wrapper for metadata.
- **`useEffect` for data.** In App Router, data fetching belongs in Server Components, not effects. Effects are for subscriptions/DOM, not initial data.
- **Ignoring loading.tsx.** Slow server data without Suspense boundaries = blank page until everything resolves. Stream progressively.
- **Bundle bloat from server imports.** Importing a server-only lib (DB client) into a client component breaks the build or leaks. `server-only` package makes violations fail fast.
