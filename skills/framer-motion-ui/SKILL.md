---
name: framer-motion-ui
description: Craft UI animations with Framer Motion: page transitions, micro-interactions, scroll reveals, and shared layouts for polished interfaces. Use for interface animation beyond basics.
category: web-development
---

# Framer Motion UI

A UI-focused companion to animation fundamentals: page transitions, micro-interaction systems, scroll reveals, shared-layout navigation, and building a coherent motion language for an interface.

## Overview

Good UI animation isn't decoration — it's **communication**: where things came from, what changed, what's interactive. This skill covers the interface-level patterns: consistent transition vocabularies, page/route transitions, scroll-triggered reveals, shared-element navigation, and gesture-driven UI — the layer above raw animation APIs (see framer-motion-pro for the API mechanics).

## When to use

- Designing a motion language for a product (durations, easings, patterns).
- Page and route transitions.
- Scroll-driven reveals and parallax.
- Shared-element transitions (list → detail).
- Micro-interaction systems (buttons, toggles, menus, toasts).

## Core concepts

- **Motion tokens.** Standardize: durations (150ms micro, 250ms UI, 400ms page), easings (easeOut for entrances, easeIn for exits, spring for physics), distances (8–24px slides). Put them in a shared module — consistency is the difference between polished and random.
- **Page transitions.** `AnimatePresence mode="wait"` around routes: exit (fade/slide out, 150–200ms) → enter (fade/slide in). Keep exits fast; slow exits feel broken.
- **Staggered reveals.** Container variants with `staggerChildren` for lists/cards entering — the single highest-ROI polish pattern.
- **Scroll reveals.** `whileInView` with `viewport={{ once: true, margin: '-80px' }}` — reveal once, slightly before entering viewport. Subtle (y: 24, opacity) beats dramatic.
- **Shared layout.** `layoutId` for list→detail morphs, tab indicators, expanding cards. The "how did they do that" effect with two lines of code.
- **Gesture UI.** Drag-to-dismiss sheets (`drag="y"` + `onDragEnd` threshold), swipeable cards, pull interactions — with spring physics and constraints.
- **Reduced motion.** `MotionConfig reducedMotion="user"` globally; ensure content is fully visible without animation (reveals must not hide content if JS/animation fails).

## Practical workflow

**1. Define motion tokens.**
```ts
// lib/motion.ts
export const EASE = [0.22, 1, 0.36, 1]; // easeOutQuint-ish
export const spring = { type: 'spring', stiffness: 350, damping: 30 };
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};
```

**2. Page transition shell.**
```tsx
<AnimatePresence mode="wait">
  <motion.main key={pathname}
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: EASE }}>
    {children}
  </motion.main>
</AnimatePresence>
```

**3. List → detail shared element.**
```tsx
// list: <motion.div layoutId={`card-${id}`} onClick={open}>
// detail: <motion.div layoutId={`card-${id}`}> — automatic morph
```

**4. Scroll reveal section.**
```tsx
<motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
  {items.map(i => <motion.div key={i.id} variants={fadeUp}>{...}</motion.div>)}
</motion.section>
```

**5. Toast/menu micro-interactions.** Spring in, auto-dismiss with exit; stack with layout animations; keep under 300ms.

## Common pitfalls

- **No motion language.** Every component inventing its own duration/easing = visual noise. Tokens first.
- **Slow exits.** 500ms exit animations make the UI feel laggy. Exits should be fast (≤200ms) or instant.
- **Reveal hiding content.** `whileInView` elements stuck at opacity 0 when JS fails or reduced-motion is on. Ensure graceful no-JS/no-motion state.
- **Over-animating.** Animating everything = animating nothing. Reserve motion for: state changes, navigation, feedback. Static content stays static.
- **Layout thrash.** Animating width/height/margin in UI transitions. Transforms + opacity; `layout` prop for real layout shifts.
- **Shared-layout collisions.** Duplicate `layoutId`s mounted simultaneously break projection. Scope IDs uniquely.
- **Ignoring reduced motion.** vestibular disorders are real. Respect the preference globally; never gate essential information behind animation.
- **Scroll-jacking.** Heavy scroll-linked transforms that fight the user's scroll. Subtle parallax (small ranges) or none.
- **AnimatePresence misplacement.** Must wrap the conditional directly; misplaced = exits never run. Verify exits play during development.
