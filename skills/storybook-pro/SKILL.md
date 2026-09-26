---
name: storybook-pro
description: Develop UI in isolation with Storybook: stories, args, controls, decorators, and interaction/visual testing. Use for component-driven development.
category: web-development
---

# Storybook Pro

A practical guide to Storybook: component-driven development — writing stories, args/controls, decorators, documentation, and using stories as the basis for visual and interaction testing.

## Overview

Storybook renders components in isolation, outside the app: each **story** is a component in a specific state (default, loading, error, long-text). This gives you a **living component catalog** for development, design review, and QA — build the UI states without navigating the app into them. Stories then double as test fixtures (interaction tests) and visual regression baselines.

## When to use

- Building/maintaining a component library or design system.
- Developing complex component states (empty, error, loading) without app setup.
- Design review and QA of UI in isolation.
- Visual regression and interaction testing via stories.

## Core concepts

- **Stories (CSF).** `export const Primary = { args: { variant: 'primary', children: 'Save' } }` — Component Story Format: stories as objects with args. One file per component (`Button.stories.tsx`).
- **Args & controls.** Args are story inputs; controls auto-generate a UI panel to tweak them (text, boolean, select, color). Great for explorative QA.
- **Decorators.** Wrappers applied to stories: theme providers, router context, padding, locale. Global decorators in `.storybook/preview.tsx`.
- **Parameters.** Per-story config: layout (`centered`, `fullscreen`), backgrounds, viewport sizes, a11y rules.
- **Docs.** Autodocs generates prop tables and docs pages from stories + TSDoc. Stories *are* the documentation — write them to be read.
- **Interaction testing.** `play` functions simulate user flows inside stories (click, type, assert) — run in CI with the test runner.
- **Visual testing.** Chromatic (or similar) snapshots every story on every PR — pixel-level regression detection across the whole catalog.

## Practical workflow

**1. Setup.**
```bash
npx storybook@latest init   # detects framework, scaffolds .storybook/
npm run storybook
```

**2. Write stories for states, not just the happy path.**
```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button, tags: ['autodocs'],
  argTypes: { onClick: { action: 'clicked' } } };
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Save' } };
export const Loading: Story = { args: { loading: true, children: 'Save' } };
export const Disabled: Story = { args: { disabled: true, children: 'Save' } };
export const LongLabel: Story = { args: { children: 'Save all changes to the shared workspace' } };
```

**3. Decorators for context.**
```tsx
// .storybook/preview.tsx
export const decorators = [
  (Story) => <ThemeProvider><div style={{ padding: 16 }}><Story /></div></ThemeProvider>,
];
```

**4. Interaction test.**
```tsx
export const Toggles: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch'));
    await expect(canvas.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  },
};
```

**5. CI.** Build Storybook, run test-runner (interaction + a11y), publish to Chromatic for visual review on PRs.

## Common pitfalls

- **Stories only for happy path.** The value is in states: loading, error, empty, overflow, RTL. If a story doesn't exist for a state, that state isn't designed.
- **Stories duplicating app logic.** Stories with complex setup replicating app state become maintenance burdens. Keep stories presentational; mock at the props boundary.
- **No decorators for providers.** Stories crashing on missing context (theme, router, store). Global decorators once, not per story.
- **Stale stories.** Component API changes, stories not updated → catalog lies. Treat stories as code: update in the same PR.
- **Over-mocking.** Stories so mocked they don't resemble real usage. Use realistic data (long names, edge values).
- **Ignoring visual review.** Chromatic diffs rubber-stamped. Assign reviewers; diffs are design QA.
- **Slow Storybook.** Hundreds of stories with heavy decorators = sluggish. Code-split stories, keep decorators light, lazy-load where possible.
- **Docs rot.** Autodocs only works if props are typed and commented. Write TSDoc on props — the docs page is your API reference.
