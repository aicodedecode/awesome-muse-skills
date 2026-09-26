---
name: testing-pro
description: Professional testing craft: test design, doubles, boundaries, maintainable suites, and testing strategy. Use when writing tests, designing test suites, or improving testing practice.
category: development
---

# Testing Pro

## Overview

Good tests — **fast, deterministic, behavior-focused, and maintainable** — are a design tool and a
safety net. Bad tests — slow, flaky, implementation-coupled — are a tax everyone pays. This skill
covers the craft: designing tests that specify behavior, using test doubles judiciously, structuring
suites for speed and clarity, and keeping the suite trustworthy over time.

The through-line: tests should make change *safer*, not harder — if tests fight refactoring, the
tests are wrong.

## When to use

- Writing unit, integration, or contract tests.
- Designing test strategy for a project or team.
- Fixing flaky, slow, or brittle test suites.
- Choosing test doubles (mocks, stubs, fakes) appropriately.
- Reviewing tests for quality and maintainability.

## Core concepts

- **Test behavior, not implementation.** Assert observable outcomes through public APIs. Tests that
  assert internal call sequences break on every refactor and train developers to delete tests.
  The test should survive a complete internal rewrite that preserves behavior.
- **The test pyramid, pragmatically.** Many fast unit tests (logic), fewer integration tests
  (seams: DB, APIs, queues — with real dependencies where feasible), few end-to-end tests
  (critical journeys). Invert it and you get slow, flaky, expensive suites.
- **Doubles with discipline.** Dummy (placeholder), stub (canned responses), fake (working
  implementation: in-memory DB), mock (verify interactions). Prefer fakes and stubs; reserve mocks
  for *verifying interactions that matter* (was the email sent?) — mocking everything couples
  tests to implementation.
- **Boundaries, not internals.** Test at module boundaries; don't unit-test private methods
  directly (test them through the public API). If private logic is hard to reach, that's design
  feedback — extract it.
- **Deterministic always.** No network, no wall-clock time (inject clocks), no randomness
  (seeded), no shared mutable state between tests. Each test sets up its world and tears it down.
  Flaky tests get quarantined immediately — a flaky suite is an ignored suite.
- **AAA and readability.** Arrange (set up), Act (one action), Assert (outcome). Test names
  describe behavior: `rejects_expired_coupon` not `test_42`. A failing test should tell you *what
  broke* without opening the implementation.

## Practical workflow

1. **Design the test with the code.** For new behavior: what's the observable contract? Write the
   test to specify it (TDD rhythm when it fits); for existing code: characterization tests first.
2. **Structure the suite.** `tests/unit/` (fast, no I/O), `tests/integration/` (real DB/services
   via testcontainers or dedicated instances), `tests/e2e/` (critical journeys only). Separate
   runners; unit suite runs in seconds on every save.
3. **Build test data deliberately.** Builders/factories (not shared fixtures) creating minimal
   valid objects; each test owns its data; database tests in transactions rolled back after.
4. **Choose doubles per seam.** External services → fakes or contract-tested stubs; time →
   injected clocks; randomness → seeds. Mock sparingly, at true boundaries, for interaction
   verification.
5. **Keep it fast and green.** Parallelize, split slow suites (PR-fast vs nightly-full), and
   treat red builds as stop-the-line events. Measure suite time like a product metric.
6. **Maintain ruthlessly.** Delete obsolete tests, fix flaky ones within days (quarantine
   immediately), and refactor test helpers like production code — test code is code.

Test quality checklist:

```text
[ ] Tests behavior through public API, not internals
[ ] Name describes the behavior being verified
[ ] Deterministic: no network, real time, randomness, or shared state
[ ] Fast: unit suite runs in seconds
[ ] Each test independent: order doesn't matter, parallel-safe
[ ] Failure message points at the broken behavior
[ ] Doubles only at true boundaries; fakes preferred over mocks
```

## Common pitfalls

- **Testing implementation details.** Asserting private method calls or internal state — every
  refactor breaks the suite, and developers learn to fear refactoring. Test the contract.
- **Mock everything.** Mocking your own domain objects and the database layer — you're testing
  the mocks. Mock at external boundaries; use real collaborators internally.
- **Shared fixtures.** One `seed.sql` mutated by 50 tests — order-dependent flakes and mystery
  failures. Factories per test, isolated data.
- **Flaky tests tolerated.** "Just rerun it" — the suite's authority dies by a thousand reruns.
  Quarantine on first flake; fix or delete within days.
- **Slow suites.** 20-minute unit suites that developers skip. Split, parallelize, fake the slow
  bits — speed is a feature of the suite.
- **No negative tests.** Only happy paths tested — the bugs live in invalid inputs, failures, and
  edge cases. Every feature earns failure-case tests.
- **Coverage as a target.** 100% mandates produce tests of getters while critical paths go
  untested. Coverage finds untested *areas*; judgment decides what matters.
