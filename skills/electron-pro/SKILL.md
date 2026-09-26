---
name: electron-pro
description: Professional Electron: main/renderer architecture, IPC, security hardening, packaging, and auto-updates. Use when writing, reviewing, or structuring Electron apps.
category: development
---

# Electron Pro

## Overview

Electron ships **desktop apps with web tech** — but it's Chromium + Node with real security and
performance obligations. Professional Electron means respecting the process model (main vs
renderer), hardening aggressively (a renderer is an untrusted browser), keeping IPC tight and
typed, and nailing the unglamorous parts: packaging, signing, auto-updates, and startup performance.

The through-line: the renderer is hostile territory — harden it like a browser, and keep privileged
work in main behind a minimal, validated IPC surface.

## When to use

- Writing or reviewing Electron applications.
- Designing main/renderer architecture and IPC contracts.
- Hardening Electron security (CSP, context isolation, permissions).
- Packaging, code-signing, and shipping auto-updates.
- Debugging performance (startup time, memory) or IPC issues.

## Core concepts

- **Process model.** Main process (Node.js, privileged: windows, filesystem, native APIs);
  renderer processes (Chromium per window, untrusted); preload scripts (the bridge — runs with
  Node access before page load, exposes a curated API via `contextBridge`). Utility processes for
  heavy work off the main thread.
- **Security hardening (non-negotiable).** `contextIsolation: true`, `nodeIntegration: false`,
  `sandbox: true`, strict Content Security Policy, no `allowRunningInsecureContent`, permission
  requests default-deny with explicit allowlist. Treat every renderer as compromised-by-default —
  validate everything crossing IPC.
- **IPC: minimal and typed.** `ipcMain.handle`/`ipcRenderer.invoke` for request/response;
  preload exposes only what's needed via `contextBridge.exposeInMainWorld`. Define the IPC
  contract as typed functions (shared types package) — not stringly-typed channel names scattered
  everywhere. Validate all renderer-supplied arguments in main (it's attacker input).
- **State and data flow.** Renderer UI state stays in the renderer (React/Vue as usual); main owns
  windows, menus, tray, and privileged operations; persistent data via main-side stores or safe
  renderer storage. Don't ship the whole app state across IPC on every change.
- **Packaging and distribution.** electron-builder (or forge): per-platform targets, code signing
  (required for macOS Gatekeeper/Windows SmartScreen sanity), notarization for macOS, and
  auto-updates (electron-updater with signed updates over HTTPS). Test the installed artifact —
  dev-mode behavior differs.
- **Performance.** Startup time is the UX: defer non-critical init, lazy-load windows, keep the
  main process lean (it's single-threaded — heavy work goes to utility processes/workers),
  and watch memory (each window is a Chromium instance — don't spawn carelessly).

## Practical workflow

1. **Scaffold securely.** electron-vite / forge template; security flags on from the first
   `BrowserWindow`; CSP meta; preload-only bridge. Lint the security checklist in review.
2. **Design the IPC contract first.** List every main↔renderer operation; define typed handlers;
   validate inputs in main; keep the surface minimal — each exposed API is attack surface.
3. **Build the main process thin.** Window management, app lifecycle, menus/tray, IPC handlers
   delegating to modules. Heavy lifting (parsing, crypto, sync engines) in utility processes.
4. **Harden the renderers.** CSP, no Node integration, sandbox on, permission handler denying by
   default, `webSecurity` on, and no loading of remote content without explicit trust decisions
   (remote content + privileged bridge = RCE).
5. **Ship the pipeline.** Build per platform in CI (sign + notarize macOS, sign Windows),
   auto-update feed (GitHub releases/S3 + electron-updater), staged rollouts, and crash reporting
   (with user consent and PII care).
6. **Test the real artifact.** Install the packaged app on each OS; test fresh install, update
   path (old version → new), offline launch, and permission flows. Dev-mode testing misses
   packaging bugs.

Preload bridge pattern:

```js
// preload.js — the ONLY code with both worlds; keep it tiny and boring
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Typed, minimal surface — no raw ipcRenderer exposure
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  onFileChanged: (cb) => ipcRenderer.on('file:changed', (_e, path) => cb(path)),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
});
```

```js
// main.js — validate everything from the renderer
ipcMain.handle('settings:save', async (_event, settings) => {
  const parsed = SettingsSchema.parse(settings); // validate: renderer is untrusted
  await store.save(parsed);
});
```

## Common pitfalls

- **`nodeIntegration: true` or disabled context isolation.** The classic Electron RCE — any XSS
  becomes full system compromise. Never disable the sandbox/isolation for convenience.
- **Over-exposed preload APIs.** Exposing raw `ipcRenderer` or broad "do anything" bridges.
  Minimal typed surface; each method validated main-side.
- **Loading remote content with a privileged bridge.** Remote URL + Node-capable preload = remote
  code execution. Either sandbox remote content hard or don't load it.
- **Main-process blocking.** Heavy sync work in main freezes every window (it's one thread).
  Utility processes/workers for heavy lifting; main stays responsive.
- **Unsigned/unnotarized releases.** Users hit Gatekeeper/SmartScreen walls; auto-update fails
  silently. Signing isn't optional for real distribution.
- **No update strategy.** Shipping 1.0 with no auto-update path strands users on buggy versions.
  Updates from day one, with staged rollouts and rollback plans.
- **Storing secrets in the renderer.** API keys in renderer code/bundles are extractable.
  Secrets live main-side (or in the OS keychain via safeStorage), never in shipped JS.
