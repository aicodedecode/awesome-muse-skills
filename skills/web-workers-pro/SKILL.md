---
name: web-workers-pro
description: Offload work with Web Workers: dedicated/shared workers, messaging, transferables, and worker-based architectures. Use to keep the main thread responsive.
category: web-development
---

# Web Workers Pro

A practical guide to Web Workers: moving heavy computation off the main thread — dedicated and shared workers, message passing, transferable objects, and the architectures (comlink, worker pools) that make workers pleasant.

## Overview

JavaScript's main thread does everything: rendering, input, your code. A long task (>50ms) blocks interaction — jank. **Web Workers** run scripts in background threads with no DOM access, communicating via message passing. Use them for: parsing/processing large data, image/video manipulation, encryption, search indexing, heavy calculations. If the main thread is busy, workers are the answer.

## When to use

- Heavy data processing (CSV/JSON parsing, transformations, aggregations).
- Image/audio/video processing client-side.
- Crypto, compression, WASM-adjacent compute.
- Search indexes (Lunr/FlexSearch) over large corpora.
- Anything profiling shows blocking the main thread.

## Core concepts

- **Dedicated workers.** `new Worker('worker.js')` — one worker per instance, dies with the page. The common case.
- **Message passing.** `postMessage` / `onmessage` — structured clone serialization (most types; functions/DOM nodes not clonable). Design message protocols: `{ type, payload }`.
- **Transferables.** `postMessage(buf, [buf])` — *moves* ArrayBuffers instead of copying (zero-copy). Essential for large binary data; the sender loses access.
- **Shared workers.** One worker shared across tabs/frames of an origin — for cross-tab coordination, shared caches, single websocket multiplexed to tabs.
- **Service workers vs web workers.** Service workers = network proxy + offline (see service-worker-pro). Web workers = computation. Different lifecycles, different purposes.
- **Module workers.** `new Worker('w.js', { type: 'module' })` — ES imports inside workers. Needs server MIME + CORS correctness.
- **Comlink.** Library making workers feel like async local objects (`await api.expensiveFn(x)`) — removes message-boilerplate for RPC-style usage.
- **Worker pools.** For parallelizable chunks: N workers (usually `navigator.hardwareConcurrency`), task queue, distribute — near-linear speedup for CPU-bound work.

## Practical workflow

**1. Basic worker.**
```js
// main.js
const worker = new Worker(new URL('./compute.worker.js', import.meta.url), { type: 'module' });
worker.postMessage({ type: 'process', rows });
worker.onmessage = (e) => { if (e.data.type === 'done') renderResults(e.data.result); };
worker.onerror = (e) => showError('Processing failed');

// compute.worker.js
self.onmessage = async (e) => {
  const result = heavyTransform(e.data.rows);
  self.postMessage({ type: 'done', result });
};
```

**2. Zero-copy for big buffers.**
```js
// transfer, don't copy, large ArrayBuffers
worker.postMessage({ type: 'image', buffer }, [buffer]);
```

**3. Comlink for RPC style.**
```js
// import * as Comlink from 'comlink';
// const api = Comlink.wrap(worker);
// const result = await api.expensiveFn(data);
```

**4. Bundler integration.** Vite/webpack support `new Worker(new URL('./w.js', import.meta.url))` natively — the worker gets bundled. Don't hand-serve worker files unless you must.

**5. Fallback.** If workers unavailable (rare) or the task is small, run inline. Feature-detect; keep the compute function importable in both contexts.

## Common pitfalls

- **No DOM access.** Workers can't touch the DOM — a frequent surprise. Compute in worker, render on main; pass data, not elements.
- **Serialization overhead.** Structured cloning large objects costs time — for huge payloads use transferables, or keep data in the worker and query it.
- **Chatty messaging.** Thousands of tiny messages = overhead dominating. Batch: fewer, larger messages.
- **Worker startup cost.** Spawning a worker takes ~10–50ms + script parse. Reuse workers (pool) instead of spawning per task.
- **Uncaught worker errors.** `worker.onerror` — without it, failures are silent. Always handle; surface to UI.
- **CORS/MIME issues.** Module workers need correct `Content-Type` and same-origin/CORS. Bundler-managed workers avoid this; hand-rolled setups hit it.
- **Shared worker complexity.** Cross-tab coordination is powerful but subtle (ports, lifecycle). Only reach for shared workers when tabs genuinely must coordinate.
- **Over-threading.** More workers than cores for non-parallelizable work = overhead. Pool size ≈ `hardwareConcurrency`; profile.
- **Debugging difficulty.** Worker breakpoints work in DevTools (separate thread context) — learn where to find them instead of `console.log`-only debugging.
- **Leaving workers running.** Terminate (`worker.terminate()`) when done for one-shot work; long-lived pools get explicit shutdown on page hide/unload where appropriate.
