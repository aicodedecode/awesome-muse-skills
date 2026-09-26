---
name: react-pro
description: Write professional React: hooks discipline, composition, performance, error boundaries, and modern patterns. Use for any React development beyond basics.
category: web-development
---

# React Pro

A practical guide to professional React: hooks used correctly, composition over configuration, performance without premature optimization, error boundaries, and the modern patterns (Server Components awareness, concurrent features) that define current React.

## Overview

React expertise is mostly **discipline**: effects that do one thing, state colocated with its use, components composed rather than configured, and renders kept cheap. The library's surface is small; the failure modes come from fighting its model — mutating state, effects as event handlers, and prop-drilling what should be composed.

## When to use

- Any React development: components, hooks, state architecture.
- Performance triage: unnecessary renders, slow interactions.
- Code review: spotting effect misuse, state duplication, composition failures.
- Modernizing class components or legacy patterns.

## Core concepts

- **Hooks rules.** Only at top level, only in components/hooks. `useState` for UI state; `useRef` for mutable non-render values (timers, DOM nodes, latest callbacks); `useMemo`/`useCallback` for expensive computations and stable references passed to memoized children.
- **Effects are for synchronization.** `useEffect` syncs with external systems (subscriptions, DOM measurements, network subscriptions) — not for "when X changes, update Y" (that's derived state: compute during render) and not for user events (that's an event handler).
- **Derived state.** If it can be computed from props/state, don't store it: `const total = items.reduce(...)` during render. `useMemo` only if expensive.
- **Composition.** `children`, slots (`header`/`footer` props), and compound components beat prop-configured mega-components (`<Modal title footerLeft ...>`).
- **Keys.** Stable, unique keys for lists — never index when order changes. Keys are identity: changing a key remounts.
- **Error boundaries.** Class components (or libraries) catching render errors per subtree — one crashing widget shouldn't kill the page.
- **Concurrent features.** `useTransition`/`startTransition` for non-urgent updates (filtering large lists), `useDeferredValue` for deferred rendering, `<Suspense>` for async boundaries.
- **Server Components awareness.** Even outside Next.js, the direction is clear: less client JS, server-rendered data, client components as interactive islands.

## Practical workflow

**1. Component shape.**
```tsx
function UserCard({ user, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);       // local UI state, colocated
  const fullName = `${user.first} ${user.last}`;          // derived, computed in render
  const handleSelect = () => onSelect(user.id);           // event handler, not effect

  useEffect(() => {                                       // external sync only
    const sub = presence.subscribe(user.id, setOnline);
    return () => sub.unsubscribe();
  }, [user.id]);

  return (...);
}
```

**2. Effect checklist.** Before writing `useEffect`, ask: is this responding to a user event (→ handler), computing render data (→ derive), or syncing with something outside React (→ effect)? Two of three aren't effects.

**3. Performance pass.** React DevTools Profiler → find wasted renders → fix causes (unstable props, context churn, missing memo) rather than wrapping everything in `memo`. `memo` is a bandage; stable data flow is the cure.

**4. State placement.** Lift only as high as needed. Global only when truly global. Prefer composition (passing components) over prop drilling.

**5. Async.** `use` hook / Suspense for data where supported; otherwise a data library (TanStack Query) — not hand-rolled effect fetching.

## Common pitfalls

- **Effects for derived state.** `useEffect(() => setFullName(a + b), [a, b])` — extra render, sync bugs. Compute during render.
- **Effects for events.** Fetching in an effect on mount for a button click flow — use the event handler.
- **Missing effect deps.** The exhaustive-deps warning is usually right. Suppressing it hides stale-closure bugs; restructure instead (move logic inside, use refs for latest values).
- **Stale closures.** Async callbacks capturing old state. Fix with functional updates (`setCount(c => c + 1)`), refs, or re-subscribing correctly.
- **Index keys.** Reordering/filtering with index keys scrambles component state. Stable IDs.
- **Prop drilling.** Five levels of pass-through props = compose instead (children/slots) or use context/store for truly shared state.
- **Context for high-frequency state.** Context re-renders all consumers on any change — fine for theme/locale, terrible for rapidly-changing values. Use a store with selectors.
- **`useMemo`/`useCallback` everywhere.** Memoization has cost; apply where profiling shows waste (expensive computes, memoized children receiving callbacks).
- **No error boundaries.** One throwing component unmounts the whole tree. Boundaries per feature area; log to error tracking in `componentDidCatch`.
- **Mutating state.** `state.items.push(x)` then `setState(state)` — same reference, no render. Always new references (or Immer).
