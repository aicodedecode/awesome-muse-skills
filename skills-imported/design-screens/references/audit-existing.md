# Auditing an existing product

Runs before any redesign work when the product already ships. The deliverable of this phase is not
a screen — it is a **map of what the product currently does and where it fails**, laid out in Figma
next to the screens it describes. Everything the redesign later claims as an improvement is measured
against this map, so a wrong note here becomes a wrong screen two phases later.

For scale: one authenticated area of a product runs to roughly 80 screens across 9 flow groups and
60 notes. That is normal, not large — plan the phase as days, not as one pass.

## 1. Capture

Walk the real product and screenshot every state, not every page: empty, filled, error, loading,
success, and the states only reachable by doing the wrong thing (submitting empty, entering a bad
code, letting the session expire).

- **One window size for the whole run.** Mixed widths make two screens incomparable, and the
  comparison is the entire point of the phase.
- **Some states never render as a static page.** A "Coming soon" answer arrived as a toast that
  disappeared in ~1.5 s, in the opposite corner from the click. If a click appears to do nothing,
  assume a transient response and catch it deliberately — "nothing happens" is a claim about
  timing, not a fact about the product.
- Put every capture into Figma in flow-ordered strips, one group per flow (`A · LOG IN`,
  `B · SIGN UP`, …), each screen numbered. The numbering becomes the addressing scheme for every
  later conversation; renaming a group later breaks every reference to it.
- **Ask before crossing anything irreversible.** Registration, verification, payments, and identity
  checks in a live product have real effects. Reading and screenshotting is free; the rest is not.

## 2. Annotate

One note per screen, directly under it, stating the defect and its consequence. Two colours only —
a defect and a working-well observation — and **the colour is the legend, so it has to match the
content**: five positive notes written in the defect colour were a straight contradiction between
what the note said and how it was marked.

Keep praise and criticism in separate notes. One note that held both had its weak nitpick diluting
two strong findings in the same block.

## 3. Re-read your own notes — this step is not optional

A critical re-read of one 64-note audit found **17 defects — one in four**. The notes had been
written by the same agent that had just done the walkthrough, with the observations still fresh, and
a quarter of them were still wrong. Assume the same rate in your own set.

What it actually finds:

| Category | What it looks like | Example |
|---|---|---|
| Miscount | A number in the prose contradicts the list right next to it | "three different wordings of one error" — there were two, one counted twice. "duplicates three of them" — the same note then listed four |
| Contradicting your own observation | The note asserts the opposite of what you verified | "the modal closes neither on Escape nor on clicking the overlay" — clicking the overlay closed it, and that had been tested by hand |
| Claiming the invisible | An assertion about state you never saw | "an unfinished draft stays in the database" — the database was never opened. "there is no support inside the product at all" — three places had been checked, not all of them |
| False contradiction | Two facts declared incompatible without doing the arithmetic | "$50–100k a year vs turnover under $5 000 — contradiction": ≈$4–8k a month, no contradiction. The real gap was a different pair of fields |
| Superlatives | Ranking a finding instead of describing it | "the crudest trap of the whole run" — unprovable, and it dates instantly |
| Local-context blindness | A judgment that is only true elsewhere | "'Below $5 000' is an unrealistically low tier" — realistic for the user's country. The fact worth keeping was different: amounts shown in USD with no localisation |

Two of these are not sloppiness but a predictable bias: **an agent auditing a product tends to
inflate**. Claiming the invisible and superlatives both make the finding sound stronger, and both
survive a casual re-read because they are about the wording, not about the observation.

### Lock

Before the notes are shown to the user, fill this in. It is filled per category, over the whole
note set, not per screen:

```
Notes reviewed: [count] of [total]  — these must be equal; a partial re-read is not this check
Miscount: [count fixed / none found]
Contradicting my own observation: [count fixed / none found]
Claiming the invisible: [count fixed / none found]
False contradiction: [count fixed / none found]
Superlatives: [count fixed / none found]
Local-context blindness: [count fixed / none found]
Colour matches content on every note: [yes / list of notes fixed]
Praise and criticism separated: [yes / list of notes split]
```

`none found` in every row, on a set larger than about 20 notes, is a result that needs an
explanation, not a pass — the observed rate is one defect in four. An unfilled block means the
re-read didn't happen, and notes that haven't been re-read are not ready to show.

## 4. Handing the audit to the redesign

A note is the input to a screen, not a specification of it. Two things follow:

**When the fix removes the object the defect lived on, the frame gets reassigned, not filled.** Three
frames documented a modal date picker: opens on the current month, field is read-only, the year
header doesn't look clickable. Replacing the picker with three typed fields dissolved all three
defects at once — so the frames became "typing the date", "age validation", and "month select", and
two of them were renamed. Filling the original frames would have meant drawing a calendar nobody
was going to build.

**Check every value list against the real design system before writing it into a mockup.** A country
list written from memory contained two countries the flag set didn't have, and named the USA
differently from the set. Neither was visible in the mockup — both would have surfaced as a missing
asset in the first build.

**Rewrite the note when the decision changes.** One note still praised a disabled-button state as
the improvement after that state had been dropped from every screen. A mockup and its own caption
disagreeing is worse than no caption: search the notes for the decision's keywords whenever a
decision is reversed.
