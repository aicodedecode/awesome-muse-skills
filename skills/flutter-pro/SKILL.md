---
name: flutter-pro
description: Professional Flutter: widget composition, state management, platform channels, and performance. Use when writing, reviewing, or structuring Flutter apps.
category: development
---

# Flutter Pro

## Overview

Flutter's promise — **one codebase, native performance, pixel-perfect control** — is delivered
through its widget model: everything is a widget, UIs are immutable descriptions, and the
framework diffs efficiently. Professional Flutter means composing widgets idiomatically (small,
const, focused), choosing state management deliberately, handling platform integration via channels
cleanly, and profiling on real devices.

The through-line: composition over inheritance, immutable UI descriptions, and state hoisted exactly
where it's needed.

## When to use

- Writing or reviewing Flutter/Dart code.
- Choosing state management (Provider, Riverpod, Bloc, signals).
- Structuring Flutter apps (features, navigation, layers).
- Debugging rebuild performance or layout issues.
- Integrating native code via platform channels.

## Core concepts

- **Widgets are immutable configuration.** `StatelessWidget` for pure UI-from-config;
  `StatefulWidget` only when the widget itself owns mutable state. Small widgets, `const`
  constructors wherever possible (const subtrees skip rebuilds) — composition is the primary
  design tool.
- **State placement.** Ephemeral UI state → `StatefulWidget` locally; shared app state → a state
  management solution; server state → repository + async patterns (FutureBuilder/StreamBuilder or
  the state solution's async support). Lifting state higher than needed causes rebuild cascades.
- **State management, chosen once.** Riverpod (compile-safe, testable), Bloc (event-driven,
  great for complex flows), Provider (simple). Pick per team/app and be consistent — mixing three
  state solutions is the Flutter equivalent of framework soup.
- **Build methods must be pure.** No side effects, no async work, no randomness in `build()` —
  it can run any number of times. Derive UI from state; do work in event handlers, initState
  (carefully), or effects.
- **Layout model.** Constraints go down, sizes go up, parents position children. `Row`/`Column`/
  `Flex` for linear, `Stack` for overlap, `CustomMultiChildLayout` rarely. Unbounded constraints
  (ListView inside Column) are the classic layout error — understand *why* before fixing with
  Expanded/shrinkWrap.
- **Platform channels for native.** MethodChannel/EventChannel for native APIs Flutter doesn't
  cover; Pigeon for type-safe interfaces. Keep channel traffic coarse-grained — chatty channels
  are a performance and reliability smell.

## Practical workflow

1. **Scaffold with structure.** Feature-first folders (`features/checkout/` with widgets, state,
   data) + `core/` (theme, routing, api); `go_router` for declarative routing with deep links;
   `flutter_lints` (or stricter) in CI.
2. **Theme centrally.** `ThemeData` with color scheme, text theme, component themes — widgets
   consume `Theme.of(context)`, never hardcoded colors. Dark mode via theme modes from day one.
3. **Manage state per scope.** Local → StatefulWidget; feature → provider/Bloc/Riverpod scoped
   to the feature; global (auth, settings) → app-level providers. Async: represent loading/error/
   data explicitly (sealed states or AsyncValue).
4. **Handle the app lifecycle.** Deep links, push notifications, permissions, app lifecycle states
   (paused/resumed → refresh), offline queues — designed early, not retrofitted.
5. **Test the pyramid.** Unit-test logic and state notifiers; widget tests for interaction
   (tap, enter text, expect UI change); integration tests (patrol/Flutter driver) for critical
   journeys on real devices.
6. **Profile on device.** DevTools: rebuild counts (why is this rebuilding?), raster vs UI thread
   (jank source), memory. Fix measured problems: const widgets, RepaintBoundary for animated
   subtrees, ListView.builder with itemExtent, cached images.

Rebuild discipline:

```dart
// const where possible; keys where identity matters; state hoisted right
class OrderList extends StatelessWidget {
  const OrderList({super.key, required this.orders});
  final List<Order> orders;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: orders.length,
      itemExtent: 72, // fixed extent = cheap layout
      itemBuilder: (context, i) => OrderTile(key: ValueKey(orders[i].id), order: orders[i]),
    );
  }
}
```

## Common pitfalls

- **Rebuild cascades.** State too high + non-const widgets = whole screens rebuilding on every
  keystroke. Hoist state to the right level; const everything static; use selectors/consumers
  narrowly.
- **Side effects in build().** Network calls, navigation, or state mutation inside build —
  runs unpredictably often. Build is pure; effects go in handlers/listeners.
- **setState for shared state.** Lifting app state into a root StatefulWidget and setState-ing
  the world. Use a proper state solution past the trivial.
- **Layout errors papered over.** `Expanded`/`Flexible`/`shrinkWrap` sprinkled until the red
  screen goes away, without understanding constraints. Learn the constraint model once.
- **Ignoring platform differences.** iOS back gestures, Android back button, permission models,
  text input behaviors — test both platforms continuously, not at release.
- **Channel chattiness.** Per-frame or per-keystroke platform channel calls. Batch; keep native
  work native-side where possible.
- **No offline story.** Assuming connectivity — the app shows spinners forever in elevators.
  Connectivity awareness, cached data, queued mutations.
