---
name: javascript-pro
description: Idiomatic modern JavaScript: ES2022+ features, async patterns, modules, and runtime behavior mastery. Use when writing, reviewing, or debugging JavaScript.
category: development
---

# JavaScript Pro

## Overview

Modern JavaScript (ES2022+) is **a capable, expressive language** — but its flexibility (dynamic
typing, `this` quirks, coercion, event loop) punishes the casual. Professional JavaScript means
knowing the runtime deeply (event loop, promises, modules), writing in modern idioms (not 2012
jQuery-era patterns), handling async structurally, and choosing when types (TypeScript/JSDoc) are
worth it.

The through-line: master the event loop and the module system, write async as linear code, and
respect the dynamism — validate at boundaries.

## When to use

- Writing or reviewing JavaScript (Node.js or browser).
- Debugging async issues, `this` binding, or coercion bugs.
- Choosing module patterns, async styles, or language features.
- Structuring Node.js applications and CLIs.
- Deciding between JS and TypeScript for a project.

## Core concepts

- **The event loop.** Call stack, microtasks (promises — run before rendering/macrotasks),
  macrotasks (timers, I/O). `await` yields; long synchronous blocks freeze everything. This model
  explains 90% of "why did this run in that order" bugs — learn it once, deeply.
- **Promises and async/await.** `async` functions return promises; `await` linearizes async code;
  `Promise.all` for parallel independent work, `Promise.allSettled` when partial failure is OK,
  `Promise.race`/`any` for timeouts/first-wins. Unhandled rejections crash Node — always handle.
- **Modules (ESM).** `import`/`export`, one module per concern, explicit dependency graph.
  Default vs named exports (prefer named — greppable, refactorable); no circular imports
  (restructure when they appear); dynamic `import()` for code splitting and conditional loading.
- **`this`, arrow functions, and binding.** Arrow functions capture lexical `this`; method
  shorthand and classes have dynamic `this`. In callbacks, prefer arrows or explicit binding —
  `this` surprises are a design smell, not a rite of passage.
- **Equality and coercion.** `===` always (except deliberate `== null` checks); know the falsy
  set (`0`, `""`, `null`, `undefined`, `NaN`, `false`); optional chaining (`?.`) and nullish
  coalescing (`??`) for safe access with correct defaults (`??` doesn't swallow `0`/`""` like
  `||` does).
- **Iterators and modern syntax.** `for...of`, destructuring, spread/rest, generators for lazy
  sequences, `Map`/`Set` over objects-as-maps (key types, no prototype pollution), `structuredClone`
  for deep copies, top-level await in modules.

## Practical workflow

1. **Set up the runtime right.** Node.js LTS, `"type": "module"` for ESM, strict linting
   (ESLint recommended config), and decide the types question: TypeScript for teams/long-lived
   code, JSDoc for small scripts.
2. **Write async linearly.** `async`/`await` throughout; parallelize independent promises;
   `AbortController` for cancellation (fetch, timeouts); never mix callbacks and promises in new code.
3. **Structure Node apps.** `src/` by feature; thin entry (`index.js`/`cli.js`); pure functions
   separated from I/O; dependency injection (or simple factories) for testability; graceful
   shutdown (close servers, flush, exit codes meaningful).
4. **Handle errors explicitly.** `try/catch` at boundaries; custom Error subclasses with context
   (`cause` chaining); validate external input (zod); fail fast on programmer errors, recover
   gracefully on operational ones.
5. **Test behavior.** Node's built-in test runner or Vitest/Jest; test pure logic heavily, I/O at
   boundaries with fakes; watch for timer/promise flakes (fake timers, explicit awaits).
6. **Know the platform APIs.** `fetch` (undici in Node), `URL`/`URLSearchParams`, `crypto`
   (webcrypto), streams for large data, `worker_threads` for CPU parallelism — the stdlib is
   deeper than most reach.

Idiomatic snippets:

```js
// Parallel independent work; allSettled tolerates partial failure
const results = await Promise.allSettled(urls.map(fetchJson));
const ok = results.filter(r => r.status === "fulfilled").map(r => r.value);

// Cancellation with AbortController
const ctrl = new AbortController();
const timeout = setTimeout(() => ctrl.abort(), 5_000);
try {
  const res = await fetch(url, { signal: ctrl.signal });
  return await res.json();
} finally {
  clearTimeout(timeout);
}

// ?? for defaults that respect 0/""
const port = Number(process.env.PORT ?? 3000);
```

## Common pitfalls

- **Callback-era patterns.** Nested callbacks, `var`, `function` expressions where arrows fit,
  manual promise construction (`new Promise`) around already-promise APIs. Write 2024 JS, not 2012.
- **Floating promises.** Not awaiting/returning promises — errors vanish, ordering breaks, Node
  warns about unhandled rejections. Every promise is awaited, returned, or explicitly handled.
- **`==` and truthiness traps.** `"" == false`, `[] == false` — coercion bugs. `===`, and `??`
  over `||` for defaults.
- **Mutating shared state across awaits.** `await` points interleave — code after `await` runs
  later, and shared objects may have changed. Treat awaits as yield points; don't assume continuity.
- **Blocking the event loop.** Synchronous crypto, JSON.parse of huge payloads, or regex
  catastrophic backtracking on the main thread. Offload (worker threads) or chunk the work.
- **Circular imports.** Module A imports B imports A — works until it silently doesn't (partial
  initialization). Restructure: extract shared bits to module C.
- **console.log debugging as the only tool.** Learn the debugger (`node --inspect`, browser
  devtools) — breakpoints and async stack traces beat print archaeology for real bugs.
