---
name: webapp-testing
description: Strategy and practice for testing web applications: test pyramid, critical user journeys, flaky-test control, and CI integration. Use when setting up or improving a web app's test suite.
category: development
---

# Webapp Testing

## Overview

Testing a web application means answering one question reliably: **can a user still do the important
things?** This skill covers the strategy layer — which tests to write, how many of each, how to keep
them fast and trustworthy — and the practice layer: testing critical journeys, controlling flakiness,
and wiring it all into CI so the suite is a gate, not a suggestion.

The goal is a suite developers trust: green means shippable, red means a real problem, and nobody
ignores it.

## When to use

- Setting up testing for a new web application.
- A test suite that's slow, flaky, or routinely ignored.
- Deciding what to test before a launch or major refactor.
- Debugging flaky tests that pass locally and fail in CI.
- Balancing unit, integration, and end-to-end coverage.

## Core concepts

- **The test pyramid (adapted for web).** Many fast unit tests for logic; a solid middle layer of
  integration/API tests for the seams; a small number of end-to-end tests for critical user journeys.
  Invert it (hundreds of E2E tests) and you get a slow, flaky suite nobody trusts.
- **Test the journey, not the implementation.** E2E tests should assert user-visible outcomes ("user
  can check out"), not CSS selectors or internal state. Implementation-coupled tests break on every
  refactor and teach teams to delete tests instead of fixing them.
- **Flakiness is a bug in the test.** A test that fails 5% of the time will be ignored 100% of the
  time. Common causes: timing assumptions (fixed sleeps), shared mutable state, test-order
  dependence, real network calls. Quarantine flaky tests immediately; fix or delete within days.
- **Test data strategy.** Each test creates what it needs and cleans up after itself (or runs in a
  transaction rolled back afterward). Shared seed databases that tests mutate are a flakiness factory.
- **CI as the gate.** Tests run on every PR, in parallel, with artifacts (screenshots, videos,
  traces) on failure. Main-branch protection requires green. A suite that doesn't block merges is
  documentation with extra steps.
- **What "done" means.** Coverage is a side effect, not a target. The target: every critical journey
  has an automated test, every bug fix adds a regression test, and the suite runs in minutes.

## Practical workflow

1. **List critical journeys.** The 5–10 things that must never break (signup, login, checkout,
   core workflow). These get E2E tests first — before anything else.
2. **Layer the suite:**
   - Unit: pure logic, validators, utilities, state reducers — fast, no I/O.
   - Integration/API: endpoints with a real test database — request in, assert response + side effects.
   - E2E: critical journeys in a real browser against a production-like build.
3. **Stabilize the harness.** Dedicated test environment, seeded deterministically; mock only at
   true boundaries (payment gateways, email) — and contract-test the mocks.
4. **Kill flakiness systematically.** Replace sleeps with explicit waits ("wait for element X");
   isolate tests (no shared state); retry only to *detect* flakiness, never to hide it — a test
   that needs retries is a test to fix.
5. **Speed it up.** Parallelize by file, split slow E2E into a nightly job vs a fast PR gate,
   keep the PR suite under ~10 minutes. Slow suites get skipped; skipped suites are worthless.
6. **Make failures actionable.** On failure: screenshot/video, console logs, network trace, and the
   exact seed/data used. A developer should reproduce in one command: `npm run test:e2e -- --grep
   "checkout flow"`.

Example layering for a SaaS app:

```text
Unit (hundreds, seconds):     pricing calc, input validation, permission checks
API/integration (dozens, ~2 min):  POST /orders creates order + decrements stock;
                                   unauthorized requests rejected; webhooks verified
E2E (8 journeys, ~6 min):     signup → create project → invite teammate → upgrade plan
Nightly (slow):               full cross-browser matrix, load smoke, a11y audit
```

## Common pitfalls

- **Testing through the UI what belongs in API tests.** Form validation logic tested via browser
  clicks is slow and brittle — push it down to unit/API level and keep E2E for the journey.
- **Fixed sleeps.** `sleep(2000)` passes until CI is slow, then flakes. Wait on conditions, not clocks.
- **Shared test accounts/data.** Two tests mutating the same user record will eventually collide.
  Isolate: unique data per test run.
- **Mocking the system under test.** Mocking your own database layer in an "integration" test just
  tests the mock. Mock at external boundaries only.
- **100% coverage mandates.** Drives tests of getters and trivial code while critical journeys go
  untested. Cover behavior that matters; measure journey coverage, not line coverage.
- **E2E against dev servers with hot-reload.** Test the production build — dev-only behavior
  (extra warnings, different bundling) hides real bugs and creates fake ones.
- **Ignoring the suite.** The moment a red build merges, the suite's authority dies. Protect main,
  fix red immediately, and treat "just rerun it" as a flakiness report, not a solution.
