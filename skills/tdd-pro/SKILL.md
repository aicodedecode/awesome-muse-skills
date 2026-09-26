---
name: tdd-pro
description: Test-driven development done right: red-green-refactor rhythm, test design, and knowing when TDD fits. Use when adopting TDD, writing tests first, or coaching teams.
category: development
---

# TDD Pro

## Overview

TDD — **red (failing test), green (minimal code), refactor** — is a design discipline disguised as
a testing practice. Writing the test first forces you to design the API before the implementation,
keeps scope minimal (only code the test demands), and leaves a regression suite as a byproduct.
Done well, it produces loosely-coupled, well-factored code; done ritualistically, it produces
brittle tests and resentment.

This skill covers the rhythm, the test-design judgment that makes it work, and the honesty about
where TDD shines and where it doesn't.

## When to use

- Adopting TDD for a team or project.
- Writing new features or fixing bugs test-first.
- Coaching developers struggling with TDD (slow, brittle tests, "testing implementation").
- Deciding where TDD applies vs where other approaches fit better.
- Reviewing test-first code for design quality.

## Core concepts

- **The rhythm: red → green → refactor.** Red: write a small failing test describing one behavior.
  Green: write the *minimum* code to pass (even if ugly). Refactor: clean up with the test as a
  safety net. The refactor step is not optional — skipping it is how TDD codebases get messy.
- **Tests as design tool.** Writing the test first means designing the API from the caller's
  perspective: what's the simplest interface that expresses this behavior? Awkward tests signal
  awkward APIs — listen to that signal.
- **Baby steps.** Each cycle: one small behavior, minutes not hours. If the red step takes 30
  minutes, the step is too big — split the behavior. Small steps keep you in control and make
  failures easy to diagnose.
- **Test behavior, not implementation.** Assert observable outcomes, not internal calls. Tests
  coupled to implementation break on every refactor and teach developers to delete tests —
  the opposite of TDD's purpose.
- **The transformation priority premise (pragmatic).** Prefer simple transformations: constant →
  scalar → array → conditional → loop → … Start with the simplest code that passes and let
  failing tests *pull* generality out. Generalize on the third case, not the first.
- **Where TDD fits best.** Algorithmic logic, domain rules, parsers, validation, APIs with clear
  contracts. Where it's weaker: exploratory UI work, spikes into unknown territory (spike first,
  then TDD the discovered design), and glue code with no logic worth specifying.

## Practical workflow

1. **Frame the behavior.** One sentence: "When X, the system does Y." If you can't state it
   simply, you don't understand it well enough to test-first yet.
2. **Red.** Write the smallest test for the simplest case (the degenerate/happy path). Watch it
   fail for the *right* reason (not a typo — a genuinely missing behavior).
3. **Green.** Minimal implementation — hardcode if that's the minimum. Resist building the
   general solution; the next tests will demand it.
4. **Refactor.** Remove duplication (including test duplication via helpers/builders), clarify
   names, extract concepts. Run the suite after every change — it should stay green.
5. **Repeat, triangulating.** Add the next case that forces generality (empty → one → many;
   valid → boundary → invalid). Let the tests pull the design forward.
6. **Review the suite as design feedback.** Painful tests (huge setup, mocking everything) =
   painful design. Refactor the production code until the tests are easy to write — that's TDD
   doing its real job.

Example rhythm — order discount:

```text
RED:    test("no discount for regular customer") → fails (no code)
GREEN:  return 0
REFACTOR: (nothing to clean yet)
RED:    test("10% for gold customer") → fails
GREEN:  if gold: return total * 0.1 else: return 0
REFACTOR: extract customer.tier check; name clearly
RED:    test("gold + coupon stacks to 15%") → fails
GREEN:  minimal stacking logic
REFACTOR: DiscountPolicy object emerges — the design the tests pulled out
```

## Common pitfalls

- **Testing implementation.** Mocking every collaborator and asserting call sequences — refactors
  break tests, developers stop refactoring, design rots. Test outcomes through public APIs.
- **Skipping refactor.** Piles of green-but-ugly code with duplicated test setup. The refactor
  step is where TDD's design benefit compounds — never skip it.
- **Steps too big.** 45-minute red phases mean you're designing in your head, not in tests.
  Smaller behaviors, faster cycles.
- **TDD for exploration.** Trying to test-first through genuinely unknown territory (new library,
  unclear requirements). Spike first to learn, throw the spike away, then TDD the real thing.
- **Brittle test data.** Tests depending on "today's date," random IDs, or shared fixtures that
  drift. Control time, generate data per test, isolate.
- **100% dogma.** TDD-ing config files, trivial getters, and framework glue. Apply TDD where
  there's *behavior worth specifying* — judgment, not ritual.
- **Slow suites killing the rhythm.** If the suite takes 10 minutes, nobody runs it per cycle.
  Keep unit tests in milliseconds; separate slow integration tests. Fast feedback is the rhythm's
  heartbeat.
