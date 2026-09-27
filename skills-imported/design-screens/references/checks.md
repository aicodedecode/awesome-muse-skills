# Checks

Three checks run before the user sees a screen. The order is fixed: the first two are cheap and
mechanical — judging style on a screen that's missing a state, or that has a 28px tap target,
spends the taste-sensitive check on something that gets redone anyway. Run them in order; jumping
to Product style first doesn't save time, it just means redoing that check after Completeness or
Accuracy forces a change.

## 1. Completeness

All elements and tasks from the brief are present. Error, empty, and loading states are drawn, not
just the happy path. Checked item-by-item against the brief's own list — this requires no taste,
only a count.

**Result:** PASS, or a list of what's missing.

## 2. Accuracy

Technical execution, not beauty and not intent. Two sources: the criteria below, and the copy,
control, form and accessibility rules the brief carried — `references/ux-rules.md` routes to them
by what the screen contains, and each rule states whether it is verified by **Read** (node
properties and numbers) or by **Look** (the render). A Look rule reported without saying what was
looked at didn't run.

- **Tap zones ≥ 44pt.** A 28px-tall field reads as a caption rule rather than a field: it
  passes a visual glance and fails the moment someone tries to tap it.
- **Integer coordinates.** A frame sitting at `x=132.5` split every edge across two pixels and
  blurred the composition — a half-pixel offset is invisible in the layers panel and obvious on
  export.
- **Colors bound to variables**, never typed in by hand. A hand-typed hex is a color that silently
  stops following the palette the next time the palette changes.
- **Text on text styles, effects on effect styles** — and every style created for this screen has at
  least one user. A type ramp in the styles panel with `textStyleId` empty on every node is the same
  defect as a hand-typed hex: it looks identical today and stops following the ramp tomorrow. Read.
- **Shadows and outside strokes not cut by a clipping ancestor.** The cut lands on the card, but the
  cause is a wrapper two levels up with the default `clipsContent`; checked by computing each shadow's
  reach against its clipping ancestors, not by glancing at the card. Read.
- **The frame being looked at agrees with the file.** A Look rule runs only on a screenshot that
  matches the Read of at least one property changed in this round; a render can lag the file by
  minutes, and a finding filed against a stale render is a finding against the cache.
- **Spacing follows the project's grid**, not an eyeballed value that happens to look close. When
  the file has a spacing collection, every gap, padding and corner radius is bound to it, never
  typed as a number: a typed `16` next to a `16` variable is the same defect as a hand-typed hex.
  The one exception is a gap that reads Auto (`SPACE_BETWEEN`); it stays unbound. A value the scale
  does not have goes to the user as a question, add it to the scale or move to the nearest step,
  and is never left as a number. Read.
- **No artifacts that read as a bug.** Stray single pixels left over from a resize read as a bug
  rather than a deliberate choice — an artifact doesn't announce itself, it has to be looked for.

**Result:** PASS, or a list of findings, each tied to a node id and a number (position, size, or
color value) — not a description of the impression it gives.

## 3. Product style

Whether the screen stayed inside how this product looks — checked against the signature-traits
list and the saved screenshot of approved work in `design.md` (format: `references/state.md`),
**never against general good-UI conventions**. Six fixes that are correct by any UI textbook —
grid alignment, baseline alignment, rounded corners — can pass the critic and still be rejected
outright, when the product's own signature is a sharp corner and a tighter baseline than the
textbook calls for. Textbook-correct and product-correct are different questions; this check asks
only the second one.

Separately: was the task solved **inside the product's own vocabulary** — an existing component,
pattern, or variable — or with an imported technique that solves the immediate problem but doesn't
belong to this product. A solution can pass every general UI heuristic and still fail this check on
vocabulary alone.

**Result:** SHOW-compatible, or a list of trait/screenshot mismatches, each naming the specific
trait or screenshot region it contradicts.

## Modes of application

Rows are mutually exclusive — pick the one that names the actual constraint on this round, not
just "is this the first time it's shown." A first showing built to a direction the user specified
is still the user-chose-this-direction row, not the first-showing row. Each row is a complete list
of what runs for that mode: everything listed runs, nothing listed is out of scope for it. No row
singles out one listed check as more required than the others listed beside it.

