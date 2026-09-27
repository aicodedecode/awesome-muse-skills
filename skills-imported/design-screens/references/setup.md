# Setup: First Run In A Project

Reached from `SKILL.md` exactly once per project: the first time `<project>/.claude/design.md` doesn't exist. Every run after the first reads that file instead of following this one.

## Step 1 — Discover before asking

Before asking anything, look for a place where the project already keeps design knowledge. The two questions in Step 2 are asked only if this search comes up empty.

Search, in this order:

1. **Domain-specific design documents** in the project root or its docs folder — files like `DESIGN_SYSTEM.md` or `<PRODUCT>_DESIGN_SYSTEM.md`.
2. **`CLAUDE.md` / `AGENTS.md`** — project instructions often name a design system or house style directly.
3. **`DESIGN.md` / `PRODUCT.md`** or similar top-level docs.
4. **The Figma file itself** — variable collections and text styles are a design system even when no document describes them in words. Open the file and check before concluding there's nothing.
5. **Project memory**, if this agent keeps one for the project — a past session may already have recorded the answer.

**Rule: if the project already has a place for design knowledge, `design.md` points to it — it does not restate it.** Copying a style description into `design.md` creates a second copy that drifts the moment either one is edited alone. Record a pointer (file path, Figma file key, memory entry name) and stop there.

If the search finds something, skip Step 2 entirely. Write the pointer into `design.md` (format in `references/state.md`) and start working.

If `design.md` already exists and is an index (`state.md`, "Several products in one repository") but the
task's product has no row, this setup runs for that product alone: its answers go to `design/<slug>.md`,
and the index gets one new row. The index itself is never overwritten.

## Step 2 — The survey: exactly two questions

Ask only if Step 1 found nothing. No more than these two, in this order.

**Question 1 — Is there a design system?**

- **Yes** → the design system is law. Colors, typography, and components come from it; nothing is invented. Ask only *where* it's described (a document, a Figma file, or both) and record the pointer. Stop here — the phases below don't run.
- **No** → ask Question 2.

**Question 2 — (only if no design system) Are there existing screens in Figma?**

- **Yes** → those screens are the style to match. New work is built to match their style. External references are gathered only as an addition, and only when the task explicitly calls for a fresh direction.
- **No** → this is a from-scratch product. Go to "From scratch" below.

## Never ask

- **Interface language.** Not part of this survey, at any point, regardless of which answer the two questions above produce.
- **What medium the mockups are built in.** Always Figma. This skill doesn't cover any other medium, so there's nothing to choose.

Asking either turns a two-question survey into a longer interview, and the rest of the skill has no use for the answer.

## From scratch

Reached only when Question 2 was answered "no existing screens." Skipped entirely whenever a design system or existing screens were found.

Order matters — each phase gives the next one something to answer to, instead of a blank page:

1. **References.** First ask, in one line, whether the user already keeps a curated set — a folder in an asset manager, a board, a moodboard — and use that set when there is one; gathering references from the web when a curated folder exists produces a direction the user has already rejected in their own collection. Only if there is nothing, the skill gathers external references itself. Either way the set is laid out in a grid and the user marks the ones that fit. A grid the agent has to look at itself is built as one contact sheet (twenty thumbnails tiled into a single image with an image tool such as ImageMagick's `montage`) and read once, not twenty separate image reads. The marked set is the input to every phase below.
2. **Three directions.** Synthesize three distinct directions from the marked references. Show them; the user picks or mixes. A single direction read off the references is a summary of the folder, not a proposal — the three still get shown, and "yes, go" to a summary is not a pick.
   When directions are built in Figma rather than described, each one's variables and styles are named under the direction's own prefix (`lens/…`, `depth/…`) so they can be told apart, and the chosen direction's tokens are the only ones that survive: the losing directions' tokens are removed once the pick is made, and the removal is listed in `design.md` under In progress until done. Tokens from three exploratory directions left in one collection read as the product's palette to the next agent.
3. **Typography, then palette.** Deliberately in this order, not the reverse: a font pairing carries more character than a color choice does, so settling type first gives the palette something concrete to answer to. In practice the answer to this step is often a mix rather than a single direction taken whole — a serif from one direction, a mono from another.
4. **Degree of character.** How far the product is willing to lean into the chosen direction — restrained or loud — in the user's own words. Asked, not proposed: an agent-picked "moderate" that the user waves through is the default of every product on the market, and it comes back as "looks like everything else" after the first build. One line: "restrained, or loud? Anything it must be unlike?"
5. **Patterns, in words.** Describe recurring layout and component patterns verbally, before touching Figma. This is the raw material that later becomes the signature-traits list in `design.md`.
6. **Screens.** Only now, build.

**Rule for every fork in this phase: the user may answer with a mix, not only pick one option.** Don't force a single choice where the honest answer spans two — the typography example above is what that looks like in practice.

## After the survey

Every answer — the pointer from Step 1, or the questionnaire and from-scratch results from Steps 2 and beyond — is written into `<project>/.claude/design.md` (format and upkeep rules: `references/state.md`). From the next run onward, this project doesn't repeat the survey; it reads the file.
