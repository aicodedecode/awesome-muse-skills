---
name: icon-designer
description: Design clear, consistent icon sets with grid systems, stroke rules, and production-ready exports.
category: creative-design
---

## Overview

Icons are a language: tiny, instant, and unforgiving. A good icon set feels
inevitable — every icon
obviously belongs with the others — which requires systematic construction, not
individual artistry.
This skill covers icon design from grid and stroke rules through metaphor
selection to multi-size
production and export.

## When to use

- Designing a custom icon set for a product or brand

- Creating individual icons (app icons, feature icons, favicons)

- Auditing an inconsistent icon collection

- Choosing between custom icons and an icon library

- Preparing icon assets for development handoff

## Core concepts

- - - **The grid is law.** Design on a consistent grid (e.g., 24px with 2px
  keylines: circle, square,
  portrait/landscape rectangles). Every icon aligns to the same keyshapes —
that's what makes a set
  feel unified.
- - - **Stroke and corner consistency.** One stroke weight, one corner radius,
  one end-cap style
  across the set. These three decisions define the icon family's personality
more than the
  individual drawings.
- - - **Metaphor first.** The hardest part of icon design isn't drawing — it's
  choosing the right
  metaphor. Test: would a new user guess the meaning? Prefer universal metaphors
(magnifier =
  search) over clever ones.
- - - **Optical correction.** Mathematically centered isn't visually centered.
  Circles need overshoot,
  horizontal strokes look heavier than vertical ones, and dense icons need
breathing room. Trust
  your eyes over the grid.
- - - **Design small, test smaller.** Icons live at 16-24px. Details that look
  great at 200px vanish
  or muddy at size. Design at actual size, test at the smallest usage, simplify
until it reads
  instantly.
- - - **Filled vs outlined.** Outlined icons feel lighter and more modern;
  filled icons carry more
  weight and read better tiny. Pick one per set — mixing styles breaks unity
(unless deliberately
  paired, e.g., outline default + filled active states).

## Practical workflow

1. 1. 1. **Define the set's rules.** Grid size, stroke weight, corner radius,
   cap style, filled vs
   outline, padding/safe area. Document before drawing icon one.
2. 2. 2. **List and group metaphors.** Inventory every needed icon, grouped by
   family (navigation,
   actions, objects, status). Choose metaphors deliberately; flag ambiguous ones
for user testing.
3. 3. 3. **Draw the key icons first.** The 5-10 most-used icons (home, search,
   settings, close, back)
   establish the style. Get these right and the rest follow.
4. 4. 4. **Build out systematically.** Work family by family, constantly
   comparing against the key
   icons. Check: same visual weight? Same level of detail? Same corner
treatment?
5. 5. 5. **Test at size.** View the full set at 16px and 24px. Squint test: can
   you tell them apart?
   Any icon that's muddy or ambiguous gets simplified or re-metaphored.
6. 6. 6. **Refine optically.** Align to pixel grid for crisp rendering, adjust
   overshoots, balance
   visual weight across the set. Export tests on light and dark backgrounds.
7. 7. 7. **Deliver production assets.** SVG (cleaned, consistent viewBox and
   naming), PNG at 1x/2x/3x
   if needed, an icon font or sprite if required, plus the source file and a
usage sheet showing the
   full set.

## Common pitfalls

- - **Inconsistent stroke weights.** The #1 amateur tell. One weight,
  everywhere, no exceptions.

- - - **Over-detailed icons.** Trying to illustrate rather than symbolize. If it
  needs more than a
  glance to parse at 24px, simplify.
- - - **Clever but unclear metaphors.** The abstract mark that "represents
  synergy" helps nobody.
  Clarity beats cleverness in iconography.
- - - **Ignoring the pixel grid.** Off-grid strokes render blurry at small
  sizes. Snap to pixels (or
  half-pixels for centered strokes) for crisp output.
- - - **Mixing styles.** Some filled, some outlined, different corner radii — a
  Frankenstein set.
  Audit and unify before shipping.
- - - **No naming convention.** "icon_final_v2_new.svg" in production. Name
  semantically
  (action/search, navigation/home) from the start; developers and future you
will thank you.
