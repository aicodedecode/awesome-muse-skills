---
name: 3d-designer
description: Create 3D visuals with modeling, texturing, lighting, rendering, and optimization for web and product.
category: creative-design
---

## Overview

3D design has moved from specialist VFX into everyday product work: marketing renders, product
visualizations, AR assets, and web experiences. This skill covers the practical 3D pipeline —
modeling, UVs/texturing, lighting, rendering — plus the optimization discipline needed for real-time
and web delivery, where polygon budgets and load times rule.

## When to use

- Creating product renders or marketing visuals

- Building 3D assets for web (WebGL) or AR

- Designing 3D illustrations or abstract brand art

- Preparing models for 3D printing or manufacturing viz

- Optimizing 3D assets for performance

## Core concepts

- - **The pipeline.** Model → UV unwrap → texture/material → light → render. Each stage builds on
  the last; skipping UVs or lighting and hoping the render saves you never works.
- - **Topology matters.** Clean quad-based topology with good edge flow deforms well (for animation)
  and subdivides cleanly. Triangles and n-gons are fine for static hard-surface work, poison for
  organic deformation.
- - **PBR materials.** Physically-based rendering: albedo, roughness, metalness, normal maps.
  Understand what each map does — 90% of "why does this look fake" is wrong roughness/metalness
  values.
- - **Lighting is everything.** Three-point lighting fundamentals, HDRI environments for realism,
  and the truth that great lighting saves mediocre models while bad lighting kills great ones. Study
  real-world light behavior.
- - **Composition and camera.** 3D scenes follow photographic rules: focal length choices (wide =
  dramatic, long = compressed), rule of thirds, depth of field for focus. Render like a
  photographer, not a technician.
- - **Optimization for delivery.** Web/AR assets need: low poly counts, baked textures, efficient
  materials, Draco/meshopt compression, and LODs. A 50MB model is a failed web asset regardless of
  beauty.

## Practical workflow

1. 1. **Define the output.** Still render? Turntable? Real-time web? AR? Print? The deliverable
   determines the entire pipeline (a web asset and a billboard render are different projects).
2. 2. **Block out first.** Rough primitive shapes establishing proportions and composition. Get the
   silhouette and camera right before any detail — 80% of a model's read is silhouette.
3. 3. **Model with intent.** Hard-surface: bevels catch highlights (never leave razor-sharp CG edges
   — real objects have micro-bevels). Organic: clean topology, reference anatomy. Keep poly counts
   appropriate to the output.
4. 4. **UV and texture.** Unwrap with minimal stretching, pack efficiently, paint or source PBR
   textures. For stylized work: define the material language (flat colors? gradients? toon shading?)
   and stay consistent.
5. 5. **Light the scene.** Key light (direction + mood), fill (soften shadows), rim (separation from
   background), environment (HDRI for reflections/ambient). Iterate lighting before final materials
   tweaks.
6. 6. **Render and post.** Appropriate samples (kill noise without wasting hours), render passes if
   compositing, then color grade: contrast, color balance, vignette. Post-production is where
   renders get their final 20%.
7. 7. **Optimize for the target.** Decimate/retopologize for real-time, bake high-poly detail to
   normal maps, compress textures (KTX2/Basis for web), test load time and frame rate on target
   devices.

## Common pitfalls

- - **No bevels.** Razor-sharp edges scream "CG." Real-world edges catch light — micro-bevels are
  the cheapest realism upgrade.
- - **Bad lighting.** Flat, single-source, or default lighting. Spend half your time on lighting;
  it's the highest-leverage stage.
- - **Texture stretching and seams.** Visible UV seams and stretched textures break immersion. Check
  UVs on a checker texture before final texturing.
- - **Ignoring scale.** Modeling without real-world units produces wrong-looking light falloff,
  depth of field, and physics. Model to scale, always.
- - **Over-detailed for the output.** Million-poly sculpts for a 200px web thumbnail. Match effort
  to the deliverable's actual resolution.
- - **No art direction.** Technically fine renders with no mood, story, or composition. 3D is a
  visual medium — direct it like one: what's the feeling, what's the focal point?
