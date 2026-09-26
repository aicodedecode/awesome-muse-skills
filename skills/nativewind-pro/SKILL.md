---
name: nativewind-pro
description: Style React Native apps with Tailwind CSS via NativeWind: setup, responsive design, dark mode, custom themes, and platform quirks. Use when building React Native UIs with utility classes.
category: development
---

# NativeWind Pro

A practical guide to NativeWind — Tailwind CSS for React Native: setup, writing utility-first styles that compile to native, responsive and dark-mode patterns, custom themes, and the platform quirks that differ from web Tailwind.

## Overview

NativeWind brings Tailwind's utility classes to React Native by compiling `className` strings into React Native styles at build time. You write `<View className="flex-1 bg-white dark:bg-black px-4">` and get native styling without StyleSheet boilerplate. It uses the Tailwind CSS engine under the hood, so most of your Tailwind knowledge transfers — with important exceptions where the web and native diverge.

## When to use

- Styling React Native or Expo apps with utility classes.
- Sharing design tokens/theme between web (Tailwind) and native codebases.
- Dark mode, responsive breakpoints, and platform-specific styles in RN.
- Migrating a StyleSheet-heavy codebase toward utility styling.

## Core concepts

- **Build-time compilation.** NativeWind's Babel plugin converts `className` to RN styles. Arbitrary values (`w-[137px]`) work; fully dynamic class strings don't — the compiler must see the class names statically.
- **`tailwind.config.js` shared.** Same config format as web Tailwind: theme extension, custom colors, fonts, spacing. One source of design tokens.
- **Dark mode.** `dark:` variant via the `class` strategy (toggle with `useColorScheme` or a theme store). Set `darkMode: 'class'` in config.
- **Responsive.** Breakpoints (`sm:`, `md:`) map to screen widths via Dimensions — useful for tablets/foldables, less central than on web.
- **Platform variants.** `ios:` and `android:` prefixes for platform-specific tweaks (shadows, elevation, ripple areas).
- **CSS interop caveats.** No cascade, no global CSS, no pseudo-elements. Some utilities have no RN equivalent (`float`, `grid` — use flexbox).

## Practical workflow

**1. Setup (Expo example).**
```bash
npx expo install nativewind tailwindcss react-native-reanimated
npx tailwindcss init
```
Add the Babel plugin (`nativewind/babel`), create `global.css` with `@tailwind` directives (or the v4 `@import "tailwindcss"`), import it at the app root, and point `tailwind.config.js` content at your source files.

**2. Write utility-first components.**
```tsx
import { View, Text, Pressable } from 'react-native';

export function Card({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl bg-white p-4 shadow-sm active:opacity-70 dark:bg-zinc-900 ios:shadow-md android:elevation-2"
    >
      <Text className="text-base font-semibold text-zinc-900 dark:text-white">{title}</Text>
    </Pressable>
  );
}
```

**3. Theme via config.** Extend colors, fontFamily (load fonts with `expo-font` first), borderRadius in `tailwind.config.js`. Use semantic names (`bg-surface`, `text-muted`) so dark mode flips in one place.

**4. Handle dynamic styles.** For truly dynamic values (e.g., width from a measurement), fall back to `style={}` — don't try to interpolate class names at runtime; the compiler can't see them.

**5. Verify on both platforms.** Shadows (`shadow-*` iOS vs `elevation` Android), text rendering, and border behavior differ. Check every custom component on iOS and Android.

## Common pitfalls

- **Dynamic class names.** `` className={`bg-${color}-500`} `` compiles to nothing — the Babel plugin needs literal class strings. Use lookup maps of full class names instead.
- **Web-only utilities.** `hover:` (mostly meaningless on touch), `grid`, `backdrop-blur`, `truncate` nuances — check RN support; use `numberOfLines` for truncation.
- **Missing content globs.** Classes in files not covered by `tailwind.config.js` `content` silently don't generate. Include all source dirs.
- **Font loading.** Custom `fontFamily` utilities need the font actually loaded (expo-font `useFonts`) before render, or text falls back/flashes.
- **Dark mode default.** Forgetting `darkMode: 'class'` (or the v4 equivalent) means `dark:` variants never activate.
- **Style prop conflicts.** Mixing `className` and `style` on the same element — `style` wins on conflicts, which can surprise. Prefer one source per element.
- **Over-specific arbitrary values.** `w-[137px]` everywhere defeats the design system. Extend the theme with real tokens instead.
- **Version mismatch.** NativeWind v2 vs v4 have different setup (CSS-first config in v4). Follow the docs for your exact major version; mixing instructions breaks the Babel pipeline.
