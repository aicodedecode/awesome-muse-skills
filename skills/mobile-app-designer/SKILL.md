---
name: mobile-app-designer
description: Design native-feeling mobile apps with platform guidelines, gestures, navigation patterns, and thumb-zone UX.
category: creative-design
---

## Overview

Mobile design is its own discipline: small screens, touch input, on-the-go
contexts, and platform
conventions users have internalized. Great mobile design feels native — it
respects iOS and Android
patterns while expressing the brand. This skill covers mobile UX patterns,
platform guidelines,
gesture design, and the production details of shipping app interfaces.

## When to use

- Designing a new iOS or Android app

- Adapting a web product to mobile

- Improving mobile navigation, onboarding, or key flows

- Designing for tablets, foldables, or wearables

- Preparing mobile designs for native development

## Core concepts

- - - **Platform conventions are UX.** iOS (Human Interface Guidelines) and
  Android (Material) users
  expect specific patterns: tab bars vs bottom nav, swipe-back behavior, share
sheets, permission
  flows. Violating conventions without reason creates friction users blame on
you.
- - - **Thumb-zone design.** Primary actions live in the bottom third (easy
  thumb reach); destructive
  or rare actions go top. On large phones, the top 25% is a stretch — don't put
the CTA there.
- - - **One-handed, one-thumb, one-task.** Mobile sessions are short and
  interrupted. Each screen
  should serve one primary task completable with a thumb. Depth over breadth:
drill in rather than
  spreading out.
- - - **Navigation patterns.** Tab bar (3-5 top-level destinations, iOS
  standard), bottom nav
  (Material equivalent), hamburger (hides destinations — use sparingly), and
gesture nav (swipe
  between sections). Pick based on information architecture, not aesthetics.
- - - **Design for interruption.** Phone calls, notifications, dead zones.
  Preserve state, autosave
  inputs, make it trivial to resume. Offline-first thinking for critical flows.
- - - **Performance and battery are UX.** Heavy animations, constant location
  polling, unoptimized
  images — users feel these as "the app is bad." Design within mobile
constraints.

## Practical workflow

1. 1. 1. **Define the mobile jobs.** Which tasks must work great on mobile?
   (Often a subset of web.)
   Prioritize ruthlessly — mobile isn't "the website but smaller."
2. 2. 2. **Choose the platform approach.** Native (best UX, two codebases),
   cross-platform (React
   Native/Flutter — near-native), or PWA/web (cheapest, weakest). The choice
shapes what's
   designable.
3. 3. 3. **Map the IA for mobile.** Flatten hierarchies, pick the navigation
   pattern, define the 3-5
   core destinations. Test the IA with a tree test before designing screens.
4. 4. 4. **Design mobile-first flows.** Start at 375px wide. Key screens:
   onboarding (3-5 steps max,
   skippable, value-first), home, core task flows, settings. Real content, real
edge cases.
5. 5. 5. **Apply platform specifics.** iOS: SF type, tab bars, large titles,
   swipe gestures, haptic
   vocabulary. Android: Material components, FABs, bottom sheets, edge-to-edge.
Respect each
   platform's soul.
6. 6. 6. **Design the states.** Loading (skeletons over spinners), empty, error,
   offline, permissions
   (with clear rationale before the system prompt), and biometric auth flows.
7. 7. 7. **Spec for developers.** Screen flows with gestures annotated,
   animation specs, asset exports
   (@1x/@2x/@3x), dark mode variants, and accessibility notes (dynamic type
support, touch target
   minimums 44pt/48dp).

## Common pitfalls

- - - **Shrinking the desktop site.** Cramming web layouts into 375px. Mobile
  needs rethought IA and
  prioritized content, not miniaturization.
- - - **Ignoring platform guidelines.** An iOS app that behaves like Android (or
  vice versa) feels
  wrong to users even if they can't articulate why. Learn both HIG and Material
basics.
- - - **Tiny touch targets.** Below 44pt/48dp targets cause mis-taps and
  frustration. This is the most
  common mobile usability failure.
- - - **Onboarding walls.** Forcing signup, tutorials, and permissions before
  showing value. Let users
  experience the product first; ask for commitment after delivering value.
- - - **Gesture-only navigation.** Hidden gestures with no affordance strand
  users. Provide visible
  alternatives for critical actions; use gestures as accelerators, not
requirements.
- - - **Forgetting the notch and safe areas.** Content under notches, home
  indicators, or camera
  cutouts. Design within safe areas on every device variant.
