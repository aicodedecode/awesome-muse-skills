# UX rules — index

Product-agnostic rules for what goes on a screen. Some were earned by having a specific screen
rejected for them, some come from a production component library, some are standard practice worth
writing down because an agent will not infer them. This file is the routing table; the rules
themselves live in `ux/*.md`.

**Two moments read this set, and they read it differently.**

- **Writing the brief** (`references/briefs.md`, block 5) — *before* anything is drawn. Take the
  rows that match what this screen will contain and paste the rules themselves into the brief. A
  rule the agent meets for the first time at check time has already cost a rebuild.
- **The Accuracy pass** (`references/checks.md`, check 2) — *after* it is drawn. The same rules,
  read as criteria.

## Routing: what to read when

| The screen contains | Read |
|---|---|
| prose — hints, messages, descriptions, empty-state text | `ux/copy.md` |
| what a control is *called* — button, link, menu item, a dialog's answers | `ux/labels.md` |
| a field, a form, validation, one step of a multi-step flow | `ux/forms.md` |
| *which* control, and how it behaves — pickers, panels, targets, gestures | `ux/controls.md` |
| saving, cancelling, deleting, acting on a selection | `ux/actions.md` |
| anything that can be missing or can fail | `ux/states.md` |
| anything that arrives asynchronously | `ux/loading.md` |
| a hint, a hover explanation, an onboarding tour | `ux/tooltips.md` |
| real data — names, amounts, dates, long strings, paragraphs | `ux/content.md` |
| rows of the same kind of thing — a table, a list of records | `ux/tables.md` |
| a search field, filter controls, a saved query | `ux/search.md` |
| a place inside a flow, an overlay, a set of screens to move between | `ux/navigation.md` |
| anything that appears, disappears, expands or moves | `ux/motion.md` |
| more than one screen width — so, nearly always | `ux/responsive.md` |
| any padding, gap, margin or position — so, always | `ux/spacing.md` |
| anything at all | `ux/accessibility.md` |

Load only the rows that match — except the last two, which have no exemption: every screen has
text, targets, states and distances.

**One file is not like the others.** `ux/principles.md` holds the *why* — Hick, Miller, Fitts, one
accent per screen, what the default costs. Those change what you choose while building (step 3),
they cannot be checked off a finished screen, and they must never be reported as Accuracy findings.
Read it when composing something new or when a direction has been rejected and you need to know
what to change; skip it for a one-element edit.

## How each rule is written

Principle first, then how to verify it. Verification is one of two kinds, and the Accuracy pass
treats them differently:

- **Read** — verifiable without judging the render: node properties, numbers, or the strings
  themselves. A finding names the node and the value it holds; no taste is involved.
- **Look** — verifiable only on the render. Say what you looked at and what you saw; "looks fine"
  is not a result.

A rule with no verification line is not finished. Write one before adding it. (`ux/principles.md`
is the exception, and says so at the top: its entries carry "use it when" instead, because they
inform a choice rather than judge a result.)

Some rules add **Blocking:** — the screen does not go to the user with that defect unfixed, and the
critic's verdict is FIX-FIRST rather than a listed finding. Everything unmarked is an ordinary
finding: real, fixable, not a stop. Two levels, because four invite arguing about which is Medium.

Where a rule holds only on one kind of device, it says so in italics — *Touch:*, *Pointer:*,
*Mobile:*. A rule with no marker holds everywhere.

**Rules that speak of tokens assume the product has them.** This skill works on products with no
design system too (`SKILL.md`, the project-state table). There, the same rule applies to the values
themselves — one scale, one set of colours, recorded in `design.md` — and "not bound to a variable"
is not a finding. What stays a finding either way is a value that matches nothing else on the
screen.

## Growing this set

A rule belongs here when it is true **outside** the product it came from. A rule that is true only
for one product is a signature trait: it goes into that project's `design.md`
(`references/state.md`, "Signature traits"), never here — putting it here would push one product's
taste onto every other product this skill touches.

Split a topic file when it stops being one topic — when the routing row would need an "and" to
describe it. Around 120–140 lines is the signal to check, not the rule itself: `states.md` split
into states and loading because the wait and the failure are different questions, not because of a
line count.
