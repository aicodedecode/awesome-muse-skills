---
name: tauri-mobile-pro
description: Build mobile apps with Tauri: Rust backend, web frontend, mobile plugins, permissions, and store deployment. Use when shipping iOS/Android apps from a web codebase via Tauri.
category: development
---

# Tauri Mobile Pro

A practical guide to Tauri for mobile: wrapping a web frontend (any framework) with a Rust backend on iOS and Android — project setup, the command/IPC bridge, mobile plugins, permissions, and getting to the app stores.

## Overview

Tauri Mobile lets you ship iOS and Android apps where the UI is your web app (HTML/CSS/JS) and privileged work happens in Rust. Compared to a pure webview wrapper, you get a real Rust backend: fine-grained capabilities, small binaries, and native APIs via plugins. Compared to Electron-style desktop Tauri, mobile adds platform permissions, app-store rules, and mobile-specific plugins (barcode scanner, biometrics, haptics).

The architecture: **webview frontend ↔ IPC commands ↔ Rust backend ↔ OS APIs.**

## When to use

- Shipping an existing web app as iOS/Android apps with native capabilities.
- Apps needing Rust performance or security properties on mobile (crypto, local processing).
- Small binary size matters (Tauri apps are dramatically smaller than Chromium-based wrappers).
- You want one web codebase for web + desktop + mobile.

## Core concepts

- **Commands.** Rust functions exposed to JS via `#[tauri::command]` + `invoke('command_name', args)`. Arguments serialize as JSON — keep payloads small and typed.
- **Capabilities.** Tauri's permission system: which windows/webviews can call which commands and access which APIs. Default-deny — you explicitly allow. Scope filesystem access narrowly.
- **Plugins.** Official and community plugins for mobile APIs: filesystem, dialog, notification, geolocation, barcode-scanner, biometrics, haptics, share. Add via cargo + JS package.
- **Mobile init.** `tauri mobile init` scaffolds Android (Gradle/Kotlin) and iOS (Xcode/Swift) projects inside your Tauri app. You need Android Studio / Xcode toolchains installed.
- **Permissions (OS-level).** Camera, location, notifications require entries in `AndroidManifest.xml` / `Info.plist` *and* runtime permission requests. Declare in config, request at point of use.
- **App identifiers.** Reverse-DNS bundle IDs (`com.example.app`) must match across config, stores, and signing — decide once, early.
- **Build flavors.** Debug builds for iteration (`tauri android dev` / `tauri ios dev` with a connected device or emulator); release builds for stores with proper signing.

## Practical workflow

**1. Scaffold.**
```bash
npm create tauri-app@latest   # or add to existing project
cd my-app
tauri mobile init              # generates android/ and ios/ projects
```

**2. Expose a command.**
```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
// register in Builder: .invoke_handler(tauri::generate_handler![greet])
```
```ts
import { invoke } from '@tauri-apps/api/core';
const msg = await invoke<string>('greet', { name: 'Ada' });
```

**3. Add a plugin (e.g., notifications).**
```bash
cargo add tauri-plugin-notification
npm i @tauri-apps/plugin-notification
```
Enable in capabilities JSON, request permission at runtime before first use.

**4. Configure capabilities.** In `capabilities/*.json`, allow exactly the commands and plugin APIs each window needs — e.g., the main window can call `greet` and `notification:*`, nothing else.

**5. Dev loop.** `tauri android dev` / `tauri ios dev` — hot-reloads the web frontend; Rust changes need rebuild. Test on real devices early: emulators hide permission and performance issues.

**6. Ship.** `tauri android build` → signed AAB; `tauri ios build` → archive for App Store Connect. Set up signing (keystore / Apple certificates) in CI; never commit signing secrets.

## Common pitfalls

- **Desktop assumptions.** Code that works in Tauri desktop may fail on mobile: no multiple windows the same way, different filesystem roots, backgrounding kills webviews.
- **Permission timing.** Requesting all permissions at launch triggers denials. Request each permission in context, right before the feature needs it, with a clear explanation.
- **Capability misconfiguration.** Overly broad capabilities (`*` everywhere) negate Tauri's security model; too narrow breaks features silently. Test every command path after tightening.
- **Blocking the UI thread.** Heavy Rust work on the command handler blocks IPC responses. Spawn async tasks / threads for long work and return progress via events.
- **Binary size creep.** Each plugin and dependency adds weight. Audit with release builds; strip symbols, enable LTO for shipping.
- **Store rejections.** Apple especially: explain background modes, don't request unused permissions, follow human-interface guidelines for the webview chrome. Read rejection-prone categories (payments, data collection) before submitting.
- **Hardcoded dev URLs.** The dev server URL in mobile config must be reachable from the device (LAN IP, not localhost). Use the `--host` flow Tauri documents for device testing.
- **Ignoring lifecycle.** Mobile apps suspend/resume; persist state on backgrounding and restore cleanly — users will background your app mid-task.
