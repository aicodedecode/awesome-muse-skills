---
name: rxjs-pro
description: Program reactively with RxJS: observables, operators, subjects, higher-order mapping, and subscription management. Use for event streams, async orchestration, and complex data flows.
category: development
---

# RxJS Pro

A practical guide to RxJS: thinking in **observables** — streams of values over time — with the operator toolkit (map/filter/scan, flattening strategies, combination, error handling) and the subscription discipline that prevents leaks.

## Overview

RxJS models async as streams: user events, HTTP responses, timers, websockets — all observables you compose with operators instead of nesting callbacks or chaining promises imperatively. The power is in **composition and cancellation**: `switchMap` cancels stale requests automatically; `debounceTime` + `distinctUntilChanged` build search-as-you-type in three operators; `combineLatest` merges streams declaratively.

## When to use

- Search-as-you-type, autocomplete, typeahead.
- Websocket streams, live data, polling with backoff.
- Complex async orchestration (dependent requests, race conditions, cancellation).
- Angular apps (RxJS is idiomatic there: HttpClient, forms, router events).
- Event-heavy UIs: drag interactions, multi-source state.

## Core concepts

- **Observable.** Lazy push collection: `new Observable(subscriber => {...})`. Cold (each subscription re-executes, e.g., HTTP) vs hot (shared, e.g., Subjects, websocket).
- **Operators.** Pure functions composing streams: `map`, `filter`, `scan` (stateful reduce), `tap` (side effects for debugging), `take`, `first`.
- **Flattening (the big one).** `switchMap` (cancel previous — search, route params), `mergeMap` (concurrent — bulk ops), `concatMap` (sequential — ordered saves), `exhaustMap` (ignore while busy — submit buttons, login).
- **Combination.** `combineLatest` (latest from each), `withLatestFrom`, `forkJoin` (all complete → one emission), `zip`, `race`.
- **Subjects.** `Subject` (multicast), `BehaviorSubject` (current value + new subscribers get latest), `ReplaySubject` (buffer). Bridges between imperative and reactive code.
- **Error handling.** `catchError` (recover/replace), `retry`/`retryWhen` (transient failures), `finalize` (cleanup). Errors terminate streams — handle or the stream dies.
- **Subscription management.** `takeUntil(destroy$)`, `async` pipe (Angular auto-unsubscribes), `Subscription.add`. Unclosed subscriptions = leaks.

## Practical workflow

**1. Search-as-you-type (the canonical example).**
```ts
import { fromEvent, debounceTime, distinctUntilChanged, filter, switchMap, catchError, of } from 'rxjs';

fromEvent(input, 'input').pipe(
  map(e => e.target.value.trim()),
  debounceTime(300),
  distinctUntilChanged(),
  filter(q => q.length >= 2),
  switchMap(q => searchApi(q).pipe(catchError(() => of([])))), // cancel stale, survive errors
).subscribe(renderResults);
```

**2. Polling with backoff.**
```ts
timer(0, 5000).pipe(
  exhaustMap(() => fetchStatus()),   // skip tick if previous still running
  retry({ delay: (err, n) => timer(Math.min(1000 * 2 ** n, 30000)) }),
  takeUntil(stop$),
).subscribe(updateUI);
```

**3. Component lifecycle (Angular).**
```ts
private destroy$ = new Subject<void>();
ngOnInit() {
  this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => this.service.get(id)),
    takeUntil(this.destroy$),
  ).subscribe(...);
}
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
```
Or just use the `async` pipe in templates — no manual subscription at all.

**4. Share expensive streams.** `source$.pipe(shareReplay({ bufferSize: 1, refCount: true }))` — one underlying subscription, late subscribers get the latest.

## Common pitfalls

- **Wrong flattening operator.** `mergeMap` for search = out-of-order results; `switchMap` for saves = lost writes. Choose deliberately: cancel/parallel/sequential/ignore.
- **Unclosed subscriptions.** Every `.subscribe` needs an end: `takeUntil`, `take(1)`, `first()`, or async pipe. Route-change leaks are the classic Angular memory bug.
- **Errors killing streams.** One unhandled error completes the whole stream silently. `catchError` at the right level (inside `switchMap`, not outside the whole pipe, usually).
- **Nested subscribes.** `obs1.subscribe(v => obs2.subscribe(...))` — callback hell with extra steps. Flatten with operators.
- **Subjects as first resort.** Reaching for Subject before trying pure operators creates imperative spaghetti. Subjects bridge; operators compose.
- **`combineLatest` needs all to emit.** It waits for every source's first emission — a never-emitting source stalls the whole combination. Seed with `startWith` or use `BehaviorSubject`.
- **Hot vs cold confusion.** Subscribing twice to a cold HTTP observable fires two requests. `shareReplay` when you want one execution, many observers.
- **Over-engineering.** Simple one-shot async doesn't need streams. Promises/async-await for single values; RxJS for streams, cancellation, and composition.
