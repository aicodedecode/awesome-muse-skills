---
name: dart-pro
description: Idiomatic Dart: null safety, async, Flutter-ready patterns, packages, and tooling. Use when writing, reviewing, or structuring Dart code (Flutter or server/CLI).
category: development
---

# Dart Pro

## Overview

Dart's design — **sound null safety, approachable async, and a productive standard library** —
makes it a strong language beyond Flutter (servers, CLIs, scripting). Professional Dart means using
null safety as intended, writing async code structurally, modeling with immutable classes and sealed
hierarchies, and organizing packages cleanly.

The through-line: null-safe by construction, async without callbacks, and code that reads plainly.

## When to use

- Writing or reviewing Dart code for idiom (Flutter apps, servers, CLIs).
- Designing with null safety, sealed classes, and pattern matching.
- Structuring Dart/Flutter packages and managing dependencies.
- Using isolates, streams, and futures correctly.
- Setting up testing, linting, and CI for Dart.

## Core concepts

- **Sound null safety.** Non-nullable by default (`String` can't be null); `?` marks genuine
  absence; `!` asserts non-null (use sparingly — each is a potential crash); `late` for
  definitely-assigned-later fields (initialization discipline, not a null-safety escape hatch).
  Flow analysis + smart promotion mean well-structured code rarely needs casts.
- **Async done structurally.** `async`/`await` for futures; `Stream` for sequences of events with
  `await for`, `map`/`where` transforms, and broadcast vs single-subscription semantics;
  `Isolate` for true parallelism (CPU work off the main isolate — no shared memory, message
  passing only).
- **Sealed classes + patterns (Dart 3).** `sealed class Result` with subtypes, exhaustive `switch`
  — the compiler enforces handling every case. Destructuring patterns in variable declarations
  and `if-case` keep parsing code clean.
- **Immutable models.** `final` fields, `const` constructors where possible, `copyWith` for
  variations. Immutable state is the foundation of predictable Flutter UIs and testable logic.
- **Packages and pub.** `pubspec.yaml` declares deps with version constraints; `dart pub get`
  resolves; lock file committed for apps. Organize by feature in `lib/`; keep `src/` private with
  a barrel export file when publishing packages.
- **Lint like you mean it.** `dart analyze` + `flutter_lints` (or stricter `very_good_analysis`
  rules) in CI. Lints catch real bugs (unawaited futures, unnecessary null assertions) — not just style.

## Practical workflow

1. **Scaffold:** `dart create` (or `flutter create`), null-safe SDK constraint, lints package,
   `analysis_options.yaml` wired up, tests in `test/`.
2. **Model the domain.** Sealed classes for states/results, immutable classes with `copyWith`,
   enums with fields/methods for rich fixed sets. Validate in factories.
3. **Write async structurally.** `await` chains over `.then` pyramids; streams for event flows
   with proper subscription lifecycle (cancel!); isolates for CPU-bound work, not I/O.
4. **Handle errors explicitly.** `try`/`catch` at boundaries; custom exception types with context;
   `Future.error` only deliberately; never swallow errors silently — log with context.
5. **Test the logic.** `package:test` (or `flutter_test`): unit-test pure logic and models,
   widget-test UI interactions, integration-test critical journeys. Mock at boundaries (HTTP,
   platform channels), not at your own domain.
6. **Mind the runtime.** Avoid jank: no heavy synchronous work on the UI isolate; profile with
   DevTools before optimizing; `const` widgets where static to reduce rebuild cost.

Idiomatic snippets:

```dart
// Sealed result + exhaustive switch
sealed class LoadResult<T> {}
final class Loaded<T> extends LoadResult<T> { final T data; Loaded(this.data); }
final class LoadFailed<T> extends LoadResult<T> { final String message; LoadFailed(this.message); }

String describe<T>(LoadResult<T> r) => switch (r) {
  Loaded(:var data) => 'Loaded: $data',
  LoadFailed(:var message) => 'Failed: $message',
};

// Immutable model with copyWith
class Order {
  final String id; final int totalCents; final bool paid;
  const Order({required this.id, required this.totalCents, this.paid = false});
  Order copyWith({bool? paid}) => Order(id: id, totalCents: totalCents, paid: paid ?? this.paid);
}
```

## Common pitfalls

- **`!` as a habit.** Null-assertion operators scattered to silence the analyzer reintroduce the
  crashes null safety was built to prevent. Restructure so promotion works, or handle the null.
- **`late` abuse.** `late` fields that throw `LateInitializationError` in production because
  initialization order wasn't guaranteed. Prefer nullable + explicit init, or constructor init.
- **Unawaited futures.** Fire-and-forget futures whose errors vanish silently (unhandled async
  errors). Await or explicitly handle; the `unawaited_futures` lint exists for this.
- **Blocking the UI isolate.** Synchronous file I/O, JSON parsing of huge payloads, or image
  processing on main — jank. `compute()`/isolates for CPU work; async I/O is already non-blocking.
- **Stream subscription leaks.** Listening without canceling (especially in widgets) — memory
  leaks and setState-after-dispose crashes. Manage lifecycle explicitly.
- **Mutable shared state.** Non-final fields mutated across async gaps — race-shaped bugs even in
  single-threaded Dart (await points interleave). Immutable models + explicit state management.
- **Ignoring lints.** `dart analyze` warnings treated as noise. Many Dart lints encode real
  correctness lessons — keep the analyzer clean in CI.
