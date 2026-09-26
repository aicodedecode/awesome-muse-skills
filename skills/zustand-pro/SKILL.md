---
name: zustand-pro
description: Manage client state with Zustand: stores, slices, selectors, middleware, and async actions. Use for lightweight React state without boilerplate.
category: development
---

# Zustand Pro

A practical guide to Zustand: minimal, hook-based React state management — store creation, selector subscriptions, slices, middleware (persist, devtools, immer), and async actions — without boilerplate.

## Overview

Zustand is a tiny store with a simple contract: `create(set => ({...}))` gives you a hook. Components subscribe to **slices** via selectors and re-render only when their slice changes. No providers (usually), no reducers, no ceremony. It's the right default for client state (UI state, auth session, feature flags, form drafts) in most React apps — reach for Redux only when you need its ecosystem or strict conventions at scale.

## When to use

- Client/UI state: modals, toasts, theme, sidebar, auth user.
- Replacing prop drilling or Context for frequently-updated state.
- Persisting state to localStorage (persist middleware).
- Async flows in the store (fetch + set, with loading states).
- Apps where Redux feels like overkill.

## Core concepts

- **Store.** `const useStore = create<State>()((set, get) => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))`. Actions live next to state.
- **Selectors.** `const count = useStore(s => s.count)` — component re-renders only when `count` changes. Select the minimum you need.
- **`get()`.** Read current state inside actions without subscribing: `set({ items: [...get().items, newItem] })`.
- **Slices pattern.** Split large stores: `create<BearSlice & FishSlice>()((...a) => ({ ...createBearSlice(...a), ...createFishSlice(...a) }))` — keeps files focused.
- **Middleware.** `devtools` (Redux DevTools integration), `persist` (localStorage/sessionStorage with versioning + migration), `immer` (mutative-style updates), `subscribeWithSelector`.
- **Transient updates.** `useStore.subscribe` or refs for high-frequency values (scroll position, mouse) that shouldn't re-render.
- **Outside React.** `useStore.getState()` works anywhere — event handlers, utilities, non-React code.

## Practical workflow

**1. Create a focused store.**
```ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: (user) => set({ user }, false, 'auth/login'),
        logout: () => set({ user: null }, false, 'auth/logout'),
      }),
      { name: 'auth-storage', version: 1 }
    ),
    { name: 'auth' }
  )
);
```

**2. Subscribe narrowly.**
```tsx
const user = useAuth(s => s.user);        // re-renders only when user changes
const login = useAuth(s => s.login);      // stable reference, never re-renders
```
Returning objects from selectors re-renders every time unless shallow-compared — use `useShallow` for multi-field selection.

**3. Async actions.**
```ts
fetchUser: async (id) => {
  set({ status: 'loading' });
  try { const user = await api.getUser(id); set({ user, status: 'idle' }); }
  catch (e) { set({ error: String(e), status: 'idle' }); }
},
```

**4. Persist with migrations.** `persist` options: `version`, `migrate: (state, version) => ...`, `partialize` to persist only part of the state (never persist tokens you shouldn't — or encrypt them).

## Common pitfalls

- **Selecting too much.** `useStore(s => s)` re-renders on any change — defeats the purpose. Select fields; `useShallow` for objects.
- **Object/array literals in selectors.** `useStore(s => ({ a: s.a }))` creates a new object each call → infinite re-renders. Wrap with `useShallow`.
- **Server state in Zustand.** Caching API responses here duplicates React Query's job and goes stale. Zustand = client state; server state = query cache.
- **Persisting secrets.** `persist` writes to localStorage — readable by any script on the page. Don't persist tokens/secrets; keep them in memory (or httpOnly cookies).
- **One giant store.** A 500-line store with everything is a context-blob in disguise. Split by domain (auth, ui, cart).
- **Mutating state.** `set` merges shallowly; nested updates need spreading or the immer middleware. Direct mutation silently breaks change detection.
- **Actions in render.** Calling `set` during render (not in an event/effect) → loops. Actions belong in handlers and effects.
- **No devtools in dev.** Add the `devtools` middleware early — time-travel debugging pays for itself the first hard bug.
