---
name: react-query-pro
description: Manage server state with TanStack Query: queries, mutations, caching, invalidation, optimistic updates, and pagination. Use when fetching/mutating remote data in React.
category: development
---

# React Query Pro

A practical guide to TanStack Query (React Query): treating **server state** as a cache with declarative fetching — queries, mutations, invalidation, optimistic updates, and pagination — instead of hand-rolled `useEffect` fetching.

## Overview

Server state (data from an API) is fundamentally different from client state (UI toggles): it's async, shared, potentially stale, and needs syncing. TanStack Query manages it as a **normalized cache keyed by query keys**, with background refetching, retries, and deduping built in. The payoff: delete most data-fetching `useEffect`s and get loading/error/retry/polling behavior for free.

## When to use

- Fetching REST/GraphQL data in React (queries).
- Mutations with cache invalidation or optimistic updates.
- Pagination, infinite scroll.
- Dependent/parallel queries, polling, prefetching.
- Replacing ad-hoc `useEffect` + `useState` data fetching.

## Core concepts

- **Query keys.** Arrays like `['todos', { status }]` — the cache identity. Structure hierarchically (`['todos']` → `['todos', id]`) so invalidation can target precisely or broadly.
- **`useQuery`.** `useQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id), staleTime, gcTime })`. Status: `pending`/`error`/`success`; `isFetching` for background refetches.
- **staleTime vs gcTime.** `staleTime`: how long data is fresh (no refetch on mount). `gcTime`: how long unused data stays cached. Set `staleTime` per query (30s–5min typical); defaults refetch aggressively.
- **Mutations.** `useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }) })`. Mutations aren't cached — they change server state, then you sync the cache.
- **Invalidation.** `invalidateQueries` marks stale → refetch. Prefer invalidating the list key after a mutation over manual cache surgery.
- **Optimistic updates.** `onMutate`: snapshot previous, `setQueryData` the optimistic value, return context; `onError`: rollback; `onSettled`: invalidate. For snappy UI on reliable mutations.
- **Infinite queries.** `useInfiniteQuery` with `getNextPageParam`; `fetchNextPage` for "load more". Flatten pages in render.
- **QueryClient defaults.** Set global `staleTime`, `retry` (disable retry for 4xx via custom retry fn), and error handling once.

## Practical workflow

**1. Setup.**
```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: (n, e) => e.status >= 500 && n < 3 } },
});
<QueryClientProvider client={queryClient}>{app}</QueryClientProvider>
```

**2. Query.**
```tsx
function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => api.getUser(id),
    enabled: !!id,                    // dependent query: wait for id
  });
}
```

**3. Mutation + invalidation.**
```tsx
const updateTodo = useMutation({
  mutationFn: (todo) => api.updateTodo(todo),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

**4. Optimistic toggle.**
```tsx
const toggle = useMutation({
  mutationFn: api.toggleTodo,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const prev = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
    return { prev };
  },
  onError: (_e, _v, ctx) => queryClient.setQueryData(['todos'], ctx.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

**5. Devtools.** Install `@tanstack/react-query-devtools` — inspect cache, keys, and fetch states live. Non-optional for debugging.

## Common pitfalls

- **Unstable query keys.** Inline objects in keys (`['todos', { filter }]` with a new object each render) cause infinite refetching. Memoize or use primitives.
- **Fetching in useEffect.** The anti-pattern Query exists to replace. If you're writing `useEffect(() => { fetch... })`, reach for `useQuery`.
- **Over-invalidation.** Invalidating `[]` (everything) after every mutation = refetch storm. Invalidate the narrowest key that covers the change.
- **No staleTime.** Defaults refetch on every mount/focus — chatty and janky. Set sensible `staleTime` per data type.
- **Optimistic updates without rollback.** `onMutate` without `onError` restore leaves the UI lying after failures. Always pair them.
- **Ignoring `enabled`.** Dependent queries firing with undefined params → 404s/400s. Gate with `enabled`.
- **Treating mutations as queries.** Don't `useQuery` for POSTs or poll mutations for results — mutations + invalidation is the pattern.
- **Server state in client stores.** Copying query results into Zustand/Redux "for convenience" creates two sources of truth. Keep server data in the query cache; derive UI state locally.
- **Retry on 4xx.** Retrying a 400/401/404 is pointless and can lock accounts. Custom retry: only 5xx/network errors.
