---
name: react-native-pro
description: Professional React Native: cross-platform architecture, navigation, native modules, and performance. Use when writing, reviewing, or structuring React Native apps.
category: development
---

# React Native Pro

## Overview

React Native lets you **ship iOS and Android from one React codebase** — but "write once" only
works when you respect both platforms. Professional React Native means architecting for platform
differences (not against them), mastering the bridge/hermes performance model, handling the
app lifecycle (permissions, deep links, push), and knowing when to go native.

The through-line: shared logic, platform-aware UI, and performance measured on real low-end devices.

## When to use

- Writing or reviewing React Native (or Expo) code.
- Structuring RN apps (navigation, state, native modules).
- Debugging performance (JS thread drops, bridge bottlenecks) or platform issues.
- Choosing Expo vs bare workflow, or JS vs native implementations.
- Handling app lifecycle: deep links, push notifications, permissions, OTA updates.

## Core concepts

- **The threading model.** JS thread (your code), native UI thread, and shadow thread (layout).
  Dropped frames = JS thread blocked (>16ms work) or expensive bridge traffic. Hermes (default
  engine) improves startup and memory — know your engine's behavior.
- **New Architecture (Fabric/TurboModules).** Synchronous layout, JSI direct calls instead of
  async bridge JSON — adopt for new projects; understand interop when bridging legacy modules.
  The performance story keeps improving; write to the new model.
- **Platform-aware UI.** `Platform.select`, platform-specific files (`.ios.js`/`.android.js`),
  and respecting platform conventions (navigation patterns, gestures, haptics). Users can tell
  when an app was designed for the other platform — honor both.
- **Navigation as architecture.** React Navigation (stack/tabs/drawer) with deep linking config
  from day one; navigation state separated from app state; type-safe params. Deep links are a
  product surface — design the URL scheme deliberately.
- **State: same rules as React, plus persistence.** Server state via query libraries; UI state
  colocated; persisted state (MMKV/AsyncStorage) for auth tokens, preferences, offline queues —
  with migration discipline for schema changes.
- **Expo vs bare.** Expo managed workflow for most apps (OTA updates, build service, config
  plugins); bare when you need custom native code beyond config plugins. Choose deliberately —
  ejecting mid-project is painful.

## Practical workflow

1. **Scaffold deliberately.** Expo (managed) unless you know you need bare; TypeScript strict;
   file-based routing (Expo Router) or React Navigation; ESLint + Prettier.
2. **Structure by feature.** `features/checkout/` (screens, components, hooks, api) + `core/`
   (navigation, theme, api client). Screens thin; logic in hooks/services.
3. **Build the platform surfaces early.** Deep linking config, push notification handling
   (permissions flow, token registration, foreground/background/quit states), app icon/splash,
   permission request flows with rationale — these are hard to retrofit.
4. **Handle offline and lifecycle.** Network-aware UI (offline banners, queued mutations),
   app-state transitions (background/foreground refresh), and graceful degradation when native
   features are unavailable.
5. **Test on real devices.** Emulators for iteration; physical low-end Android for performance
   truth. Detox/Maestro for E2E critical journeys; Jest for logic; screenshot tests for visual
   regressions across platforms.
6. **Profile before optimizing.** Hermes profiling, `InteractionManager` for deferring work past
   animations, `FlatList` optimization (getItemLayout, windowSize, memo rows), native driver for
   animations (`useNativeDriver`), and Reanimated for gesture-driven UI off the JS thread.

Performance checklist:

```text
[ ] Lists: FlatList with getItemLayout, memoized rows, sensible windowSize
[ ] Images: sized, cached (expo-image / fast-image), no layout shift
[ ] Animations: native driver / Reanimated; JS thread free during gestures
[ ] Startup: Hermes, lazy screens, deferred non-critical init
[ ] Bridge: batched native calls; no chatty per-frame JS↔native traffic
[ ] Tested on a low-end Android device, not just the iPhone simulator
```

## Common pitfalls

- **JS thread blocking.** Heavy computation, large JSON parsing, or synchronous storage reads on
  the JS thread — dropped frames and ANRs. Defer, chunk, or move to native/worklets.
- **Unoptimized lists.** Plain `map()` over hundreds of rows, no memoization, images without
  sizing — the classic RN perf disaster. FlatList done right is non-negotiable.
- **Ignoring Android.** Developing on iOS simulator and "checking Android later." Fragmentation,
  back-button behavior, and performance characteristics differ enormously — test both continuously.
- **Navigation state in Redux.** Duplicating navigation state in global stores causes desync bugs.
  Navigation libraries own navigation state; app state stays separate.
- **Permission flows as afterthoughts.** Requesting permissions without rationale, or crashing when
  denied. Design the denied/limited states; explain before asking (especially iOS).
- **Console.log in production.** Logging PII and bloating release builds. Strip logs in release,
  use a proper logging service with levels.
- **Native module sprawl.** A custom native module for what a maintained library (or config
  plugin) already does. Every native module is maintenance burden across RN upgrades — minimize.
