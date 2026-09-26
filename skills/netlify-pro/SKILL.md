---
name: netlify-pro
description: Netlify guidance — deployments, branch previews, serverless functions, edge, forms, and site performance.
category: development
---

## Overview

Netlify pioneered the JAMstack deployment model: git-push builds, atomic deploys with instant rollbacks, branch preview URLs, and a global edge network — plus serverless functions, forms, and identity as add-ons. It's the straightforward path for static sites and frontend apps with light backend needs.

Netlify's opinions (static-first, functions for dynamic bits, plugins for build steps) make simple things trivial and complex backends awkward — know where the boundary is. This skill covers deploying well on Netlify: builds, previews, functions, edge, forms, and performance.

## When to use

- Deploying static sites or frontend apps to Netlify.
- Setting up branch deploys and deploy previews.
- Adding serverless or edge functions.
- Handling forms without a backend (Netlify Forms).
- Tuning build performance and caching.
- Controlling Netlify costs (bandwidth, functions, build minutes).
- Comparing Netlify with Vercel/Cloudflare Pages.

## Core concepts

- **Atomic deploys.** Every deploy is an immutable snapshot; instant rollbacks to any previous deploy. Broken deploy? One click back. This changes deployment psychology — ship smaller, rollback freely.
- **Branch deploys and previews.** Production branch, branch deploys (per-branch URLs), and deploy previews (per-PR). Context-aware config (`[context.production]`, `[context.deploy-preview]`) tailors builds per environment.
- **Builds.** Build command + publish directory per site; dependency caching; build plugins (framework detection, optimizations); monorepo support with base directories. Build minutes are a billing dimension — keep builds fast.
- **Redirects and rewrites.** `_redirects` file or `netlify.toml` `[[redirects]]` — SPA fallbacks, proxying to APIs, country-based routing, signed proxy URLs. Edge-level routing without origin involvement.
- **Headers.** `_headers` file or `[[headers]]` for security headers (CSP, HSTS), caching policies, and CORS — set deliberately per path.
- **Serverless functions.** Node/Go functions in `netlify/functions` (or configured dir): background functions (longer timeouts) vs synchronous; scheduled functions (cron) for periodic tasks. Bundling via esbuild; keep them small and fast.
- **Edge functions.** Deno-based, run near users — for personalization, auth gates, A/B tests, geolocation. Different runtime from serverless functions; know which you need.
- **Forms.** `netlify` attribute on HTML forms captures submissions without backend code; spam filtering, notifications, and Zapier/webhook integrations. For serious forms, pair with functions for validation.
- **Identity.** Netlify Identity (GoTrue-based) for auth with role-based access control on routes (`_redirects` role conditions). Fine for small apps; larger auth needs go to dedicated providers.
- **Large Media / Blobs.** Netlify Blobs for key-value/file storage from functions; Large Media (Git LFS based) for versioned assets — understand which fits (Blobs for runtime data, not Git-tracked assets).
- **Split testing.** Branch-based A/B testing at the edge — traffic splitting between branches without code changes.
- **Analytics.** Server-side analytics (no client JS needed) — privacy-friendly baseline before adding heavier RUM.
- **Environment variables.** Per-context scoping (production, deploy-preview, branch-deploy, dev); scopes prevent previews touching prod; sensitive values via UI/CLI, never in the repo.
- **Pricing dimensions.** Bandwidth, build minutes, function invocations/duration, form submissions, Identity users. The surprises: unoptimized assets eating bandwidth, chatty functions, and build minutes from slow installs.

## Practical workflow

1. **Connect and configure.** Link repo, set build command + publish dir, framework preset; configure contexts in `netlify.toml` for per-environment behavior.
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   [context.production.environment]
     API_URL = "https://api.example.com"
   [context.deploy-preview.environment]
     API_URL = "https://api-staging.example.com"
   ```
2. **Set redirects and headers.** SPA fallback (`/* /index.html 200`), API proxying, security headers per path — edge config that keeps the origin simple.
   ```toml
   [[redirects]]
     from = "/api/*"; to = "https://api.example.com/:splat"; status = 200
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```
3. **Write focused functions.** One function per concern; background functions for long work; scheduled functions replacing cron; keep bundles small.
4. **Use edge functions for request shaping.** Auth checks, geo-personalization, A/B tests at the edge — fast, close to users, off the origin.
5. **Handle forms.** Netlify Forms for simple capture with spam filtering; functions for validation and downstream integration (CRM, email); honeypot fields for spam.
6. **Leverage previews.** Deploy previews per PR with staging API URLs; run E2E tests against preview URLs; use branch deploys for long-lived staging.
7. **Optimize assets.** Image CDN/transformations, asset optimization settings, hashed filenames with immutable caching; large media via dedicated storage, not bandwidth-heavy page loads.
8. **Monitor and control cost.** Bandwidth by path in analytics; function logs and durations; build-minute trends; spend alerts before the invoice surprises.

## Common pitfalls

- **SPA without fallback redirect** — deep links 404ing; `/* /index.html 200` is step zero.
- **Preview hitting production APIs** — unscoped env vars; context-scoped variables per environment.
- **Functions doing heavy work** — timeouts and bills; background functions or external workers for long tasks.
- **No security headers** — missing CSP/HSTS/X-Frame-Options; set them in `[[headers]]`.
- **Unoptimized assets** — giant images eating bandwidth; transform and size at the source.
- **Build minutes bloat** — reinstalling everything every build; cache dependencies, prune build steps.
- **Forms without spam protection** — honeypot + filtering; open forms attract bots within hours.
- **Edge vs serverless confusion** — wrong runtime for the task; edge for request shaping, serverless for Node/Go logic.
- **Ignoring atomic rollbacks** — debugging forward on a broken deploy; one-click rollback exists, use it.
- **Secrets in netlify.toml** — committed env values; use the UI/CLI for sensitive variables.
- **No function log monitoring** — errors invisible until users report; watch function logs and set alerts.
- **Bandwidth-heavy media** — video/files served as page assets; dedicated storage + CDN for heavy media.
- **Split testing without cleanup** — stale branches splitting traffic; end tests and remove branches.
