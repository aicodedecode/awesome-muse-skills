---
name: kotlin-pro
description: Idiomatic Kotlin: null safety, coroutines, data classes, sealed hierarchies, and Android/JVM patterns. Use when writing, reviewing, or structuring Kotlin code.
category: development
---

# Kotlin Pro

## Overview

Kotlin's pitch — **a pragmatic, null-safe, concise language for the JVM and Android** — is
delivered through its type system and coroutines. Professional Kotlin means using null safety as
designed (not fighting it with `!!`), modeling with data classes and sealed hierarchies, writing
suspend functions instead of callback chains, and keeping the functional sugar readable rather
than clever.

The through-line: concise but explicit — Kotlin brevity should clarify, never obscure.

## When to use

- Writing or reviewing Kotlin for idiom and safety (JVM, Android, or Multiplatform).
- Designing with null safety, data classes, and sealed types.
- Using coroutines and Flow for async work.
- Structuring Android apps (ViewModel, repositories, DI).
- Setting up testing, linting (detekt), and CI for Kotlin.

## Core concepts

- **Null safety is the point.** Nullable (`String?`) vs non-null (`String`) is a compile-time
  contract. Use safe calls (`?.`), Elvis (`?:`) with meaningful defaults or early returns, and
  `let`/`also` scoping deliberately. `!!` is a bug with a timer — each one needs a justification.
- **Data classes for data.** `data class` gives equals/hashCode/copy/destructuring for free.
  Immutable (`val`) by default; `copy()` for variations. Perfect for DTOs, UI state, and domain
  values — stop writing Java-style POJOs.
- **Sealed hierarchies for states.** `sealed interface UiState` with `data object Loading`,
  `data class Content(...)`, `data class Error(...)` — then `when` is exhaustive and the compiler
  enforces handling every case. This pattern alone eliminates a huge class of UI bugs.
- **Coroutines, structured.** `suspend` functions for async work; `viewModelScope`/`lifecycleScope`
  on Android so cancellation follows the lifecycle; `Flow` for streams of values, `StateFlow` for
  observable state. Never `GlobalScope.launch` — unstructured concurrency leaks.
- **Extension functions with restraint.** Great for domain-specific readability
  (`String.toSlug()`), terrible as dumping grounds. Keep them discoverable (file per domain) and
  avoid shadowing stdlib names.
- **Idiomatic stdlib.** `let`/`run`/`apply`/`also`/`with` — learn which returns what (`apply`/`also`
  return receiver; `let`/`run` return lambda result). Scope functions clarify *intent* when used
  well and obfuscate when chained thoughtlessly.

## Practical workflow

1. **Model with types.** Data classes immutable, sealed interfaces for states/results, enums for
   fixed sets. Nullability explicit at every boundary.
2. **Structure Android apps in layers.** UI (Compose/Views, dumb) → ViewModel (state holder,
   survives config change) → Repository (single source of truth, mediates sources) → Data sources
   (network/DB). DI (Hilt/Koin) wires it; manual DI is fine for small apps.
3. **Write coroutines structurally.** `suspend` all the way down for I/O; dispatchers explicit
   (`Dispatchers.IO` for blocking I/O); `Flow` with proper sharing (`stateIn`/`shareIn`) for
   hot streams; handle cancellation cooperatively (check `isActive` in long loops).
4. **Test the logic.** JUnit 5 + Turbine for Flows, MockK for mocks, coroutines test dispatcher
   for deterministic async tests. Test ViewModels and repositories; keep Android-framework
   dependencies behind interfaces.
5. **Lint and format.** ktlint or Spotless for formatting (non-negotiable in CI), detekt for
   complexity/smell rules tuned to the team — not every default rule.
6. **Mind the platform.** On Android: don't do I/O on main, respect lifecycle, test on low-end
   devices; on JVM: coroutines over raw threads, structured logging, graceful shutdown.

Idiomatic snippets:

```kotlin
// Sealed UI state + exhaustive when
sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Content<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}

fun render(state: UiState<List<Order>>) = when (state) {
    is UiState.Loading -> showSpinner()
    is UiState.Content -> showOrders(state.data)
    is UiState.Error -> showError(state.message)
}

// Repository with Flow, single source of truth
class OrderRepository(private val api: OrderApi, private val dao: OrderDao) {
    fun orders(): Flow<List<Order>> = dao.observe()
        .onStart { refresh() }
    private suspend fun refresh() { /* fetch → cache → dao.insert */ }
}
```

## Common pitfalls

- **`!!` everywhere.** Defeats the entire language. If you're sure it's non-null, prove it to the
  compiler (check + smart cast) instead of asserting blindly.
- **`GlobalScope.launch`.** Fire-and-forget coroutines that outlive their purpose, leak resources,
  and crash after the screen is gone. Always scope to a lifecycle.
- **Blocking in coroutines.** Calling blocking I/O on `Dispatchers.Default` starves the shared
  pool. Use `Dispatchers.IO` or `withContext` appropriately.
- **Mutable shared state across coroutines.** `var` mutated from multiple coroutines without
  synchronization — the same race conditions Java had, now with nicer syntax. Use actors,
  `Mutex`, or confined state.
- **Over-chained scope functions.** `foo?.let { it.bar().also { ... }.run { ... } }` — write it
  as statements when the chain stops clarifying. Brevity ≠ readability.
- **Data class misuse.** Mutable `var` fields in data classes break equals/hashCode contracts;
  data classes with no real data (behavior-only) should be regular classes or objects.
- **Leaking Android framework into domain.** `Context` in repositories, Android classes in pure
  logic — untestable and unportable. Keep the domain pure; adapt at the edges.
