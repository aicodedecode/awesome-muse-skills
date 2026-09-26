---
name: service-worker-pro
description: Control the network layer with Service Workers: caching strategies, offline support, background sync, and update flows. Use for offline-first web apps.
category: web-development
---

# Service Worker Pro

A practical guide to Service Workers: the programmable network proxy in the browser — lifecycle, caching strategies, offline architectures, background sync, and the update flows that keep users on fresh code without breaking them.

## Overview

A Service Worker (SW) sits between your page and the network: it **intercepts requests** and decides — cache, network, or both. This enables offline support, instant repeat loads, and background sync. It's also the foundation of push notifications. The SW runs in its own thread with its own lifecycle (install → activate → fetch), independent of any page — which is both its power and its sharp edges (stale caches, update races).

## When to use

- Offline-capable web apps (see also pwa-patterns).
- Caching strategies for assets and API responses.
- Background sync for queued mutations.
- Push notification handling.
- Advanced prefetching/prerendering strategies.

## Core concepts

- **Lifecycle.** `install` (precache) → `activate` (cleanup old caches) → `fetch` (intercept). A new SW waits until all tabs using the old one close (`skipWaiting()` + `clients.claim()` to take over immediately — use deliberately).
- **Scope.** SW controls pages under its registration path. Register at root (`/sw.js`) for full-site control.
- **Cache API.** `caches.open('v1')` — programmatic cache storage, separate from HTTP cache. Version cache names; delete old versions on activate.
- **Strategies.** Cache-first (immutable assets), network-first (fresh data, cache fallback), stale-while-revalidate (fast + fresh eventually), network-only, cache-only. Match strategy to resource type.
- **Precache vs runtime.** Precache the app shell at install (known URLs); cache runtime requests as they happen (API responses, images).
- **Background Sync.** `sync.register('send-queue')` → SW retries when online — for queued mutations. One-shot; for periodic, Periodic Background Sync (limited support).
- **Update flow.** Byte-difference check on navigation → new SW installs → waits → activates. UX: notify "new version available" → user refreshes, or auto-`skipWaiting` for non-critical apps.

## Practical workflow

**1. Register.**
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.addEventListener('updatefound', () => notifyUpdateAvailable());
  });
}
```

**2. Precache + strategies (vanilla).**
```js
const SHELL = 'shell-v3';
const PRECACHE = ['/', '/app.css', '/app.js', '/offline.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== SHELL).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.url.includes('/api/')) {
    e.respondWith(networkFirst(request, 'api-v1'));       // fresh data, offline fallback
  } else if (request.destination === 'image') {
    e.respondWith(cacheFirst(request, 'images-v1'));      // immutable-ish assets
  } else {
    e.respondWith(staleWhileRevalidate(request, SHELL));  // shell + pages
  }
});
```
(Or use Workbox — recommended over hand-rolling for production.)

**3. Offline fallback.** Navigation requests failing → serve cached `/offline.html`. API failing → serve cached response with a flag, or a structured offline error the app handles.

**4. Background sync for mutations.**
```js
// page: queue failed POSTs in IndexedDB, then
navigator.serviceWorker.ready.then(reg => reg.sync.register('outbox'));
// sw.js: self.addEventListener('sync', e => { if (e.tag === 'outbox') e.waitUntil(flushOutbox()); });
```

**5. Update UX.** `updatefound` → show "Update available — refresh" snackbar → on click, `registration.waiting.postMessage({ type: 'SKIP_WAITING' })` → `controllerchange` → `location.reload()`.

## Common pitfalls

- **Caching the SW file itself.** If `/sw.js` is cached with a long TTL, updates never arrive. Serve it `Cache-Control: no-cache` (revalidate every time).
- **Over-aggressive precaching.** Precaching everything = slow install, wasted bandwidth. Precache the shell; runtime-cache the rest.
- **Stale-forever bugs.** Cache-first on HTML/API without versioning = users stuck on ancient content. Version caches; prefer SWR/network-first for HTML.
- **Update races.** `skipWaiting` mid-session can break in-flight app state (old page, new cached assets). For complex apps, prompt the user instead of forcing.
- **Opaque responses.** Cross-origin `no-cors` responses are opaque — cacheable but inscrutable (can't check status). Prefer CORS-enabled endpoints.
- **Quotas.** Cache + IndexedDB share origin storage (browser-managed, evictable). Don't treat it as infinite; handle `QuotaExceededError`.
- **Dev confusion.** SW caching during development = "my changes aren't showing". Unregister in dev, or use dev-only bypass. Chrome DevTools → Application → Service Workers → "Update on reload" + "Bypass for network".
- **Scope mistakes.** Registering `/app/sw.js` controls only `/app/*`. Root registration for site-wide control.
- **Untested offline.** "Works offline" claimed, never tested. DevTools offline mode + real airplane-mode tests on device.
