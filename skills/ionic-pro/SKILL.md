---
name: ionic-pro
description: Build cross-platform mobile apps with Ionic: UI components, navigation, Capacitor integration, theming, and performance. Use when building hybrid mobile apps with web tech.
category: development
---

# Ionic Pro

A practical guide to Ionic: building cross-platform mobile (and desktop/PWA) apps with web technologies — the component library, navigation patterns, Capacitor integration for native features, theming, and performance tuning.

## Overview

Ionic is a UI toolkit + app framework for hybrid mobile apps: framework-agnostic web components (usable with React, Vue, Angular, or plain JS) styled as native iOS/Android controls, paired with Capacitor for native device access. The pitch: **one codebase, native-looking UI, real native capabilities**, deployable to iOS, Android, desktop, and web.

Ionic components adapt per platform automatically (iOS mode vs Material Design mode) — you get platform-appropriate UX without maintaining two designs.

## When to use

- Cross-platform mobile apps built by web teams (React/Vue/Angular).
- Apps needing native-style UI (tabs, modals, action sheets) without native code.
- Prototypes and MVPs that must run on iOS + Android + web from one codebase.
- Pairing with Capacitor for camera, push, filesystem, geolocation.

## Core concepts

- **Web components.** `<ion-button>`, `<ion-list>`, `<ion-modal>` work in any framework. Framework bindings (e.g., `@ionic/react`) add idiomatic wrappers and routing integration.
- **Adaptive styling.** Components render iOS or Material styles based on platform (`mode="ios"` / `mode="md"` override available). Test both modes — don't assume.
- **Navigation.** Stack-based navigation with animated transitions (`ion-nav`, framework routers). Mobile patterns: tabs root, push/pop pages, modals and action sheets for transient UI.
- **Theming.** CSS variables (`--ion-color-primary`, etc.) + light/dark mode support. Define a palette once; components inherit.
- **Gestures.** Built-in gesture system (swipe-to-close modals, pull-to-refresh via `ion-refresher`, infinite scroll via `ion-infinite-scroll`).
- **Capacitor pairing.** Ionic handles UI; Capacitor handles native. The standard stack is Ionic + Capacitor, and the CLIs integrate.
- **PWA path.** The same app can ship as an installable PWA — useful for bypassing stores during beta or for desktop.

## Practical workflow

**1. Scaffold.**
```bash
npm install -g @ionic/cli
ionic start myApp tabs --type=react   # blank | tabs | sidemenu; react | vue | angular
cd myApp && ionic serve
```

**2. Build screens with components.**
```html
<ion-page>
  <ion-header><ion-toolbar><ion-title>Orders</ion-title></ion-toolbar></ion-header>
  <ion-content>
    <ion-refresher slot="fixed" onIonRefresh={doRefresh}><ion-refresher-content /></ion-refresher>
    <ion-list>
      <ion-item button detail={true} onClick={openOrder}>
        <ion-label>Order #1234<ion-note>Shipped</ion-note></ion-label>
      </ion-item>
    </ion-list>
    <ion-infinite-scroll onIonInfinite={loadMore}><ion-infinite-scroll-content /></ion-infinite-scroll>
  </ion-content>
</ion-page>
```

**3. Add native via Capacitor.** `ionic integrations enable capacitor`, then use Capacitor plugins as usual (`npx cap sync`, native projects, device testing).

**4. Theme.** Set brand colors via CSS variables, verify contrast in both light and dark modes, test iOS and MD modes on real devices.

**5. Performance pass.** Lazy-load routes, virtualize long lists (`ion-virtual-scroll` or framework equivalents), avoid heavy work in render paths. Profile on a mid-range Android — that's your real user.

**6. Ship.** `ionic build` → `npx cap sync` → Xcode/Android Studio → stores. Same signing and permission discipline as any Capacitor app.

## Common pitfalls

- **Desktop-browser-only testing.** Touch targets, safe areas, keyboard behavior, and scroll physics differ on devices. Test on iOS and Android hardware early.
- **Ignoring safe areas.** Notched devices + `viewport-fit=cover` require `env(safe-area-inset-*)` padding — Ionic handles much of this, but custom layouts need it manually.
- **Non-lazy routes.** Loading every page up front balloons startup time on mobile networks. Lazy-load per route/tab.
- **Over-nesting components.** Deep `ion-item`/`ion-list` nesting with heavy slots slows rendering. Flatten where possible; virtualize lists over ~50 items.
- **Mode blindness.** Designing only in iOS mode and shipping broken Material styling (or vice versa). Review both.
- **Keyboard overlap.** On Android especially, the keyboard can cover inputs. Use Ionic's keyboard handling and test form flows on-device.
- **Blocking the UI thread.** Long JS tasks freeze gestures and transitions. Move heavy work to Web Workers or native.
- **Plugin version drift.** Ionic, Capacitor, and plugins must stay on compatible majors — check the compatibility table on upgrades, don't bump blindly.
