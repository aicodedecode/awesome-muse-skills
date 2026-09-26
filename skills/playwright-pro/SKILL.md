---
name: playwright-pro
description: Browser automation with Playwright — reliable selectors, waits, and test patterns — use for E2E testing and scripted browsing.
category: web-data
---

## Overview

Playwright automates Chromium, Firefox, and WebKit with a modern async API,
built-in waiting, and first-class test runner integration. Its killer
feature is auto-waiting: actions wait for elements to be actionable, which
eliminates most flakiness that plagues browser automation. This skill covers
writing Playwright automation that's fast and reliable.

## When to use

- Writing end-to-end tests for web applications
- Automating browser workflows (form filling, data extraction from JS sites)
- Testing across Chromium, Firefox, and WebKit
- Debugging flaky browser tests
- Generating PDFs/screenshots or mocking network responses

## Core concepts

**Auto-waiting beats sleep.** Playwright actions (click, fill, select)
automatically wait for the element to be attached, visible, stable, and
receiving events. Never use fixed `sleep()` — use explicit waits
(`waitForSelector`, `expect(...).toBeVisible()`) tied to actual conditions.
Flaky tests are almost always missing waits in disguise.

**Locators over selectors.** Prefer user-facing locators —
`getByRole('button', { name: 'Submit' })`, `getByLabel`, `getByText` — over
CSS/XPath. They mirror how users find elements, survive most refactors, and
enforce accessibility (if you can't find it by role, screen readers can't
either). Reserve CSS for layout-specific cases.

**Isolated contexts.** Each test gets a fresh browser context (cookies,
storage, sessions isolated) — fast and parallelizable, unlike fresh browser
instances. Share authenticated state via storage-state files: log in once,
save state, reuse across tests — cutting minutes off suites.

**Network control.** Route interception mocks APIs (`page.route` → fulfill
with fixtures) for deterministic tests independent of backends; request
inspection asserts what the app actually sent. Use mocking for speed and
stability, but keep a subset of tests hitting real backends to catch
integration drift.

**Trace viewer for debugging.** On failure, capture traces (screenshots,
DOM snapshots, network, console per action) — the trace viewer replays
exactly what happened. Configure tracing to retain-on-failure; debugging
from a trace beats re-running and hoping.

## Practical workflow

1. **Structure tests by user journey** (not by page object ceremony):
   arrange → act → assert, with test data seeded via API (faster than UI
   setup) where possible.
2. **Write with locators:** roles, labels, and text first; add `data-
   testid` attributes for elements with no good user-facing handle.
3. **Handle the async reality:** await every action, assert with
   auto-retrying `expect` (not manual polling), and wait for network idle
   or specific responses after actions that trigger requests.
4. **Isolate and parallelize:** fresh context per test, storage-state for
   auth, workers for parallelism — keep suites under minutes, not hours.
5. **Debug with traces:** reproduce locally with `--headed --debug`,
   inspect the trace timeline for the exact failing action and app state.
6. **Keep the suite healthy:** quarantine genuinely flaky tests with an
   owner and deadline (never normalize red), and delete tests that assert
   nothing meaningful.

## Common pitfalls

- **Fixed sleeps** — `waitForTimeout(3000)` is slow when unnecessary and
  flaky when insufficient; wait on conditions instead.
- **Testing implementation details** — asserting on CSS classes or internal
  state instead of user-visible outcomes; refactors break the suite.
- **Shared state between tests** — order-dependent tests that pass alone
  and fail together; isolate via fresh contexts.
- **Over-mocking** — a suite that mocks everything tests the mocks;
  balance with real-integration coverage.
- **Ignoring the other browsers** — Chromium-only testing misses
  Firefox/WebKit quirks; run the matrix in CI at least for critical paths.
- **Screenshots as assertions** — pixel comparisons are brittle across
  environments; assert structure and key visuals, not exact pixels
  (except dedicated visual-regression setups with controlled baselines).
