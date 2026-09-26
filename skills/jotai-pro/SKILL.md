---
name: jotai-pro
description: Manage atomic React state with Jotai: atoms, derived atoms, async atoms, and scoped providers. Use for granular, bottom-up state in React.
category: development
---

# Jotai Pro

A practical guide to Jotai: atomic state management for React — tiny atoms composed bottom-up, derived atoms, async atoms, and the patterns that make global state feel local.

## Overview

Jotai inverts the store model: instead of one big store you slice, you define **atoms** — minimal units of state — and compose them. Components subscribe to exactly the atoms they use, so re-renders are surgically precise. State can live colocated with features yet be shared globally. It's "React state, but shareable": `useState`-like ergonomics with global reach.

## When to use

- Granular state where different components need different pieces (avoids over-rendering).
- Bottom-up state: start local, lift to shared only when needed.
- Derived state (computed from other atoms) without selector boilerplate.
- Async state (data fetching) as atoms with Suspense integration.
- Apps finding Zustand/Redux too top-down.

## Core concepts

- **Atoms.** `const countAtom = atom(0)`; `const [count, setCount] = useAtom(countAtom)`. Primitive, focused, composable.
- **Derived atoms (read).** `const doubledAtom = atom((get) => get(countAtom) * 2)` — computed, cached, updates when deps change. The replacement for selectors.
- **Writable derived atoms.** `atom((get) => ..., (get, set, arg) => ...)` — read/write atoms that encapsulate logic (e.g., a "toggle theme" atom).
- **Async atoms.** `atom(async (get) => fetch(...))` — suspends with React Suspense; combine with `loadable()` to avoid Suspense when you want manual loading states.
- **`atomFamily` / utils.** `atomFamily((id) => atom(...))` for parameterized atoms (per-item state); `selectAtom` for subscribing to part of a big atom; `atomWithStorage` for persistence; `atomWithReset`/`RESET`.
- **Provider scoping.** Bare atoms are global singletons; `<Provider>` scopes them per subtree (useful for reusable components needing isolated state, or tests).
- **No keys needed.** Unlike Recoil, atoms are just values — no string keys, no collisions.

## Practical workflow

**1. Define atoms near their domain.**
```ts
// features/theme/atoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'light');
export const toggleThemeAtom = atom(
  (get) => get(themeAtom),
  (_get, set) => set(themeAtom, (t) => (t === 'light' ? 'dark' : 'light'))
);
```

**2. Consume precisely.**
```tsx
function ThemeButton() {
  const [, toggle] = useAtom(toggleThemeAtom); // subscribes only to toggle writes
  return <button onClick={toggle}>Toggle</button>;
}
```
`useAtomValue` for read-only, `useSetAtom` for write-only — split subscriptions to minimize renders.

**3. Derived data.**
```ts
const todosAtom = atom<Todo[]>([]);
const filterAtom = atom<'all' | 'active'>('all');
const visibleTodosAtom = atom((get) =>
  get(filterAtom) === 'all' ? get(todosAtom) : get(todosAtom).filter(t => !t.done)
);
```

**4. Async with loadable.**
```ts
const userAtom = atom(async (get) => api.getUser(get(userIdAtom)));
// in component: const user = useAtomValue(loadable(userAtom)); // {state: 'loading'|'hasData'|'hasError', data}
// or let it suspend inside <Suspense>
```

**5. Scope when reusing.** Wrap reusable stateful widgets in `<Provider>` so two instances don't share atoms.

## Common pitfalls

- **Mega-atoms.** One `appStateAtom` object = one subscription invalidates everything. Atoms should be small; that's the whole point.
- **Derived atom side effects.** Read functions must be pure — no fetching/setting inside a read. Side effects go in write functions or effects.
- **Async atom waterfalls.** Chained async atoms suspend sequentially. Parallelize with `Promise.all` inside one atom or split independent atoms.
- **Forgetting loadable.** Async atoms suspend by default — without a `<Suspense>` boundary the app crashes. Use `loadable` or ensure boundaries.
- **atomFamily leaks.** Families cache per param forever; for unbounded params (user IDs over a long session) prune or scope. Fine for bounded sets.
- **Global-by-default surprises.** Two unrelated features importing the same atom share state — usually desired, occasionally surprising. Scope with Provider when independence matters.
- **Storing server cache.** Same rule as other client stores: atoms for client state; server data belongs in a query cache (or async atoms deliberately, knowing the trade-offs).
- **Over-atomizing.** Every boolean its own atom creates indirection soup. Group genuinely-cohesive state; split genuinely-independent state.
