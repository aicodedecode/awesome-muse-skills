---
name: svelte-pro
description: Idiomatic Svelte: runes reactivity, component design, SvelteKit routing/data loading, and performance. Use when writing, reviewing, or structuring Svelte apps.
category: development
---

# Svelte Pro

## Overview

Svelte's bet — **a compiler instead of a runtime** — means idiomatic Svelte looks deceptively
simple: `$state`, `$derived`, `$effect` (runes) declare reactivity, and the compiler generates the
surgical DOM updates. Professional Svelte means thinking in runes correctly (universal reactivity),
structuring SvelteKit apps around its data-loading model, and keeping components small and honest.

The through-line: write straightforward code; let the compiler do the clever work.

## When to use

- Writing or reviewing Svelte 5 (runes mode) code.
- Structuring SvelteKit applications (routing, load functions, forms).
- Designing component APIs (props, snippets, events).
- Debugging reactivity issues in runes mode.
- Optimizing Svelte rendering or bundle size.

## Core concepts

- **Runes: universal reactivity.** `$state` for reactive values (deeply reactive proxies — mutate
  freely), `$derived` for computed values, `$effect` for side effects. Runes work in `.svelte.js`
  modules too — shared reactive state without component boilerplate.
- **Props as runes.** `$props()` destructures component inputs; `$bindable()` marks two-way-bound
  props explicitly. No more `export let` — and prop mutation rules are now explicit instead of
  accidental.
- **Effects are for side effects.** `$effect` syncs with the outside world (DOM measurements,
  subscriptions, persistence) — with cleanup returned. Deriving values in effects instead of
  `$derived` is the classic runes mistake.
- **Snippets over slots.** `{@render children()}` and named snippets replace slots with a more
  composable, typed API. Snippets are just functions returning markup — pass them as props for
  powerful composition patterns.
- **SvelteKit's data model.** `load` functions (server-first, progressively enhanced), form actions
  (no-JS-baseline forms that enhance), and the `data` prop flow. Design around server load +
  actions before reaching for client-side fetching.
- **Stores, evolved.** The classic store contract (`subscribe`) still works and interoperates;
  runes in modules cover most new shared-state needs. Don't mix paradigms confusingly — pick per
  boundary.

## Practical workflow

1. **Scaffold with SvelteKit.** `npm create svelte@latest`; TypeScript; ESLint + Prettier;
   routes mirror the URL structure (`src/routes/...`).
2. **Design data flow per route.** `+page.server.ts` `load` for data (validated, typed);
   `+page.svelte` renders from `data`; form `actions` for mutations with `use:enhance` for
   progressive enhancement. Client fetches only for truly client-side concerns.
3. **Write components small.** Props in via `$props()`, events via callbacks (props), content via
   snippets. Keep components focused; extract runes-based logic into `.svelte.js` modules when
   shared.
4. **Handle async states.** Await blocks (`{#await}`) or runes-based loading state in load
   functions; error boundaries via `+error.svelte`; loading UI via `+page.svelte` skeletons.
5. **Test behavior.** Vitest for logic and runes modules; `@testing-library/svelte` for component
   behavior; Playwright for critical journeys (SvelteKit's first-class testing story).
6. **Keep bundles lean.** The compiler already minimizes runtime — your job is route-level code
   splitting (automatic), avoiding heavy deps in shared chunks, and measuring with the bundle
   analyzer before optimizing.

Idiomatic snippets:

```svelte
<script>
  let { userId } = $props();
  let filter = $state('');
  // $derived, not $effect, for computed values
  let visible = $derived(orders.filter(o => o.id.includes(filter)));
  let total = $derived(visible.reduce((s, o) => s + o.total, 0));

  // $effect only for side effects, with cleanup
  $effect(() => {
    document.title = `Orders (${visible.length})`;
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  });
</script>
```

## Common pitfalls

- **`$effect` for derived state.** Computing values inside effects instead of `$derived` —
  causes unnecessary runs, ordering bugs, and confusion. Derived = `$derived`, always.
- **Deep mutation surprises.** `$state` proxies are deeply reactive — convenient, but mutating
  nested objects triggers fine-grained updates you might not expect. For large replace-whole
  objects, that's fine; for huge collections with frequent tiny updates, consider structure.
- **Forgetting runes mode boundaries.** Legacy-mode (`export let`) and runes-mode idioms mixed
  in one codebase. Migrate deliberately; don't straddle.
- **Client-fetching what load() should do.** `onMount(fetch(...))` for initial page data —
  loses SSR, SEO, and SvelteKit's loading/error semantics. Server `load` first.
- **Props drilling through 5 layers.** Either the state belongs in a shared runes module, or
  the component tree needs restructuring (composition with snippets).
- **No cleanup in effects.** Subscriptions, intervals, and observers without returned cleanup —
  leaks that accumulate in SPAs. Every `$effect` with setup returns teardown.
- **Over-fetching in load.** Returning the whole database from `load` "for flexibility."
  Load what the page needs; use streaming promises for deferred secondary data.
