# Briefs

Reference for `SKILL.md`, "Working a screen," step 2: write the brief, then check it against this
file, before any agent is dispatched. Two agent templates live here — designer (strongest model tier) and
mechanic (cheaper tier) — plus the addendum that applies only in variants mode. The critic's prompt is
not repeated here; it lives whole in `references/checks.md`, run at step 4.

## Why the self-check lives inside the template, not next to it

Baseline failure: a brief mandated an identical tab bar across three requested list-screen variants,
and got three variants that differed everywhere except the navigation. The defect was never in an
agent's judgment; it was in what the brief handed the agent to judge
with. A checklist that sits as prose beside the template gets read once and forgotten by the time
the template is actually being filled in. So the ten checks below are not a list to consult —
they are blank slots built into the "ready to send" template itself. A slot still holding `[ ]`
is visibly not done, the same way an unrun check in `checks.md`'s critic prompt defaults to
FIX-FIRST rather than a silent pass.

## The designer brief — eight blocks

Each block below is explained with a filled example. The actual copy-paste template, with the
ten self-checks embedded at the block each one governs, follows in the next section.

1. **Role and prior failure.** State who the agent is; if a previous attempt at this exact screen
   was rejected, say so plainly, including the reason if known — and separately, pull any
   relevant lines from `design.md`'s `Rejected` section (verbatim, per `state.md`'s format), even
   when they concern a different screen. The two are not the same fact: an idea can be on record
   as rejected product-wide without this exact screen ever having been attempted before. The
   ASCII-texture idea was retried a round after the user had rejected it in words — the rejection
   was on file, just never carried into the next brief. Silence on either line reads as "nothing
   to avoid," a different claim from "I checked."
   *Example: "You are a mobile screen designer working in Figma. A previous pass on this screen
   was rejected — the user's words: 'the buttons all look the same, I can't tell what's
   tappable.' Also on file in design.md's Rejected section: 'ASCII isn't us, dither is
   closer' (empty-state texture) — do not propose ASCII texture here either."*

2. **Skills to load, minimal stack, in order.** `figma-use`, `figma-plugin-api-rules`, and exactly one
   visual skill for the task type (`SKILL.md`, "Minimum skill stack") — never the whole shelf. Name
   the visual skill you actually found on this session's shelf, and name what NOT to load, so the
   agent doesn't stack lenses. Found none → say that instead, and don't leave the line blank.
   *Example: "Load, in order: figma-use, figma-plugin-api-rules, mobile-app-ui-design. Do not load
   frontend-design, impeccable or dataviz — this is a native screen, not web or a chart."*
   *Example, empty shelf: "Load, in order: figma-use, figma-plugin-api-rules. No visual skill is
   installed here — work from design.md and references/ux-rules.md."*

3. **References, as absolute file paths, with an instruction to look at all of them.** A path the
   agent might skip is a reference that might as well not exist.
   *Example: "Look at every file below, all four, before building anything:
   <repo>/.claude/design-shots/accounts-list-2026-01-14.png, <repo>/.claude/design.md, ... Node <id> in
   the Figma file is the screen to clone from — open it first."*

4. **Work zone and forbidden zones.** Name the frame or page the agent may edit, and what it may
   not touch — other pages, other frames, shared components used elsewhere.
   *Example: "Work only inside frame 'Settings/Draft'. Do not touch the Accounts page or any node
   also used by an existing screen — check Instances before editing a component."*

5. **Design system as material that isn't free, and the rules in force.** Colors from variables,
   type from text styles — never typed in or eyeballed, even "just this once." Then: open
   `references/ux-rules.md`, take the rows matching what this screen will contain, and paste those
   rules into the brief in full. Naming the file is not enough — a dispatched agent reads the brief,
   not this skill's references.
   *Example: "Every fill is a variable from the 'color' collection. Every text layer uses an
   existing text style. If neither exists for what you need, say so instead of typing a value."*

6. **Screen content — data and tasks, not structure.** What the screen must show and let the user
   do. Layout, navigation, and component choice are the agent's to solve — dictating them is how
   one brief produced three variants with identical navigation.
   *Example: "The screen must let the user request a reset link by email, see a confirmation
   state, and see an error state for an unregistered email. How these are arranged, and whether
   there's a back button, is yours to solve."*

7. **Process: intent in words, then build, then self-critique.** A one-paragraph statement of
   intent before any Figma call, then the build, then at least one self-review and revision pass —
   stated as real compositional latitude, not a form to fill in.
   *Example: "First, in words: what is this screen's one clear idea? Then build it. Then check
   your own result against that idea and the references, and revise at least once. You have real
   freedom in how you arrange this."*

8. **Response format — short.** Cap the answer so the agent doesn't narrate the whole build back.
   *Example: "Reply in 15 lines or fewer: what you built, the frame's node id, and anything you're
   unsure passes the product's own style."*

## Designer Brief — ready to send

