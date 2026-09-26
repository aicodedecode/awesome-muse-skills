---
name: angular-pro
description: Idiomatic Angular: standalone components, signals, RxJS patterns, DI, and enterprise structure. Use when writing, reviewing, or structuring Angular applications.
category: development
---

# Angular Pro

## Overview

Modern Angular (v16+) has reinvented itself: **standalone components, signals for fine-grained
reactivity, and deferred views** — while keeping its enterprise strengths (DI, RxJS, the CLI,
strong conventions). Professional Angular means embracing the modern idioms (signals over
unnecessary RxJS, standalone over NgModules for new code), structuring by feature with clear
boundaries, and using the platform's opinions instead of fighting them.

The through-line: Angular rewards convention — learn its idioms deeply and the framework carries
the architecture.

## When to use

- Writing or reviewing Angular code (v16+ idioms).
- Structuring Angular apps (standalone components, feature modules, libraries).
- Choosing between signals, RxJS, and async pipe patterns.
- Designing DI, services, and state management.
- Debugging change detection, DI, or RxJS subscription issues.

## Core concepts

- **Standalone by default.** New components/directives/pipes are standalone — no NgModules needed.
  Compose via `imports` arrays; use NgModules only for legacy boundaries. Simpler mental model,
  better tree-shaking, easier lazy loading.
- **Signals for local reactivity.** `signal()`, `computed()`, `effect()` — fine-grained, no
  subscription management, automatic dependency tracking. Default choice for component state;
  `effect` only for side effects (logging, syncing to external systems), never for deriving state
  (that's `computed`).
- **RxJS where streams live.** HTTP (HttpClient returns Observables), complex event composition
  (debounce, switchMap, combineLatest), and multicasting. `async` pipe (or `toSignal()`) in
  templates — manual `.subscribe()` in components is a leak waiting to happen.
- **DI as the architecture.** Hierarchical injectors, `providedIn: 'root'` services, injection
  tokens for config/abstractions. Constructor injection (or `inject()`); services own logic,
  components own presentation. Testability falls out naturally.
- **Smart/dumb components.** Container components (inject services, manage state, handle routing)
  compose presentational components (`@Input()` in, `@Output()` out, `OnPush` change detection).
  This split keeps templates testable and change detection cheap.
- **Change detection, understood.** Default vs `OnPush` — OnPush components update on input
  reference changes, events, and async pipe emissions. Immutability (`signal.update` returning new
  objects) makes OnPush correct and fast.

## Practical workflow

1. **Scaffold with the CLI.** `ng new` with standalone, strict TypeScript, and routing; ESLint +
   Prettier; feature-based folder structure (`features/orders/`) with clear public APIs per feature.
2. **Model state deliberately.** Component-local → signals; cross-component → services with
   signals or RxJS subjects; complex global → NgRx/NGXS only when the app's state interactions
   justify it (most apps don't need it).
3. **Write components presentational-first.** Dumb components with typed inputs/outputs and OnPush;
   containers wire services and routing. Templates declarative; logic in the class testable.
4. **Handle HTTP properly.** Services wrap HttpClient; interceptors for auth/errors cross-cutting;
   typed responses; loading/error states in the component via signals or async pipe.
5. **Test the pyramid.** Jest/Vitest or Karma+Jasmine: unit-test services/pipes/functions;
   component tests via TestBed for behavior (inputs in → DOM/events out); Playwright/Cypress for
   critical journeys.
6. **Optimize deliberately.** OnPush everywhere presentational; `defer` blocks for below-fold
   content; route-level lazy loading; trackBy (or `@for ... track`) for lists; bundle budgets in
   `angular.json` enforced in CI.

Idiomatic snippets:

```ts
// Signal-based component state; computed derives; effect only for side effects
@Component({ standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, ... })
export class OrderListComponent {
  private ordersService = inject(OrdersService);
  filter = signal('');
  orders = this.ordersService.orders; // signal from service
  visible = computed(() =>
    this.orders().filter(o => o.id.includes(this.filter()))
  );
  total = computed(() => this.visible().reduce((s, o) => s + o.total, 0));
}

// RxJS where streams live: typeahead search
results$ = this.term$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term)),
  catchError(() => of([]))
);
```

## Common pitfalls

- **Manual subscriptions without teardown.** `.subscribe()` in components without `takeUntilDestroyed`
  — leaks on every navigation. Async pipe or `takeUntilDestroyed()` always.
- **Signals for everything, RxJS for nothing (or vice versa).** Signals for local/synchronous
  state; RxJS for event streams and composition. Using signals to reimplement `debounceTime` is
  as wrong as using Subjects for a counter.
- **Effects for derived state.** `effect(() => this.b.set(transform(this.a())))` — that's
  `computed`. Effects are side-effect-only; misuse creates loops and confusion.
- **Mutating signal contents.** `this.list().push(x)` mutates without notifying. Use
  `this.list.update(l => [...l, x])` — immutability makes reactivity correct.
- **God services / god modules.** `UtilService` with 60 methods, or a shared module importing the
  world. Services per domain; standalone imports kept minimal and explicit.
- **Ignoring OnPush.** Default change detection on huge trees is the classic Angular perf bug.
  OnPush + immutable updates + async pipe is the standard prescription.
- **NgModule cargo-culting.** Creating modules for new features out of habit. Standalone is the
  default now — simpler imports, better lazy loading.
