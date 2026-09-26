---
name: webgl-pro
description: Work directly with WebGL: contexts, shaders (GLSL), buffers, textures, and debugging. Use when you need GPU control below library level.
category: web-development
---

# WebGL Pro

A practical guide to raw WebGL (WebGL2): contexts, GLSL shaders, buffers, textures, framebuffers, and debugging — for when Three.js/WebGPU are the wrong abstraction and you need direct GPU control.

## Overview

WebGL is the low-level GPU API: you write GLSL shaders, manage buffers, and issue draw calls yourself. It's verbose — a triangle takes ~100 lines — but it gives total control and the widest device support of any web GPU API. Legitimate uses: custom rendering engines, GLSL-heavy effects (shader art, post-processing), tiny-footprint graphics (no library weight), and learning how GPUs actually work.

WebGL2 (not 1) is the baseline: `webgl2` context, GLSL ES 3.00, transform feedback, instancing, integer textures.

## When to use

- Custom 2D/3D rendering where libraries add more weight than value.
- Shader-driven effects: fullscreen fragment shaders, particles, post-processing.
- Maximum compatibility (older devices lacking WebGPU).
- Understanding the layer beneath Three.js (debugging, custom ShaderMaterial).

## Core concepts

- **Context.** `canvas.getContext('webgl2', { antialias: true, alpha: false })`. Null = unsupported → fallback. Handle `webglcontextlost`/`webglcontextrestored`.
- **Shaders (GLSL ES 3.00).** Vertex shader (per-vertex: positions) + fragment shader (per-pixel: color). Compile → attach → link → `useProgram`. Check `COMPILE_STATUS`/`LINK_STATUS` and read the info log — always.
- **Buffers.** `createBuffer` → `bindBuffer(ARRAY_BUFFER)` → `bufferData` (upload) → `vertexAttribPointer` (layout) → `enableVertexAttribArray`. VAOs (`createVertexArray`) bundle attribute state.
- **Uniforms.** `getUniformLocation` + `uniform4f/Matrix4fv` — per-draw parameters (time, resolution, camera). Uniform locations per program; set after `useProgram`.
- **Textures.** `createTexture` → `texImage2D` (upload image/video/canvas) → parameters (filtering, wrapping, mipmaps). Flip Y for DOM images (`UNPACK_FLIP_Y_WEBGL`).
- **Framebuffers.** Render-to-texture for post-processing: `createFramebuffer` + texture attachment → render scene → use texture in a second pass.
- **Draw calls.** `drawArrays` (sequential vertices) / `drawElements` (indexed). Instancing (`drawArraysInstanced`) for repeated geometry.
- **State machine.** WebGL is stateful: bound buffers, enabled attributes, active textures are global state. Bugs = stale state. VAOs and disciplined bind/unbind discipline fix most.

## Practical workflow

**1. Boilerplate: compile shaders.**
```js
function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh));
  }
  return sh;
}
// link program, check LINK_STATUS the same way
```

**2. Fullscreen fragment shader (the effect workhorse).**
```glsl
#version 300 es
precision highp float;
uniform vec2 u_res; uniform float u_time;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  // ... your effect ...
  outColor = vec4(color, 1.0);
}
```
Render a single fullscreen triangle/quad; all the magic is in the fragment shader. `u_time`/`u_res` updated per frame.

**3. Textured quad.**
```js
// upload: gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
// params: gl.texParameteri(...TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.generateMipmap(...);
```

**4. Debug.** `gl.getError()` after suspicious calls during dev (or the `webgl-lint` style extensions); Spector.js captures frames and shows every call/state — the single best WebGL debugger.

**5. Resize.** `canvas.width = clientWidth * dpr; gl.viewport(0, 0, w, h)` — canvas backing store ≠ CSS size; mismatch = blur.

## Common pitfalls

- **Ignoring compile logs.** Black screen with no error = unchecked `COMPILE_STATUS`. Always check and log.
- **Stale state.** Forgetting to bind the right buffer/VAO before drawing = garbage or nothing. VAOs per object; bind before draw.
- **Attribute layout mismatch.** `vertexAttribPointer` stride/offset wrong = distorted geometry. Count bytes carefully (float = 4 bytes).
- **Y-flip confusion.** DOM images are top-down; GL textures bottom-up. `UNPACK_FLIP_Y_WEBGL` or flip UVs — pick one, be consistent.
- **Mipmap + NPOT.** Non-power-of-two textures with mipmap filtering fail on strict implementations. Use power-of-two or `CLAMP_TO_EDGE` + linear filtering.
- **Context loss.** GPUs reset; without `webglcontextlost` handling the canvas goes black permanently. Listen, and rebuild resources on restore.
- **Precision qualifiers.** Fragment shaders require `precision` statements; `highp` unsupported in some mobile fragment shaders — use `mediump` with care or feature-check.
- **Leaking GL objects.** Long sessions creating buffers/textures without `deleteBuffer`/`deleteTexture` exhaust GPU memory. Track and free.
- **Reinventing Three.js.** If you're rebuilding scene graphs, materials, and loaders by hand, stop — use the library. Raw WebGL is for shaders and special cases.
