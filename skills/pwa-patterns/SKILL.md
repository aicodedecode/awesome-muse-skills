---
name: pwa-patterns
description: Build Progressive Web Apps: manifests, service workers, offline strategies, installability, and push. Use for app-like web experiences.
category: web-development
---

# PWA Patterns

A practical guide to Progressive Web Apps: web app manifests, service-worker caching strategies, offline UX, installability, and push notifications — making web apps feel native where it counts.

## Overview

A PWA = a normal web app + **manifest** (installability metadata) + **service worker** (offline/caching) + HTTPS. The payoff: installable to home screen, works offline, push notifications, app-like feel — without app stores. The discipline: offline isn't a feature toggle, it's a design constraint affecting every data flow.

## When to use

- Internal tools and B2B apps needing offline resilience.
- Content apps (news, docs, catalogs) for flaky networks.
- Avoiding app-store overhead for app-like distribution.
- Adding push notifications to a web app.

## Core concepts

- **Manifest (`manifest.json`).** `name`, `icons` (192/512px, maskable), `start_url`, `display: standalone`, `theme_color`, `background_color`. Linked via `<link rel="manifest">`. Controls the installed app's identity.
- **Service worker.** A script the browser runs in the background: intercepts network requests, serves cached responses, enables offline. Lifecycle: install → activate → fetch. Update via byte-change detection.
- **Caching strategies.** Cache-first (static assets), network-first (API data with cache fallback), stale-while-revalidate (balance), cache-only / network-only. Choose per resource type — one strategy doesn't fit all.
- **Offline UX.** Detect `navigator.onLine` + fetch failures; show cached data with "offline" indicator; queue mutations (background sync) and replay when online.
- **Installability.** Criteria: manifest + service worker + HTTPS + icons. Prompt via `beforeinstallprompt` (capture the event, show your own UI at the right moment — not on first visit).
- **Push.** Push API + Notifications API via service worker; requires user permission and a push service (VAPID keys for web push). Permission prompt in context, never on load.

## Practical workflow

**1. Manifest.**
```json
{
  "name": "FieldOps", "short_name": "FieldOps",
  "start_url": "/app/", "display": "standalone",
  "background_color": "#ffffff", "theme_color": "#4f46e5",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

**2. Service worker (Workbox recommended over hand-rolling).**
```js
// with Workbox:
registerRoute(({ request }) => request.destination === 'image', new CacheFirst({ cacheName: 'images' }));
registerRoute(({ url }) => url.pathname.startsWith('/api/'), new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 3 }));
precacheAndRoute(self.__WB_MANIFEST); // app shell
```

**3. Versioning.** Precache the app shell with content-hashed filenames; on new deploy, the SW updates, `skipWaiting` + `clients.claim` (or prompt "new version available → refresh").

**4. Offline data.** Cache API responses (NetworkFirst); for mutations, queue in IndexedDB and sync on `online`/Background Sync. Show pending-sync state in UI ("3 changes will sync").

**5. Install prompt.**
```js
let deferred;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; showInstallButton(); });
// on click: deferred.prompt(); await deferred.userChoice;
```

**6. Push.** Request permission after a user action ("Enable notifications" toggle) → subscribe with VAPID key → send subscription to server → server pushes via Web Push.

## Common pitfalls

- **Service worker scope.** SW only controls pages under its path. Serve from root (`/sw.js`, scope `/`) or scope carefully.
- **Caching the HTML shell aggressively.** Stale app shell = users stuck on old version. Precache with hashed assets; never cache-bust the entry HTML long-term.
- **Update UX.** Silent updates confuse ("why did it change?"); no updates strand users. Prompt "Update available" with a refresh action — the standard pattern.
- **Offline as afterthought.** Bolting offline onto an app designed online-first fails. Design data flows for offline from the start (local-first where possible).
- **Over-caching APIs.** Caching personalized/dynamic API responses too long serves stale/wrong data. Short TTLs + revalidation for dynamic data.
- **Push permission on load.** Instant denial, permanently. Ask in context after demonstrating value.
- **iOS gaps.** Safari PWA support lags (push arrived late, some APIs missing). Test the full PWA flow on iOS; design fallbacks.
- **HTTPS requirement.** SW/manifest/install need secure contexts. `localhost` OK for dev; production must be HTTPS.
- **Icon gaps.** Missing maskable icons = ugly cropped icons on Android. Provide `any maskable` with safe-zone padding.
