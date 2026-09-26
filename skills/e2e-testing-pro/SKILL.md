---
name: e2e-testing-pro
description: End-to-end testing mastery: critical journeys, Playwright/Cypress patterns, flakiness control, and CI integration. Use when building or fixing browser E2E suites.
category: development
---

# E2E Testing Pro

## Overview

End-to-end tests — **real browsers driving real user journeys** — are the highest-value and
highest-cost tests you own. Done right, they prove the thing that matters: users can accomplish
critical tasks. Done wrong, they're a slow, flaky suite everyone ignores. This skill covers the
discipline: which journeys to cover, how to write resilient tests, killing flakiness systematically,
and fitting E2E into CI without grinding it to a halt.

The through-line: few, fast, and trustworthy — E2E is a scalpel, not a blanket.

## When to use

- Setting up E2E testing (Playwright, Cypress) for a web app.
- Fixing flaky or slow E2E suites.
- Deciding which user journeys deserve E2E coverage.
- Debugging E2E failures in CI.
- Integrating E2E into deployment pipelines.

## Core concepts

- **Journeys, not pages.** Test user goals end-to-end (signup → onboard → first value; browse →
  cart → checkout → confirmation), not individual pages in isolation. 5–15 critical journeys cover
  most business risk; hundreds of E2E tests cover mostly maintenance burden.
- **Test like a user, locate like an engineer.** Interact as users do (click the button labeled
  "Checkout"), but locate elements resiliently: `getByRole`, `getByLabel`, `getByTestId` for
  dynamic content — never brittle CSS selectors or XPath tied to layout. Layout changes shouldn't
  break tests.
- **Auto-waiting over sleeps.** Modern tools (Playwright especially) auto-wait for actionability —
  lean on it. Explicit waits should wait on *conditions* (element visible, network idle for *that*
  request), never `sleep(2000)`. Fixed sleeps are flakiness with extra steps.
- **Isolation per test.** Each test: fresh browser context (cookies/storage isolated), seeded
  backend state via API (not UI setup — don't test login 50 times, use API to authenticate),
  unique test data, and cleanup. Shared state between tests is the #1 flakiness source.
- **The testing pyramid applies.** E2E is the tip — push logic down to unit/integration tests.
  If an E2E test is really testing form validation, that's a unit test wearing an expensive costume.
- **Artifacts on failure.** Screenshots, videos, traces (Playwright's trace viewer is superb),
  console logs, network logs — captured automatically. A failing E2E without artifacts is a mystery;
  with them, it's usually a 5-minute diagnosis.

## Practical workflow

1. **Pick the journeys.** The 5–15 flows that must never break (revenue, signup, core value).
   Get product/stakeholder agreement — these are business-critical assertions.
2. **Set up the harness.** Playwright (recommended: multi-browser, tracing, auto-waiting) or
   Cypress; dedicated test environment with production-like build; API helpers for setup/
   teardown (create user, seed data) — UI only for what the journey actually tests.
3. **Write the first journey.** Page-object-ish organization (or Playwright fixtures) encapsulating
   selectors and common flows; assertions on user-visible outcomes ("order confirmation shows
   order number"), not implementation details.
4. **Stabilize ruthlessly.** Run each test 20–50x in CI-like conditions; fix every flake at the
   root (timing → proper waits; shared state → isolation; real network → route mocking for
   third parties). Zero tolerance for "usually passes."
5. **Fit into CI sanely.** Shard across workers; run E2E on PRs for affected journeys (fast
   subset) + full suite on main/nightly; block merges on the PR subset. Keep PR E2E under ~10 min.
6. **Maintain like production code.** Review E2E changes carefully; delete tests for removed
   features immediately; refactor page objects; track flake rate as a metric and budget fix time.

Resilient test sketch (Playwright):

```ts
test("guest can complete checkout", async ({ page }) => {
  // Setup via API, not UI — fast and isolated
  const user = await api.createUser({ email: uniqueEmail() });
  await api.seedCart(user.id, [productA]);

  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.getByRole("link", { name: "Cart" }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  // ... fill shipping/payment via labels ...
  await page.getByRole("button", { name: "Place order" }).click();

  // Assert user-visible outcome
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByTestId("order-number")).toContainText(/ORD-\d+/);
});
```

## Common pitfalls

- **Testing everything E2E.** 300 E2E tests "for coverage" — slow, flaky, unmaintainable. Push
  down the pyramid; E2E only for critical journeys.
- **UI-based setup.** Logging in through the UI in every test's `beforeEach` — slow and couples
  every test to login. API setup; UI only for the journey under test.
- **Fixed sleeps.** `waitForTimeout(3000)` — passes until CI is slow, then flakes. Auto-wait +
  condition-based waits only.
- **Brittle locators.** CSS selectors mirroring DOM structure (`.app > div:nth-child(2) button`)
  — breaks on every redesign. Role/label/testid locators survive refactors.
- **Shared test data.** Two tests using the same user/order — collisions, order dependence, flakes.
  Unique data per test, always.
- **Real third-party calls.** Hitting real payment/email APIs in E2E — slow, flaky, sometimes
  expensive. Route-interception or sandbox modes for third parties; contract-test the integration
  separately.
- **No failure artifacts.** A red E2E with just "timeout" and no screenshot/trace — undebuggable.
  Artifacts always, retained long enough to investigate.
