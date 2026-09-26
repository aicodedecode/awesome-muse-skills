---
name: accessibility-design-checker
description: Audit designs for accessibility with WCAG checklists covering color, type, focus, motion, and content.
category: creative-design
---

## Overview

Accessible design isn't a separate discipline — it's quality design that works for everyone,
including the 1 in 6 people with significant disabilities. This skill provides a practical audit
checklist for designs: color contrast, typography, touch targets, focus states, motion, and content
— mapped to WCAG 2.2 AA, the standard most organizations target.

## When to use

- Auditing mockups or prototypes for accessibility before handoff

- Checking color contrast and typography choices

- Reviewing interactive states (focus, hover, error) for accessibility

- Evaluating motion and animation for vestibular safety

- Building accessibility into a design system

## Core concepts

- - **WCAG 2.2 AA is the target.** The practical standard: 4.5:1 text contrast (3:1 for large
  text/UI components), keyboard operability, meaningful focus indicators, no keyboard traps,
  resizable text to 200%, and reduced-motion support.
- - **Contrast is math, not opinion.** Every text/background combination gets checked with a
  contrast tool. This includes text on images (test the worst-case area), placeholder text (often
  fails), and disabled states (exempt, but don't abuse the exemption).
- - **Don't rely on color alone.** Status, errors, and data distinctions need a second channel:
  icons, text labels, patterns, or shapes. Approximately 1 in 12 men has color vision deficiency —
  design for them explicitly.
- - **Touch and target sizes.** Minimum 24×24 CSS px (WCAG 2.2 AA), with 44×44 as the recommended
  target. Spacing between targets matters as much as size — crowded small targets cause mis-taps for
  everyone.
- - **Focus must be visible.** Keyboard users navigate by focus indicators. Design them deliberately
  (don't just accept browser defaults or, worse, remove outlines): high-contrast, consistent, and
  present on every interactive element.
- - **Motion and vestibular safety.** Honor prefers-reduced-motion: eliminate parallax, auto-playing
  animation, and dramatic transitions for users who opt out. Never convey essential info through
  motion alone.

## Practical workflow

1. 1. **Set the scope.** Which screens/flows, which level (AA standard), and what counts as a
   blocker vs nice-to-have. Agree with the team before auditing.
2. 2. **Check color and contrast.** Run every text/background and UI/background combination through
   a contrast checker. Simulate deuteranopia, protanopia, and tritanopia on key screens — especially
   data visualizations and status indicators.
3. 3. **Review typography.** Minimum sizes (12px absolute floor for captions, 16px+ for body
   recommended), line height (1.5 for body), resizable to 200% without breakage or horizontal
   scrolling, no text in images for essential content.
4. 4. **Audit interactive elements.** Every button/link/input: visible focus state, adequate target
   size, clear labels (not placeholder-only), error identification with text (not just red borders),
   and logical keyboard/tab order.
5. 5. **Evaluate motion.** List all animations: which are essential, which are decorative? Define
   the reduced-motion fallback for each (usually: crossfade or instant). Check for auto-playing
   content with pause controls.
6. 6. **Check content and structure.** Heading hierarchy (no skipped levels), meaningful link text
   ("Download report" not "click here"), alt text plan for images (decorative vs informative), form
   labels and instructions, and reading order on complex layouts.
7. 7. **Report with severity.** Categorize findings: blocker (fails WCAG AA / blocks task
   completion), major (significant barrier), minor (polish). Each gets: the issue, where, why it
   matters, and a concrete fix. Include passing checks too — teams need to know what held up.

## Common pitfalls

- - **Accessibility as a final gate.** Auditing finished designs instead of designing accessibly
  from the start. Retrofits cost 10x and produce worse results.
- - **Contrast theater.** Checking the primary button but not placeholder text, captions, or
  text-on-image. Audit every combination, not just the obvious ones.
- - **Removing focus outlines.** `outline: none` without a replacement is the most common
  accessibility vandalism in CSS. Design the focus state; don't delete it.
- - **Placeholder as label.** Placeholders vanish on input, fail contrast, and aren't read
  consistently by screen readers. Visible persistent labels, always.
- - **Decorative motion without fallbacks.** Shipping parallax and auto-play with no reduced-motion
  path. It's not just exclusion — for some users it's physically harmful.
- - **Treating the checklist as the ceiling.** WCAG is the floor. Real accessibility includes
  testing with actual assistive technology users — automated checks and audits catch maybe 40% of
  real barriers.