| Situation | Checks to run |
|---|---|
| First showing of a new screen, direction was the agent's own call | all three |
| After fixes | only the checks tied to the listed findings, plus "did anything else break" |
| The user chose this direction themselves | Completeness and Accuracy only. **Taste is out of scope**: the critic does not rule on whether a device the user explicitly asked for belongs in the product — that question was already decided by the person who asked for it |
| Edit inside approved work | Accuracy, scoped to the touched element, and Product style — both run in full; a batch of textbook-correct edits with no Product style check is exactly the kind that gets rejected. Completeness is out of scope: nothing was added, screen composition didn't change, there's nothing new to count. Reviewed **one element at a time**, never as a batch |

## Critic prompt (copy-paste ready)

The critic is a separate, read-only agent — not the one that built the screen, so there's no
incentive to confirm its own success. The output below is a checklist to fill in, not a paragraph
to write, and it has exactly two legitimate results per section: a completed result (PASS / a
list), or `out of scope for this mode` — and that second value is legitimate **only** for a check
the mode's row in "Modes of application" does not list. A section left blank, or marked out of
scope for a check the row *does* list, means that check didn't run: treat the verdict as FIX-FIRST.
Fill in the bracketed lines before sending.

```
You are reviewing a Figma screen against three checks: Completeness, Accuracy, Product style
(criteria in references/checks.md). You are the critic, not the builder — a separate pass.

Skills to load: a critique skill if this session has one on the shelf (`design-critique` is one
name worth looking for) — otherwise none; the criteria below are self-contained either way.
figma-use is not required — this is a read-only pass, no use_figma call is made.

Inputs — each line below is an absolute path, filled in before sending. A line left unfilled
blocks the check that depends on it exactly the way a blank result section does (see Verdict):
- design.md for this project. Accuracy reads its Settings section (design system, tokens);
  Product style reads Signature traits. Required whenever either check runs — every mode row
  except the one where neither is listed: [absolute path]
- Saved screenshot of the approved screen, needed for the Product style check and for "edit
  inside approved work" mode: [absolute path / not applicable — this mode's row does not list
  Product style]
- The screen's task list that Completeness is checked against — the brief that carries it, or
  the task list itself, pasted in full: [absolute path to the brief / the task list itself]

Rules:
- Read-only. Do not write, move, or edit anything in Figma.
- Verify every item yourself, directly against node properties or the screenshot. A builder's
  report of what it did is not evidence of what it did — re-derive each result from the file.
- Every finding names a specific node id. "Spacing looks off" is not a finding; "node 12:34,
  padding-top 14px, grid step is 8px" is.
- If something looks wrong but is a limitation of the tool or the export (e.g. a rendering
  artifact from the screenshot pipeline, not the file itself), say so and separate it from an
  actual defect in the file.
- Mode: [first showing / after fixes / user-chosen direction / edit inside approved work] —
  run every check that mode's row lists (references/checks.md, "Modes of application").
- For a check the row does **not** list, write `out of scope for this mode` as its result — do
  not leave the section blank. For a check the row **does** list, `out of scope` is not a valid
  answer for it; produce a real result instead.

Fill in every section below for the mode given. Do not summarize instead of filling it in.

## Completeness
Result: [PASS / list of missing elements or states / out of scope for this mode]

## Accuracy
Result: [PASS / list of findings, each with a node id and a number / out of scope for this mode —
note if scoped to a single touched element rather than the whole screen]

## Product style
Result: [SHOW-compatible / list of mismatches against the signature-traits list or saved
screenshot, each naming the trait or region / out of scope for this mode]

## Verdict
SHOW or FIX-FIRST. A section legitimately marked out of scope does not block this; a section
left blank, an input slot left unfilled, or a result marked out of scope despite being listed
for this mode, does.
```

For **after fixes**, replace the Completeness/Accuracy/Product style sections with:

```
## Findings from last round
- [finding 1]: ADDRESSED / NOT ADDRESSED
- [finding 2]: ADDRESSED / NOT ADDRESSED

## New breakage
[Anything the fixes broke that wasn't broken before. "None found" is a valid, explicit answer —
an empty line is not.]

## Verdict
SHOW or FIX-FIRST.
```
