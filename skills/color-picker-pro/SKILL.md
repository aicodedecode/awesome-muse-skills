---
name: color-picker-pro
description: Pick, convert, and manage colors with format conversions, palette extraction, and harmony tools.
category: utilities
---

## Overview

Color picking sounds trivial until you're matching a brand color from a screenshot, converting
between HEX/RGB/HSL/CMYK, or extracting a palette from an image. This skill covers practical color
workflows: precise picking, lossless format conversion, palette extraction, accessibility checking,
and organizing color decisions.

## When to use

- Picking exact colors from screens, images, or designs

- Converting between color formats (HEX, RGB, HSL, CMYK, Pantone-ish)

- Extracting palettes from images or brand assets

- Checking contrast ratios for accessibility

- Building and documenting color palettes

## Core concepts

- - **Color formats and when to use them.** HEX (`#3B82F6`) — web standard, compact. RGB
  (`rgb(59,130,246)`) — same data, explicit. HSL (`hsl(217,91%,60%)`) — intuitive for adjusting
  (tweak lightness/saturation directly). CMYK — print only. Name them correctly per context.
- - **Picking precisely.** Screen pickers sample the rendered pixel — which includes anti-aliasing,
  compression artifacts, and color profiles. For brand colors, get the value from the source file or
  brand guide, not a screenshot. Screenshots lie by a few values.
- - **HSL for manipulation.** Need a darker variant? Drop HSL lightness 10%. Need muted? Drop
  saturation. Doing this math in HEX is guesswork; in HSL it's deterministic.
- - **Palette extraction.** From images: quantize to dominant colors (median-cut or k-means), then
  curate — raw extraction includes muddy intermediates. Pick 4-6 that represent the image's
  character, then refine.
- - **Contrast checking.** Every text/background pair: 4.5:1 for body text (WCAG AA). Check
  programmatically, not by eye — eyes adapt and deceive.
- - **Color management gotchas.** The same HEX renders differently across displays (calibration),
  and screenshots embed display profiles. For critical matching, work in a color-managed pipeline
  and verify on the target medium.

## Practical workflow

1. 1. **Pick the color.** Use a screen picker for approximations; source files/brand guides for
   exact values. Note the format you picked in — convert deliberately, don't eyeball conversions.
2. 2. **Convert formats.** Use reliable converters (or code) — HEX↔RGB is trivial math, RGB→HSL
   needs the proper formula, CMYK conversion depends on the profile (it's not pure math). Document
   which profile was used for print conversions.
3. 3. **Build variants.** From a base color in HSL: generate tints (lightness up), shades (lightness
   down), and muted versions (saturation down) in even steps. A 5-9 step scale per key color covers
   most UI needs.
4. 4. **Check harmony.** Test candidate palettes: complementary tension? analogous calm? Run through
   a color-blindness simulator — a palette that collapses for 8% of users needs rework.
5. 5. **Verify contrast.** Check all text/background combinations against WCAG ratios. Adjust
   lightness (not hue) to fix failures — it preserves the palette's character.
6. 6. **Document the palette.** Name colors semantically (`primary`, `surface`, `critical`), record
   all formats (HEX for web, CMYK for print), note usage rules. A palette without documentation gets
   misused.

**Quick conversions (Python):**
```python
import colorsys
# HEX -> RGB -> HSL
h = "3B82F6"
r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
hh, ll, ss = colorsys.rgb_to_hls(r, g, b)  # note: HLS, swap S/L for HSL
print(f"hsl({hh*360:.0f}, {ss*100:.0f}%, {ll*100:.0f}%)")
# Contrast ratio (relative luminance, WCAG)
def lum(c):
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
def ratio(h1, h2):
    L = sorted([sum(w * lum(int(x[i:i+2], 16)) for i, w in zip((0,2,4),(0.2126,0.7152,0.0722))) for x in (h1, h2)])
    return (L[1] + 0.05) / (L[0] + 0.05)
print(ratio("FFFFFF", "3B82F6"))  # contrast of blue on white
```

## Common pitfalls

- - **Trusting screenshots.** Compression and profiles shift values. For brand-critical colors,
  always go to the source.
- - **Eyeballing conversions.** Guessing the CMYK equivalent of a screen color. Use proper
  conversion with the right profile — or accept that some RGB colors can't print.
- - **Raw extraction without curation.** Auto-extracted palettes include muddy averages. Curate:
  pick the colors with character, drop the mush.
- - **Skipping contrast checks.** "Looks fine to me" fails for users with low vision. The math takes
  10 seconds — run it.
- - **Inconsistent formats.** HEX in CSS, RGB in design tokens, named colors in docs — pick per
  context but keep a single source of truth with all formats recorded.
- - **Forgetting dark mode.** A palette perfected for light backgrounds can fail on dark. Derive and
  check the dark variants, don't just invert.
