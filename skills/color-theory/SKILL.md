---
name: color-theory
description: Apply color theory with palette building, harmony, psychology, contrast, and accessibility standards.
category: creative-design
---

## Overview

Color is the fastest emotional signal in design — processed before words, before layout, before
meaning. Used well, it guides attention, encodes meaning, and makes brands unforgettable. Used
carelessly, it confuses and excludes. This skill covers color theory fundamentals, palette
construction, psychological and cultural dimensions, and accessibility requirements.

## When to use

- Building a color palette for a brand or product

- Choosing UI colors (actions, states, feedback, data visualization)

- Fixing color contrast and accessibility issues

- Understanding color psychology for marketing or branding

- Reviewing designs for color harmony and consistency

## Core concepts

- - **The HSB mental model.** Hue (which color), Saturation (intensity), Brightness (light/dark).
  Professionals think in HSB: harmonious palettes share saturation/brightness relationships even
  when hues differ.
- - **Harmony structures.** Complementary (opposites — high energy), analogous (neighbors — calm,
  cohesive), triadic (three equidistant — vibrant but balanced), monochromatic (one hue — elegant,
  safe). Pick one structure per palette; don't mix structures.
- - **The 60-30-10 rule.** 60% dominant neutral/background, 30% secondary, 10% accent. The accent is
  precious — spend it on the one thing that matters most (the CTA, the alert).
- - **Color has jobs.** In UI: brand expression, hierarchy (what's important), state
  (success/error/warning/info), and data encoding. Assign each color a job; a color doing three jobs
  is doing none well.
- - **Psychology is contextual.** Blue = trust (finance, tech), red = urgency (sales, errors), green
  = go/success — but culture and context modulate everything (red means luck in China, mourning in
  parts of Africa). Know your audience.
- - **Accessibility is math.** WCAG: 4.5:1 contrast for normal text, 3:1 for large text and UI
  components. Never encode meaning in color alone — pair with icons, labels, or patterns (8% of men
  have color vision deficiency).

## Practical workflow

1. 1. **Define color's jobs.** List what color must do: brand recognition, primary actions, feedback
   states, data categories, backgrounds. Each job gets a dedicated color family.
2. 2. **Start with neutrals.** Build the grayscale/ramp first — most of any interface is neutrals. A
   refined neutral scale (with subtle warmth or coolness) elevates the whole design.
3. 3. **Choose the primary.** The brand/action color: distinctive in the competitive landscape,
   works at large and small sizes, passes contrast on its backgrounds. Test it as a button, a link,
   and a background.
4. 4. **Build the supporting palette.** Secondary colors, semantic colors
   (success/warning/error/info — test these for CVD distinguishability), and data visualization
   palette (categorical: distinct hues; sequential: single-hue lightness steps).
5. 5. **Check contrast systematically.** Every text/background and UI/background combination against
   WCAG ratios. Fix failures by adjusting lightness, not by hoping.
6. 6. **Test in context.** View the palette applied to real screens, in light and dark mode, and
   through color-blindness simulators (deuteranopia, protanopia, tritanopia). Print a swatch sheet —
   screens lie.
7. 7. **Document with values.** Hex, RGB, and HSL/HSB for each color; usage rules (when to use
   which); don'ts. Name semantically for UI (surface, action, critical) so the palette survives
   rebrands.

## Common pitfalls

- - **Rainbow interfaces.** Too many saturated colors competing. Restraint reads as premium; rainbow
  reads as carnival.
- - **Pure black and pure white.** #000 on #FFF causes halation and eye strain. Use off-blacks
  (#111-#1a1a1a) and let backgrounds breathe.
- - **Color-only meaning.** Red/green status dots with no labels exclude color-blind users. Always
  add a second channel: icon, text, or pattern.
- - **Inaccessible text.** Light gray body text on white — the most common accessibility failure on
  the web. Check every combination, not just the obvious ones.
- - **Gradients as a crutch.** Gradient backgrounds hiding weak composition or low-contrast text.
  Gradients are fine as accents; they're not a substitute for hierarchy.
- - **Ignoring dark mode.** Designing only for light and letting dark mode be an afterthought
  produces muddy, low-contrast dark themes. Design both deliberately from the token level.
