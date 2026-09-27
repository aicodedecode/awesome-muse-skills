# Responsive — what a mockup owes the other widths

Reached from `references/ux-rules.md`. Read when the screen will be seen at more than one width,
which is nearly always.

A mockup at one width is a decision about every other width, made by omission: whoever builds it
will choose what stacks, what shrinks and what disappears. These rules are about making that choice
in the design instead.

### Breakpoints come from the content, not from device names

The width where the layout should change is the width where *this* content stops working — where the
line gets too long to read, where the third column has nowhere to go, where the table stops being
legible. Naming breakpoints after phones and tablets bakes in a hardware generation and misses the
place where the design actually breaks.

**Read:** each breakpoint against what fails just past it. No answer means it was copied from
somewhere.

### Draw the widths where something changes, not a device catalogue

Two or three frames that each show a different arrangement beat six frames showing the same
arrangement at different sizes. The set to draw: the narrowest supported, the widest that still
changes anything, and each width where the layout genuinely reorganises.

**Read:** the frame set — every frame differs from its neighbour in arrangement, not only in size.

### Reflow first, stack second, hide last — and hidden is never lost

The cheapest adaptation is letting content reflow inside the same structure. Next is stacking columns
into one. Only then, moving something behind an affordance — and *moving* is the word: content that
disappears at a narrow width without a way to reach it is content the mobile user does not have. If
it is genuinely unnecessary there, it was probably unnecessary everywhere.

**Read:** for each element absent from the narrow frame, where it went and how it is reached.
**Blocking:** content present at one width and unreachable at another.

### The order the eye takes has to survive the stack

Columns collapsing into one line up in some order, and it is a design decision, not the DOM's. The
sidebar that sat beside the content may belong above it or below it depending on whether it filters
the content or merely accompanies it — and a filter that lands under the results it filters is
useless on the width where filtering matters most.

**Read:** the narrow frame's top-to-bottom order against what the user needs first.

### Targets grow on touch even when the layout doesn't

Narrow does not mean touch and wide does not mean pointer — a tablet is wide and touched, a small
window is narrow and moused. Where the product supports both, target size and spacing follow the
input, not the width (`ux/controls.md`, `ux/accessibility.md`), and hover-only affordances need their
touch equivalent at every width.

**Read:** which frames are touch and which are pointer; target sizes follow that, not the frame width.

### A table gets a strategy, not a shrink

Columns compressed until the text wraps to three lines each is not a responsive table. The two honest
options are a list of cards or a horizontal scroll, chosen by how many columns the record has
(`ux/tables.md`). Choose per table and record it — this is the single most common place a responsive
design is left to whoever builds it.

**Read:** each table's narrow strategy is named in the design.

### The widest width is a design too

Layouts stop being designed past the width the designer's monitor happens to be. Content that grows
without limit produces unreadable line lengths (`ux/content.md`) and rows the eye cannot track across;
the fix is a maximum measure, centred, with the extra space left empty rather than filled because it
is there.

**Read:** the widest frame — is there a max width, and is the empty space deliberate?

### Fixed chrome costs viewport, and on short screens it costs too much

Sticky headers, bottom bars, floating buttons and banners all eat the height the content has. On a
short viewport — a laptop with a browser bar, a phone in landscape — several of them together can
leave a form with two visible fields. Decide which chrome survives a short screen and which
collapses.

**Read:** the short-viewport frame; the content area's remaining height with every fixed element
present.
