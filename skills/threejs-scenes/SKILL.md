---
name: threejs-scenes
description: Direct 3D website scenes with Three.js: hero scenes, scroll-driven cameras, product stages, and art direction for the web. Use for website 3D sections and scenes.
category: web-development
---

# Three.js Scenes

A website-focused companion to Three.js fundamentals: hero scenes, scroll-driven cameras, product showcase stages, lighting for the web, and the art-direction decisions that make 3D sections feel intentional rather than tech-demo.

## Overview

Website 3D serves the page, not the other way around: a hero that loads fast and degrades gracefully, a product stage that invites interaction, scroll choreography that guides rather than distracts. This skill covers **scene design for websites** — composition, pacing, performance budgets per section, and fallbacks — assuming Three.js mechanics from threejs-pro.

## When to use

- 3D hero sections on marketing sites.
- Scroll-driven 3D storytelling (camera moves with scroll).
- Product showcase stages (rotate, zoom, variant switching).
- Deciding how much 3D a page can afford.

## Core concepts

- **One scene per section.** Isolate 3D sections as independent scenes/canvases — a failing or heavy hero shouldn't break the product stage. Lazy-init canvases near the viewport (IntersectionObserver).
- **Scroll choreography.** Map scroll progress (0→1 across the section) to camera path keyframes or object transforms; smooth with lerped values. Keep camera moves slow and purposeful — fast 3D scroll motion causes discomfort.
- **Product stage.** Studio lighting (key/fill/rim + environment), turntable or OrbitControls with damping and limits (min/max polar angle, zoom bounds), variant switching (swap materials, not models).
- **Hero composition.** 3D as backdrop or sidekick to headline copy — never competing with it. Generous negative space, slow ambient motion, pause when off-screen.
- **Section budgets.** Each 3D section gets a budget: e.g., hero ≤ 3MB assets, ≤ 100 draw calls, 60fps on a 3-year-old phone. Sum across sections for the page total.
- **Fallbacks.** `prefers-reduced-motion` → static frame or image; no WebGL → poster image; slow device → reduced pixel ratio / simplified scene. The page must work without 3D.

## Practical workflow

**1. Plan the section.**
- Purpose in one sentence (showcase product / set mood / explain concept).
- Storyboard: 3–5 keyframes of the scroll or interaction journey.
- Budget: assets MB, draw calls, target devices.

**2. Hero scene.**
```js
// lazy init when near viewport
const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { initHero(); io.disconnect(); }
}, { rootMargin: '400px' });
```
Ambient animation (slow rotation, floating particles), camera mostly fixed with subtle parallax on mouse (lerped, ±few degrees). Pause rendering when off-screen (`renderer.setAnimationLoop(null)` + resume).

**3. Scroll-driven section.**
```js
// progress from scroll position within the section
const progress = clamp((scrollY - sectionTop) / (sectionHeight - viewportH), 0, 1);
const smooth = lerp(current, progress, 0.08); // per frame
camera.position.lerpVectors(keyA, keyB, easeInOut(smooth));
object.rotation.y = smooth * Math.PI * 2;
```
Pin the section (position: sticky) while the canvas animates through keyframes — the standard scrollytelling pattern.

**4. Product stage.**
- OrbitControls: `enablePan = false`, polar limits, zoom limits, damping.
- Variant switching: preloaded materials, crossfade or instant swap; update UI state.
- Hotspots: HTML overlays positioned via `project()` each frame (easier than in-3D text).

**5. Performance per section.** Cap pixel ratio (1.5–2), pause off-screen loops, dispose on section unmount (SPA), total page draw calls under budget.

## Common pitfalls

- **3D competing with content.** Spinning chaos behind headline copy = unreadable. 3D supports the message; restraint is a feature.
- **No off-screen pausing.** Five 3D sections all rendering = dead battery. Pause loops outside the viewport.
- **Scroll-jacking the camera.** Tying camera 1:1 to raw scroll = nauseating. Smooth (lerp), ease, keep ranges modest.
- **Missing reduced-motion.** Auto-rotating, parallaxing scenes must respect `prefers-reduced-motion` — render a static composed frame instead.
- **Heavy heroes.** A 20MB hero that loads after the user scrolled past. Budget, compress, lazy-init, show poster first.
- **Unbounded controls.** OrbitControls without limits lets users get lost inside geometry. Constrain polar angle, distance, and target.
- **HTML/3D misalignment.** Hotspots or overlays drifting from 3D positions on resize — recompute projections on resize and per frame.
- **One giant scene.** Everything in one scene = one failure mode, one perf profile. Section isolation is resilience.
- **Forgetting mobile.** Touch controls, smaller screens, weaker GPUs — test the 3D sections on a mid-range phone, not just a desktop.
