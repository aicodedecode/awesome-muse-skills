---
name: expo-pro
description: Build React Native apps with Expo: managed workflow, EAS Build/Update, config plugins, push notifications, and store submission. Use when shipping cross-platform mobile apps with Expo.
category: development
---

# Expo Pro

A practical guide to Expo: the managed React Native workflow — project setup, Expo Router, EAS Build and Updates, config plugins, push notifications, and submitting to the App Store and Play Store.

## Overview

Expo is the fastest path to production React Native: managed build service (EAS Build), over-the-air updates (EAS Update), file-based routing (Expo Router), and a curated SDK of native modules — without touching Xcode/Gradle for most features. When you need custom native code, **config plugins** modify the native projects at build time, and **development builds** give you a custom Expo Go with your native modules.

Mental model: **write JS/TS → EAS builds native binaries in the cloud → EAS Update ships JS changes instantly.**

## When to use

- Cross-platform iOS/Android apps from one TypeScript codebase.
- Teams that want to avoid native toolchain maintenance.
- Apps needing OTA updates for JS-layer fixes and features.
- Push notifications, camera, location, sensors via the Expo SDK.
- Ejecting to bare workflow only when config plugins can't cover a native need.

## Core concepts

- **Expo Router.** File-based routing (`app/index.tsx`, `app/settings.tsx`); layouts, tabs, stacks, and deep linking configured by file structure. Typed routes reduce navigation bugs.
- **EAS Build.** Cloud builds producing `.ipa`/`.aab`/`.apk` from `eas.json` profiles (development, preview, production). No Mac required for iOS builds.
- **EAS Update.** OTA updates for JS/assets — publish with `eas update`, users get it on next launch. Native changes still need a new build.
- **Config plugins.** JS functions that patch native projects at prebuild time (permissions, entitlements, Info.plist keys). Prefer plugins over manual native edits — manual edits get wiped on prebuild.
- **Development builds.** Custom dev client (`eas build --profile development`) replacing Expo Go when you use custom native modules. `npx expo start --dev-client` connects to it.
- **`app.json` / `app.config.js`.** Central config: bundle IDs, icons, splash, permissions, plugins, updates policy. Dynamic `app.config.js` for env-specific values.
- **Expo SDK modules.** `expo-camera`, `expo-location`, `expo-notifications`, `expo-av`, `expo-file-system`, etc. — versioned together per SDK release; keep them aligned.

## Practical workflow

**1. Scaffold.**
```bash
npx create-expo-app my-app --template tabs
cd my-app && npx expo start
```

**2. Configure identity early.**
```json
// app.json
{ "expo": { "name": "MyApp", "slug": "my-app",
  "ios": { "bundleIdentifier": "com.example.myapp" },
  "android": { "package": "com.example.myapp" } } }
```
Bundle ID/package decided once — changing later is painful.

**3. Add capabilities via config plugins.**
```json
{ "expo": { "plugins": [
  ["expo-camera", { "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera." }],
  "expo-notifications"
] } }
```

**4. Push notifications.**
```ts
import * as Notifications from 'expo-notifications';
const { status } = await Notifications.requestPermissionsAsync();
const token = (await Notifications.getExpoPushTokenAsync()).data;
// send token to your backend; send pushes via Expo push service or your own APNs/FCM
```
Test on real devices — simulators can't receive pushes.

**5. Build and update.**
```bash
eas build --platform all --profile production   # store binaries
eas update --branch production --message "Fix checkout bug"  # OTA JS update
```

**6. Submit.** `eas submit` uploads to App Store Connect / Play Console. Set up credentials once (`eas credentials`); store secrets in EAS, never in the repo.

## Common pitfalls

- **SDK version drift.** Mixing SDK 52 modules with an SDK 51 project breaks builds. Upgrade with `npx expo install --fix` and keep modules aligned.
- **Expo Go confusion.** Expo Go only includes the standard SDK modules. Custom native code needs a development build — "works in Expo Go, crashes in production" usually means a native module mismatch.
- **OTA overreach.** EAS Update can't change native code or add native modules. Bumping an SDK module version requires a new build, not just an update.
- **Permission strings missing.** iOS requires usage descriptions for camera/location/etc. — missing keys = App Store rejection. Android needs manifest permissions via plugins.
- **Asset bloat.** Unoptimized images in `assets/` inflate the binary and OTA payloads. Compress, use right sizes, lazy-load where possible.
- **Ignoring update channels.** Pushing an update to the wrong branch/channel ships unfinished JS to production. Use `development`/`preview`/`production` branches deliberately.
- **Secrets in JS.** The bundle is readable — API keys in app code are public. Use backend proxies or EAS Secrets injected at build time for build-only values.
- **Deep linking untested.** Configure schemes/universal links early and test cold-start + warm deep links on both platforms — auth callbacks depend on them.
