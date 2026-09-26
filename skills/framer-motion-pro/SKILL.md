---
name: framer-motion-pro
description: Animate React with Framer Motion (Motion): gestures, layout animations, variants, scroll-linked motion, and exit transitions. Use when adding production-grade UI animation.
category: development
---

# Framer Motion Pro

A practical guide to Framer Motion (now "Motion"): declarative React animations — gestures, layout animations, variants, scroll-linked motion, and AnimatePresence — with the performance habits that keep animations at 60fps.

## Overview

Framer Motion (the `framer-motion` package, now evolving as "Motion") lets you animate React declaratively: `<motion.div animate={{ x: 100 }} />`. It handles the hard parts — interruptible animations, layout projection (animating between layouts), drag gestures with physics, and exit animations for unmounting components. The core principle: **animate transforms and opacity** (GPU-cheap); avoid animating layout properties (width, top, margin) which force reflow.

## When to use

- Micro-interactions: hovers, taps, toggles, button feedback.
- Page/route transitions and modal/dialog enter-exit.
- Layout animations: list reordering, expanding cards, shared-element transitions.
- Scroll-linked effects: parallax, progress indicators, reveal-on-scroll.
- Drag interactions with springs and constraints.

## Core concepts

- **`motion` components.** `motion.div` etc. accept `initial`, `animate`, `exit`, `whileHover`, `whileTap`, `whileInView`, `whileFocus` — declarative animation states.
- **Transitions.** `transition={{ type: 'spring', stiffness: 300, damping: 30 }}` (physics, natural) vs `type: 'tween', duration: 0.3, ease: 'easeOut'` (precise). Springs for UI physics; tweens for choreographed sequences.
- **Variants.** Named states propagated through the tree: parent `animate="open"` flows to children with matching variant labels — orchestrated multi-element animation from one prop.
- **`AnimatePresence`.** Wraps conditionally-rendered components to animate `exit` on unmount. `mode="wait"` / `popLayout` for transitions between components.
- **Layout animations.** `layout` prop animates position/size changes when layout shifts (list reorder, expand). `layoutId` creates shared-element transitions between different components ("magic motion").
- **Gestures.** `drag`, `dragConstraints`, `dragElastic`, `whileDrag`; `useMotionValue` + `useTransform` for manual control (e.g., parallax from scroll).
- **`useScroll` / `useInView`.** Scroll progress as a motion value; in-view triggers for reveal animations.

## Practical workflow

**1. Micro-interaction.**
```tsx
<motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  Save
</motion.button>
```

**2. Enter/exit.**
```tsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

**3. Orchestrated list (variants).**
```tsx
const list = { show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

<motion.ul variants={list} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>{i.name}</motion.li>)}
</motion.ul>
```

**4. Scroll-linked.**
```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
<motion.div style={{ y }}>...</motion.div>  // style motion values skip re-render
```

**5. Shared element.**
```tsx
{selected ? <motion.div layoutId="card" .../> : <motion.div layoutId="card" .../>}
```
Same `layoutId` in two places → automatic morph transition.

## Common pitfalls

- **Animating layout properties.** `width`, `height`, `top`, `left` in `animate` → layout thrash. Use `scale`, `x/y`, `opacity`; use `layout` prop for genuine layout changes.
- **Missing `AnimatePresence`.** Conditional render without it = instant unmount, no exit animation. Wrap every exiting element.
- **No `key` discipline.** AnimatePresence children and layout animations need stable keys; key changes remount and restart animations.
- **`layoutId` collisions.** Two mounted components with the same `layoutId` = broken projection. Ensure uniqueness among mounted elements.
- **Reduced motion ignored.** Respect `prefers-reduced-motion`: `useReducedMotion()` or `MotionConfig reducedMotion="user"` to disable non-essential animation.
- **Janky springs.** Overly stiff springs on low-end devices; test on real hardware. Prefer shorter durations/tweens for critical UI.
- **Animating on every render.** Putting motion values in React state re-renders per frame. Use `style={{ x: motionValue }}` — Motion updates the DOM directly.
- **Exit animations on route change.** Router unmounts need AnimatePresence around routes with `mode="wait"` — otherwise exits never play.
