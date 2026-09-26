---
name: redux-pro
description: Manage complex state with Redux Toolkit: slices, thunks, RTK Query, selectors, and DevTools. Use for large apps needing strict state conventions.
category: development
---

# Redux Pro

A practical guide to modern Redux via Redux Toolkit (RTK): slices, async thunks, RTK Query for server state, memoized selectors, and DevTools — the disciplined approach for large apps where state changes must be predictable and auditable.

## Overview

Modern Redux = **Redux Toolkit**, full stop. `configureStore` (good defaults: thunk, DevTools), `createSlice` (reducers + actions together, Immer-powered "mutative" syntax), `createAsyncThunk` (async flows), and **RTK Query** (server-state caching built in). Hand-written reducers, switch statements, and action-type constants are legacy — if a tutorial shows them, it's outdated.

Redux earns its boilerplate when: many parts of the app read/write the same state, state transitions need auditing (who changed what, when), or middleware (logging, persistence, analytics) must observe everything.

## When to use

- Large apps with complex shared client state (multi-step flows, editors, dashboards).
- State changes that must be traceable/auditable.
- Teams needing strict conventions across many developers.
- Server-state caching via RTK Query as the data layer.
- NOT for: simple UI toggles (useState/Zustand), or server state alone (TanStack Query).

## Core concepts

- **Store.** `configureStore({ reducer: { auth: authSlice.reducer, ... } })` — one store, slices per domain. Infer `RootState`/`AppDispatch` types from it.
- **Slices.** `createSlice({ name: 'cart', initialState, reducers: { addItem(state, action: PayloadAction<Item>) { state.items.push(action.payload); } } })` — Immer lets you "mutate" safely.
- **Thunks.** `createAsyncThunk('cart/checkout', async (args, { getState, rejectWithValue }) => {...})` — pending/fulfilled/rejected lifecycles handled in `extraReducers`.
- **RTK Query.** `createApi({ reducerPath, baseQuery: fetchBaseQuery({ baseUrl }), endpoints: builder => ({ getUser: builder.query<User, string>({ query: id => `/users/${id}` }) }) })` — generates hooks (`useGetUserQuery`), caching, invalidation via tags.
- **Selectors.** `createSelector` (reselect) for memoized derived data. Select narrowly in components (`useSelector(s => s.cart.items)`).
- **Tags.** RTK Query `providesTags`/`invalidatesTags` — declarative cache invalidation ("mutating a Todo invalidates the Todo list").
- **DevTools.** Time-travel, action log, state diff — the audit trail that justifies Redux.

## Practical workflow

**1. Setup.**
```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';

export const store = configureStore({
  reducer: { cart: cartSlice.reducer, [api.reducerPath]: api.reducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// hooks.ts: typed useAppDispatch/useAppSelector
```

**2. Slice.**
```ts
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], status: 'idle' } as CartState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => { state.items.push(action.payload); },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkout.fulfilled, (state) => { state.items = []; });
  },
});
```

**3. RTK Query endpoints.** Define queries/mutations with tags; use generated hooks in components; invalidate on mutations.

**4. Selectors.**
```ts
export const selectCartTotal = createSelector(
  [(s: RootState) => s.cart.items],
  (items) => items.reduce((sum, i) => sum + i.price, 0)
);
```

## Common pitfalls

- **Legacy Redux patterns.** Switch reducers, `connect()`, hand-written action creators — RTK replaces all of it. Don't mix eras.
- **Untyped dispatch/selector.** Always export typed hooks; untyped `useDispatch` loses thunk types and payload checking.
- **Non-serializable state.** Putting class instances, Dates-as-objects, or functions in the store breaks DevTools/time-travel and triggers warnings. Keep state serializable (store IDs, derive the rest).
- **Mutating outside Immer.** "Mutative" syntax only works inside `createSlice` reducers. Elsewhere, it's a real mutation bug.
- **Selector churn.** Inline selectors returning new objects (`useSelector(s => s.items.filter(...))`) re-render constantly. Memoize with `createSelector`.
- **Thunks for everything.** Simple sync updates don't need thunks. Reserve thunks for async/side-effectful flows.
- **RTK Query vs thunks confusion.** Fetching data? RTK Query. Orchestrating complex async business logic? Thunk. Don't fetch in thunks and hand-manage the cache.
- **Store as a junk drawer.** Unrelated state crammed into one slice. One domain per slice; compose at the store.
