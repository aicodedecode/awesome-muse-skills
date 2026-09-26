---
name: tauri-pro
description: Professional Tauri: Rust backend + web frontend architecture, commands, security capabilities, and distribution. Use when writing, reviewing, or structuring Tauri apps.
category: development
---

# Tauri Pro

## Overview

Tauri builds **tiny, fast desktop apps**: a Rust backend for privileged work, a system webview for
UI (no bundled Chromium — small binaries, low memory), and a capability-based security model
controlling what the frontend may do. Professional Tauri means designing the command boundary well,
using capabilities to grant least privilege, keeping the Rust backend idiomatic, and handling
distribution (signing, updates) properly.

The through-line: Rust does the privileged work, the webview renders — and capabilities decide what
crosses between them.

## When to use

- Writing or reviewing Tauri (v1/v2) applications.
- Designing Tauri commands and the frontend/backend contract.
- Configuring capabilities, permissions, and security.
- Structuring the Rust backend (state, async, plugins).
- Packaging, signing, and shipping Tauri updates.

## Core concepts

- **Architecture: Rust core + webview UI.** Backend in Rust (commands, system access, heavy
  computation); frontend in any web stack (React, Svelte, vanilla) running in the OS webview.
  Commands (`#[tauri::command]`) are the typed RPC boundary — design them like an API.
- **Commands as the contract.** Async commands for I/O, serializable args/returns (serde),
  `Result<T, E>` for typed errors surfaced to JS. Validate frontend input in commands (the
  webview is untrusted input, like any client). Keep commands coarse-grained — chatty
  command-per-keystroke patterns waste the boundary.
- **Capability-based security (v2).** Fine-grained permissions: which windows can call which
  commands, which FS paths are accessible, which HTTP hosts are reachable. Default-deny;
  grant per-window, per-capability. This is Tauri's security superpower — use it deliberately,
  not with blanket `*` permissions.
- **State management in Rust.** `tauri::State<T>` for managed shared state (with `Mutex`/`RwLock`
  inside for interior mutability); events (`emit`/`listen`) for backend→frontend pushes;
  channels for streaming. Don't shuttle all state through commands on every render.
- **Plugins for platform features.** Official plugins (fs, http, notification, updater, dialog…)
  with their own capability-gated permissions. Prefer maintained plugins over hand-rolled FFI —
  and audit the permissions each plugin requests.
- **Small binaries, real distribution.** ~10MB apps vs Electron's ~100MB+; bundling per OS
  (dmg/app, msi/nsis, AppImage/deb/rpm); signing + notarization; built-in updater with signed
  artifacts. Test installed artifacts per platform.

## Practical workflow

1. **Scaffold:** `npm create tauri-app` (or cargo); choose frontend stack; v2 capabilities from
   the start — don't develop with permissive caps "temporarily."
2. **Design the command surface.** List backend operations; define commands with typed
   inputs/outputs; share types between Rust and TS where practical (typeshare or manual mirrors
   kept in sync by tests).
3. **Configure capabilities.** Per-window capability files granting exactly the commands, FS
   scopes, and network hosts each window needs. Review capability diffs like security policy changes.
4. **Write idiomatic Rust backend.** Commands thin (validate → delegate to modules); business
   logic in plain Rust modules (testable without Tauri); async with tokio; errors as typed
   enums serialized for the frontend.
5. **Build the frontend normally.** It's a web app — standard patterns apply; call commands via
   the typed `invoke`; listen for backend events where push is needed; handle the offline/desktop
   lifecycle (window events, single-instance, deep links).
6. **Ship securely.** Sign + notarize; updater with signature verification; staged rollouts;
   crash/error reporting with consent. Verify the update path (old → new) on each OS.

Command + capability sketch:

```rust
// Rust: typed command, validated input, typed error
#[tauri::command]
async fn read_report(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<Report, ReportError> {
    let safe_name = validate_report_name(&name)?; // webview input is untrusted
    let store = state.reports.lock().unwrap();
    store.get(&safe_name).cloned().ok_or(ReportError::NotFound)
}
```

```jsonc
// capabilities/main.json — least privilege per window
{
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    { "identifier": "fs:allow-read-file", "allow": [{ "path": "$APPDATA/reports/*" }] },
    "http:default"
  ]
}
```

```ts
// Frontend: typed invoke
import { invoke } from "@tauri-apps/api/core";
const report = await invoke<Report>("read_report", { name });
```

## Common pitfalls

- **Blanket capabilities.** `"fs:allow-read-file"` with `**` scope or `http:allow-fetch` to `*`
  — forfeits the security model. Scope to exactly what's needed, per window.
- **Trusting the webview.** Commands that skip validation because "it's our UI." The webview runs
  attacker-influenceable content (XSS, devtools) — validate like a server API.
- **Chatty commands.** Dozens of tiny commands called in loops — serialization overhead and
  complexity. Batch; design command granularity around use cases.
- **Blocking the Rust runtime.** Long sync work in commands blocks the async runtime. `spawn_blocking`
  for CPU work; async I/O natively.
- **Frontend doing backend's job.** File access, crypto, or business rules in JS that Rust should
  own (and capability-gate). The split exists for security — respect it.
- **Untested update path.** Updater configured but never tested old→new on a real machine.
  Updates are the highest-stakes feature — test them like one.
- **Ignoring webview differences.** WKWebView (macOS), WebView2 (Windows), WebKitGTK (Linux)
  have real behavior differences. Test all three; polyfill deliberately.
