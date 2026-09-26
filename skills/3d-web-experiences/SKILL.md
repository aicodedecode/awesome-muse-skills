---
name: 3d-web-experiences
description: Create 3D web experiences: scene setup, models, materials, lighting, animation, scroll-driven scenes, and performance budgets. Use when adding 3D to websites beyond basic demos.
category: development
---

# 3D Web Experiences

A practical guide to shipping 3D on the web — product viewers, hero scenes, scroll-driven storytelling, configurators — with an emphasis on the asset pipeline and performance budgets that separate smooth experiences from janky tech demos.

## Overview

Web 3D = WebGL (or WebGPU) + a scene graph library (three.js dominates) + 3D assets + disciplined performance work. The hard parts are rarely the rendering code: they're **asset weight** (a 50MB model kills mobile), **draw calls** (hundreds of meshes = slow), and **frame budget** (16.6ms at 60fps, less on low-end devices).

Rule of thumb: design the experience for the weakest device you support, then enhance — not the reverse.

## When to use

- 3D product viewers and configurators (color/material/parts switching).
- Animated hero scenes and scroll-driven 3D storytelling.
- Interactive data visualizations in 3D.
- Choosing model formats and compression.
- Diagnosing 3D performance problems.

## Core concepts

- **Scene graph.** Scene → meshes (geometry + material) → lights → camera. Everything is a positioned node; groups organize parts.
- **Geometry.** BufferGeometry of triangles. Polygon count is a budget: hero models 50–200k tris desktop, far less for mobile; background props much less.
- **Materials.** PBR (physically based rendering): `MeshStandardMaterial` with color/roughness/metalness maps. Fewer unique materials = fewer shader programs = faster.
- **Lighting.** Key + fill + rim, or environment maps (IBL) for realistic reflections. Real-time shadows are expensive — one shadow-casting light max on mobile, or bake shadows into textures.
- **glTF.** The standard interchange format. Prefer `.glb` (binary) with Draco mesh compression and KTX2/Basis texture compression.
- **Animation.** `requestAnimationFrame` loop with delta-time (never fixed steps); `THREE.AnimationMixer` for skeletal/glTF animations; lerp for smooth interpolation.
- **Scroll-driven scenes.** Map scroll progress → camera path / object transforms. Use a smoothed (lerped) scroll value, never raw scroll events, to avoid judder.
- **Draw calls.** Each mesh+material = at least one draw call. Merge static geometry, use instancing (`InstancedMesh`) for repeated objects (grass, bolts, stars).

## Practical workflow

**1. Prepare assets first.**
```bash
# Typical pipeline: Blender -> glTF -> compress
# - Apply transforms, merge materials, bake AO/shadows where possible
# - Export .glb, then compress:
gltfpack -i model.glb -o model-packed.glb -cc   # meshopt compression
```
Target: hero model under 3–5MB, textures ≤2048px (1024 for mobile), KTX2 compressed.

**2. Scaffold the scene.**
```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.environment = await loadEnvironment(); // RoomEnvironment or HDRI for PBR reflections
```

**3. Load with feedback.** Show a real loading UI with progress (`onProgress` bytes) — 3D assets are heavy; a blank canvas reads as broken.

**4. Animate correctly.**
```js
const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05); // clamp tab-switch spikes
  controls.update();
  mixer?.update(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
```

**5. Budget and measure.** Use the browser's frame profiler + `renderer.info` (draw calls, triangles, geometries). Set budgets: e.g., <150 draw calls, <500k tris, <10MB assets for a marketing hero.

**6. Degrade gracefully.** `WebGL2` check → fallback to a static image or video. Respect `prefers-reduced-motion` (pause auto-rotation/camera moves).

## Common pitfalls

- **Uncompressed assets.** Shipping raw 40MB FBX/OBJ exports. glTF + meshopt/Draco + KTX2 routinely cuts 80–95%.
- **Draw call explosion.** A model with 300 separate meshes renders 300+ draw calls. Merge, instance, or atlas.
- **Pixel ratio blindness.** `setPixelRatio(devicePixelRatio)` on a 3x phone = 9x pixels. Cap at 2 (or 1.5 for heavy scenes).
- **Shadow abuse.** Multiple shadow-casting lights or huge shadow maps tank mobile GPUs. One directional light with tight shadow camera, or baked shadows.
- **Memory leaks.** Geometries, materials, and textures not disposed on scene teardown (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`). SPAs navigating between 3D views leak fast.
- **Z-fighting.** Coplanar surfaces flicker — offset with polygonOffset or tiny positional gaps.
- **Blocking the main thread.** Parsing a big glTF synchronously freezes the page. Load async, show progress, consider Web Workers for heavy prep.
- **No loading state.** Users stare at black. Always: skeleton → progress → reveal.
- **Ignoring color management.** Set `renderer.outputColorSpace = SRGBColorSpace` and use sRGB textures correctly, or colors look washed out/wrong.
