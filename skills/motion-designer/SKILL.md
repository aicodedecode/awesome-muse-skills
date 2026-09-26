---
name: motion-designer
description: Design purposeful motion and animation with timing, easing, choreography, and implementation specs.
category: creative-design
---

## Overview

Motion is communication: it orients users, explains relationships between
screens, provides
feedback, and adds delight. Bad motion distracts; good motion is invisible —
users feel oriented but
never notice the animation. This skill covers motion design from principles
(timing, easing,
choreography) to practical specs developers can implement.

## When to use

- Designing UI animations, transitions, and micro-interactions

- Creating animated brand elements or explainer motion graphics

- Defining motion guidelines for a design system

- Specifying animations for developer handoff

- Reviewing motion for usability and accessibility

## Core concepts

- - - **The 12 principles, distilled.** The classics that matter most in UI:
  easing (nothing moves
  linearly in nature), anticipation/follow-through (set up and settle), staging
(one focus at a
  time), and timing (duration communicates weight).
- - - **Duration language.** Micro-interactions: 100-300ms. Screen transitions:
  300-500ms. Anything
  longer needs a reason (storytelling, onboarding). Slow motion feels broken;
fast motion feels
  jarring — calibrate to the action's importance.
- - - **Easing is the personality.** Ease-out for entrances (fast start, gentle
  landing — feels
  responsive), ease-in-out for movements within view, spring physics for
playful/delightful moments.
  Standardize 3-4 easings per system.
- - - **Choreography.** When multiple elements animate, stagger them (20-50ms
  offsets) and establish
  hierarchy — the primary element leads. Everything moving at once is visual
noise.
- - - **Motion with meaning.** Every animation should: orient (where did that
  come from?), confirm
  (did my action register?), or delight (brand moment, used sparingly).
Decorative motion that
  serves none of these is a candidate for deletion.
- - - **Accessibility is non-negotiable.** Respect prefers-reduced-motion:
  provide a reduced variant
  (fades instead of slides, no parallax/autoplay). Never animate essential
information in a way that
  can't be perceived statically.

## Practical workflow

1. 1. 1. **Define the motion's job.** For each animation: what does the user
   need to understand?
   (Navigation? State change? Feedback?) Write it in one sentence before
touching keyframes.
2. 2. 2. **Storyboard the key moments.** Sketch the start, middle, and end
   states. For UI: which
   elements move, which fade, what's the focal point? For explainer work: script
→ storyboard →
   animatic.
3. 3. 3. **Set timing and easing.** Assign durations from your scale, easings
   from your 3-4 standards.
   Prototype at real speed — motion designed in slow-mo always feels wrong in
production.
4. 4. 4. **Choreograph the sequence.** Order and stagger elements. The eye
   follows the lead element;
   supporting elements follow 20-50ms behind. Test: can you follow the story
without effort?
5. 5. 5. **Prototype and feel it.** In After Effects, Principle, Figma, or code
   — watch it 10 times.
   Motion judgment is kinesthetic; you can't spec what you haven't felt.
6. 6. 6. **Spec for implementation.** Duration, easing curve (cubic-bezier
   values), delay/stagger,
   transform properties (prefer transform/opacity — they're GPU-friendly), and
the reduced-motion
   fallback. Developers need numbers, not adjectives.
7. 7. 7. **Review in context.** Watch the animation in the real product, on real
   devices, at real
   speed. Check performance (60fps target) and the reduced-motion experience.

## Common pitfalls

- - - **Motion for motion's sake.** Animating everything because you can. Each
  animation must earn its
  milliseconds.
- - - **Linear easing.** The telltale sign of amateur motion. Real movement
  accelerates and
  decelerates — use proper easings everywhere.
- - - **Inconsistent timing.** Random durations across the product feel chaotic.
  A duration scale
  (like a type scale) creates rhythm.
- - - **Ignoring reduced motion.** Shipping parallax, autoplay, and dramatic
  transitions with no
  fallback excludes users and can cause real harm (vestibular disorders).
- - - **Performance blindness.** Animating layout properties (width, top/left)
  causes jank. Stick to
  transform and opacity; test on mid-range devices.
- - - **Over-delighting.** The delightful onboarding animation is delightful
  once and annoying the
  fiftieth time. Provide skip/dismiss, and keep delight moments rare and brief.
