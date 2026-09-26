---
name: vercel-pro
description: Vercel guidance — deployments, edge/serverless functions, ISR, preview environments, analytics, and cost control.
category: development
---

## Overview

Vercel is the frontend cloud: git-push deployments, preview URLs per PR, edge network, and serverless/edge functions — deeply integrated with Next.js but supporting any frontend framework. Its superpower is developer experience: zero-config deployments with production-grade edge infrastructure underneath.

The tradeoffs live in cost and control: bandwidth/function pricing can surprise at scale, and the platform's opinions (serverless-first, edge runtime limits) shape architecture. This skill covers deploying well on Vercel — rendering strategies, functions, caching, previews, and keeping the bill predictable.

## When to use

- Deploying Next.js (or any frontend) to Vercel.
- Choosing rendering strategies (SSG, ISR, SSR, edge).
- Writing serverless and edge functions (limits, regions, cold starts).
- Setting up preview deployments and branch workflows.
- Tuning caching and performance (headers, ISR, edge config).
- Controlling Vercel costs (bandwidth, function duration, builds).
- Migrating to/from Vercel or comparing with Netlify/Cloudflare.

## Core concepts

- **Git-centric deploys.** Push to deploy; every PR gets a preview URL with its own deployment. Production branch auto-deploys. The preview workflow is the killer feature — design review processes around it.
- **Rendering strategies.** SSG (build-time, fastest), ISR (stale-while-revalidate — static with background updates), SSR (per-request server render), edge rendering. ISR is the default answer for content that changes: fast and fresh.
- **Serverless functions.** API routes / route handlers run as serverless functions: region selection, memory/timeout configuration, cold starts. Keep them fast and stateless; heavy compute belongs elsewhere.
- **Edge functions/middleware.** Run at the edge near users (middleware for auth, redirects, A/B tests, geolocation). Edge runtime limits apply (no native Node APIs beyond the compat list) — know the boundary.
- **Fluid compute.** The newer model blurring serverless/edge — understand what your workload runs on and its limits rather than assuming.
- **Caching.** `Cache-Control` headers, ISR revalidation, and the edge cache. Vercel caches aggressively at the edge — set headers deliberately or debugging "stale content" becomes a hobby.
- **ISR and on-demand revalidation.** Time-based (`revalidate: 60`) plus on-demand (`revalidatePath`/`revalidateTag` from CMS webhooks) — the content-freshness pattern for Next.js on Vercel.
- **Preview environments.** Per-PR deployments with their own env vars and (optionally) branch databases. Preview env var scoping (preview vs production) prevents PRs touching prod data.
- **Environment variables.** Per-environment (production/preview/development) scoping; sensitive values never in code; pull with `vercel env pull` for local dev.
- **Builds.** Build command, output directory, install command per project; build cache for dependencies; monorepo support with per-app project roots. Failed builds from unpinned dependencies are the classic CI mystery.
- **Analytics and Speed Insights.** Real-user monitoring built in — use it before adding third-party RUM. Web Vitals tracked per deployment; regressions attributed to specific deploys.
- **Domains and TLS.** Custom domains with automatic TLS, wildcard support, edge config for redirects/rewrites at the platform level.
- **Pricing dimensions.** Bandwidth, function invocations/duration, builds, ISR reads/writes. The bill surprises come from: unoptimized images, API routes doing heavy work, and ISR churn.
- **Limits.** Function timeouts, payload sizes, edge runtime constraints — design within them or split workloads (heavy jobs to dedicated compute).
- **Cron jobs.** Scheduled invocations via `vercel.json` crons — replaces external schedulers for light periodic work; keep handlers idempotent.
- **Edge Config.** Ultra-low-latency global config reads at the edge — feature flags without origin round trips.

## Practical workflow

1. **Connect the repo.** Import project, set framework preset, configure build settings; set production/preview/development env vars with correct scoping.
2. **Choose rendering per route.** Static for marketing, ISR for content (CMS-driven with on-demand revalidation), SSR/edge for personalized — don't SSR what ISR can serve.
   ```js
   // ISR: static with background refresh
   export const revalidate = 60;
   // on-demand from CMS webhook:
   // revalidatePath("/blog/[slug]") or revalidateTag("posts")
   ```
3. **Write lean functions.** API routes doing one thing fast; region set near your data (`export const runtime` / region config); timeouts appropriate to the task; no heavy compute in request path.
4. **Cache deliberately.** `Cache-Control: s-maxage=60, stale-while-revalidate` for semi-dynamic; long immutable caching for hashed assets; on-demand revalidation from content webhooks.
5. **Use middleware at the edge.** Auth gates, geo-personalization, A/B tests, and redirects in middleware — runs before the origin, keeps logic off the critical render path.
   ```js
   // middleware.js — edge auth gate sketch
   export function middleware(req) {
     if (!req.cookies.get("session") && req.nextUrl.pathname.startsWith("/app"))
       return Response.redirect(new URL("/login", req.url));
   }
   ```
6. **Leverage previews.** Every PR gets a URL — wire visual review, E2E tests against previews, and branch-database provisioning for realistic testing.
7. **Monitor vitals.** Speed Insights + Analytics per deployment; set performance budgets; investigate Web Vital regressions by attributing to the deploying PR.
8. **Control costs.** Image optimization (use the Image component correctly, don't serve giant originals), bound function durations, cache API responses, review bandwidth by route; set spend alerts.

## Common pitfalls

- **SSR everything** — slow TTFB and function bills; ISR/SSG where content isn't per-user.
- **No cache headers** — dynamic-by-default responses killing edge cache value; set them per route.
- **Heavy work in functions** — image processing, long computations in request path; move to dedicated compute or background jobs.
- **Unscoped env vars** — preview deployments hitting production databases; scope vars per environment.
- **Unoptimized images** — giant originals through the image optimizer; size and format correctly at the source.
- **ISR without revalidation strategy** — stale content with no webhook revalidation; wire CMS events to on-demand revalidation.
- **Edge runtime surprises** — Node APIs unavailable in middleware/edge functions; check the compat list.
- **Bandwidth blindness** — video/large assets served through Vercel bandwidth; use dedicated storage/CDN for heavy media.
- **Build failures from unpinned deps** — floating versions breaking builds randomly; lockfiles committed and respected.
- **Ignoring function regions** — functions far from the database adding latency; co-locate with data.
- **No spend alerts** — surprise bills from traffic spikes or runaway functions; set budget notifications.
- **Preview env drift** — previews diverging from production config; keep env var sets in sync.
- **Preview deployments indexed** — staging URLs in search results; send `x-robots-tag: noindex` on non-production.
- **Cron overlapping runs** — long crons overlapping the next scheduled run; make handlers idempotent and bounded.
- **Middleware doing too much** — heavy logic at the edge slowing every request; keep middleware fast and small.
