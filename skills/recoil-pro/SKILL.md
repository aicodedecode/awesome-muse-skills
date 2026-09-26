---
name: recoil-pro
description: Manage React state with Recoil: atoms, selectors, async selectors, and atom families/effects. Use when maintaining Recoil codebases or needing its data-flow graph.
category: development
---

# Recoil Pro

A practical guide to Recoil: Facebook's experimental-but-widely-used atomic state library — atoms, selectors (sync/async), atom families, and effects. Particularly useful for maintaining existing Recoil codebases and understanding its data-flow graph model.

## Overview

Recoil models state as a **data-flow graph**: **atoms** (units of state, identified by unique string keys) and **selectors** (pure functions deriving from atoms/other selectors, cached per dependency set). Components subscribe via hooks and re-render only when their subscribed values change. Async selectors integrate with Suspense. Note: Recoil's development has slowed (maintenance mode); for new projects, Jotai or Zustand are usually better choices — but large production codebases run on Recoil, and its concepts transfer.

## When to use

- Maintaining an existing Recoil codebase.
- Understanding selector-based derived data (concepts apply to Jotai/others).
- Apps needing the data-flow graph mental model (explicit deps, cached derivations).
- Evaluating migration off Recoil (to Jotai/Zustand).

## Core concepts

- **Atoms.** `const nameState = atom({ key: 'nameState', default: '' })`. Keys must be globally unique — collisions are silent and nasty.
- **Selectors.** `selector({ key: 'upperName', get: ({ get }) => get(nameState).toUpperCase() })` — derived, memoized, recompute only when deps change. `set` for writable selectors.
- **Async selectors.** `get` can be async → Suspense integration. `useRecoilValueLoadable` for manual loading/error states without Suspense.
- **Atom families.** `atomFamily({ key: 'todoState', default: id => fetchTodo(id) })` — parameterized atoms, `todoState(id)` per instance.
- **Effects (`effects_UNSTABLE`).** Per-atom effects: persistence to localStorage, logging, syncing with external stores. The escape hatch for side effects.
- **`useRecoilState` / `useRecoilValue` / `useSetRecoilState` / `useResetRecoilState`.** Split read/write subscriptions like Jotai's hooks.
- **`waitForAll` / `waitForNone`.** Concurrent async selector helpers: `waitForAll([selA, selB])` parallelizes; `waitForNone` gives loadables for partial rendering.

## Practical workflow

**1. Define state with unique keys.**
```ts
import { atom, selector } from 'recoil';

export const todosState = atom<Todo[]>({ key: 'todosState', default: [] });
export const filterState = atom<Filter>({ key: 'filterState', default: 'all' });

export const visibleTodosState = selector({
  key: 'visibleTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);
    return filter === 'all' ? todos : todos.filter(t => !t.done);
  },
});
```

**2. Consume.**
```tsx
const visible = useRecoilValue(visibleTodosState);
const setTodos = useSetRecoilState(todosState);
```

**3. Async with loadables.**
```ts
const userQuery = selector({
  key: 'userQuery',
  get: async ({ get }) => api.getUser(get(userIdState)),
});
// component: const loadable = useRecoilValueLoadable(userQuery);
// switch (loadable.state) { case 'loading': ...; case 'hasValue': ...; case 'hasError': ... }
```

**4. Persist via effects.**
```ts
const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const saved = localStorage.getItem(key);
  if (saved) setSelf(JSON.parse(saved));
  onSet((v) => localStorage.setItem(key, JSON.stringify(v)));
};
```

**5. Debug.** Recoil DevTools / React DevTools: inspect atom values; use snapshots (`useRecoilSnapshot`) in tests to assert state transitions.

## Common pitfalls

- **Duplicate keys.** Two atoms with the same `key` silently share/collide. Namespace keys by feature (`'cart/itemsState'`); consider a lint or helper enforcing prefixes.
- **Selector side effects.** `get` must be pure. Fetching is fine (async get), but writing atoms or mutating external state inside `get` corrupts the graph.
- **Async selector waterfalls.** Sequential dependent selectors suspend one after another. Use `waitForAll` for parallel fetches.
- **Suspense-everywhere.** Async selectors suspend by default; missing boundaries crash. Prefer `useRecoilValueLoadable` at leaves for granular loading UI.
- **Atom family memory.** Families retain every parameterized instance; unbounded params (per-message IDs) leak. Prune or avoid families for unbounded sets.
- **Effects_UNSTABLE instability.** The API is literally marked unstable; behavior changed across versions. Pin the Recoil version and wrap effects in your own helpers.
- **Over-selectoring.** Trivial derivations as selectors add indirection; inline simple computations in components.
- **Migration planning.** If moving to Jotai: atoms map nearly 1:1 (drop keys), selectors map to derived atoms, families to atomFamily. Migrate feature by feature behind the same component APIs.
