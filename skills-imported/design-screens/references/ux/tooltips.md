# Tooltips, popovers and onboarding hints

Reached from `references/ux-rules.md`. Read when something on the screen explains, hints, or teaches
— on hover, on focus, or on its own.

Three different things get called "tooltip", and they have different rules. Naming which one a
frame is, before drawing it, is most of the work.

## Contextual tooltip

### It is not focusable, holds nothing interactive, and takes no input

A short piece of context about the element under the cursor or focus. It appears and disappears with
the pointer, and it contains no link, no button, no field. A tooltip the user has to reach into is a
popover, and it needs the rules below instead.

**Read:** the tooltip frame's children — text only.

### Its text is supplementary, never essential

Progressive disclosure that keeps descriptive text off the screen is a legitimate use. But whatever
is required to complete the task belongs in the interface, where the user does not have to go
looking for it. If the sentence cannot be dropped without the task becoming unclear, it is not
tooltip material.

**Read:** delete the tooltip mentally — is the task still doable?
**Blocking:** required instructions available only on hover.

### It earns its place on icons and on rarely-used features

An icon or a control with no descriptive text of its own; a feature people forget exists or that
only makes sense in this context. Those are the cases where a hover hint carries real value rather
than restating the label next to it.

**Read:** each tooltip against its trigger's own visible label — if they say the same thing, remove
one.

### Fixed offset, a defined set of anchor positions, bounded width

The gap between the hint and its trigger is one number for the whole product, not per instance. The
hint attaches at one of a named set of positions relative to the trigger, chosen by where there is
room. And its width comes from a small set of steps rather than from the length of the string — a
hint that grows to fit any text ends up a single line across the viewport.

**Read:** offset, anchor position and width against the values recorded in `design.md`.

## Popover — a non-modal dialog

### It may hold one interactive element, but it is not a form

Bound to a trigger element, an action or an event. It can carry a link or a button. It cannot be an
input surface — the moment the user is filling something in, the container is a sheet or a modal
(`ux/navigation.md`).

**Read:** the popover's children — no field, no more than one action.

### It may open by itself, but it closes only by intent

The system is allowed to raise it. Only the user dismisses it — hovering away is not a dismissal,
because they may be reaching for the thing inside it.

**Read:** what closes it; a hover-out that discards an interactive popover is a defect.

## Static info block

### When a hover hint isn't enough, the explanation becomes part of the page

Settings pages are the usual case: the guidance is too long for a tooltip, or the user needs it in
front of them while they work. Then it stops being a hint and becomes a block in the layout —
which changes where it goes and what it must contain.

**Read:** each explanation over a sentence or two is a block, not a hover hint.

### Its position states its scope

General information about the page goes at the top. Information about one element goes directly
under that element. Either way it aligns to the content width, because a banner that ignores the
page's measure reads as an interruption rather than as part of the screen.

**Read:** each info block's position against what it explains.

### It may lose its heading, never its description — and past a few lines it collapses

A block inside another block can go without a title. It cannot go without the sentence that says
what it is for. And when the explanation runs past about four lines, it gets a collapse control and
starts collapsed, so the guidance is available without pushing the actual settings off the screen.
Long guidance is also where bullets earn their place over prose.

**Read:** every info block has a description; ones over ~4 lines have a collapse control.

## Onboarding hints — four kinds, not one

Which kind this is decides whether it blocks, whether it has steps, and whether it comes back.

| Kind | What it is | Blocks the user? | Comes back? |
|---|---|---|---|
| **Onboarding** | nudges a new user toward the next action, early in the first sessions | no — the user must be able to keep working | until done |
| **Walkthrough** | an interactive tour through a set of settings or a changed layout, with next/back/skip | yes, deliberately — the surrounding content is dimmed and the subject highlighted | once; record viewed / not viewed |
| **New feature** | one callout on a feature or a significant change, optionally linking to help | no | never, once dismissed |
| **Better way to use** | reveals a non-obvious capability — a shortcut, an autocomplete, a collapse — after the user has done the long version a few times | no | rarely, and stop after it lands |

### An onboarding hint says only what belongs to this page

It does not explain the product; it explains what is in front of the user. A hint that describes
another screen has no way to be acted on and reads as an advert.

**Read:** each hint's text against what is visible in the frame it points at.

### A hint that blocks needs a way out on every step

Back, next, finish, and skip — plus, where the tour is long, an indicator of how many steps remain.
A tour the user cannot leave gets clicked through blindly, which teaches nothing (`ux/navigation.md`
on skippable onboarding).

**Read:** the hint frames carry back / next / finish / skip and a step indicator.

### The two styles are not interchangeable

A hint on a light surface with navigation buttons, offset from its subject, is the teaching kind:
the rest of the screen dims and the subject is highlighted. A hint on a dark surface, tight to its
subject, with no buttons, is the pointing kind: it names a thing and the rest of the screen stays
live. Using the teaching style for a one-line pointer makes a trivial remark feel like a wall.

**Look:** the style against whether the rest of the screen is meant to stay usable.

### Whether it repeats is part of the design, not the implementation

For every hint: does it come back after the page is closed, and does that depend on whether the user
finished it? An unanswered question here becomes a hint that either never returns to someone who
missed it, or greets a veteran user every morning.

**Read:** each hint records its repeat policy.
