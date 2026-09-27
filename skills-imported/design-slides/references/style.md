# Deck style

## Where the style comes from

Down the chain; the first thing found is the style:

1. **The company's design system or template** (Figma library, Figma Slides template, pptx master, brand book). This is law.
2. **Past decks** of the person or the company. The style is taken from them: fonts, colors, grid, how numbers and the product are shown.
3. **Nothing.** Three different directions from references the person provides, per the "From scratch" section in `../design-screens/references/setup.md`. The person picks one or mixes them. One direction instead of three is not offered.

The agent has no default style of its own. A neutral light background with one accent, chosen "because there was nothing", is also a default style.

The style source is recorded in the deck file.

## What the style includes

Only what the source sets: fonts, colors, grid, devices. Elements the source does not have are not added by the agent: an all-caps letter-spaced eyebrow, a rule with the slide number at the bottom, gradient blobs, a card with a stripe on the left. If such an element is needed, it is offered to the person separately.

## The approved style beats the tells catalogue

If an element is set by the style source, it stays even when it matches a tell from `tells.md`: Inter and indigo in a company template are not corrected.

## Layout follows the job

The layout is chosen for the slide's job from the plan (`story.md`). Key slides set the layouts for their jobs; other slides with the same job take them, slides with a different job get their own.

## Grid, rhythm and weight

Spacing scale and grid per `../design-screens/references/ux/spacing.md`: one scale for the whole deck, text sits on the grid on both axes. On top of that, for slides:

- **One title height.** The title starts at the same height on every slide except the title slide. Content is not centered vertically if that moves the title.
- **One zone for the footer and notes.** Footnotes, sources and rows of partner logos sit at the same distance from the footer on every slide.
- **One main element per slide.** Context (background data, footnotes, explanations) is lighter than the main element in size, color or saturation.
- **Empty space with no job is a reason to redo the layout, not to fill it.** A large void in the middle means the blocks are not composed.
- **A highlighted row keeps its text on the grid.** The background extends past the grid; the text inside sits where it does in the neighboring rows.
- **A fact sits next to what it is about.** A number about one person or one company goes next to that name, not in a shared line at the bottom.

## Type scale

Seven or eight sizes for the whole deck, each with its role: title slide, heading, lead, subheading, body, small, caption; numbers in monospace get a separate short scale. One role is set the same way on every slide. Sizes that differ by 2–4 px and nothing else are merged into one.

## Contrast

Text, including gray secondary text, is at least 4.5:1 against the background. After any background change, accent colors are checked again: a light accent on a tinted background gets lost. If an accent does not read, change how it is applied (a highlighter mark under dark text, a fill), not add an outline.

A PDF is usually viewed in a viewer with a white background: the slide background must differ from white enough for the boundary between slides to show.

## Accents

Small accent details make a strict slide feel alive; there is no need to scrub them out. Rules:

- each accent has one meaning across the deck (for example, a dot means "built in-house", a highlight means "the slide's main conclusion");
- the meaning is explained on the slide with a legend or a label next to it, if the reader will not work it out alone;
- one brand detail without a legend is fine (a colored mark in the name on the title slide);
- a detail the person approved is not removed for the sake of the system: the system adapts to it.

## Charts on a slide

If the session has a `dataviz` skill, load it for any chart. On a slide, in addition:

- the chart's title is set at the subheading level, units next to it ("$ bn", "% per year");
- bars have an axis they grow from;
- the top of the chart lines up with the top of the neighboring text column, rows aligned to the grid;
- value labels fit inside the slide margins; the scale is chosen so the longest labeled bar fits;
- a context chart is lighter than the slide's main element.

## Links and terms

In a PDF, email addresses and links are clickable and colored. A term on the title slide is clear without the rest of the deck: the full product term, not the short form used inside the team.
