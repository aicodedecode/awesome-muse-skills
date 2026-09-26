---
name: senior-frontend
description: Senior frontend engineer perspective: component architecture, state management, rendering performance, and UX trade-offs. Use when designing UI features, reviewing frontend code, or choosing client-side patterns.
category: development
---

# Senior Frontend Engineer

## Overview

A senior frontend engineer thinks in **user-perceived outcomes**: time to interactive, jank-free
scrolling, accessible interactions, and UI that survives bad networks and weird data. This skill
captures how that role approaches frontend work — component boundaries, where state lives, what
renders when and why, and how to keep a growing client codebase changeable instead of brittle.

The through-line: the browser is a hostile, underpowered, unpredictable runtime. Design for it.

## When to use

- Designing a new feature's component structure and data flow.
- Reviewing frontend code for architecture, performance, or accessibility issues.
- Choosing between state management approaches (local state, context, stores, server cache).
- Debugging rendering performance: slow lists, layout thrash, input lag.
- Deciding what goes client-side vs server-side (SSR, hydration, islands).

## Core concepts

- **Components are boundaries, not folders.** A good component owns one piece of UI *and* the logic
  that can only live with it. If two components always change together, they're one component. If a
  component needs ten props to render, its boundary is wrong.
- **State colocation.** Keep state as low as possible — in the component that uses it. Lift state
  only when siblings genuinely share it. Global state is for *global* things (auth session, theme),
  not for avoiding prop passing.
- **Server state ≠ client state.** Fetched data is a cache with staleness, retries, and invalidation —
  treat it with a data-fetching library, not hand-rolled `useEffect` fetch spaghetti. UI state
  (open modals, form drafts) lives separately and dies with the view.
- **Rendering budget.** Every render should be explainable. Memoization is a targeted fix for measured
  problems, not a default — wrapping everything in `memo` trades one performance problem for a
  correctness-and-complexity problem.
- **Progressive enhancement mindset.** The UI must communicate state: loading, empty, error, offline.
  Design these four states *first*; the happy path is the easy part.
- **Accessibility is correctness.** Keyboard operability, focus management, semantic HTML, and
  sufficient contrast are not polish — a modal that traps no focus is a broken modal.

## Practical workflow

1. **Start from states, not screens.** List every state the feature can be in (loading, empty, error,
   partial, offline, permission-denied) and sketch each before writing components.
2. **Draw the data flow.** For each piece of state, name its owner, its readers, and its lifetime.
   If you can't name the owner, the design isn't done.
3. **Choose rendering strategy deliberately:**
   - Static content → static generation / CDN.
   - Personalized but cacheable → SSR with caching.
   - Highly interactive islands → hydrate selectively, not the whole page.
4. **Build the skeleton first** — layout, loading states, error boundaries — then fill in behavior.
   Users judge speed by when *something meaningful* appears, not when JS finishes.
5. **Measure before optimizing.** Profile with devtools: which components re-render on each keystroke?
   Virtualize lists over ~100 rows, debounce expensive work, move work off the main thread only when
   profiling says the main thread is the bottleneck.
6. **Review checklist for every PR:**
   - Keyboard path works; focus visible and logical; no focus loss on dialogs.
   - No layout shift on load (reserve space for async content).
   - Works at 320px width and 200% zoom.
   - Failed requests show a recoverable error state, not a blank screen.

Example state-ownership decision:

```text
Feature: dashboard with filterable table
- filters (UI state)      → owned by FilterBar, lifted to Dashboard only because Table needs them
- table rows (server)     → fetched via query hook, cached by filter key, stale-while-revalidate
- selected rows (UI)      → owned by Table; cleared when filters change (lifetime = one query)
- export job (server)     → mutation; progress polled; NOT in global store
```

## Common pitfalls

- **Prop drilling panic.** Reaching for a global store because props feel tedious. Two levels of
  props is fine; the store is for cross-cutting concerns, not convenience.
- **Effect-driven fetching chains.** `useEffect` that fetches, sets state, triggers another effect.
  This is where race conditions and double-fetches breed — use a query library with request keys.
- **Ignoring the loading/error/empty states** until QA finds them. They're the majority of real-world
  renders on flaky networks.
- **Premature memoization.** `useMemo`/`memo` everywhere "for performance" without a profile to
  justify it — now renders are unpredictable and the code is harder to read.
- **Hydration mismatches.** Rendering different HTML on server and client (dates, random IDs,
  `window` checks) causes flicker and bugs. Render deterministically; defer client-only bits.
- **Div soup.** `<div onClick>` instead of `<button>`: no keyboard support, no semantics, no focus.
  Use the platform's elements first, custom ARIA second.
- **Chasing frameworks over fundamentals.** The senior move is knowing *when not to add* a library:
  every dependency is a liability you didn't write and can't fully control.
