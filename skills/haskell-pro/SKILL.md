---
name: haskell-pro
description: Idiomatic Haskell: pure functional design, type-driven modeling, monad stacks, and principled effects. Use when writing, reviewing, or structuring Haskell programs.
category: development
---

# Haskell Pro

## Overview

Haskell's promise — **if it compiles, it probably works** — comes from purity, laziness, and an
expressive type system. Professional Haskell means modeling with algebraic data types so illegal
states are unrepresentable, keeping the core pure and pushing effects to the edges, and choosing
effect-management strategies (mtl, ReaderT patterns, or effect systems) that the team can actually
maintain.

The through-line: types first, effects explicit, and elegance in service of correctness — not the
other way around.

## When to use

- Writing or reviewing Haskell for idiom and correctness.
- Modeling domains with ADTs, newtypes, and smart constructors.
- Managing effects (choosing between mtl, ReaderT, effect libraries).
- Structuring Haskell projects (Cabal/Stack, modules, layering).
- Debugging laziness issues (space leaks) or type errors.

## Core concepts

- **ADTs model the domain.** Sum types for variants, product types for combinations, newtypes for
  distinguishing same-shaped values (`newtype UserId = UserId Int`). Smart constructors
  (unexported constructors + validating functions) make invalid values unconstructible.
- **Pure core, effectful shell.** Business logic as pure functions (trivially testable, no mocks);
  `IO` only at the edges (parsing input, hitting network/DB). The bigger the pure core, the more
  the compiler verifies.
- **Effects, chosen deliberately.** Simple apps: `ReaderT Env IO` with `MonadReader`/`MonadIO`
  constraints. Larger: mtl-style typeclasses or an effect system (effectful/polysemy) — but pick
  ONE and be consistent; mixing effect paradigms is worse than any single choice.
- **Total functions.** Avoid partial functions (`head`, `fromJust`, inexhaustive patterns) —
  they're runtime crashes wearing type-safe clothes. `-Wall` flags inexhaustive patterns; treat
  those warnings as errors.
- **Laziness: power and peril.** Laziness enables beautiful composition (infinite structures,
  streaming via folds), but space leaks come from accumulating unevaluated thunks. Learn to spot
  them: strict folds (`foldl'`), bang patterns, and profiling (`+RTS -p`) when memory grows
  unexpectedly.
- **Typeclasses for overloading, not OO.** `Eq`, `Ord`, `Show` derived; custom classes for genuine
  ad-hoc polymorphism. Don't mimic OO hierarchies — Haskell's abstraction tools are types and
  functions, not inheritance.

## Practical workflow

1. **Scaffold:** Cabal (or Stack) project, GHC 9.x, `-Wall -Werror` in CI, `ormolu`/`fourmolu`
   for formatting, HLS for IDE support.
2. **Model the domain in types first.** ADTs for states, newtypes for IDs and units, smart
   constructors for invariants. Write the types before the functions — the functions often write
   themselves.
3. **Keep functions small and total.** Pattern match exhaustively; return `Maybe`/`Either` for
   partiality instead of crashing; use `Either` with descriptive error types (not `String`) for
   domain errors.
4. **Structure the app:** `src/Domain/` (pure logic), `src/App/` (effectful orchestration),
   `app/Main.hs` thin. Effects flow inward: `main` wires dependencies, pure core decides.
5. **Test the pure core heavily.** HSpec/Tasty for unit tests, QuickCheck/Hedgehog property tests
   for invariants ("parse . render == id", "sorted output is ordered") — property testing is
   Haskell's killer testing feature; use it.
6. **Profile before optimizing.** Laziness makes performance non-obvious; `criterion` for
   benchmarks, RTS profiling for space leaks. Fix strictness issues with data, not folklore.

Idiomatic snippets:

```haskell
-- Newtype + smart constructor: invalid values unrepresentable
newtype Email = Email Text deriving (Eq, Show)

mkEmail :: Text -> Either EmailError Email
mkEmail t
  | Text.null t        = Left EmptyEmail
  | not ("@" `Text.isInfixOf` t) = Left MissingAtSign
  | otherwise          = Right (Email t)

-- Total function with explicit failure, not partial head
safeHead :: [a] -> Maybe a
safeHead []    = Nothing
safeHead (x:_) = Just x

-- Pipeline of pure transforms; IO only at edges
processOrder :: Order -> Either OrderError Invoice
processOrder = validate >=> price >=> toInvoice
```

## Common pitfalls

- **Stringly-typed code.** `String` for everything — slow (linked lists!) and meaningless.
  `Text` for text, newtypes for domain concepts, ADTs for variants.
- **Partial functions.** `head`, `tail`, `fromJust`, `!!` — each a crash waiting for the wrong
  input. Total alternatives exist; use them.
- **Space leaks.** Lazy accumulation in folds and long-lived thunks in data structures. Default
  to strict folds (`foldl'`), strict fields (`!`) in hot data types, and profile memory.
- **Over-monadification.** Wrapping pure logic in `IO` or a transformer stack "just in case."
  Pure functions are testable and composable — keep them pure until effects are genuinely needed.
- **Effect-system tourism.** Adopting the trendiest effect library per module. Pick one approach
  for the codebase and be boring about it.
- **Unreadable point-free golf.** `(f . g . h)` chains and operator soup that take ten minutes to
  parse. Point-free is a tool for clarity, not a contest — name intermediate steps when it helps.
- **Ignoring -Wall.** Inexhaustive-pattern and unused-import warnings are bug reports from the
  compiler. `-Werror` in CI; fix, don't suppress.
