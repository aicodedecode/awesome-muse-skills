---
name: webxr-experiences
description: Build WebXR AR/VR experiences in the browser: sessions, controllers, hit-testing, anchors, and performance for immersive web apps. Use when creating browser-based AR or VR.
category: development
---

# WebXR Experiences

A practical guide to building augmented and virtual reality experiences that run in the browser via WebXR: session setup, input, AR hit-testing and anchors, VR locomotion, and the performance discipline immersive rendering demands.

## Overview

WebXR exposes XR hardware (VR headsets, AR-capable phones) to web pages through a session-based API. A session is either `immersive-vr` (full virtual environment) or `immersive-ar` (camera passthrough with virtual overlays). The browser owns the render loop (`XRSession.requestAnimationFrame`); your job is to submit frames from the headset's pose each tick, at a rock-solid framerate — dropped frames in XR cause motion sickness, not just jank.

Most WebXR apps are built on three.js (or Babylon.js) with its WebXR helpers, which handle session negotiation, camera rigs, and controller models.

## When to use

- VR product viewers, training simulations, virtual tours.
- AR try-on, furniture placement, or measurement tools on phones.
- 360° media viewers with headset support.
- Deciding between WebXR and native XR SDKs.
- Debugging session startup failures and tracking loss.

## Core concepts

- **Session modes.** `immersive-vr` replaces vision; `immersive-ar` composites over the camera feed. `inline` is a magic-window fallback on a regular page. Always feature-detect (`navigator.xr.isSessionSupported`) and offer graceful 2D fallback.
- **Reference spaces.** `local-floor` (standing, gravity-aligned — best default), `local` (seated), `bounded-floor` (room-scale with bounds), `viewer` (head-locked, for inline). Pick per experience; floor-level spaces need no calibration.
- **Render loop.** `session.requestAnimationFrame(onFrame)` gives you `XRFrame` with viewer poses. Render each `XRView` (one per eye) to the session's framebuffer via the WebGL layer.
- **Input sources.** `session.inputSources` — controllers, hands. `targetRaySpace` for pointing, `gripSpace` for held position. Handle `selectstart/selectend` for trigger pulls.
- **Hit testing (AR).** `requestHitTestSource` casts rays into the real world to find planes — the basis of "tap to place object." Requires the `hit-test` feature.
- **Anchors.** Persist virtual content at real-world positions; without anchors, placed objects drift as tracking refines.
- **Hand tracking.** `hand-tracking` feature exposes 25 joints per hand — powerful but less precise than controllers; design chunky targets.
- **Features are optional.** Request features (`local-floor`, `hit-test`, `anchors`, `hand-tracking`) and degrade when denied — hardware varies wildly.

## Practical workflow

**1. Bootstrap with a framework.**
```js
// three.js pattern
renderer.xr.enabled = true;
const session = await navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['hit-test', 'local-floor'],
  optionalFeatures: ['anchors', 'hand-tracking']
});
renderer.xr.setSession(session);
```
Wrap in try/catch — session requests fail for a dozen benign reasons (no headset, user gesture missing, HTTPS required).

**2. Build the scene XR-first.** Scale in meters (1 unit = 1m), place UI at comfortable distances (0.8–3m), keep text large. Design for 72–120fps from the start.

**3. Add interaction.** Raycast from controller `targetRaySpace` against interactables; highlight on hover, trigger on select. For AR placement: hit-test on tap → create anchor → attach object.

**4. Handle session lifecycle.** `sessionstart`/`sessionend` events; pause app logic when the session ends; release resources. The user can exit at any time via system UI — your app must survive it.

**5. Test without hardware.** Browser XR emulators let you simulate headsets, controllers, and AR planes on desktop — use them for iteration, real devices for validation.

**6. Performance pass.** See 3d-web-experiences discipline, tightened: XR effectively renders the scene twice (stereo). Budget ~5ms CPU per frame on mobile-class GPUs.

## Common pitfalls

- **No HTTPS.** WebXR requires a secure context — `http://localhost` works, anything else needs HTTPS. A top "it works on my machine" failure.
- **Missing user gesture.** `requestSession` for immersive modes must come from a user gesture (button tap). Auto-starting on load fails silently.
- **Assuming features exist.** Requesting `anchors` on a device without support throws. Mark non-critical features optional and check `session.enabledFeatures`.
- **Motion sickness.** Smooth artificial locomotion, low framerates, and horizon mismatch cause nausea. Prefer teleportation, maintain target fps, lock the horizon.
- **Tiny UI.** Text readable on desktop is illegible in a headset. Minimum comfortable text is roughly 2–3cm tall at 1m distance; test on-device.
- **Ignoring tracking loss.** When tracking degrades, freeze or fade content rather than letting it swim — swimming breaks presence and comfort.
- **DPR blindness.** Headsets have high pixel density; rendering at full resolution doubles GPU cost. Use the XR layer's recommended resolution and dynamic resolution scaling.
- **No 2D fallback.** Many users have no XR hardware. Ship a magic-window / orbit-controls fallback so the content is still usable.