```
## 1. Role and prior failure
You are a [role] designer working in Figma on [product].
Prior attempt on this exact screen: [none yet — first attempt / rejected — user's words: "..."]
Relevant lines from design.md's Rejected section (verbatim, state.md's format), even if they
concern a different screen: [none apply / quote each relevant line, with its date]
SELF-CHECK 3 — are BOTH lines above filled in, even when the honest answer is "nothing yet" /
"none apply"? Leaving either blank reads as "nothing to avoid," a different claim from "I
checked."
  [ ]

## 2. Skills to load, minimal stack, in order
Load, in order: figma-use, figma-plugin-api-rules, [one visual skill for this task type — see
SKILL.md, "Minimum skill stack"]. Do not load any other visual skill.

## 3. References
Open every file below before building anything:
[absolute path 1]
[absolute path 2]
Existing node to clone from, if one exists: [node id]
SELF-CHECK 2 — is every reference above an absolute file path, with an instruction to review all
of them?
  [ ]
SELF-CHECK 9 — is there a node id above to clone from, or only a worded description of the
screen's anatomy? A cloned node keeps spacing, styles, and bindings identical; a description
invites the agent to author from scratch — and authored-from-scratch screens drift off product style.
If only a description exists, STOP and find a node before sending this brief.
  [ ]

## 4. Work zone and forbidden zones
Edit only: [frame / page].
Do not touch: [other pages, shared components, anything also used elsewhere].
(Variants mode only) Do not look at output from any previous round — a fresh dispatch gives a
fresh take, not a variation on what round 1 already produced.
SELF-CHECK 5 — are forbidden zones named, and, in variants mode, is the no-peeking line present?
  [ ]
SELF-CHECK 8 — is every prohibition above phrased as a goal ("stay inside the Settings frame"),
not a bare block ("don't touch anything else")?
  [ ]

## 5. Design system as material, and the rules in force
Colors: variables only, from [collection name]. Typography: existing text styles only.
Reuse ladder, in this order, ahead of any create step:
1. Does the screen need this element at all?
2. Is there a component in the design system for it?
3. Is there an existing pattern in the product to clone?
4. Does an existing variable or text style already solve it?
Only when all four are "no" — create.
Never cut, no matter where the ladder lands: the screen's error, empty, and loading states;
accessibility (tap zones, contrast); every task listed in block 6.

Rules in force for this screen (pasted in full from references/ux-rules.md, not named):
[the rules from every matching row — copy, forms, controls, accessibility]
SELF-CHECK 6 — is the reuse ladder above present, in this order (need it at all → component →
pattern to clone → variable/text style → create), with the never-cut list next to it?
  [ ]
SELF-CHECK 10 — are the rules in force pasted in full, from every row of references/ux-rules.md
that matches what this screen contains — including the accessibility row, which always matches?
A brief that only cites the file makes the agent discover the rules at check time, after the
screen is built.
  [ ]

## 6. Screen content
This screen must let the user: [tasks]. It must show: [data]. Draw the error, empty, and loading
states, not only the happy path.
This section does not fix layout, navigation, or which components to use — solving that is the
agent's job, not the brief's.
(Variants mode only) Axis of difference for this round: [what must differ between variants — never
structure or navigation].
SELF-CHECK 1 — does this section give data and tasks only, with structure and navigation left open?
  [ ]

## 7. Process
State your intent in one paragraph before touching Figma. Then build. Then review your own result
against the references and the design system, and revise at least once before answering. You have
real freedom in how you arrange this — the brief says what the screen must do, not what it must
look like.
SELF-CHECK 4 — is compositional freedom granted in explicit words, not just the absence of a ban?
  [ ]

## 8. Response format
Reply in 15 lines or fewer: the node id, what you built, and anything you're unsure passes the
product's own style.
SELF-CHECK 7 — is a response cap stated, at or under 15 lines?
  [ ]

## Economy
[paste the full text from "Economy," below, unedited]

SEND STATUS: [NOT READY / READY] — do not mark READY while any SELF-CHECK line above still shows
"[ ]" instead of an actual answer.
```

## Variants-mode addendum

Add the lines tagged "(variants mode only)" above — never by default. They apply only under the
three conditions in `SKILL.md`, "Default: one screen": the user asked in words, this is discovery
on a product with no chosen direction, or the orchestrator names a genuine fork and the user says
yes to seeing options.

- **Axis of difference, stated explicitly.** Block 6 names what must differ between variants —
  density, tone, emphasis, information hierarchy. It never names structure or navigation as the
  axis, and it never leaves structure unconstrained by accident either; SELF-CHECK 1 covers both.
- **Explicit ban on specifying structure and navigation**, even through the axis of difference.
  This is the rule the tab-bar failure exists to prevent: a navigation pattern mandated once,
  pasted into three otherwise-independent briefs, produces three variants that only differ where
  the brief allowed them to.
- **Ban on peeking at previous rounds**, in block 4. Each brief goes to a fresh dispatch. An agent
  shown round 1's output gives a variation on round 1, not a genuinely separate take.
