---
name: micro-frontends-pro
description: Architect micro-frontends: module federation, single-spa, routing, shared dependencies, and team autonomy patterns. Use for large apps split across teams.
category: web-development
---

# Micro-Frontends Pro

A practical guide to micro-frontends: splitting a large frontend across teams — integration approaches (Module Federation, single-spa, iframes, web components), shared dependencies, routing, and the organizational patterns that make it work.

## Overview

Micro-frontends apply microservices thinking to UI: **independently deployable frontend slices owned by different teams**, composed into one product. The technical challenge is integration (how slices compose at runtime); the real challenge is organizational ( Conway's law, contracts, versioning). Only adopt when team scale demands it — the complexity tax is real.

## When to use

- Large products with multiple teams stepping on each other's deploys.
- Incremental migration (strangler fig) from a legacy frontend.
- Truly independent team ownership of product areas.
- NOT for: small teams, simple products, or "it sounds cool" (a modular monolith is better).

## Core concepts

- **Integration approaches.**
  - **Module Federation (webpack):** remotes expose modules consumed at runtime; shared deps deduped. Best for webpack-based teams wanting deep integration.
  - **single-spa:** framework-agnostic orchestrator; apps mount/unmount on routes. Good for mixing frameworks (React + Vue + Angular).
  - **Web components:** framework-agnostic custom elements as the composition contract. Simple, standards-based.
  - **Iframes:** strongest isolation (separate JS heap, CSS), weakest UX integration (sizing, routing, communication via postMessage). Use for untrusted/third-party content, not first-party decomposition.
  - **Build-time composition:** monorepo packages composed at build — "micro-frontends" in team ownership only. Often the pragmatic sweet spot.
- **Routing.** Shell owns top-level routing; remotes own sub-routes. Contract: who handles `/billing/*` vs `/billing/settings`. Deep-linking must work across the composition.
- **Shared dependencies.** Singleton sharing (React, router, design system) — version alignment is the #1 integration bug source. Either strict alignment or tolerate duplication deliberately.
- **Communication.** Custom events / pub-sub bus for cross-slice messaging (cart updated, user logged out); URL as shared state where possible; avoid direct imports between slices.
- **Contracts.** Versioned APIs between shell and remotes (props/events, route params). Breaking changes need coordination — contracts don't eliminate coupling, they make it explicit.
- **Deployment independence.** Each slice deploys on its own cadence; the shell references remotes by URL (versioned). Rollback per slice.

## Practical workflow

**1. Decide if you need it.** Signals for yes: 4+ teams, deploy conflicts weekly, parts of the app on different frameworks, legacy strangulation. Otherwise: modular monolith.

**2. Choose the integration.**
- Same framework (React everywhere) → Module Federation.
- Mixed frameworks → single-spa or web components.
- Third-party/untrusted → iframes.
- Team ownership without runtime composition → build-time packages.

**3. Define the shell.** Shell responsibilities: authentication, top-level routing, layout chrome (nav, footer), shared design system, error boundaries per slice (one slice crashing ≠ whole app down).

**4. Module Federation sketch.**
```js
// shell webpack config
new ModuleFederationPlugin({
  name: 'shell',
  remotes: { billing: 'billing@/billing/remoteEntry.js', search: 'search@/search/remoteEntry.js' },
  shared: { react: { singleton: true, requiredVersion: '^18.0.0' }, 'react-dom': { singleton: true } },
});
// usage: const BillingApp = React.lazy(() => import('billing/App'));
```

**5. Contracts & versioning.** Document each remote's mount contract (props in, events out, routes owned). Version remotes; shell pins versions; canary new remote versions independently.

**6. Independent CI/CD.** Each slice: own repo (or monorepo package), own pipeline, own deploy. Contract tests (does the remote still expose what the shell expects?) in CI.

## Common pitfalls

- **Adopting too early.** 2 teams + micro-frontends = distributed monolith pain with none of the benefits. Earn the complexity with scale.
- **Shared dependency skew.** Shell on React 18.2, remote on 18.0, non-singleton → duplicate Reacts → hooks errors. Align strictly or isolate fully.
- **No error isolation.** One remote's crash whitescreens the shell. Error boundaries per remote; fallback UI; failed-remote retry.
- **Inconsistent UX.** Each team inventing its own patterns = franken-app. Shared design system (components, tokens, motion) is mandatory, not nice-to-have.
- **Chatty cross-slice coupling.** Remotes importing each other's internals recreates the monolith with network hops. Communicate via events/URLs, not imports.
- **Routing conflicts.** Two slices claiming overlapping routes; back-button breaking across remotes. Single routing authority (the shell) with delegated sub-routes.
- **Performance death by composition.** 5 remotes × framework runtime + duplicated deps = slow. Audit the composed bundle; share aggressively; lazy-load remotes by route.
- **Testing gaps.** Unit tests per slice, but no integration tests of the composition. Contract tests + E2E across the composed app in CI.
- **Version drift.** Shell expecting remote v2 API, remote deployed v3. Pin versions; canary; keep backward compatibility windows.
- **Ignoring the monolith option.** A well-modularized monolith with team-owned directories and independent deploy pipelines (feature flags) solves 80% of cases with 20% of the complexity.
