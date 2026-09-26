---
name: rust-pro
description: Idiomatic Rust: ownership, lifetimes, error handling, async, project structure, and safe unsafe. Use when writing, reviewing, or structuring Rust programs.
category: development
---

# Rust Pro

## Overview

Rust's promise — **memory safety without a garbage collector, and fearless concurrency** — is paid
for in the borrow checker. Professional Rust means working *with* ownership rather than fighting
it: designing data flow so the compiler's rules feel natural, using the type system to encode
invariants, and reaching for `unsafe` only with justification and encapsulation.

This skill covers idiomatic Rust: ownership patterns, error handling, async, project organization,
and the tooling (`cargo`, `clippy`, `rustfmt`) that defines the ecosystem's high bar.

## When to use

- Starting or structuring a Rust crate/workspace.
- Writing or reviewing Rust for idiom, safety, or performance.
- Fighting the borrow checker (restructuring data flow).
- Choosing async runtimes, error-handling strategies, or concurrency primitives.
- Writing `unsafe` code or reviewing it.

## Core concepts

- **Ownership is the design tool.** Each value has one owner; borrowing (`&`, `&mut`) is temporary.
  When the borrow checker complains, it's usually flagging a real design tension — restructure
  (clone small data, use indices instead of references, split structs) rather than sprinkling
  `Rc<RefCell<>>` to silence it.
- **Lifetimes describe relationships.** Most lifetimes are elided; explicit ones appear on structs
  holding references and functions relating input/output lifetimes. If you're fighting lifetime
  annotations, consider owned data (`String` over `&str` in structs) — the small cost buys big
  simplicity.
- **Errors: `Result` + `?`.** `thiserror` for library error types (callers match on variants),
  `anyhow` for applications (context-rich, easy `?` propagation). `unwrap()`/`expect()` only where
  failure is genuinely impossible — and `expect` with a message explaining why. Never `unwrap` on
  user input or I/O in production paths.
- **Iterators over loops.** `map`, `filter`, `fold`, `collect` — zero-cost, composable, and clearer
  than manual loops once fluent. `collect::<Result<Vec<_>, _>>()` turns an iterator of Results
  into one Result — learn this idiom early.
- **Async: Tokio by default.** `async`/`await` for I/O concurrency; `spawn` for independent tasks;
  `select!` for racing operations; channels (`tokio::sync::mpsc`) for message passing. Don't block
  the async runtime with CPU work or sync I/O — `spawn_blocking` exists for that.
- **Traits for abstraction.** Define behavior with traits; use generics (monomorphized, zero-cost)
  for performance-critical polymorphism and `dyn Trait` (trait objects) where heterogeneity or
  binary size matters. Derive the std traits (`Clone`, `Debug`, `PartialEq`…) liberally — `Debug`
  on everything is a debugging superpower.

## Practical workflow

1. **Scaffold:** `cargo new` (binary) or `cargo new --lib`; workspace for multi-crate projects;
   `rustfmt` + `clippy -D warnings` in CI from day one.
2. **Model with types.** Newtypes for domain IDs (`struct UserId(Uuid)`), enums for states,
   `Option`/`Result` instead of sentinel values. Make invalid states unrepresentable.
3. **Handle errors deliberately.** Libraries: `thiserror` enums. Binaries: `anyhow` with
   `.context("…")` at boundaries. Propagate with `?`; handle at the layer that can act.
4. **Structure the crate:** `lib.rs` re-exports the public API; modules by domain concept;
   `#[cfg(test)] mod tests` colocated; integration tests in `tests/`. Keep `main.rs` thin.
5. **Concurrency choice:** threads + channels/`Arc<Mutex<>>` for CPU parallelism (rayon for data
   parallelism); async for I/O concurrency. Don't mix sync blocking into async executors.
6. **Profile before optimizing.** `cargo bench` (criterion), flamegraphs for hotspots. Rust is
   fast by default — most wins come from algorithmic changes and avoiding needless allocation,
   not micro-tricks.

Idiomatic snippets:

```rust
// Errors with context (application code)
use anyhow::{Context, Result};
fn load(path: &Path) -> Result<Config> {
    let data = std::fs::read(path)
        .with_context(|| format!("reading config {}", path.display()))?;
    Ok(toml::from_str(&data)?)
}

// Builder-ish construction, consuming self
impl Request {
    fn timeout(mut self, d: Duration) -> Self { self.timeout = d; self }
}
```

## Common pitfalls

- **Fighting the borrow checker with smart pointers.** Wrapping everything in `Rc<RefCell<T>>`
  to avoid restructuring. Sometimes right (graphs, shared mutable UI trees); usually a sign the
  data flow needs redesign.
- **`unwrap()` in production paths.** Panics on user input, network data, or file I/O are crashes.
  Reserve `expect` for true invariants, with messages.
- **Cloning to appease the compiler.** `.clone()` everywhere "works" but hides design issues and
  costs performance. Clone deliberately (small/cheap types), restructure otherwise.
- **Async pitfalls.** Blocking the executor (sync sleep, heavy compute in async fn), holding
  `MutexGuard` across `.await` (deadlock risk — use `tokio::sync::Mutex` or restructure), and
  `async` in traits without care (needs `async_trait` or native support depending on version).
- **`unsafe` without encapsulation.** `unsafe` blocks scattered through business logic. Rule:
  encapsulate in a minimal module with a safe API and document the invariants the caller must
  uphold (`// SAFETY:` comments).
- **Over-engineering lifetimes.** Structs full of `<'a>` that could own their data. Owned data
  with occasional clones beats lifetime tetris in application code.
- **Ignoring clippy.** `cargo clippy` catches real bugs and non-idioms. `-D warnings` in CI keeps
  the bar; fix lints instead of allowing them globally.
