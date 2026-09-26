---
name: react-best-practices
description: Idiomatic React: component design, hooks discipline, state placement, rendering performance, and modern patterns. Use when writing or reviewing React code, or choosing React architecture.
category: development
---

# React Best Practices

## Overview

React rewards **declarative thinking**: describe what the UI should be for a given state, and let
React handle the DOM. Most React pain comes from fighting this model — syncing state with effects,
managing the DOM imperatively, or scattering state where it doesn't belong.

This skill distills modern, idiomatic React: component boundaries, hooks done right, state
colocation, data-fetching patterns, and performance work that targets measured problems.

## When to use

- Writing new React components, hooks, or features.
- Reviewing React code for idiom, performance, or correctness issues.
- Choosing state management (useState, context, external stores, server-state libraries).
- Debugging stale closures, infinite effect loops, or unnecessary re-renders.
- Migrating to modern patterns (Server Components, Suspense, actions).

## Core concepts

- **UI = f(state).** Components render from state and props; side effects synchronize with the
  outside world. If you're "syncing" two pieces of React state with an effect, derive one from the
  other instead — derived state shouldn't be state at all.
- **Hooks rules are the contract.** Call hooks unconditionally at the top level; custom hooks
  extract reusable *logic*, not just to hide code. The `exhaustive-deps` lint rule is right more
  often than you are — a missing dep is usually a design smell, not a lint annoyance.
- **State colocation.** State lives in the lowest component that needs it. Lift only for genuinely
  shared state. Context is for *rarely-changing* shared values (theme, auth) — not a state manager;
  context updates re-render every consumer.
- **Server state is a cache.** Fetched data has staleness, dedup, retries, and invalidation — use a
  dedicated library (React Query / SWR / Relay) instead of `useEffect` + `fetch`. Hand-rolled
  fetching is where race conditions and waterfall bugs breed.
- **Composition over configuration.** `children`, render props, and compound components beat
  prop-soup (`headerTitle`, `headerOnClick`, `showHeaderIcon`). If a component takes 15 props,
  split it or compose it.
- **Keys are identity.** Keys tell React *which* item is which across renders. Unstable keys
  (array index on reorderable lists, random values) destroy state and performance. Key by stable id.

## Practical workflow

1. **Sketch state first.** For the feature, list every stateful value and classify: UI state
   (component), shared UI state (lifted/context), server state (query library), URL state
   (search params for shareable view state). This prevents most architecture mistakes.
2. **Build components bottom-up.** Leaf components first (pure, props in → UI out), then
   composition. Keep components small enough to name precisely — vague names (`DataWrapper`)
   signal vague responsibilities.
3. **Write effects as synchronization, not lifecycle.** Each effect does one sync job with a
   cleanup. Ask: "what external thing am I syncing with?" If the answer is "other React state,"
   compute during render instead.
4. **Handle async states explicitly.** Loading / error / empty / success for every data boundary;
   error boundaries for crash isolation; Suspense boundaries placed deliberately, not once at root.
5. **Optimize with a profiler, not superstition.** Find the slow render first (React DevTools
   profiler, highlight updates). Then: split components to isolate re-renders, memoize the
   measured hotspots, virtualize long lists. `memo` everywhere is a code smell.
6. **Review React PRs for:** effect dependency correctness, state that should be derived,
   fetch-in-effect instead of a query hook, index keys, prop drilling that wants composition,
   and missing loading/error states.

Idiomatic patterns:

```jsx
// Derive, don't sync
const [items, setItems] = useState([]);
const [query, setQuery] = useState("");
const visible = items.filter(i => i.name.includes(query)); // computed, not state + effect

// Server state via query hook, not useEffect
const { data, isLoading, error } = useQuery({
  queryKey: ["orders", status],
  queryFn: () => fetchOrders(status),
});

// Stable keys
{orders.map(o => <OrderRow key={o.id} order={o} />)}
```

## Common pitfalls

- **Effects that sync React state.** `useEffect(() => setB(transform(a)), [a])` — just compute `b`
  during render. Effects are for external systems (DOM, network, subscriptions).
- **Stale closures.** An effect or callback capturing old state because deps were silenced.
  Fix the design (functional updates, refs for latest values) instead of disabling the lint rule.
- **Fetching in effects.** Race conditions on rapid param changes, no caching, no dedup, loading
  waterfalls. A query library solves all four; hand-rolled solves none.
- **Context as global state.** Putting frequently-updating values in context re-renders the whole
  tree on every keystroke. Use a store with selectors for mutable shared state.
- **Premature memoization.** `useMemo`/`useCallback`/`memo` on everything "just in case" —
  adds complexity, hides bugs, and rarely helps without a measured hotspot.
- **Ignoring the key warning.** Index keys on dynamic lists cause state to attach to the wrong
  row — inputs "jumping" between rows is the classic symptom.
- **Prop drilling to depth 5+.** Either the state is misplaced (colocate lower) or the tree needs
  composition (pass components, not data, down).
