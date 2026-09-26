---
name: emotion-pro
description: Style React with Emotion: css prop, styled API, theming, SSR, and zero-config patterns. Use when choosing or using Emotion for CSS-in-JS.
category: development
---

# Emotion Pro

A practical guide to Emotion: the flexible CSS-in-JS library for React — the `css` prop, `styled` API, theming, SSR extraction, and the configuration choices (babel preset, labels) that make it pleasant.

## Overview

Emotion offers two APIs for the same engine: the **`css` prop** (`<div css={css`...`}>`, JSX pragma or automatic runtime) for inline styling, and **`styled`** (same idea as styled-components) for reusable components. It's fast, SSR-friendly, and framework-agnostic at its core (`@emotion/css` works without React). The `css` prop shines for one-off styles; `styled` for repeated components — most codebases use both.

## When to use

- React apps wanting flexible CSS-in-JS (css prop for ad-hoc, styled for reusable).
- Theming with `ThemeProvider` from `@emotion/react`.
- SSR (Next.js, Remix, custom) with critical CSS extraction.
- Non-React usage via `@emotion/css` (vanilla JS, other frameworks).

## Core concepts

- **`css` prop.** `<div css={{ color: 'hotpink' }}>` (object) or `` css`color: hotpink;` `` (template). Needs the JSX transform configured: `/** @jsxImportSource @emotion/react */` or babel preset `@emotion/babel-preset-css-prop`.
- **`styled`.** `import styled from '@emotion/styled'` — same API shape as styled-components; components interchangeable in most patterns.
- **Theming.** `ThemeProvider` from `@emotion/react`; `useTheme()` hook; `${props => props.theme.x}` interpolations. Type via module augmentation like styled-components.
- **Composition.** `css` results compose: `css={[base, isActive && active]}` — arrays merge, later wins. Clean variant handling without template gymnastics.
- **`Global`.** `<Global styles={css`...`} />` for resets and base styles.
- **Labels.** `@emotion/babel-plugin` adds `label: ComponentName;` to generated classes — readable DevTools. Also enables better minification and source maps.
- **SSR.** `extractCritical` (v10) / framework integrations collect used styles server-side. Next.js App Router needs the documented Emotion SSR setup to avoid hydration mismatches.

## Practical workflow

**1. Setup.**
```bash
npm i @emotion/react @emotion/styled
# babel: presets: ['@emotion/babel-preset-css-prop'] (enables css prop + labels)
```
Or with the new JSX transform: set `jsxImportSource: '@emotion/react'` in tsconfig + per-file pragma comment where needed.

**2. Patterns.**
```tsx
/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';

// ad-hoc: css prop with array composition
const base = css`padding: 12px 20px; border-radius: 8px;`;
const primary = (theme) => css`background: ${theme.colors.brand}; color: white;`;

function Button({ variant, children }) {
  const theme = useTheme();
  return <button css={[base, variant === 'primary' && primary(theme)]}>{children}</button>;
}

// reusable: styled
const Card = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;
```

**3. Theme + types.** Define theme object, augment `@emotion/react`'s `Theme` interface, wrap app in `ThemeProvider`.

**4. SSR.** Follow the framework-specific Emotion SSR docs (critical CSS extraction on server, cache provider for App Router). Verify: no unstyled flash, no hydration warnings.

**5. Object styles vs template.** Object styles (`css={{...}}`) are lintable/typeable and compose well; template literals are better for complex selectors and media queries. Pick per case, stay consistent per file.

## Common pitfalls

- **Missing JSX config.** `css` prop does nothing (or errors) without the pragma/babel preset/jsxImportSource. The #1 "Emotion isn't working" cause.
- **No babel plugin.** Missing labels → unreadable class names in DevTools; also suboptimal minification. Add `@emotion/babel-plugin`.
- **css prop + TypeScript friction.** Without config, TS complains about the `css` prop type. The babel preset or jsxImportSource + `@emotion/react` types fix it.
- **SSR mismatch.** Client/server class-name divergence → hydration warnings. Use the documented SSR/cache setup for your framework; don't hand-roll.
- **Overusing css prop.** Every element with a bespoke `css` prop = unmaintainable snowflakes. Promote repeated patterns to `styled` components.
- **Theme any-typed.** Untyped theme = runtime typos. Augment the Theme interface once.
- **Global styles in components.** `<Global>` inside a frequently-rendered component re-injects. Render once at root.
- **Specificity with composition.** Array composition merges declarations; conflicting properties resolve by order, not specificity — understand the merge to avoid surprise overrides.
