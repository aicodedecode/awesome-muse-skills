---
name: jetpack-compose-pro
description: Professional Jetpack Compose: declarative UI, state hoisting, side effects, navigation, and performance. Use when writing, reviewing, or structuring Compose apps.
category: development
---

# Jetpack Compose Pro

## Overview

Jetpack Compose brings **declarative UI to Android**: composables describe the UI for the current
state, and the runtime recomposes surgically. Professional Compose means mastering state hoisting,
understanding recomposition (what triggers it, how to minimize it), handling side effects with the
effect handlers, and structuring apps in the now-standard UI-state-holder layers.

The through-line: state hoisted, events up, recomposition cheap — and side effects in their proper handlers.

## When to use

- Writing or reviewing Jetpack Compose code.
- Designing state ownership (hoisting) and unidirectional data flow.
- Debugging recomposition issues (too much, too little, loops).
- Structuring Compose apps (ViewModels, navigation, layers).
- Optimizing Compose performance.

## Core concepts

- **State hoisting.** State lives in the caller; stateless composables receive value + onChange
  lambda. `var text by remember { mutableStateOf("") }` at the right level — hoist until shared,
  no higher. This makes composables reusable, previewable, and testable.
- **Unidirectional data flow (UDF).** State flows down, events flow up. ViewModel exposes
  `StateFlow<UiState>`; UI renders it; user actions call ViewModel methods. The screen is a pure
  function of UiState — predictable and testable.
- **Recomposition, understood.** Recomposes when state it reads changes; skips when inputs are
  stable/unchanged. Stable types (`@Stable`, immutable data classes) enable skipping; unstable
  params (like lambdas capturing changing values, or `List` without stability) defeat it. The
  Layout Inspector's recomposition counts show the truth.
- **Side effects have handlers.** `LaunchedEffect(key)` for coroutines tied to composition,
  `rememberUpdatedState` for capturing latest values, `DisposableEffect` for cleanup-needed
  subscriptions, `derivedStateOf` for expensive derivations (not recomputing on every
  recomposition). Raw `rememberCoroutineScope().launch` in event handlers only — never fire
  coroutines directly in composition.
- **ViewModel as state holder.** Survives config changes, exposes UiState via StateFlow,
  handles business logic and data. UI layer stays dumb; `collectAsStateWithLifecycle()` bridges
  to composition lifecycle-safely.
- **Navigation Compose.** Type-safe routes (Kotlin serialization), navigation as events from
  ViewModel (one-shot events via Channel/SharedFlow consumed once), deep links declared in the
  graph. Back stack is framework-owned; don't duplicate it.

## Practical workflow

1. **Model UiState.** Sealed interface per screen (`Loading`, `Content(data)`, `Error(msg)`) in
   the ViewModel; single `StateFlow` exposed. The UI switches on it exhaustively.
2. **Hoist state deliberately.** Screen-level state in ViewModel; widget-local (text field input,
   expanded toggles) in `remember` at the lowest composable that needs it.
3. **Write pure composables.** No side effects in composition; params in, UI out; `@Preview`
   for every reusable component (previews are documentation and regression checks).
4. **Handle effects correctly.** `LaunchedEffect` for data loading on entry (or better: ViewModel
   init), `DisposableEffect` for listeners, `derivedStateOf` for expensive computed values like
   filtered lists.
5. **Test the layers.** Unit-test ViewModels with Turbine (StateFlow assertions) and test
   dispatchers; Compose UI tests for interaction (performClick, assertIsDisplayed); keep
   Android-framework deps behind interfaces.
6. **Profile recomposition.** Layout Inspector recomposition counts; fix hotspots: stabilize
   types, hoist lambdas with `remember`, defer reads (`{ state.value }` lambdas instead of
   passing values deep), and use `LazyColumn` with keys for lists.

Idiomatic snippets:

```kotlin
// ViewModel: single UiState, events as methods
@HiltViewModel
class OrdersViewModel @Inject constructor(
    private val repo: OrderRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<OrdersUiState>(OrdersUiState.Loading)
    val uiState: StateFlow<OrdersUiState> = _uiState.asStateFlow()

    init { refresh() }
    fun refresh() = viewModelScope.launch {
        _uiState.value = OrdersUiState.Loading
        _uiState.value = try {
            OrdersUiState.Content(repo.orders().first())
        } catch (e: Exception) {
            OrdersUiState.Error("Couldn't load orders")
        }
    }
}

// Screen: pure function of UiState
@Composable
fun OrdersScreen(vm: OrdersViewModel = hiltViewModel(), onOrderClick: (String) -> Unit) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    when (val s = state) {
        is OrdersUiState.Loading -> LoadingSpinner()
        is OrdersUiState.Content -> OrderList(orders = s.orders, onOrderClick = onOrderClick)
        is OrdersUiState.Error -> ErrorView(message = s.message, onRetry = vm::refresh)
    }
}
```

## Common pitfalls

- **State too high or too low.** App-level state in composables (lost on nav) or text-field
  state in ViewModels (overkill + test friction). Hoist to the right level.
- **Unstable parameters killing skip.** Passing `List` (unstable) or capturing lambdas that
  change every recomposition — everything recomposes always. Stabilize: immutable wrappers,
  `remember`ed lambdas, or pass lambdas that don't capture changing state.
- **Side effects in composition.** Launching coroutines or mutating state directly in composable
  bodies — runs unpredictably. Effect handlers exist for this.
- **Reading state too eagerly.** Passing `state.value` deep into the tree recomposes everything
  below on change; passing `{ state.value }` lambdas defers reads to where needed. Defer reads
  past composition boundaries.
- **Events as state.** Navigation or snackbar "events" stored in StateFlow get re-consumed on
  recomposition/config change. One-shot events via Channel/SharedFlow, consumed once.
- **No keys in lazy lists.** `LazyColumn` items without keys — state (text fields, checkboxes)
  attaches to positions, not items, scrambling on reorder. `key = { it.id }` always.
- **God composables.** 400-line screen composables doing layout + logic + effects. Extract:
  stateless UI components (previewable), ViewModel for logic, effects in handlers.
