---
name: design-handoff-specialist
description: Prepare flawless design-to-development handoffs with specs, assets, behaviors, and QA processes.
category: creative-design
---

## Overview

The handoff is where designs go to die — or to ship. Great handoff isn't a file dump; it's a
communication package that lets developers build confidently without guessing: organized files,
specified behaviors, production assets, and a QA loop that catches drift. This skill systematizes
handoff so the built product matches the designed intent.

## When to use

- Preparing designs for developer handoff

- Writing specs for interactions, states, and edge cases

- Organizing Figma (or other tool) files for development

- Exporting production assets (icons, images, illustrations)

- Running design QA on built features

## Core concepts

- - **Handoff is communication, not delivery.** The goal: a developer can build the feature without
  pinging you with questions. Every unanswered question is a guess — and guesses drift from the
  design.
- - **States, states, states.** For every component and screen: default, hover, focus, active,
  disabled, loading, empty, error, and success. The unhappy paths are where handoff usually fails —
  spec them explicitly.
- - **Behaviors over pictures.** Developers need to know what happens: what animates, how long, what
  triggers it, what the responsive breakpoints do, how lists handle 0/1/1000 items. Annotate
  behaviors in the file, not in a separate doc nobody reads.
- - **One source of truth.** The handoff file is canonical. Mark what's ready for dev (and what's
  still exploring), version it, and never let "the latest" live in three places. Stale specs cause
  more bugs than missing ones.
- - **Assets production-ready.** Exported at correct sizes and formats (SVG for icons/logos,
  WebP/optimized PNG/JPG for imagery, @2x/@3x where needed), consistently named, organized.
  Developers shouldn't have to crop or re-export.
- - **Design QA closes the loop.** Handoff isn't done at delivery — it's done when the built feature
  matches the design. Budget QA time, file discrepancies as bugs, and verify on real devices.

## Practical workflow

1. 1. **Clean the file.** Archive explorations, delete hidden layers, name everything semantically,
   organize flows by feature. A developer opening the file should see structure, not archaeology.
2. 2. **Mark ready for dev.** Clearly delineate what's build-ready vs in-progress. Use sections,
   labels, or a cover page with status. Ambiguity here causes building the wrong thing.
3. 3. **Spec the behaviors.** Annotate directly on/near the designs: interactions (what triggers
   what), animations (duration, easing, properties), responsive rules (breakpoints, reflow
   behavior), and content rules (truncation, max lengths, empty states).
4. 4. **Document the edge cases.** Long text, missing images, error states, offline, permission
   denials, first-run vs returning. Walk through each flow asking "what could be different?" and
   spec the answers.
5. 5. **Export assets.** Icon SVGs (cleaned, consistent naming), images optimized for web, any
   custom fonts or Lottie files. Provide a manifest or organized asset page — don't make developers
   hunt.
6. 6. **Walk through together.** A 30-minute handoff review with developers: demo the flows, explain
   the tricky behaviors, answer questions live. Record it for anyone who misses it.
7. 7. **Run design QA.** On staging: compare build to design systematically (layout, spacing,
   typography, states, responsive, motion). File visual discrepancies as bugs with screenshots and
   expected-vs-actual. Verify fixes before sign-off.

## Common pitfalls

- - **The file dump.** Sending a messy Figma link with "let me know if you have questions."
  Questions will come — dozens of them — and each answer arrives too late.
- - **Missing states.** Designing the happy path beautifully and leaving loading/error/empty to
  developer improvisation. The edge cases are the product for many users.
- - **Pixel-perfect expectations.** Demanding exact matches across browsers/devices instead of
  designing robustly. Specify the intent (spacing system, behavior rules) so developers can adapt
  correctly.
- - **No responsive specs.** Desktop mocks with "make it responsive" as the entire mobile strategy.
  Define breakpoints and behaviors explicitly.
- - **Skipping the walkthrough.** Assuming the file speaks for itself. Thirty minutes of
  conversation prevents weeks of rework.
- - **No design QA.** Considering handoff "done" at file delivery. The last mile of polish — and the
  user's actual experience — happens in QA. Schedule it, don't hope for it.
