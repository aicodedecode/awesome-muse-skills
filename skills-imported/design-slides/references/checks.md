# Checks before the deck is handed over

Five checks. What to fix without asking is set by the branch in `SKILL.md`: nothing in a review without edits, only defects in a pre-send check, everything in a new deck and a full rework. After fixes, checks 1, 2, 4 and 5 run again on the final export (check 3 runs again if the fixes changed layouts).

## 1. Tells checklist

Every slide and the deck as a whole against `tells.md`, with the rule "the approved style wins".

## 2. Numbers against sources

Every number on a slide is in the deck file's source table with the same value, period and units; the status on the slide matches the table; every chart is built from the table's numbers. Done by the agent that has the sources.

## 3. Fresh eyes

A helper agent gets only the slide PNGs: no plan, no conversation, no sources. The brief:

> These are the slides of a presentation, one PNG per slide. Answer briefly:
> 1. What is each slide's job (what does it show or prove)?
> 2. Which slide is the main one, and why?
> 3. Which slides use the same template although they show different things?
> 4. What one idea did you take away from the deck?
> 5. Where do rhythm, spacing, visual weight, alignment or contrast look off (slide number, what exactly)? Which colored details have no clear meaning?

Its "slide job" is compared with the job in the plan. A mismatch means the layout or the text does not carry the job: in a new deck and a full rework the slide is fixed; in the other branches it goes into the "Suggested changes" list.

## 4. Type and details

On the render, count the distinct combinations of text size and weight (with a script over computed styles, or by eye across the slides). More than eight sizes, or one role set differently on different slides: reduce to the scale from `style.md`. Check every colored detail: does it have one meaning, and is that meaning clear?

Labels, statuses and tags on slides match the source's words: a status such as "signed" or "live" appears only if the source says exactly that. A property stays with the subject the source attaches it to; it does not move to another column or another subject.

## 5. Export

The deck is checked in the format it will be sent in (PDF, pptx, Figma link): every slide is looked at in the export's render, not in the editor. Missing blocks, clipped text, broken shadows, empty areas that are not in the source file are defects. Open the PDF in a regular viewer too: the boundary between slides must be visible.

## Reply to the person

The deck and a short list: what was found, what was fixed, what I suggest changing (with slide numbers).
