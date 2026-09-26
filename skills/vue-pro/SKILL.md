---
name: vue-pro
description: Idiomatic Vue 3: Composition API, reactivity, component design, Pinia state, and performance. Use when writing, reviewing, or structuring Vue applications.
category: development
---

# Vue Pro

## Overview

Vue 3's Composition API rewards **explicit reactivity**: you declare what's reactive, derive what's
computed, and isolate side effects in watchers — and the framework handles the rest. Professional
Vue means mastering the reactivity model (refs vs reactive, when each unwraps), composing logic in
reusable composables, structuring apps by feature, and managing state with Pinia deliberately.

The through-line: reactivity is a contract — declare it precisely, and the UI stays in sync for free.

## When to use

- Writing or reviewing Vue 3 code (Composition API, `<script setup>`).
- Designing component structure, composables, or state management.
- Debugging reactivity issues (lost reactivity, stale values, infinite watchers).
- Choosing between Options API and Composition API, or migrating.
- Optimizing Vue rendering performance.

## Core concepts

- **Reactivity fundamentals.** `ref` for primitives (and anything reassigned — remember `.value`
  in script, auto-unwrapped in template); `reactive` for objects you mutate in place; `computed`
  for derived state (cached, lazy); `watch`/`watchEffect` for side effects. Lost reactivity almost
  always means destructuring a reactive object or forgetting `.value`.
- **`<script setup>` as the default.** Less boilerplate, better type inference, top-level bindings
  auto-exposed to template. `defineProps`/`defineEmits` with types; `defineModel` for two-way
  bindings. Options API only for legacy consistency.
- **Composables: logic extraction.** `useXxx()` functions encapsulating reactive state + logic
  (data fetching, form handling, event listeners with cleanup in `onUnmounted`). The Composition
  API's superpower — reuse logic without mixins' implicit magic or HOC wrapper hell.
- **Pinia for shared state.** Stores per domain (`useCartStore`), state/actions/getters colocated,
  `$patch` for batch updates, and store-to-store usage kept acyclic. Not every shared value needs
  Pinia — props/emits and composables cover component-scoped sharing.
- **Component design.** Single-responsibility components; props down, events up; slots for content
  composition; `v-model` with explicit prop/event pairs for custom inputs. Keep components
  presentational where possible; container components orchestrate.
- **Performance levers.** `v-memo` for expensive subtrees, `v-once` for static content,
  `shallowRef`/`shallowReactive` for large objects you replace wholesale, virtual scrolling for
  long lists, and async components + route-level code splitting.

## Practical workflow

1. **Scaffold with the official toolchain.** `create-vue` (Vite + `<script setup>` + TypeScript
   recommended), Pinia, Vue Router; ESLint with Vue rules in CI.
2. **Structure by feature.** `src/features/cart/` (components, composables, store, types) over
   `src/components/` soup. Shared primitives in `src/components/ui/`, shared logic in
   `src/composables/`.
3. **Type the boundaries.** TypeScript: typed props/emits, typed store state, typed API layer.
   Runtime validation (zod) at the API boundary; types trusted inside.
4. **Write components declaratively.** Template expresses state → UI; computed for derivations;
   watchers only for side effects (API calls, manual DOM, persistence). No direct DOM manipulation
   where reactivity suffices.
5. **Manage async states.** Every data fetch: loading/error/empty/success; error boundaries via
   `onErrorCaptured`; Suspense for async component boundaries placed deliberately.
6. **Test appropriately.** Vitest for composables and utilities (test the reactivity with
   `@vue/test-utils` where needed), component tests for behavior (props in → emitted events/DOM
   out), Playwright/Cypress for critical journeys. Test behavior, not implementation.

Idiomatic snippets:

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ userId: string }>()
const emit = defineEmits<{ loaded: [count: number] }>()

const { data, error, isLoading } = useUserOrders(props.userId) // composable
const total = computed(() => data.value?.reduce((s, o) => s + o.total, 0) ?? 0)

watch(error, (e) => { if (e) reportError(e) }) // side effect only
</script>
```

## Common pitfalls

- **Lost reactivity.** Destructuring `reactive()` (`const { name } = state` — `name` is now dead),
  or forgetting `.value` on refs in script. Use `toRefs()`/`storeToRefs()` when destructuring.
- **Mutating props.** Props are read-only — mutating them breaks one-way data flow and warns.
  Emit events; let the parent update. (Or `defineModel` for sanctioned two-way binding.)
- **Watchers doing computed's job.** `watch` that sets another ref from a source — that's
  `computed`. Watchers are for side effects only.
- **Overusing `watchEffect`.** Implicit dependency tracking that's hard to reason about and easy
  to make infinite. Prefer explicit `watch` with named sources.
- **Pinia as a junk drawer.** One giant store, or storing everything "just in case." Domain
  stores, minimal state, derived via getters.
- **Ignoring cleanup.** Event listeners, timers, subscriptions in composables without
  `onUnmounted` cleanup — leaks that accumulate in SPAs.
- **Template logic bloat.** Complex expressions and method calls in templates (re-evaluated every
  render). Move to computed properties — cached and testable.
