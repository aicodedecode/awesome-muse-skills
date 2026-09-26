---
name: swift-pro
description: Idiomatic Swift: value types, optionals, protocols, structured concurrency, and SwiftUI/UIKit patterns. Use when writing, reviewing, or structuring Swift apps.
category: development
---

# Swift Pro

## Overview

Swift rewards **safety by construction**: optionals instead of nulls, value types by default,
protocols over inheritance, and a compiler that catches entire bug families. Professional Swift
means leaning into these — modeling with structs and enums, handling optionals explicitly, using
structured concurrency instead of callback pyramids, and writing code the compiler can verify.

The through-line: make invalid states unrepresentable, handle the absent case explicitly, and let
the type system do the worrying.

## When to use

- Writing or reviewing Swift code for idiom and safety.
- Structuring iOS/macOS apps (SwiftUI or UIKit).
- Choosing value vs reference types, or designing protocol abstractions.
- Using async/await, actors, and structured concurrency.
- Debugging optionals, retain cycles, or concurrency issues.

## Core concepts

- **Value types by default.** `struct` for data and domain models — copied on assignment, no
  shared-mutable-state surprises, thread-safe by construction. `class` only when you need identity,
  shared mutable state, or inheritance (rare). Enums with associated values model states beautifully.
- **Optionals are explicit.** `if let`/`guard let` for unwrapping, `map`/`flatMap` for transforms,
  nil-coalescing for defaults. Force-unwrap (`!`) only for true invariants (IBOutlets after load)
  — never on network data or user input. Implicitly-unwrapped optionals are a code smell outside
  narrow cases.
- **Protocols + extensions.** Protocol-oriented design: small protocols, default implementations
  via extensions, composition over inheritance. But don't protocol-everything preemptively —
  concrete types first, protocols when you have two conformers or a testing seam.
- **Structured concurrency.** `async`/`await` for asynchronous work, `Task` groups for fan-out,
  `actor` for isolated mutable state. Say goodbye to callback pyramids and manual GCD queue
  hopping. Respect `@MainActor` for UI updates; don't block the main actor.
- **Error handling with `throws`.** Typed throws (Swift 6) for precise error modeling; `do/catch`
  at boundaries, `try?`/`try!` only where failure is truly uninteresting/impossible. `Result`
  type when errors are values to pass around rather than control flow.
- **Memory: ARC + weak/strong discipline.** Retain cycles via closures capturing `self` strongly —
  `[weak self]` in escaping closures that outlive their context. Value types sidestep most of this;
  reference cycles are a class-design problem.

## Practical workflow

1. **Model first.** Structs for data, enums with associated values for states/results, protocols
   for the seams you'll actually test or vary.
2. **Handle absence explicitly.** No force-unwraps on external data; `guard let` early for
   preconditions; meaningful defaults via `??`.
3. **Write async code structurally.** `async` functions, `TaskGroup` for parallel work, actors for
   shared mutable state. Migrate legacy completion handlers with `withCheckedContinuation` at the
   boundary.
4. **Organize by feature.** Group related models, views, and logic (`Features/Checkout/`) rather
   than by type (`Models/`, `Views/`). Keep views dumb; move logic to view models or domain types.
5. **Test the logic, not the framework.** Unit-test domain types, view models, and parsers with
   XCTest/Swift Testing; UI tests only for critical journeys. Inject dependencies via protocols
   for testability.
6. **Mind the platform.** Respect main-actor isolation, handle background/foreground transitions,
   test on device for performance and memory, and profile with Instruments before optimizing.

Idiomatic snippets:

```swift
// Enum states + async/await + guard
enum LoadState<T> {
    case idle, loading, loaded(T), failed(Error)
}

func refresh() async {
    state = .loading
    do {
        let items = try await store.fetchItems()
        state = .loaded(items)
    } catch {
        state = .failed(error)
    }
}

// Weak capture in escaping closures
service.onUpdate = { [weak self] items in
    guard let self else { return }
    self.items = items
}
```

## Common pitfalls

- **Force-unwrap roulette.** `!` on optionals from JSON, user input, or casts — crashes in
  production. Every `!` should have a justification a reviewer can verify.
- **Massive view controllers / views.** 1,000-line view files doing networking, parsing, and
  layout. Extract: view models for state, services for I/O, small composable views.
- **Retain cycles.** Closures capturing `self` strongly in long-lived objects (timers, network
  callbacks, notification observers). `[weak self]` + `guard let self` is the reflex.
- **Blocking the main thread.** Synchronous networking, JSON parsing of large payloads, or image
  processing on main — jank and watchdog kills. Move to background, update UI on main actor.
- **Over-protocoling.** A protocol for every struct "for testability" before there's a second
  implementation. Concrete types are simpler; add protocols at real seams.
- **Ignoring Swift 6 concurrency checking.** Data races flagged by the compiler are real bugs.
  Adopt `Sendable`, respect actor isolation — don't silence with `@unchecked Sendable` without
  understanding why.
- **Stringly-typed APIs.** String constants for states, notification names as raw strings.
  Enums, typed notification wrappers, and `#function`-based identifiers prevent typo-bugs.
