---
name: pillow-pro
description: Automate image processing in Python with Pillow for resizing, watermarking, thumbnails, and batch pipelines.
category: media
---

## Overview

Pillow (PIL) is Python's workhorse for programmatic image processing: resizing, cropping,
watermarking, format conversion, thumbnails, and batch pipelines. When you need to process hundreds
of images identically — or build image handling into an application — Pillow beats manual tools.
This skill covers practical Pillow patterns for real production tasks.

## When to use

- Batch resizing, converting, or watermarking images in Python

- Generating thumbnails and responsive image variants

- Compositing text/graphics onto images (memes, certificates, OG images)

- Building image pipelines in web apps or scripts

- Analyzing image properties (dimensions, mode, EXIF)

## Core concepts

- - **Open, transform, save.** The core loop: `Image.open()` → operations (chainable) → `save()`
  with format-specific options. Pillow is lazy — operations queue until save/show, and `open()`
  doesn't load pixel data until needed.
- - **Modes matter.** `RGB` (standard), `RGBA` (transparency), `L` (grayscale), `P` (palette).
  Compositing requires matching modes — convert explicitly (`img.convert("RGBA")`) rather than
  debugging cryptic errors.
- - **Resampling filters.** `Image.LANCZOS` for high-quality downscaling, `Image.BICUBIC` for
  general use, `Image.NEAREST` for pixel art (preserves hard edges). The default is fast but ugly —
  always specify.
- - **`thumbnail()` vs `resize()`.** `thumbnail()` modifies in place, preserves aspect ratio, never
  enlarges — perfect for preview generation. `resize()` gives exact dimensions (may distort) — use
  with computed aspect-preserving math.
- - **EXIF orientation.** Phone photos carry rotation in EXIF, not pixels.
  `ImageOps.exif_transpose(img)` applies it — skip this and portraits come out sideways. Do it
  first, always.
- - **Memory discipline.** Large batches: process one image at a time, explicitly `close()` or use
  context managers, and avoid holding all images in a list. A 1000-image batch that loads everything
  will OOM.

## Practical workflow

1. 1. **Set up the pipeline.** Input dir, output dir (never overwrite sources), consistent naming,
   and a log of what was processed. Pillow scripts should be idempotent — safe to re-run.
2. 2. **Normalize inputs.** Apply `exif_transpose`, convert to working mode (usually RGB/RGBA), and
   validate (catch corrupt files with try/except — real-world folders always contain one).
3. 3. **Apply transforms.** Resize/crop per spec. For aspect-safe crops: compute the target box from
   the center or use `ImageOps.fit(img, (w, h), Image.LANCZOS)` which crops-to-fill elegantly.
4. 4. **Composite overlays.** Watermarks: create an RGBA overlay layer, `alpha_composite` or `paste`
   with mask. Text: `ImageDraw` with a loaded TrueType font (`ImageFont.truetype`), computing text
   size with `draw.textbbox` for centering.
5. 5. **Optimize on save.** JPEG: `quality=82, optimize=True, progressive=True`. PNG:
   `optimize=True`. WebP: `quality=80, method=6`. Strip EXIF on save unless needed (`exif=b""` or
   omit).
6. 6. **Batch it.** Loop with progress reporting, error isolation per file (one bad image shouldn't
   kill the batch), and a summary at the end. Example skeleton:

```python
from PIL import Image, ImageOps
from pathlib import Path

SRC, DST = Path("input"), Path("output")
DST.mkdir(exist_ok=True)
for p in SRC.glob("*.jpg"):
    try:
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((1600, 1600), Image.LANCZOS)
            im.save(DST / p.with_suffix(".webp").name,
                    "WEBP", quality=80, method=6)
    except Exception as e:
        print(f"SKIP {p.name}: {e}")
```

7. 7. **Verify outputs.** Spot-check dimensions, file sizes, and visual quality. Check a few images
   at 100% — a wrong resample filter or quality setting poisons the whole batch silently.

## Common pitfalls

- - **Sideways phone photos.** Forgetting `exif_transpose` — the classic Pillow bug. It affects
  nearly every phone image; handle it unconditionally.
- - **Default resampling.** `resize()` without a filter uses NEAREST — blocky and ugly. Always pass
  `Image.LANCZOS` (downscale) explicitly.
- - **Mode mismatch errors.** Pasting RGBA onto RGB, or drawing on palette images. Convert to a
  common mode first; the error messages won't tell you plainly.
- - **Memory blowups.** Loading thousands of images into a list, or keeping references alive in a
  loop. Process streaming-style, one at a time.
- - **JPEG quality roulette.** Saving with default quality (75) when you wanted 90, or vice versa.
  Set quality deliberately per use case and document it.
- - **Overwriting sources.** Saving processed images back into the source folder with the same
  names. One bug away from destroying originals — always write to a separate output directory.
