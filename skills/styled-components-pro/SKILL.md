---
name: styled-components-pro
description: Style React with styled-components: theming, transient props, attrs, SSR, and performance patterns. Use when building component-scoped styles with CSS-in-JS.
category: development
---

# styled-components Pro

A practical guide to styled-components: component-scoped CSS-in-JS for React — theming, transient props, the `css` helper, SSR, and the performance patterns that keep runtime styling cheap.

## Overview

styled-components turns CSS into React components: `const Button = styled.button\`...\`` generates a class at render time with your styles attached. Styles live with components, props drive variants, and theming flows through React context. The cost is runtime: styles compute in the browser. Used well (static styles, transient props, babel plugin), the cost is small; used carelessly (new components per render, prop-drilling styles), it compounds.

## When to use

- React apps wanting co-located, prop-driven styles.
- Theming via `ThemeProvider` (light/dark, brand variants).
- Migrating from global CSS to component-scoped styles.
- SSR setups (Next.js pages router, custom SSR) needing critical CSS extraction.

## Core concepts

- **`styled`.** `styled.tag` or `styled(Component)` — template literal CSS, interpolations for props/theme. Extending: `styled(Button)` inherits styles.
- **Transient props (`$`).** `$active` instead of `active` — not forwarded to the DOM, avoiding React unknown-prop warnings and invalid HTML attributes. Default to `$` for styling-only props.
- **`css` helper.** Share style fragments: `const tone = css\`color: ...\`;` then `${tone}` in multiple components. Also powers `createGlobalStyle`.
- **`attrs`.** Set static attrs/default props: `styled.input.attrs({ type: 'checkbox' })\`...\`` — keeps the template focused on styling.
- **Theming.** `<ThemeProvider theme={theme}>` → `${({ theme }) => theme.colors.brand}`. Type the theme (TS declaration merging on `DefaultTheme`) so typos fail at compile time.
- **`createGlobalStyle`.** Resets, fonts, base styles — rendered once at app root.
- **Babel plugin.** `babel-plugin-styled-components`: meaningful `displayName`s, minified class names, SSR-friendly IDs. Non-optional in practice.

## Practical workflow

**1. Setup.** Install `styled-components` + babel plugin (in `.babelrc`/config). For SWC: `@swc/plugin-styled-components`.

**2. Component pattern.**
```tsx
import styled, { css } from 'styled-components';

const tone = {
  primary: css`background: ${({ theme }) => theme.colors.brand}; color: white;`,
  ghost: css`background: transparent; color: ${({ theme }) => theme.colors.brand};`,
};

export const Button = styled.button<{ $tone?: keyof typeof tone; $fullWidth?: boolean }>`
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  ${({ $tone = 'primary' }) => tone[$tone]}
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
```
Transient props, theme tokens, variant map — no prop leaks to the DOM.

**3. Theme typing.**
```ts
// styled.d.ts
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme { colors: { brand: string; ... }; radii: { md: string } }
}
```

**4. SSR.** Collect styles on the server (`ServerStyleSheet` / framework integration) and inject into HTML — otherwise first paint is unstyled. Next.js App Router: use the official registry pattern.

**5. Performance pass.** Define styled components at module level (never inside render — that remounts every render); prefer transient props; keep interpolations simple (avoid creating new objects/functions in interpolations).

## Common pitfalls

- **Defining components inside render.** `function X() { const Box = styled.div...; return <Box/> }` — new component identity every render → remount + style recalculation. Module level, always.
- **Non-transient styling props.** `active`, `large` forwarded to DOM → React warnings + invalid attributes. `$`-prefix everything styling-only.
- **Over-interpolation.** Complex logic inside template literals runs per render. Hoist variant maps and helpers out.
- **Missing babel plugin.** Cryptic class names, no displayNames in DevTools, SSR mismatches. Install and verify it's active.
- **Theming without types.** Untyped theme = stringly-typed typos discovered at runtime. Declare the module once.
- **Global styles multiplied.** Rendering `createGlobalStyle` component in multiple places duplicates output. Once, at the root.
- **Specificity surprises.** `styled(Button)` extension + overrides can create specificity fights. Prefer variant props on one component over deep extension chains.
- **Runtime cost denial.** Thousands of dynamic styled components on a page has measurable cost. For static marketing pages, consider zero-runtime alternatives; for apps, it's usually fine — measure before rewriting.
