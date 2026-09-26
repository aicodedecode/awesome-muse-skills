---
name: design-patterns-pro
description: Apply classic design patterns judiciously: when each pattern fits, modern alternatives, and anti-patterns. Use when designing object interactions or reviewing pattern usage.
category: development
---

# Design Patterns Pro

## Overview

Design patterns are **a shared vocabulary for recurring design problems** — not a checklist to
apply. The professional skill isn't knowing 23 patterns; it's recognizing which problem you have,
picking the simplest pattern that solves it, and knowing when modern language features made a
pattern unnecessary.

The through-line: patterns serve the design — if you're contorting code to fit a pattern, you have
it backwards.

## When to use

- Designing how objects collaborate in unfamiliar code.
- Reviewing code for pattern misuse or over-engineering.
- Naming a design ("this is basically Observer") to communicate it.
- Refactoring toward a cleaner structure with a known shape.
- Learning to see past pattern names to the underlying forces.

## Core concepts

- **Patterns by purpose.** Creational (how objects are made: Factory, Builder, Singleton —
  Singleton almost always wrong), Structural (how objects compose: Adapter, Decorator, Facade,
  Composite), Behavioral (how objects interact: Observer, Strategy, Command, State, Template
  Method). Classify the *problem* first; the pattern follows.
- **The essential dozen (modern take).**
  - *Strategy* — interchangeable algorithms (sorting, pricing rules); often just functions/lambdas now.
  - *Observer* — subscribe/notify; language-level in reactive frameworks, event emitters elsewhere.
  - *Decorator* — layered behavior (middleware, Python decorators); prefer composition.
  - *Adapter* — translate interfaces at boundaries (anti-corruption layers).
  - *Facade* — simplify a subsystem's interface for common use.
  - *Factory* — when construction logic is non-trivial (parsing, DI containers); not for every `new`.
  - *Builder* — complex objects with many optional parts (fluent APIs, test fixtures).
  - *Command* — operations as objects (undo, queues, scheduling).
  - *State* — behavior varying by state; often replaceable by state machines or polymorphism.
  - *Template Method* — skeleton algorithm with hooks; often better as composition + strategy now.
  - *Composite* — tree structures treated uniformly (UI trees, file systems).
  - *Repository* — collection-like abstraction over persistence (a DDD staple).
- **Patterns dissolved by language features.** Strategy → first-class functions; Observer →
  signals/reactive primitives; Singleton → DI containers or modules; Visitor → pattern matching;
  Iterator → for-of/generators. Modern languages absorbed many GoF patterns — use the feature,
  not the ceremony.
- **Composition over inheritance.** The meta-pattern behind half the catalog: prefer composing
  small behaviors over deep hierarchies. Most pattern misuse is inheritance where composition fit.

## Practical workflow

1. **Name the problem, not the pattern.** "We need to swap pricing algorithms at runtime" —
   that's the requirement. *Then* notice it's Strategy-shaped.
2. **Start with the simplest thing.** Functions before Strategy objects; a conditional before a
   State hierarchy; direct calls before Observer. Introduce the pattern at the *second* or *third*
   occurrence of the need.
3. **Apply minimally.** Implement the pattern's essence, not its UML diagram. A Strategy can be
   a function parameter — it doesn't need an abstract class and three subclasses on day one.
4. **Check the modern alternative.** Could a lambda, a match expression, or a framework primitive
   do this with less machinery? If yes, do that.
5. **Name it when you use it.** If the design genuinely is Observer, say so in code/docs — the
   shared vocabulary is the point. Future readers pattern-match on names.
6. **Review for pattern abuse.** AbstractFactoryFactory energy: patterns stacked on patterns,
   speculative generality ("we might need more strategies later"), and patterns applied where a
   plain function sufficed.

Pattern selection guide:

```text
Varying algorithm at runtime      → Strategy (or just a function parameter)
Reacting to state changes         → Observer / signals / events
Adding behavior transparently     → Decorator (middleware, wrappers)
Incompatible interfaces           → Adapter (at system boundaries)
Complex construction              → Builder (many optionals) / Factory (non-trivial creation)
Undoable/queueable operations     → Command
Behavior depends on state         → State (or explicit state machine)
Tree structures                   → Composite
Simplifying a subsystem           → Facade
```

## Common pitfalls

- **Pattern-first design.** "Let's use Abstract Factory here" before understanding the problem.
  Patterns are solutions looking for problems — make sure you have the problem first.
- **Over-engineering via patterns.** Full GoF ceremony for one variation that an `if` or function
  parameter would handle. YAGNI applies to patterns too.
- **Singleton abuse.** Global mutable state with a fancy name — untestable, hidden coupling.
  DI, modules, or explicit parameters instead. (True singletons: rare — loggers, maybe.)
- **Inheritance-heavy patterns.** Template Method hierarchies five deep, fragile base classes.
  Composition-based alternatives (strategy injection, hooks) are almost always more flexible.
- **Ignoring language features.** Hand-rolled Observer with manual subscription lists in a
  signals-based framework; Visitor pattern where pattern matching exists. Use the language.
- **Pattern names as thought-terminating.** "It's a Factory, don't question it" — the name should
  *start* the design conversation (does it fit? is it minimal?), not end it.
- **Not refactoring toward patterns.** The flip side: duplicated conditionals that *scream*
  Strategy/State, left to rot because "patterns are over-engineering." Let the need emerge, then
  name and apply the pattern cleanly.
