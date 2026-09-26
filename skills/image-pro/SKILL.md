---
name: image-pro
description: Handle professional image tasks with format conversion, resizing, compression, and metadata workflows.
category: media
---

## Overview

Working with images professionally means mastering the pipeline: choosing the right format, sizing
for the destination, compressing without visible loss, and managing metadata. This skill covers
practical image handling — format decisions, batch processing, optimization for web, and quality
control — using standard tools and techniques.

## When to use

- Converting between image formats (JPG, PNG, WebP, AVIF, TIFF)

- Resizing and cropping images for web, print, or social

- Compressing images without visible quality loss

- Batch-processing large sets of images

- Stripping or editing EXIF/metadata for privacy or delivery

## Core concepts

- - **Format decision matrix.** Photographs → JPEG/WebP/AVIF (lossy, small). Graphics with
  transparency → PNG/WebP. Simple graphics → SVG (vector, infinitely scalable). Print masters →
  TIFF. Web delivery in 2026: WebP as baseline, AVIF where supported.
- - **Lossy vs lossless.** Lossy (JPEG/WebP/AVIF) discards data for smaller files — fine for final
  delivery. Lossless (PNG, TIFF) preserves everything — for masters and intermediates. Never re-save
  a lossy file repeatedly; generation loss compounds.
- - **Resolution vs dimensions.** Dimensions (pixels) determine display size; DPI/PPI only matters
  for print (300 for print, irrelevant for screen). A "72 DPI" web image and "300 DPI" web image
  with identical pixels are identical on screen.
- - **Compression sweet spots.** JPEG quality 80-85 is visually lossless for most photos. WebP at
  quality 75-80 beats JPEG at smaller sizes. Always compare visually at 100% — metrics lie, eyes
  don't.
- - **Metadata matters.** EXIF contains camera data, GPS location, and timestamps. Strip GPS before
  publishing (privacy); preserve copyright metadata for professional delivery. Know what your
  exports carry.
- - **Color profiles.** sRGB for web (universal), Adobe RGB or ProPhoto for print/pro work.
  Mismatched profiles cause dull or shifted colors — embed the profile and convert deliberately.

## Practical workflow

1. 1. **Define the destination.** Web hero? Social thumbnail? Print? Each has target dimensions,
   format, and file-size budget. Start from the requirement, not the source.
2. 2. **Choose the format.** Photos for web → WebP (fallback JPEG). Transparency → PNG or WebP.
   Logos/icons → SVG. Archive masters → TIFF or PNG.
3. 3. **Resize correctly.** Downscale with high-quality resampling (Lanczos/bicubic sharper). Never
   upscale beyond ~150% without AI upscaling — invented pixels look soft. Crop to the composition
   first, then resize.
4. 4. **Compress and compare.** Export at candidate settings, view at 100% side by side with the
   original. Check critical areas: gradients (banding?), text edges, skin tones, fine detail. Pick
   the smallest file with no visible difference.
5. 5. **Handle metadata.** Strip location data for public sharing; keep copyright and creator info
   for professional work. Verify with an EXIF reader before publishing sensitive shoots.
6. 6. **Batch with scripts.** For large sets: scripted pipelines (ImageMagick, sips, or Python) with
   consistent settings. Example ImageMagick batch:
   `mogrify -path ./web -format webp -quality 80 -resize "1920x1920>" *.jpg`
   (resizes to max 1920px, converts to WebP — non-destructive to originals since output goes to
./web)
7. 7. **Quality-check the outputs.** Spot-check exports: correct dimensions, no corruption, metadata
   as intended, file sizes within budget. One bad batch setting can ruin hundreds of files — verify
   early.

## Common pitfalls

- - **Upscaling for "quality."** Enlarging a small image doesn't add detail. Deliver at native
  resolution or use proper upscaling tools with realistic expectations.
- - **PNG for photographs.** A photo saved as PNG can be 5-10x larger than WebP with zero visual
  benefit. Match format to content.
- - **Forgetting mobile.** A 4MB hero image on a phone over cellular is a bounce. Responsive images
  (srcset) with size-appropriate variants are standard practice.
- - **GPS in published photos.** Location data in shared images is a privacy and safety issue. Strip
  EXIF location before any public posting.
- - **Over-compression artifacts.** Banding in skies, blockiness in shadows, mushy text. The fix is
  always: raise quality or pick a better format — not "it's fine."
- - **Working from lossy originals.** Editing a JPEG, saving as JPEG, editing again — each cycle
  degrades. Keep a lossless master; export lossy only for delivery.
