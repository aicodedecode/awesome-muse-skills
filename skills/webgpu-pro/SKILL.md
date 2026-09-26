---
name: webgpu-pro
description: Build WebGPU applications: device setup, pipelines, shaders (WGSL), buffers, compute passes, and fallbacks. Use when targeting next-gen GPU compute/graphics in the browser.
category: development
---

# WebGPU Pro

A practical guide to WebGPU: requesting devices, writing WGSL shaders, building render and compute pipelines, managing buffers, and shipping with graceful fallbacks for browsers without support.

## Overview

WebGPU is the modern GPU API for the web — lower overhead than WebGL, explicit resource management, and first-class **compute shaders** for GPGPU work (physics, image processing, ML inference) alongside rendering. It's lower-level than WebGL by design: you describe pipelines, bind groups, and command encoders explicitly, and the driver does less guessing.

The mental model: **device → pipelines (how to draw/compute) → bind groups (what data) → command encoder (the work list) → queue.submit (go).**

## When to use

- GPU compute in the browser: simulations, image/video processing, procedural generation.
- High-performance rendering that outgrows WebGL (many draw calls, complex scenes).
- ML inference acceleration on the client.
- Learning modern GPU programming concepts (explicit APIs like Vulkan/Metal/D3D12).
- Deciding whether WebGPU is appropriate vs WebGL (support is broad but not universal).

## Core concepts

- **Adapter & device.** `navigator.gpu.requestAdapter()` picks the GPU; `adapter.requestDevice()` creates the logical device. Handle `null` adapter — no WebGPU on this browser/device.
- **WGSL.** WebGPU Shading Language: Rust-flavored, explicit types. Separate `@vertex`, `@fragment`, `@compute` entry points in shader modules.
- **Pipelines.** `GPURenderPipeline` (vertex+fragment, fixed state: topology, blending, depth) and `GPUComputePipeline`. Pipelines are immutable and somewhat expensive to create — create up front, reuse.
- **Buffers.** `GPUBuffer` with usage flags (`VERTEX`, `INDEX`, `UNIFORM`, `STORAGE`, `COPY_DST`, `MAP_READ`). Usage flags are mandatory and checked — a buffer without the right flag can't be used that way.
- **Bind groups.** Bind buffers/textures/samplers to shader slots (`@group(0) @binding(0)`). Layout must match the pipeline's expectations exactly.
- **Command encoding.** `createCommandEncoder()` → render/compute passes → `encoder.finish()` → `queue.submit([commandBuffer])`. Recording is cheap; submission is the sync point.
- **Canvas context.** `canvas.getContext('webgpu')`, `configure()` with the preferred format. Resize handling: reconfigure on canvas size change.
- **Async mapping.** Read GPU results with `buffer.mapAsync(GPUMapMode.READ)` — it's async; never block waiting.
- **Limits.** Devices expose limits (max buffer size, workgroup sizes); request higher limits explicitly when needed and handle denial.

## Practical workflow

**1. Feature-detect and bootstrap.**
```js
if (!navigator.gpu) { /* fall back to WebGL2 or 2D */ }
const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
const device = await adapter.requestDevice();
device.lost.then(info => console.error('Device lost:', info.reason)); // handle context loss
```

**2. Write a minimal render pipeline (WGSL).**
```wgsl
@vertex
fn vs(@builtin(vertex_index) i : u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(vec2<f32>(0.0, 0.5), vec2<f32>(-0.5, -0.5), vec2<f32>(0.5, -0.5));
  return vec4<f32>(pos[i], 0.0, 1.0);
}
@fragment
fn fs() -> @location(0) vec4<f32> { return vec4<f32>(1.0, 0.4, 0.1, 1.0); }
```

**3. Compute pattern (e.g., array processing).**
```js
// create STORAGE buffers with COPY_SRC|COPY_DST for readback,
// a compute pipeline with workgroup_size(64),
// dispatchWorkgroups(Math.ceil(N / 64)), submit, mapAsync, read results.
```

**4. Frame loop.** Acquire current texture → encode render pass → submit. Keep per-frame allocations out of the hot loop (reuse encoders' descriptor objects where sensible, reuse buffers).

**5. Debug.** Enable `device.pushErrorScope('validation')` / `popErrorScope()` around suspicious code during development — WebGPU validates aggressively and tells you exactly what mismatched.

**6. Fallback strategy.** WebGPU → WebGL2 → static/canvas fallback. Abstract the "renderer" behind an interface so the app doesn't care which backend won.

## Common pitfalls

- **Forgetting usage flags.** `createBuffer` without `GPUBufferUsage.STORAGE` then using it as storage = validation error. Plan buffer roles up front.
- **Bind group / shader mismatch.** `@binding(1)` in WGSL but bound at index 0 silently fails validation. Keep a table of group/binding assignments per pipeline.
- **Creating pipelines per frame.** Pipeline creation compiles shaders — do it once at init; cache by configuration key.
- **Ignoring device loss.** GPUs reset; `device.lost` fires and everything must be recreated. Handle it or the app dies on driver hiccups.
- **Synchronous readback fantasies.** `mapAsync` is async for a reason — structure compute as submit → await → consume, never spin-wait.
- **Workgroup size errors.** `@workgroup_size(256)` on hardware with max 128 fails. Query `adapter.limits.maxComputeWorkgroupSize*` or stay conservative (64).
- **Canvas sizing.** Forgetting to reconfigure the context on resize = stretched/blank rendering. Observe with ResizeObserver.
- **Assuming universal support.** Check support per browser/version; enterprise/older devices lag. The fallback path is part of the feature, not an afterthought.
- **Over-engineering.** WebGPU's explicitness tempts gold-plating. If WebGL2 meets the perf budget, it's the simpler, wider-supported choice.
