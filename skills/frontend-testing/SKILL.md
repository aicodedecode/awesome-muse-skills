---
name: frontend-testing
description: Test frontend code: unit, component, E2E, visual regression, and accessibility tests with a sane pyramid. Use for reliable UI quality.
category: web-development
---

# Frontend Testing

A practical guide to frontend testing: the testing pyramid for UI (unit → component → E2E), visual regression, accessibility tests, and the habits that keep suites fast and trustworthy.

## Overview

Frontend testing pyramid: **many unit tests** (pure logic: utils, hooks, reducers), **component tests** (render + interact: Testing Library), **few E2E tests** (critical user journeys: Playwright/Cypress), plus **visual regression** for UI fidelity and **a11y checks** in CI. The goal isn't coverage percentage — it's catching regressions in things users actually do.

Test behavior, not implementation: query by role/text like a user, not by component internals.

## When to use

- Setting up testing for a new frontend project.
- Choosing between Testing Library, Playwright, Cypress, Storybook tests.
- Flaky/slow suites needing triage.
- Adding visual regression or a11y testing.

## Core concepts

- **Unit tests (Vitest/Jest).** Pure functions, utilities, hooks (renderHook), state logic. Fast (ms), numerous, no DOM needed mostly.
- **Component tests (Testing Library).** Render components, fire events, assert on what the user sees: `screen.getByRole('button', { name: 'Save' })`. Mock network at the boundary (MSW), not internals.
- **E2E (Playwright/Cypress).** Real browser, critical paths: signup, checkout, core workflows. Slow and flaky-prone — keep the count low and the value high.
- **Visual regression.** Screenshot comparison (Playwright screenshots, Chromatic, Percy): catches CSS/layout breakage unit tests can't see. Baseline carefully; review diffs as a team.
- **A11y tests.** axe-core in component tests and CI (`jest-axe`, Playwright axe) — catches missing labels, contrast, invalid ARIA automatically.
- **MSW (Mock Service Worker).** Intercept network at the request level — tests exercise real fetch code with fake responses. Better than mocking fetch itself.
- **Test IDs.** `data-testid` as a last resort; prefer role/text queries. Test IDs for elements with no good semantic query.

## Practical workflow

**1. Setup.**
```bash
npm i -D vitest @testing-library/react @testing-library/user-event jsdom msw
npx playwright install   # E2E browsers
```

**2. Unit test (logic).**
```ts
// utils/format.test.ts
import { formatCurrency } from './format';
test('formats USD', () => expect(formatCurrency(1234.5)).toBe('$1,234.50'));
```

**3. Component test (behavior).**
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits the form', async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.c');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));
  expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.c', password: 'secret123' });
});
```

**4. E2E (critical journey).**
```ts
// e2e/checkout.spec.ts
test('guest checkout', async ({ page }) => {
  await page.goto('/products/widget');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

**5. CI.** Unit/component on every PR (fast); E2E on main + pre-release (slower); axe checks in both; visual regression on UI PRs.

## Common pitfalls

- **Testing implementation.** Asserting on state variables, mocking internal functions, snapshot-testing huge trees — brittle tests that break on refactors. Test user-observable behavior.
- **E2E for everything.** 200 E2E tests = slow, flaky CI that everyone ignores. E2E the 5–10 journeys that must never break; component-test the rest.
- **Flaky selectors.** CSS-class/XPath selectors break on styling changes. Role/text queries are stable and user-aligned.
- **No network mocking strategy.** Tests hitting real APIs = slow + flaky + side effects. MSW or equivalent, always.
- **Sleep-based waits.** `await sleep(1000)` = flakiness. Use proper waiting (Testing Library's findBy, Playwright's auto-waiting assertions).
- **Untested error paths.** Happy-path-only suites. Test loading, error, and empty states — that's where UI bugs live.
- **100% coverage mandates.** Coverage as a target produces meaningless tests. Cover critical logic and user journeys; let the number follow.
- **Slow suites.** 20-minute test runs get skipped. Parallelize, mock heavy deps, keep E2E lean. Fast feedback or no feedback.
- **Visual regression noise.** Font rendering, anti-aliasing, animations cause false diffs. Stabilize (disable animations, consistent fonts) and review baselines deliberately.
