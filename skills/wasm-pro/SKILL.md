---
name: wasm-pro
description: Ship WebAssembly modules: compile from Rust/C/C++, JS interop, memory management, threading, and performance patterns. Use when moving hot code to the browser or edge.
category: development
---

# WASM Pro

A practical guide to WebAssembly: compiling Rust/C/C++ to wasm, JavaScript interop, linear memory management, multithreading with SharedArrayBuffer, and the performance patterns that make wasm worth it.

## Overview

WebAssembly is a portable, near-native-speed bytecode that runs in browsers (and servers/edge runtimes). The use cases that justify it: **compute-heavy work** (codecs, crypto, physics, image processing), **porting existing native libraries**, and **consistent behavior** across platforms. It's not a faster JavaScript — it's for code where JS genuinely can't keep up or where you need to reuse a battle-tested native codebase.

The core interop model: wasm has linear memory (a big byte array) and exported functions; JS and wasm pass numbers directly and complex data via that shared memory.

## When to use

- Porting a Rust/C/C++ library to the browser (parsers, codecs, compression, crypto).
- Hot loops: physics, simulations, audio/video processing, heavy math.
- Running the same logic on client, server, and edge (one codebase, multiple targets).
- Sandboxing untrusted compute (wasm's memory isolation).
- Evaluating whether wasm is worth it vs optimized JS (often it isn't — measure first).

## Core concepts

- **Linear memory.** Wasm's memory is a contiguous byte array, grown in 64KiB pages. Strings/structs cross the boundary by writing bytes + passing pointer/length.
- **Interop bindings.** Raw wasm exports only numbers. Tools generate the glue: `wasm-bindgen` (Rust), Emscripten (C/C++). They handle string/struct marshaling so you don't hand-roll it.
- **Rust → wasm.** `wasm-pack build --target web` produces a `.wasm` + JS glue + TypeScript types. `#[wasm_bindgen]` marks exported functions; `wee_alloc` or default allocator manages memory.
- **C/C++ → wasm.** Emscripten compiles to wasm + JS runtime (`emcc source.c -o out.js`). Heavier glue, but ports huge codebases (it runs entire engines).
- **WASI.** WebAssembly System Interface — filesystem, clocks, sockets for non-browser runtimes (servers, edge). Browser builds typically avoid WASI.
- **Threads.** `SharedArrayBuffer` + Atomics enable wasm threads. Requires COOP/COEP headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`) — plan hosting accordingly.
- **SIMD.** Wasm SIMD (128-bit vectors) for data-parallel code; enabled by default in modern toolchains with the right target features.
- **Streaming compile.** `WebAssembly.instantiateStreaming(fetch('mod.wasm'))` compiles during download — faster startup. Requires correct MIME type (`application/wasm`).

## Practical workflow

**1. Decide the boundary.** Keep the JS↔wasm interface chunky: few calls, big payloads. Chatty interop (thousands of tiny calls) erases the speedup.

**2. Build (Rust example).**
```bash
cargo install wasm-pack
wasm-pack build --target web --release
```
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_image(data: &[u8], width: u32, height: u32) -> Vec<u8> {
    // &[u8] in, Vec<u8> out — wasm-bindgen handles the copying
    transform(data, width, height)
}
```

**3. Load efficiently.**
```js
import init, { process_image } from './pkg/my_crate.js';
await init(); // instantiateStreaming under the hood
```

**4. Manage memory.** Avoid per-frame allocations across the boundary. Reuse buffers; prefer passing views (`&[u8]`) over owned copies where the binding supports it. Watch for leaks: JS-held references to wasm-allocated memory aren't GC'd on the wasm side.

**5. Thread carefully.** Only add threads when single-threaded wasm is proven insufficient — SAB + COOP/COEP headers complicate deployment (breaks some embeds/CDN setups).

**6. Measure.** Benchmark against optimized JS on target devices. Wasm wins on sustained compute; JS often wins on startup and DOM-adjacent work.

## Common pitfalls

- **Wrong MIME type.** Serving `.wasm` as `application/octet-stream` breaks `instantiateStreaming` (falls back to slower ArrayBuffer instantiation). Configure the server/CDN.
- **Chatty boundaries.** Calling wasm per-pixel or per-item. Batch work into single calls with bulk data.
- **Memory leaks.** Wasm linear memory doesn't shrink automatically; long sessions grow it. Reuse buffers, free what you allocate, monitor `memory.buffer.byteLength`.
- **Panics across the boundary.** Rust panics in wasm are opaque by default. Use `console_error_panic_hook` in dev; in prod, design APIs that return `Result` instead of panicking.
- **COOP/COEP fallout.** Enabling cross-origin isolation for threads can break third-party iframes/scripts that don't send CORP headers. Test the whole page, not just the wasm module.
- **Huge downloads.** Debug builds and unoptimized wasm bloat. Always `--release`, consider `wasm-opt -Oz`, and lazy-load the module only when needed.
- **Assuming wasm = fast.** Startup cost (download + compile) can exceed the compute savings for small tasks. Profile end-to-end, including load time.
- **No fallback.** Older browsers and some locked-down environments lack wasm or threads. Feature-detect and provide a JS fallback path for critical features.
