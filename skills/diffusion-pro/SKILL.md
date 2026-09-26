---
name: diffusion-pro
description: Generate and edit images with diffusion models: prompting, seeds, CFG, img2img, inpainting, conditioning, and API integration. Use when adding AI image generation to apps or workflows.
category: development
---

# Diffusion Pro

A practical guide to working with diffusion image models in products and creative workflows: prompt craft, reproducibility, image-to-image, inpainting, conditioned generation, and integrating generation APIs reliably.

## Overview

Diffusion models generate images by iteratively denoising random noise, guided by a text prompt (and optionally reference images or spatial controls). Three knobs dominate output quality: the **prompt** (what), the **seed** (which random starting point), and **guidance strength** (how literally to follow the prompt). Master those, add negative prompts and img2img, and you can produce consistent, art-directable results instead of slot-machine outputs.

## When to use

- Adding text-to-image generation to an app (avatars, illustrations, marketing creatives, thumbnails).
- Editing images: inpainting (replace a region), outpainting (extend), img2img (restyle).
- Building consistent character/style sets with seeds and reference images.
- Choosing between hosted APIs and local inference.
- Handling moderation, attribution, and consent concerns.

## Core concepts

- **Text-to-image.** Prompt → noise → denoised image. Detailed prompts with subject, style, lighting, composition, and quality tags ("sharp focus, studio lighting") outperform single words.
- **Seed.** Fixes the initial noise. Same prompt + seed + settings = same image. Essential for reproducibility, variations, and consistent series.
- **Steps.** Denoising iterations (typically 20–50). More steps = finer detail, diminishing returns past ~40 for most models.
- **CFG / guidance scale.** How strongly the model obeys the prompt (typical 5–9). Too low = off-prompt drift; too high = oversaturated, artifacts.
- **Negative prompt.** What to exclude ("blurry, watermark, extra fingers"). As important as the positive prompt for clean output.
- **img2img.** Start from an existing image + noise strength (0–1). Low strength (~0.3) = subtle refinement; high (~0.8) = loose reinterpretation.
- **Inpainting.** Mask a region; the model regenerates only that area (remove objects, fix hands, change clothes). Mask feathering avoids hard edges.
- **Conditioning (ControlNet-style).** Extra inputs — edges, depth maps, poses, segmentation — that lock composition while the prompt controls style/content.
- **Adapters (LoRA).** Small fine-tuned weights that add a style, character, or concept on top of a base model without full retraining.
- **Upscaling.** Generate small, upscale after. Cheaper and often sharper than generating at full resolution directly.

## Practical workflow

**1. Pick the route.** Hosted API = zero infra, per-image cost, fastest start. Local (open weights) = privacy, no per-image cost, needs a real GPU (8GB+ VRAM minimum for SD-class models, more for large ones).

**2. Build a prompt template.**
```
[subject], [action/pose], [setting], [lighting], [style/medium], [quality tags]
Negative: blurry, low-res, watermark, deformed, extra limbs, text
```
Keep a library of tested templates per use case; freeform user prompts get wrapped in your template.

**3. Lock reproducibility.** Generate with a fixed seed during iteration; only randomize when exploring. Store prompt + seed + settings with every output (provenance matters for regeneration and debugging).

**4. Iterate deliberately.** Change one variable at a time: first prompt wording, then CFG (±1), then steps. Keep a contact sheet of variants — visual diffing beats memory.

**5. Edit, don't regenerate.** For fixes, use inpainting on the problem region rather than re-rolling the whole image — preserves what already works.

**6. Post-process.** Upscale, then light color/contrast correction. A 1024px generation upscaled to 2048 with mild sharpening beats a slow native 2048 generation.

**7. Integrate the API defensively.** Async job pattern (submit → poll/webhook → fetch), timeouts, retries with new seeds on moderation false-positives, and caching by prompt-hash.

## Common pitfalls

- **Slot-machine prompting.** Random seeds + vague prompts = unrepeatable luck. Templates, fixed seeds, versioned settings.
- **Ignoring safety filters.** Every serious deployment needs input/output moderation (CSAM, violence, hate). Hosted APIs include it; local deployments must add it — this is non-optional.
- **Face/identity issues.** Generating real people's likenesses without consent is a legal and ethical minefield; photorealistic faces of private individuals should be off-limits.
- **No provenance.** AI-generated images in products should be labeled as such where regulation or platform policy requires it; keep generation metadata regardless.
- **Style drift across a series.** Without fixed seeds, reference images, or adapters, "the same character" won't look the same twice. Lock identity with img2img from a canonical reference.
- **Text in images.** Diffusion models still mangle text. For typography-heavy designs, generate the background and composite real text over it.
- **VRAM surprises.** Local inference OOMs are common — use attention slicing, half precision, and tiled VAE for large images; check model requirements before promising local generation.
- **Cost blindness.** Per-image API costs compound in loops (4 variants × 3 retries × 1000 users). Cache, dedupe, and set per-user quotas.
