---
name: swiftui-pro
description: Professional SwiftUI: declarative UI, state management, data flow, navigation, and performance. Use when writing, reviewing, or structuring SwiftUI apps.
category: development
---

# SwiftUI Pro

## Overview

SwiftUI's declarative model — **describe the UI for the current state, and the framework keeps it
in sync** — rewards thinking in data flow rather than view manipulation. Professional SwiftUI means
mastering the state wrappers (`@State`, `@Binding`, `@Observable`, `@Environment`), keeping views
small and value-driven, handling navigation and data deliberately, and knowing exactly when to drop
to UIKit.

The through-line: state drives views; views are cheap, pure functions of state.

## When to use

- Writing or reviewing SwiftUI code.
- Designing state ownership and data flow in SwiftUI apps.
- Structuring navigation, sheets, and app lifecycle.
- Debugging view update issues (not updating, updating too much).
- Deciding SwiftUI vs UIKit for a screen or component.

## Core concepts

- **State wrappers, each with a job.** `@State` (private, view-owned), `@Binding` (two-way link
  to someone else's state), `@Observable`/`@StateObject`-era models (shared/reference state —
  modern: `@Observable` classes held in `@State`), `@Environment` (dependency injection: color
  scheme, dismiss, custom values). Choosing the wrong wrapper is the root of most SwiftUI bugs.
- **Single source of truth.** Every piece of state has one owner; everything else derives or
  binds. Duplicated state that "syncs" via `onChange` is a bug factory — derive with computed
  properties instead.
- **Views are cheap and ephemeral.** The framework creates and discards view structs constantly —
  never store mutable state in the view struct itself (that's `@State`'s job), never do work in
  `body` (it's called often and must be pure-ish), and keep `body` small by extracting subviews.
- **Identity matters.** `ForEach` needs stable `id`s; `.id()` controls view identity for
  transitions and state preservation. Wrong identity = state attaching to the wrong row, animations
  glitching — the SwiftUI equivalent of React's key bugs.
- **Navigation, modern.** `NavigationStack` with path binding (deep-linkable, programmatic),
  sheets/full-screen covers with item bindings, and `navigationDestination(for:)` type-driven
  routing. Design the navigation state as data and it becomes testable.
- **Data layer separation.** Views observe; view models / `@Observable` stores fetch and mutate;
  repositories talk to network/persistence. `@Observable` macro classes with `@MainActor` for UI
  state — the modern replacement for `ObservableObject` ceremony.

## Practical workflow

1. **Model state first.** For each screen: what state exists, who owns it, what derives from it.
   Owners hold `@State`/`@Observable`; children receive bindings or values.
2. **Build small views.** Extract subviews aggressively (also a performance win — fine-grained
   invalidation); view structs stay focused; logic lives in observable models, not in `body`.
3. **Wire data with tasks.** `.task` for async work tied to view lifetime (auto-cancelled on
   disappear); `.refreshable` for pull-to-refresh; handle loading/error/empty states explicitly.
4. **Navigate as data.** `NavigationStack(path:)` bound to a path array; deep links map to path
   construction; sheets driven by optional item state. Navigation becomes unit-testable logic.
5. **Handle the platform.** `scenePhase` for lifecycle, `@Environment` for size classes/color
   scheme, proper keyboard/focus handling on macOS/iPad, accessibility labels on custom controls.
6. **Test the logic.** Unit-test observable models and domain logic (no UI needed); UI tests
   (XCUITest) for critical journeys; snapshot tests for visual regressions on key screens.

Idiomatic snippets:

```swift
@Observable
@MainActor
final class OrderListModel {
    var orders: [Order] = []
    var filter = ""
    var state: LoadState = .idle

    var visible: [Order] { // derived, not stored
        orders.filter { filter.isEmpty || $0.id.contains(filter) }
    }

    func refresh() async {
        state = .loading
        do { orders = try await store.fetchOrders(); state = .loaded }
        catch { state = .failed(error) }
    }
}

struct OrderListView: View {
    @State private var model = OrderListModel()
    var body: some View {
        List(model.visible) { order in OrderRow(order: order) }
            .task { await model.refresh() }
            .refreshable { await model.refresh() }
    }
}
```

## Common pitfalls

- **State in the wrong wrapper.** `@State` for shared state (each view gets its own copy —
  desync), `@ObservedObject` without ownership (object dies unexpectedly), or plain `var` in
  the view struct (lost on every re-creation).
- **Work in `body`.** Network calls, date formatting of large lists, or side effects inside
  `body` — runs constantly. Compute in models; `body` only describes.
- **Massive single views.** 500-line `body` with inline everything — slow to compile, impossible
  to reason about, coarse invalidation. Extract subviews.
- **Missing identity.** `ForEach(orders)` without stable ids on mutable lists — state and
  animations attach wrongly after reorder/filter. Always identify by stable id.
- **`onChange` sync loops.** Two states syncing each other via `onChange` — infinite loops or
  subtle desync. One source of truth; derive the rest.
- **UIKit dismissal.** Reaching for UIKit for everything "because SwiftUI can't." Modern SwiftUI
  covers most needs; bridge selectively (`UIViewRepresentable`) for the genuine gaps (rich text,
  complex gestures, legacy components) — and wrap cleanly.
- **Ignoring accessibility.** Custom controls without labels, traits, or actions. SwiftUI gives
  you a lot free — don't lose it with custom gestures lacking accessibility equivalents.
