---
name: scala-pro
description: Idiomatic Scala: functional-OO blend, case classes, pattern matching, effect systems, and build tooling. Use when writing, reviewing, or structuring Scala applications.
category: development
---

# Scala Pro

## Overview

Scala's strength — **a principled blend of functional and object-oriented programming on the JVM** —
is also its risk: the language lets you write Java-with-sugar, Haskell-on-the-JVM, or anything in
between. Professional Scala means picking a coherent style for the codebase (and sticking to it):
immutable data with case classes, `Option`/`Either` instead of nulls/exceptions for expected cases,
for-comprehensions for sequencing, and an effect story the team understands.

The through-line: expressive types, immutable data, explicit effects — and consistency across the codebase.

## When to use

- Writing or reviewing Scala for idiom (Scala 2.13 or 3).
- Modeling domains with case classes, ADTs, and pattern matching.
- Choosing effect management (Future, cats-effect, ZIO).
- Structuring Scala projects (sbt, modules, layering).
- Debugging implicits/givens, type inference, or performance issues.

## Core concepts

- **Case classes + ADTs.** `case class` for immutable data (structural equality, pattern matching,
  `copy` for updates); `sealed trait` hierarchies for variants with exhaustive matching. This pair
  models most domains better than any framework.
- **Option/Either/Try over nulls and exceptions.** `Option` for absence, `Either[E, A]` for
  failures as values, exceptions only for the truly exceptional. For-comprehensions sequence these
  cleanly — learn to read and write them fluently.
- **Immutability by default.** `val` not `var`; immutable collections (`List`, `Vector`, `Map`);
  transformations return new values. `var` is occasionally pragmatic (local accumulators, perf
  hotspots) — never shared mutable state.
- **Effects, one story.** `Future` for simple async interop (mind the ExecutionContext); cats-effect
  `IO` or ZIO for principled effect management with resource safety (`Resource`/`ZManaged` for
  acquire-release). Don't mix raw Futures and IO in the same codebase without a clear boundary.
- **Implicits (Scala 2) / givens (Scala 3):** powerful, dangerous. Use for typeclass instances and
  DI-ish context passing; avoid implicit conversions (Scala 3 wisely makes them explicit). When a
  newcomer can't find where a value comes from, you've overused them.
- **Pattern matching as control flow.** Destructure in matches, extract with custom extractors
  sparingly, and let exhaustiveness checking (`-Xfatal-warnings` + sealed traits) catch missing cases.

## Practical workflow

1. **Scaffold:** sbt project, Scala 3 (or 2.13 for legacy ecosystems), scalafmt enforced in CI,
   `-Xfatal-warnings` with `-Wunused` to keep the codebase honest.
2. **Model the domain.** Sealed traits + case classes; smart constructors (`object` factories
   validating input) where invariants matter; no nulls crossing boundaries.
3. **Choose the effect story early.** Team decision, documented: plain Futures, cats-effect IO, or
   ZIO. Consistency beats optimality — a mixed codebase pays both ecosystems' complexity costs.
4. **Structure in layers.** Domain (pure, no effects) → services (effectful orchestration) →
   interpreters/adapters (DB, HTTP, messaging). The domain stays testable without mocks.
5. **Test behaviorally.** ScalaTest or munit for unit tests, property-based (ScalaCheck) for
   invariants, and integration tests with real dependencies (testcontainers) at the adapter layer.
6. **Watch compile times and binary weight.** Scala compiles slowly — modularize (sbt subprojects),
   avoid implicit-heavy megatraits, and profile before blaming the language.

Idiomatic snippets:

```scala
// ADT + exhaustive matching
sealed trait OrderStatus
object OrderStatus:
  case object Pending extends OrderStatus
  case object Paid extends OrderStatus
  case object Shipped extends OrderStatus
  case object Cancelled extends OrderStatus

def canCancel(s: OrderStatus): Boolean = s match
  case OrderStatus.Pending | OrderStatus.Paid => true
  case OrderStatus.Shipped | OrderStatus.Cancelled => false

// For-comprehension sequencing Either
def placeOrder(cmd: PlaceCmd): Either[OrderError, Order] =
  for
    cart  <- validateCart(cmd.cart)
    priced <- priceCart(cart)
    order <- persist(priced)
  yield order
```

## Common pitfalls

- **Style schizophrenia.** Half the codebase in Java-style mutable OO, half in Haskell-style
  point-free. Agree on the team's Scala dialect (document it) and review for consistency.
- **Exceptions for expected failures.** Throwing for validation errors or "not found" in normal
  flow. `Either`/`Option` for expected cases; exceptions for programmer errors and truly
  exceptional infrastructure failures.
- **`null` leaking in.** From Java interop or careless code — wrap Java APIs at the boundary
  (`Option(x)`), never let null flow through Scala code.
- **Implicit/given soup.** Instances and conversions that make code magical and undebuggable.
  Explicit is better than implicit when the reader can't trace the source.
- **Blocking in Futures.** Calling blocking I/O inside the default ExecutionContext starves it.
  Dedicated (blocking) context for blocking calls, or an effect system that manages shifting.
- **Over-abstracted typelevel gymnastics.** Shapeless/HList wizardry and 5-parameter typeclasses
  for business CRUD. The type system serves the domain — when the types are harder than the
  problem, simplify.
- **Ignoring compile-time cost.** Massive implicit resolution and macro expansion making builds
  take 20 minutes. Modularize, reduce implicit scope, and treat build time as a team tax.
