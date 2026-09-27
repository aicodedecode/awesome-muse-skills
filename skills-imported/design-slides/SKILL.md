---
name: design-slides
description: Use when creating, restyling, reviewing, or editing a presentation, pitch deck, slide deck, talk, or design review deck, in Figma Slides, Figma Design, pptx, Google Slides, or HTML. Also use when a deck looks generic, templated, or AI-made and needs fixing.
---
> Adapted for Muse from [schudarin/chudarin-design-skills](https://github.com/schudarin/chudarin-design-skills) (MIT) — plain-markdown portable unit. Claude Code-isms neutralized; any Figma MCP / write steps are kept as read-only reference knowledge.


# Slides

A deck built on defaults is recognized at once: every slide on one template, the main point given the same weight as the minor ones, no product in sight, placeholders instead of data, an export nobody opened. This skill puts the story before the layout, takes the style from the person or the company, and checks the deck in the form it will be sent in.

Text on slides follows the `writing-texts` skill, with the person's and the product's voice. The deck's state lives in `<project>/.claude/slides/<deck>.md`, one file per deck (format in `references/story.md`).

## Which branch

| What exists | Branch |
|---|---|
| No deck | new deck |
| A deck; asked to change part of it | partial edit |
| A deck; asked to look at it or assess it ("what's wrong?") | review without edits |
| A deck; asked to check it and hand it over or send it | pre-send check |
| A deck; asked to redo it entirely | full rework |

## New deck

Each step ends where it says "wait". The next step starts only after the person answers.

1. **First reply: questions and a plan, no slides.** One message:
   - questions the request does not answer: who is watching and what they decide; how the deck will be used (shown live, sent as a file, edited by others, printed, animated) and in which format;
   - a plan per `references/story.md`: a table "claim · slide job · layout";
   - data questions: every claim without a number or a source becomes a question. Such a claim does not go on a slide until the data exists.

   Wait for the plan to be confirmed and the questions answered.
2. **Style and tool** per `references/style.md` and `references/tools.md`. There is no default style: if the person has nothing, three directions to choose from. Wait for the choice.
3. **Two or three key slides** with different jobs and different layouts, as screenshots. Wait for confirmation.
4. **The remaining slides** per the plan: each slide's layout follows its job and is taken from a key slide when the job is the same.
5. **Checks** per `references/checks.md`, fixes, export again. The person gets the deck after this.

After each step the state is written to the deck file: plan, sources, style, what was confirmed and what was rejected.

## Existing deck

**Partial edit.** Only what was asked changes; plan, style and key slides are not agreed again. The affected slides are checked and exported. If something else in the deck stands out along the way (a repeated layout, a number without a source, a tell from `references/tells.md`), the reply ends with a list "Noticed, not changed": slide number and one line per item.

**Review without edits.** All checks from `references/checks.md`, but the deck files do not change: no fixes, no export over them. Reply: what I found, by slide, and what I suggest changing.

**Pre-send check.** All checks from `references/checks.md` on the whole deck. Only defects are fixed without asking: an element lost or broken in export, a typo. Style, plan and layouts do not change. Everything else goes into a "Suggested changes" list. The final export is checked again. Reply: what was found, what was fixed, what is suggested.

- **A number on a slide differs from the source table.** This is not a typo: the person may have updated the slide and not the table. Do not change the number. Show both values and ask which is right and where it comes from; the export waits for the answer.
- **No deck file** (the deck was made elsewhere). The source table is not filled from the deck itself: "source: slide" or "source: deck" is not a source. Every number is recorded with the status "unverified", and a question is asked about each.

**Full rework.** The plan is rebuilt from the deck (the claim and the job of each slide) and shown for confirmation. Then steps 2–5 of a new deck.

## Data

A number is on a slide only if it is in the deck file's source table. No source: a question to the person. A placeholder on a slide or in a proposal ("TBD", "to follow", "data later", bars without values, "[screenshot]") is neither placed nor offered: a question goes in its place, and a slide without data waits for the answer or leaves the plan. The status "estimate" or "forecast" stays next to the number. Details in `references/story.md`.

## Files

| File | When to read |
|---|---|
| `references/story.md` | plan, slide jobs, deck types, source table, deck file format |
| `references/style.md` | choosing the style, layout by job, grid, type, contrast, accents, charts |
| `references/tells.md` | catalogue of tells; before the key slides and during checks |
| `references/checks.md` | checks before the deck is handed over |
| `references/tools.md` | choosing the tool; Figma, pptx, HTML |
