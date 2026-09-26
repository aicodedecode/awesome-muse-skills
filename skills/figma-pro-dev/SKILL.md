---
name: figma-pro-dev
description: Developer-Figma collaboration: dev mode, design tokens, component inspection, handoff, and design-system alignment. Use when implementing designs from Figma or aligning code with a design system.
category: development
---

# Figma Pro (Dev)

## Overview

For developers, Figma is **the source of truth for what to build** — and the collaboration surface
with designers. Professional Figma usage from the dev side means: extracting specs efficiently (dev
mode), consuming design tokens as code, implementing components to match the design system's
intent (not just pixels), and giving designers feedback that improves the handoff both ways.

The through-line: implement the *system*, not the screenshot — tokens, components, and behaviors,
not one-off pixel values.

## When to use

- Implementing UI from Figma designs.
- Extracting design tokens (colors, type, spacing) into code.
- Reviewing designs for implementability before building.
- Setting up design-token pipelines (Style Dictionary, Tokens Studio).
- Giving designers developer-friendly feedback.

## Core concepts

- **Dev Mode as the interface.** Inspect mode: measurements, colors, typography, assets export,
  and code snippets (CSS/iOS/Android). Compare designs vs implementation (visual diffing); focus
  on tokens and components, not copying generated CSS verbatim.
- **Design tokens, not hex codes.** Colors, typography scales, spacing, radii, shadows defined as
  named tokens in Figma Variables — exported to code (Style Dictionary, Tokens Studio) as the
  single source of truth. Hardcoded `#3B82F6` in code while Figma says `color/primary/600` is
  drift waiting to happen.
- **Components map to components.** Figma components (with variants, auto-layout, properties)
  should correspond 1:1 with code components (props = Figma properties). Mismatched granularity —
  Figma has 3 button variants, code has 12 — signals a broken handoff conversation.
- **Auto-layout ≈ flexbox.** Figma's auto-layout maps directly to flexbox concepts (direction,
  gap, padding, alignment). Designs built with auto-layout translate to responsive code naturally;
  absolutely-positioned-everything designs fight responsiveness — flag it early.
- **Behaviors, not just visuals.** Hover/focus/disabled/error/loading states, responsive behavior
  at breakpoints, animation specs (duration, easing), and content edge cases (long names, empty
  states). A design without states is a spec with holes — ask before assuming.
- **Two-way feedback.** Developers reviewing designs for: implementability (custom vs system
  components), accessibility (contrast, focus, touch targets), and edge cases. Designers need this
  input *before* final sign-off, not after implementation starts.

## Practical workflow

1. **Before building: review the design.** Check: tokens used (not raw values)? components from
   the library (not one-offs)? all states designed? responsive behavior specified? If not, ask —
   assumptions now are rework later.
2. **Set up the token pipeline.** Export Figma Variables → transform (Style Dictionary) → code
   tokens (CSS custom properties, Tailwind theme, platform resources). Automated, versioned,
   and the *only* way colors/type/spacing enter the codebase.
3. **Map components 1:1.** For each Figma component: the code component, its props (matching
   Figma properties/variants), and its states. Build the mapping explicitly for design-system
   work; it becomes the contract.
4. **Implement from tokens + components.** Compose screens from the component library using
   tokens; new one-off styles are a design-system conversation, not a solo decision.
5. **Verify visually.** Screenshot/snapshot tests for components; side-by-side review with the
   designer for key screens; check responsive breakpoints and states, not just the happy-path
   desktop frame.
6. **Close the loop.** Implementation discoveries (a state nobody designed, a breakpoint that
   breaks) go back to the designer *and* into the design system. Handoff is a conversation, not
   a handover.

Token pipeline sketch:

```text
Figma Variables (color/primary/600, spacing/4, radius/lg, ...)
   → Tokens Studio / Variables export (JSON)
   → Style Dictionary transform
   → code: CSS custom props / Tailwind @theme / SwiftUI / Compose resources
   → consumed by components; CI verifies no raw values (lint rule)
```

Dev checklist per screen:

```text
[ ] All colors/type/spacing from tokens (no raw values)
[ ] Components from the library (props match Figma variants)
[ ] All states implemented (hover, focus, disabled, loading, error, empty)
[ ] Responsive behavior verified at defined breakpoints
[ ] Assets exported at right sizes/formats (SVG for icons, right densities)
[ ] Accessibility: contrast, focus order, touch targets (44px+)
```

## Common pitfalls

- **Pixel-copying screenshots.** Measuring pixels from a static frame instead of using tokens and
  components — brittle, unresponsive, and drifts from the system on the next design update.
- **Raw values in code.** Hardcoded hex/spacing "to match the design" while tokens exist. Lint
  against it; tokens are the contract.
- **Ignoring states.** Building only the default state — hover, focus, error, empty, and loading
  get invented during implementation (inconsistently). Demand state coverage in design review.
- **One-off components.** Building bespoke components for what the design system already covers
  (or should). Every one-off is design-system debt — route it through the system conversation.
- **No responsive spec.** Desktop frame only, "we'll figure out mobile later." Later is rework.
  Auto-layout-first designs + breakpoint specs before implementation.
- **Copying generated code.** Pasting Figma's generated CSS verbatim — absolute positioning,
  magic numbers, no responsiveness. Generated code is a *reference*, not an implementation.
- **Silent divergence.** Implementation drifting from design with no conversation (or design
  changing without telling devs). Regular design-engineering syncs; the mapping is a living contract.
