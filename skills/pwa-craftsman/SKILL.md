---
name: pwa-craftsman
description: Build excellent Progressive Web Apps: manifests, service workers, offline strategy, installability, and app-like UX. Use when building or reviewing PWAs.
category: development
---

# PWA Craftsman

## Overview

A great PWA — **installable, offline-capable, and app-like** — is a craft of details: the manifest
that makes it installable, the service worker that makes it reliable, caching strategies matched to
content types, and UX that respects connectivity. This skill covers building PWAs that feel native
rather than "a website with a manifest."

The through-line: reliable (works offline), fast (instant loads), engaging (installable, push-capable)
— in that order.

## When to use

- Building a new PWA or converting a web app.
- Designing offline support and caching strategies.
- Debugging service worker issues (stale content, update flows).
- Improving installability, push notifications, or app-like UX.
- Auditing an existing PWA against quality criteria.

## Core concepts

- **The manifest.** `manifest.json`: name, icons (maskable + any, multiple sizes), theme/background
  colors, display mode (`standalone`), start URL, shortcuts, share target. This is the install
  contract — get icons and colors right, because they're the app's face on the home screen.
- **Service worker lifecycle.** Install → activate → fetch interception; versioned caches;
  `skipWaiting` + `clients.claim` for prompt updates (or deliberate delayed updates). The #1 PWA
  bug class is lifecycle confusion — learn it cold before writing strategies.
- **Caching strategies per content type.** This is the core design work:
  - App shell (HTML/CSS/JS): precache, cache-first with versioned updates.
  - API data: stale-while-revalidate (fresh UI, background refresh) or network-first with cache
    fallback for must-be-fresh data.
  - Images/media: cache-first with quota management.
  - Truly dynamic: network-only.
  One strategy for everything is always wrong.
- **Offline as a designed state.** Not just "cached shell + spinner" — queued mutations (background
  sync), clear offline UI, conflict resolution policy for synced data. Offline support is a product
  decision with UX design, not a service worker flag.
- **Installability criteria.** HTTPS, manifest with icons, service worker with fetch handler,
  and meeting the browser's engagement heuristics. Plus the UX: *when* to prompt (after value
  demonstrated, not on first visit) and a graceful custom install button.
- **Push notifications (with restraint).** Push API + Notifications API via the service worker;
  VAPID keys; user permission requested in context with clear value. Notifications are a
  retention tool that becomes an uninstall tool when abused — every push must earn the next one.

## Practical workflow

1. **Start with the baseline.** HTTPS, responsive design, and a fast site — a slow broken site
   with a manifest is still a slow broken site. Lighthouse PWA audit as the starting scorecard.
2. **Write the manifest.** Complete icons (192/512 + maskable), theme colors matching the UI,
   `display: standalone`, shortcuts to key actions. Validate with DevTools → Application.
3. **Build the service worker with Workbox (or hand-rolled if small).** Precache the app shell
   (build-integrated revisioning); runtime caching routes per content type with the right strategy;
   quota/expiration policies so caches don't grow unboundedly.
4. **Design offline UX.** Offline page/fallbacks, queued actions with background sync, "you're
   offline" states that explain what's available. Test with DevTools offline + real airplane mode.
5. **Handle updates gracefully.** New service worker → notify user ("Update available") rather
   than force-reloading mid-task; or auto-update for non-critical apps. Never strand users on
   stale versions silently, never yank the rug mid-flow.
6. **Add engagement carefully.** Custom install prompt at the right moment; push only for
   genuinely time-sensitive, user-valued events; notification settings in-app. Measure opt-in and
   disable rates — they're the truth about your push strategy.

Caching strategy map:

```text
/app-shell (/, /styles/*, /app.js)   → precache, cache-first (versioned at build)
GET /api/feed                        → stale-while-revalidate (5 min max age)
/api/user/* (must be fresh)          → network-first, cache fallback on failure
/images/*                            → cache-first, max 200 entries, 30-day expiry
POST /api/* (mutations)              → network-only + background-sync queue when offline
```

## Common pitfalls

- **Cache-everything service worker.** One cache-first strategy for all routes = stale API data
  and confused users. Strategies per content type, always.
- **Update purgatory.** Users stuck on old versions because the new SW never activates (or
  activates mid-session breaking state). Deliberate update UX: notify + user-triggered reload.
- **Unbounded caches.** Caching every image forever until storage pressure evicts *everything*
  unpredictably. Expiration + max entries on every runtime cache.
- **Offline as an accident.** "It kind of works offline" — untested, with spinners and broken
  mutations. Offline is a feature: design, implement, and test it like one.
- **Install prompt on first paint.** Begging for installation before demonstrating value —
  dismissed forever. Prompt after the aha moment; provide a persistent manual install entry point.
- **Notification spam.** Every marketing whim as a push. Permission revoked, app uninstalled.
  High-value, user-controlled, infrequent — or don't do push at all.
- **iOS assumptions.** Safari's PWA support has real gaps/limits (push arrived late, storage
  limits, no install prompt API — manual share-menu install). Design for the weakest platform you
  support; test on real iOS.
