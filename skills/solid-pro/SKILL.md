---
name: solid-pro
description: Idiomatic SolidJS: fine-grained reactivity, signals/memos/effects, component design, and SolidStart patterns. Use when writing, reviewing, or structuring Solid apps.
category: development
---

# Solid Pro

## Overview

SolidJS takes fine-grained reactivity to its logical end: **no virtual DOM, no re-rendering
components** — signals update exactly the DOM nodes that depend on them. Professional Solid means
internalizing the reactive execution model (components run once; effects track dependencies
automatically), using primitives precisely (signals, memos, effects, resources), and structuring
apps so reactivity flows in one direction.

The through-line: think in dataflow graphs, not render cycles — components are setup code, JSX is
a template compiled to fine-grained updates.

## When to use

- Writing or reviewing SolidJS code.
- Designing reactive state, derived values, and side effects.
- Structuring SolidStart applications (routing, data, SSR).
- Debugging reactivity issues (stale values, missing updates, effect loops).
- Optimizing Solid rendering or understanding its execution model.

## Core concepts

- **Components execute once.** A Solid component function runs a single time to set up reactive
  nodes — JSX expressions re-execute only where they read signals. Code outside reactive contexts
  (effects, memos, JSX bindings) runs once; don't expect "re-render" semantics.
- **Primitives with distinct jobs.** `createSignal` (read/write reactive value), `createMemo`
  (cached derivation — use instead of deriving in effects or during render), `createEffect`
  (side effects, auto-tracks dependencies), `createResource` (async data with loading/error
  states built in). Choosing the wrong primitive is the root of most Solid bugs.
- **Fine-grained updates.** `<div>{count()}</div>` — only the text node updates when `count`
  changes. This is why Solid is fast by default, and why you rarely need memoization: the
  framework already updates minimally.
- **Stores for nested state.** `createStore` for deep reactive objects — path-based updates
  (`setState('user', 'name', 'Ada')`) with immutable semantics and fine-grained notifications.
  Prefer stores over nested signals for complex state shapes.
- **Control flow components.** `<Show>`, `<For>`, `<Switch>/<Match>`, `<Suspense>`, `<ErrorBoundary>`
  — real components (not syntax) that handle reactivity correctly. `<For>` with keyed identity
  for lists; never `.map()` directly in JSX for dynamic lists (loses fine-grained updates).
- **SolidStart's isomorphic model.** File-based routing, server functions for data/mutations,
  SSR streaming — design data loading server-first like other meta-frameworks, with Solid's
  reactivity on the client.

## Practical workflow

1. **Scaffold with SolidStart** (or Vite + Solid for SPAs); TypeScript; file-based routes.
2. **Model state as signals/stores.** Component-local → signals; shared → context + stores or a
   small external store module; server data → `createResource` / server functions with
   loading/error states.
3. **Derive with memos, never in effects.** `const total = createMemo(() => items().reduce(...))`
   — cached, lazy, and correct. Effects only touch the outside world.
4. **Write JSX as templates.** Expressions read signals where the DOM should update; control-flow
   components for conditionals/lists; avoid creating signals inside JSX expressions (runs per
   evaluation — usually once, but confusing).
5. **Handle resources properly.** `createResource(fetcher)` gives `loading`/`error` states;
   `refetch`/`mutate` for updates; `<Suspense>` boundaries placed deliberately; `<ErrorBoundary>`
   for crash isolation.
6. **Test behavior.** Vitest for logic; `@solidjs/testing-library` for component behavior
   (assert on DOM, interact via user events); Playwright for critical journeys.

Idiomatic snippets:

```tsx
// Signals + memo + resource: each primitive doing its job
function OrderList() {
  const [filter, setFilter] = createSignal("");
  const [orders] = createResource(fetchOrders); // { loading, error } built in

  const visible = createMemo(() =>
    (orders() ?? []).filter(o => o.id.includes(filter()))
  );
  const total = createMemo(() => visible().reduce((s, o) => s + o.total, 0));

  // Effect ONLY for side effects
  createEffect(() => { document.title = `Orders (${visible().length})`; });

  return (
    <Suspense fallback={<Skeleton />}>
      <ErrorBoundary fallback={err => <ErrorView error={err} />}>
        <For each={visible()}>{order => <OrderRow order={order} />}</For>
      </ErrorBoundary>
    </Suspense>
  );
}
```

## Common pitfalls

- **Thinking in re-renders.** Writing code that assumes the component function re-runs (like
  React). In Solid it runs once — logic that must re-run on signal change belongs in memos,
  effects, or JSX expressions.
- **Deriving in effects.** `createEffect(() => setB(transform(a())))` — use `createMemo`.
  Effects are side-effect-only; derivation-in-effect causes loops and extra runs.
- **Destructuring signals' values.** `const { name } = user()` captures a snapshot, not
  reactivity. Keep the signal call inside reactive contexts.
- **`.map()` instead of `<For>`.** Direct array mapping in JSX doesn't get keyed fine-grained
  updates — list state (focus, input values) breaks on reorder. `<For>` always for dynamic lists.
- **Creating reactives in render paths.** `createSignal`/`createEffect` inside JSX expressions or
  event handlers that run repeatedly — leaks reactive nodes. Create in component body (runs once).
- **Over-nesting effects.** Effects that set signals read by other effects — cascade of runs,
  hard to reason about. Flatten: derive with memos, keep effects at the leaves touching the
  outside world.
- **Ignoring `<Suspense>` placement.** One root Suspense for everything = whole-page spinners.
  Place boundaries around independent data regions for progressive loading.
