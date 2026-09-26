---
name: refactoring-pro
description: Systematic refactoring: safe transformations, strangler patterns, characterization tests, and large-scale change management. Use when improving code structure without changing behavior.
category: development
---

# Refactoring Pro

## Overview

Refactoring — **improving structure without changing behavior** — is how codebases stay malleable.
The professional discipline is making it *safe and systematic*: small behavior-preserving steps,
tests as the safety net (characterization tests when none exist), and strategies for large-scale
change (strangler fig, branch by abstraction) that don't require freezing the world.

The through-line: never refactor and change behavior in the same step — and prove it with tests.

## When to use

- Cleaning up code that's hard to understand or change.
- Preparing code for a new feature (refactor first, then extend).
- Paying down tech debt systematically.
- Migrating architectures, frameworks, or libraries incrementally.
- Reviewing refactors for safety and scope discipline.

## Core concepts

- **Two hats, never both.** Refactoring (structure changes, behavior identical) vs feature work
  (behavior changes). Wear one hat at a time; mixed commits are unreviewable and unrevertable.
  If you spot a behavior improvement while refactoring, note it and do it separately.
- **Small, named transformations.** Extract function/method, rename, move, inline, replace
  conditional with polymorphism, introduce parameter object — each a discrete, reviewable step.
  Big-bang rewrites fail; sequences of small safe steps succeed.
- **Tests as the safety net.** Existing tests must pass before *and* after every step. No tests?
  Write **characterization tests** first: capture current behavior (even buggy — document it),
  then refactor against them. Golden-master tests for legacy code with unclear specs.
- **Code smells as signals.** Long methods, large classes, duplicated logic, long parameter lists,
  feature envy (method more interested in another class), primitive obsession, shotgun surgery
  (one change touches ten files) — each smell suggests specific refactorings.
- **Strangler fig for large migrations.** New implementation grows alongside the old behind an
  abstraction; traffic/functionality migrates incrementally; the old is removed last. For
  frameworks, architectures, and monolith decomposition — the only migration strategy that
  consistently works.
- **Branch by abstraction.** Introduce an abstraction over the old implementation, build the new
  behind it, switch the binding, delete the old. Enables incremental replacement *within* a
  codebase without long-lived feature branches.

## Practical workflow

1. **Establish the safety net.** Run existing tests (all green?). If coverage is thin, write
   characterization tests for the area you're touching — capture behavior, lock it in.
2. **Identify the target.** What's the specific pain? (Can't add feature X without touching 12
   files → the seam is wrong.) Refactor *toward* enabling something, not toward abstract cleanliness.
3. **Work in tiny steps.** One transformation → run tests → commit. Each commit leaves the code
   working. If a step breaks tests, the step was too big or wasn't behavior-preserving — revert
   and slice smaller.
4. **Follow the smells to structure.** Duplication → extract; long method → extract + compose;
   tangled conditional → polymorphism/strategy; wrong home → move method; primitive soup →
   value objects.
5. **For large changes: strangler.** Put the seam (abstraction/facade/routing) in place first,
   migrate incrementally with both implementations live, monitor, then remove the old. Never a
   flag day if you can avoid it.
6. **Verify and clean.** Full suite green, no behavior change (diff the *behavior*, not just the
   code — run characterization tests), dead code removed, and the commit history tells the story
   in small steps.

Refactoring session checklist:

```text
[ ] Tests green before starting (or characterization tests written)
[ ] One refactoring hat on — no behavior changes mixed in
[ ] Steps small enough that each is obviously safe
[ ] Tests run after every step (automated, fast)
[ ] Commit per step (or per few steps) — revertable history
[ ] No dead code left behind (old paths removed, not commented out)
[ ] Final review: does the structure now make the next change easy?
```

## Common pitfalls

- **Refactoring + features in one diff.** Unreviewable, unrevertable, and the source of "the
  refactor broke something" (it was the feature). Separate commits, separate PRs if needed.
- **No safety net.** Refactoring without tests is just editing. Characterization tests are the
  entry fee for legacy code — write them first.
- **Big-bang rewrites.** "We'll rewrite it properly" — months of parallel work, merge hell, and
  rediscovery of every bug the old code had fixed. Strangler fig instead, always.
- **Refactoring without a reason.** Churning code toward personal taste with no enabling goal.
  Refactor to enable a feature, fix a pain, or pay measured debt — "cleaner" alone isn't a reason.
- **Changing behavior accidentally.** "While I'm here" fixes slipped into a refactor. If the
  characterization test now fails differently, you've changed behavior — split it out.
- **Stopping halfway.** Extracting methods but leaving the 2,000-line class; introducing the
  abstraction but never migrating callers. Half-refactors are worse than none — finish the seam.
- **Premature abstraction during refactor.** Extracting speculative generalizations instead of
  the duplication actually present. Refactor toward the code you have, not the code you imagine.