- **Show as a batch, allow mixing.** Not a line in the agent's brief — an instruction to the
  orchestrator, for after every variant is back: lay them out together in one grid for the user,
  and let the user pick pieces across variants, not only a whole variant. `SKILL.md`, "Working a
  screen," step 5.
- **Synthesis round, once the user has picked.** Not prose ("combine the good parts") — a
  what-from-where list, one line per element, naming the source variant:

  ```
  ## Synthesis — what comes from where
  [element] ← variant [n]
  [element] ← variant [n]
  [element] ← variant [n]
  (every element the user pointed to, none implied or assumed)
  SELF-CHECK S1 — does every element from the user's picked set have its own row above? Not "the
  list is written," but one row per picked element, checked against what the user actually
  pointed to, not against memory of it.
    [ ]

  SEND STATUS: [NOT READY / READY] — do not mark READY while the SELF-CHECK line above still
  shows "[ ]" instead of an actual answer.
  ```

  **This list becomes the synthesized screen's task list for the Completeness check.** A
  synthesized screen has no brief of its own to check item-by-item against — without this list,
  Completeness has nothing to count against, and a dropped element passes silently. This is the
  exact failure the check exists to catch: a synthesized list screen passed every gate and
  shipped without its primary add button, because nothing on record said the button had to
  survive the merge.

## The mechanic brief — cheaper model tier

For variable bindings, text-style application, cloning, renaming, and moving nodes — never for
composition, critique, or synthesis (`SKILL.md`, "Models"). The agent makes no design decisions;
an ambiguous step is a reason to stop and ask, not to choose on the user's behalf. Work happens in
small `use_figma` calls, one property change per call, with the read-back requested inside that
same call — not scheduled as a separate check for later — and a check against the target before
the next node starts. A batch of five writes verified once at the end means a failure on node two
is discovered four nodes too late.

These disciplines are prose today, and the same reasoning that put ten self-checks into the
designer template applies here without a discount: a checklist that sits beside the template gets
read once and forgotten by the time the template is filled in. The mechanic template below carries
the same kind of slots, for its own three real requirements, with the same blocking send status.

## Mechanic Brief — ready to send

```
You are executing a mechanical Figma edit on [product]. You are not making design decisions — if a
step is ambiguous, stop and ask rather than choosing for the user.

Load: figma-use, figma-plugin-api-rules. No visual skill — there is no design judgment in this task.

Reuse ladder before creating anything, in order:
1. Does the screen need this element at all?
2. Is there a component for it?
3. Is there an existing pattern to clone?
4. Does an existing variable or text style already solve it?
Only if all four are "no" — create.
Never cut, no matter where the ladder lands: the screen's error, empty, and loading states;
accessibility (tap zones, contrast); every task in the steps below.

Steps — one Figma effect per step, small calls:
1. [node id] — [property] → [target value].
2. [node id] — [property] → [target value].
[repeat per node]
Rule applied to every step above: read the changed property back inside the SAME use_figma call
that set it, and compare the read-back to the target before starting the next step. A mismatch
stops the sequence here — do not continue to the next node on an unconfirmed step.
SELF-CHECK M1 — is every step above sized to one Figma effect, with the read-back-and-compare rule
enforced before the next node starts, instead of a batch verified once at the end?
  [ ]
SELF-CHECK M2 — does the rule require the read-back inside the SAME use_figma call that made the
change, not scheduled as a separate check for later?
  [ ]

## Economy
[paste the full text from "Economy," below, unedited]

Reply in 15 lines or fewer: one line per node — node id, property, before → after. Nothing else.
SELF-CHECK M3 — is the reply held to the 15-line, one-line-per-node contract above, with nothing
else added?
  [ ]

SEND STATUS: [NOT READY / READY] — do not mark READY while any SELF-CHECK line above still shows
"[ ]" instead of an actual answer.
```

## Economy

The three rules below go into every brief this file produces, worded exactly as follows — this is
the recipe each dispatched task carries, not a separate document an agent has to go find:

> **Numbers before pictures.** Do not screenshot your own work "just to be sure". Verify with
> numbers or by reading node properties back; take a screenshot only to judge quality, where the
> eye is irreplaceable.
>
> `compare -metric AE -fuzz 2% approved.png now.png diff.png` — zero means unchanged.
> An export hash before and after proves an edit is pixel-inert.
>
> **One strip, not six reads.** Compose several frames into a single image with `magick ...
> +append` and read it once.
>
> **Never call `get_metadata` on a page id** — it has overflowed the context limit at 188,152
> characters. Node ids only; for a page overview write a compact dumper that does not descend
> into instances.

**What this never applies to: the brief to the design agent, and the critic's findings.** A brief
compressed into a structural checklist in words, with no pictures, and run on an economy model
produces a screen whose styles change while the design barely does. A token-compression skill, whatever it is
called, is fair game only for the mechanic's status reports and the log lines in `design.md`
— never for the brief above, and never for a critic's findings, which are useless without the node
id and the number attached.

| Compress | Never compress |
|---|---|
| Mechanic status reports (the ≤15-line contract), `design.md` log lines | The brief to the design agent; the critic's findings text |
