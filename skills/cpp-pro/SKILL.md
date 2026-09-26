---
name: cpp-pro
description: Idiomatic modern C++: RAII, smart pointers, move semantics, value semantics, STL algorithms, and safe concurrency. Use when writing, reviewing, or structuring C++ code.
category: development
---

# C++ Pro

## Overview

Modern C++ (17/20/23) is **a language of zero-cost abstractions and strict ownership**: RAII ties
resource lifetime to scope, smart pointers make ownership explicit, move semantics eliminate needless
copies, and the STL algorithms express intent better than hand loops. Professional C++ means writing
for correctness first (the compiler and sanitizers as allies), using the modern toolbox instead of
C-with-classes habits, and reserving cleverness for measured hotspots.

The through-line: own resources explicitly, prefer the standard library, and let tools (sanitizers,
static analysis) catch what humans miss.

## When to use

- Writing or reviewing C++ for modern idiom and safety.
- Designing ownership (smart pointers, lifetimes) and concurrency.
- Structuring C++ projects (CMake, modules, libraries).
- Debugging memory errors, UB, or performance issues.
- Modernizing legacy C++ (C++11 or older) codebases.

## Core concepts

- **RAII: resources are objects.** Acquire in constructor, release in destructor — files, locks,
  sockets, memory. Scope exit (including exceptions) cleans up automatically. If you're writing
  manual `new`/`delete` in application code, something's off.
- **Smart pointers express ownership.** `unique_ptr` = sole ownership (the default); `shared_ptr`
  = shared ownership (use sparingly — shared ownership is shared responsibility); `weak_ptr` breaks
  cycles. Raw pointers/references = non-owning observation. `make_unique`/`make_shared` always.
- **Value semantics by default.** Prefer values and const references; move (`std::move`) when
  transferring ownership out. Understand the rule of 0/3/5: if you manage a resource, define (or
  delete) copy/move/destructor consistently — or better, let a smart pointer member do it (rule of 0).
- **Algorithms over hand loops.** `std::transform`, `find_if`, `accumulate`, ranges (`views::filter
  | views::transform`) — named algorithms state intent; raw loops hide bugs. Ranges (C++20) compose
  lazily and read like pipelines.
- **Const-correctness and `noexcept`.** `const` member functions, `const&` parameters you don't
  mutate — the compiler then enforces your contracts. `noexcept` where failure is impossible
  (moves, swaps) enables optimizations and documents guarantees.
- **Concurrency: the standard toolkit.** `std::thread`, `mutex`/`lock_guard` (never manual
  lock/unlock), `atomic` for lock-free counters/flags, `jthread` (C++20, auto-joining) over
  `thread`. Share immutable data freely; synchronize mutable sharing — and prefer message passing
  or task parallelism over fine-grained locking.

## Practical workflow

1. **Set up the build sanely.** CMake with target-based deps, C++20 (or 23) standard set,
   warnings as errors (`-Wall -Wextra -Werror`), and presets for debug/release/sanitizer builds.
2. **Sanitizers in CI.** ASan+UBSan on the test suite always; TSan for threaded code. They catch
   memory errors and UB that code review never will. Fuzz parsers and decoders (libFuzzer).
3. **Write with ownership explicit.** Function signatures show it: `unique_ptr<T>` param = takes
   ownership; `T&` = mutates; `const T&` = reads; `T` return by value (RVO/move make it cheap).
4. **Prefer the STL.** Containers (`vector` default — not `list`), `<algorithm>`, `<chrono>`,
   `<filesystem>`, `<format>`/`fmt` over printf/iostream formatting. Don't reimplement.
5. **Test with a real framework.** GoogleTest/Catch2/Doctest; test behavior including edge cases;
   run under sanitizers. Benchmark hot paths (Google Benchmark) before optimizing.
6. **Review for the C++-specific:** ownership clarity, exception safety (strong guarantee where it
   matters), no raw `new`/`delete`, no C-style casts (`reinterpret_cast` needs justification),
   lifetime of references/pointers captured in lambdas and async work.

Idiomatic snippets:

```cpp
// RAII + unique_ptr: ownership is visible in the signature
std::unique_ptr<Config> loadConfig(const std::filesystem::path& path); // takes nothing, returns ownership

// Ranges pipeline instead of a hand loop
auto adults = users
    | std::views::filter([](const User& u) { return u.age >= 18; })
    | std::views::transform([](const User& u) { return u.name; });

// lock_guard: never manual lock/unlock
{
    std::lock_guard lock(mutex_);
    queue_.push(std::move(item));
} // unlocked here, even on exception
```

## Common pitfalls

- **Manual memory management.** Raw `new`/`delete` in modern code — leaks on exception paths,
  double-frees, and ownership ambiguity. Smart pointers or values, always.
- **Dangling references/pointers.** Returning references to locals, capturing locals by reference
  in async lambdas, `string_view` outliving its string. Lifetime issues are C++'s sharpest edge —
  sanitizers + careful API design are the guards.
- **Undefined behavior dismissed.** Signed overflow, use-after-free, data races — "works on my
  machine" until the optimizer exploits the UB. UBSan exists; use it.
- **C-style casts and `reinterpret_cast` casualness.** Bypassing the type system silently.
  `static_cast`/`dynamic_cast` deliberately; `reinterpret_cast` only with documented justification.
- **Over-abstracted template metaprogramming.** Template magic that's cleverer than the team.
  Concepts (C++20) constrain templates readably — prefer them over SFINAE archaeology.
- **Ignoring the rule of 0/3/5.** Classes managing resources with default copy semantics —
  double-free on copy. Either manage properly or hold a smart pointer and define nothing.
- **Premature micro-optimization.** `register`-era thinking, manual loop unrolling, avoiding
  `vector` for imagined overhead. Profile first; the STL and the optimizer are better at this
  than you are.
