---
name: threejs-pro
description: Build 3D with Three.js: scenes, cameras, lighting, materials, animation loop, loaders, and performance. Use for programmatic 3D graphics in the browser.
category: development
---

# Three.js Pro

A practical guide to Three.js: the standard library for programmatic 3D in the browser — scene setup, cameras, lights, materials, the animation loop, asset loading, post-processing, and performance.

## Overview

Three.js wraps WebGL in a scene-graph API: you compose **scenes** of meshes, lights, and cameras, and the renderer draws them each frame. It handles the GPU plumbing; you handle the 3D thinking (transforms, materials, lighting) and the performance budget. Pairs with the 3d-web-experiences skill (which covers art direction and asset pipeline); this one is the code-level reference.

## When to use

- Programmatic 3D: scenes built in code rather than loaded models.
- Product viewers, configurators, data viz in 3D.
- Custom shaders (`ShaderMaterial`, `onBeforeCompile`).
- Post-processing pipelines (bloom, DOF, outlines).
- React integration via React Three Fiber (same concepts, declarative).

## Core concepts

- **Renderer / Scene / Camera.** `WebGLRenderer({ antialias: true })`; `Scene` holds everything; `PerspectiveCamera(fov, aspect, near, far)` (or Orthographic for isometric/data viz).
- **Mesh = Geometry + Material.** `BoxGeometry`, `SphereGeometry`, `PlaneGeometry`, `BufferGeometry` (custom); materials: `MeshStandardMaterial` (PBR), `MeshBasicMaterial` (unlit), `ShaderMaterial` (custom GLSL).
- **Transforms.** Position/rotation/scale on `Object3D`; groups for hierarchies. Remember: rotation order matters; use quaternions for interpolation.
- **Lights.** Ambient/hemisphere (fill), Directional (sun + shadows), Point/Spot (local). Physical falloff in newer versions — `useLegacyLights` is gone; intensities are in physical units.
- **Shadows.** `renderer.shadowMap.enabled = true`; per-light `castShadow` + per-mesh `castShadow`/`receiveShadow`. One shadow light for perf; tune `shadow.camera` bounds tightly.
- **Loaders.** `GLTFLoader` (models), `TextureLoader`, `RGBELoader` (HDRI environments), `DRACOLoader` (compressed meshes). All async — design loading UX.
- **Animation loop.** `renderer.setAnimationLoop(tick)` (XR-compatible) with `THREE.Clock` delta; clamp delta to avoid tab-switch jumps.
- **Raycasting.** `Raycaster` for picking (click/drag objects), with pointer NDC conversion. Essential for configurators.
- **Post-processing.** `EffectComposer` + passes (RenderPass, UnrealBloomPass, OutputPass). Powerful but expensive — budget it.

## Practical workflow

**1. Boilerplate.**
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth; requires controls.update() in loop
```

**2. Lights + environment.**
```js
scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(5, 8, 3); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);
// PBR reflections:
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
```

**3. Animate.**
```js
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  controls.update();
  // update animations with dt
  renderer.render(scene, camera);
});
```

**4. Resize.** Update camera aspect + renderer size on window resize (ResizeObserver on container).

**5. Dispose.** On teardown: traverse scene, `geometry.dispose()`, `material.dispose()`, textures too; `renderer.dispose()`.

## Common pitfalls

- **Forgetting `controls.update()`.** Damping/auto-rotate silently do nothing without it in the loop.
- **Shadow camera too big.** Default shadow camera covers a huge area → blurry shadows. Tighten `left/right/top/bottom` to the scene's bounds.
- **No tone mapping / wrong color space.** Washed-out or oversaturated renders. `ACESFilmicToneMapping` + `outputColorSpace = SRGBColorSpace` (default in recent versions — verify).
- **Leaking GPU resources.** SPA navigation between 3D views without dispose = VRAM leak → crash. Dispose geometries/materials/textures/render targets.
- **Pixel ratio uncapped.** `setPixelRatio(devicePixelRatio)` on 3x displays = 9x fill cost. Cap at 2, lower for heavy scenes.
- **Z-fighting.** Coplanar geometry flickers; use `polygonOffset` or small separations.
- **Blocking on load.** Awaiting all assets before first frame = long blank. Progressive: show scene shell, stream assets with progress.
- **Raycast on every mousemove against everything.** Expensive with many meshes. Throttle, raycast against a curated pick-list, or use bounding-sphere prechecks.
- **Version API drift.** Three.js moves fast (lights physical units, color space defaults). Pin the version; read migration notes on upgrade.
