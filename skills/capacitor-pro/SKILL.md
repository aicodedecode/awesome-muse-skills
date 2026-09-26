---
name: capacitor-pro
description: Ship iOS/Android apps with Capacitor: web codebase, native plugins, live updates, and store builds. Use when wrapping a web app as native mobile apps.
category: development
---

# Capacitor Pro

A practical guide to Capacitor: turning a web app into native iOS and Android apps with full access to native APIs via plugins — setup, the plugin bridge, platform projects, live updates, and store deployment.

## Overview

Capacitor wraps your built web app in a native shell with a WebView, plus a plugin bridge to native APIs (camera, filesystem, push notifications, geolocation...). Unlike older "write once" web containers, Capacitor embraces the native projects: `ios/` and `android/` are real, editable Xcode/Gradle projects checked into your repo. You own the native side.

The flow: **web code → `npx cap sync` → native projects → build in Xcode/Android Studio → stores.**

## When to use

- An existing web app (React, Vue, Angular, plain JS) needs iOS/Android apps.
- You want native features (push, camera, biometrics) without going fully native.
- Teams that are web-first but need store presence.
- OTA content updates without full store review (within store policy limits).

## Core concepts

- **The bridge.** `Plugins.Camera.getPhoto(...)` in JS calls native code. Official plugins cover the essentials; community plugins fill gaps; you can write custom native plugins (Swift/Kotlin) when needed.
- **`npx cap sync`.** Copies your web build output into the native projects and updates plugin native code. Run after every web build and every plugin install.
- **Native projects are source.** `ios/` and `android/` are checked in and editable — add native dependencies, entitlements, deep links directly. Capacitor regenerates only what it owns.
- **Config (`capacitor.config.ts`).** App ID, app name, web directory (`dist`), server settings for live reload during development.
- **Live reload.** Point the native app at your dev server (`server.url`) for instant iteration on a device — then clear it for production builds.
- **Push notifications.** Via the Push Notifications plugin + FCM (Android) / APNs (iOS). Certificates, entitlements, and token handling are the fiddly parts — budget time.
- **Live updates.** Services exist to push web-bundle updates over the air. Allowed for web content; native changes still need store review. Stay within Apple/Google policy (no changing app purpose or sneaking features past review).

## Practical workflow

**1. Add to a web app.**
```bash
npm i @capacitor/core @capacitor/cli
npx cap init "MyApp" com.example.myapp --web-dir=dist
npm i @capacitor/camera @capacitor/push-notifications   # plugins you need
npx cap add ios
npx cap add android
```

**2. Use a plugin.**
```ts
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  resultType: CameraResultType.Uri,
  quality: 90,
});
// photo.webPath -> display; photo.path -> native file access
```
Always wrap in try/catch — users deny permissions, and simulators lack cameras.

**3. Dev loop.**
```bash
npm run build && npx cap sync
# then run from Xcode / Android Studio on a device
```
For speed: set `server.url` to your LAN dev server + `cleartext: true` for live reload during development.

**4. Platform specifics.** iOS: set bundle ID, signing team, capabilities (push, associated domains) in Xcode. Android: `applicationId`, signing config, permissions in `AndroidManifest.xml`.

**5. Build for stores.** iOS: Archive in Xcode → App Store Connect. Android: signed AAB (`./gradlew bundleRelease`). Automate signing in CI with secrets — never commit keystores or provisioning profiles.

**6. Maintain.** After Capacitor major upgrades, re-run `npx cap sync`, check plugin compatibility, and re-verify permissions — upgrades are the #1 source of "it worked last release" bugs.

## Common pitfalls

- **Forgetting `cap sync`.** Web changes not appearing on device? You built but didn't sync. Make it part of the build script.
- **Permissions as an afterthought.** Camera/location/notifications need `Info.plist` entries (iOS, with usage descriptions) and manifest entries + runtime requests (Android). Missing usage descriptions = instant App Store rejection.
- **Simulator-only testing.** Push notifications, cameras, and performance behave differently on real devices. Test on hardware before submission.
- **WebView quirks.** iOS WKWebView and Android WebView differ: scrolling behavior, input focus, file access. Test both; use `viewport-fit=cover` and safe-area insets for notched devices.
- **Storing secrets in the web bundle.** The JS bundle is readable. API keys in web code are public — use a backend or native secure storage (Keychain/Keystore via plugins).
- **OTA overreach.** Pushing native-code-equivalent changes or altering app purpose via live update violates store policy. Web content and bug fixes only.
- **Plugin rot.** Community plugins lag behind Capacitor majors. Prefer official plugins; vet community ones for maintenance activity before depending on them.
- **Ignoring app lifecycle.** `appStateChange` / `pause` / `resume` events — persist state, refresh stale data on resume, handle deep links (`appUrlOpen`) for auth callbacks.
