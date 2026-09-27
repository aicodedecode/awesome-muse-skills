# Content — truncation, formats, typography of running text

Reached from `references/ux-rules.md`. Read when the screen shows real data: names, amounts, dates,
long strings, tables, paragraphs.

### Essential text is never truncated

Names, amounts, statuses, anything the row exists to communicate. Truncate the secondary line
instead. If every string in the row is essential and none fits, the layout is wrong — the text is
not the thing to fix.

**Read:** for each truncated node, whether the row would still make sense with that value hidden.
**Blocking:** an amount or an identity cut mid-word is a defect, not a compromise.

### Truncation is a decision made per node, not a fallback

Three outcomes, chosen deliberately: wrap to a second line, truncate with an ellipsis, or let the
container grow. And where a value is truncated, the full value has to be reachable somewhere — a
detail view, a tooltip, the next screen. For values whose *end* carries the meaning — file names,
identifiers, addresses — truncate the middle, not the tail.

**Read:** `textTruncation` / wrap behaviour is set explicitly on every text node that can overflow.
The Figma-side mechanics — why a truncated node still reports its full string, and how to lift the
truncation — are in `figma-plugin-api-rules/references/text-and-styles.md`.

### Realistic content, not lorem ipsum and not "asdf"

Placeholder text hides exactly the problems the mockup exists to find: real names are longer, real
amounts have more digits, real statuses are two words. Fill the mockup with the plausible
worst case — the longest name, the largest number, the wordiest status — and the layout problems
surface before the build, not after.

**Look:** the longest string that will realistically occur is present somewhere on the screen.

### Numbers right, text left, one precision per column

In a table, digits line up only when the column is right-aligned; text scans only when it is
left-aligned. And a column keeps one format: `1,000` next to `1000.5` cannot be compared at a
glance, which is the entire purpose of putting them in a column.

**Read:** alignment per column type, and one decimal precision per numeric column.

### A date format that can be misread is a bug

`03/04` is March the fourth or the third of April depending on the reader. In a mockup either use a
format that cannot be misread (`4 Mar 2026`) or state the locale the screen assumes. Thousands
separators and decimal marks differ by locale too — a screen that hardcodes one is a screen that
will be wrong somewhere.

**Read:** every date on the screen is unambiguous, or `design.md` records the locale.

### An amount states its currency

A number with no symbol or code is a defect in any product that will ever have a second currency,
which is most of them. The same goes for units: 12 what?

**Read:** every amount carries a currency; every measurement carries a unit.

### Reading text sits between about 45 and 75 characters per line

Longer and the eye loses the return to the next line; much shorter and the rhythm breaks up. This
governs paragraph containers — not labels, not table cells.

**Read:** the paragraph container's width against the string's average character width.

### Line height belongs to the size, not to the file

Headings sit tighter, body text looser, and long lines need more than short ones. One line-height
value applied across every size — the usual outcome of a single spacing token — makes headings airy
and body text cramped at the same time.

**Read:** line-height values differ across the type scale rather than sharing one number.

### A heading that wraps to one orphan word reads as broken

Balance it or shorten it. A two-line heading whose second line holds a single short word looks like
a layout failure even when it is technically correct.

**Look:** every multi-line heading at its real width, with the real string.

### One accordion panel open at a time, unless the task is comparing

Default to one: a stack of expandable rows exists to keep the page scannable, and letting several
open returns the page to the wall of text the accordion was there to prevent. Opening one closes the
last.

The exception is real and narrow — when the user's job is to compare what is inside two panels, or
to work through several in one pass, forcing them closed makes them reopen the same panel repeatedly.
Then several may be open, and the design says so rather than leaving it to the component's default.

**Read:** the accordion's states, and which behaviour the design specifies.

### A stack of avatars collapses into a count

Overlapped avatars stop being readable after a handful; past that, the rest become "+7". Which
number is the threshold is a product decision — but there is one, and it is the same everywhere in
the product rather than per screen.

**Read:** the threshold on this screen against `design.md`.

### A name in a row truncates; it does not wrap

In a list, a timeline or a table row, a long name takes an ellipsis at its maximum width and keeps
the row one line tall. Wrapping one cell re-flows the whole row and breaks the alignment that makes
the list scannable. The full value stays reachable — a tooltip, the detail view.

**Read:** name cells have a max width and truncate; row height is unaffected by content length.

### A timeline states its direction

Newest first or oldest first is a decision the screen makes and holds; a timeline that mixes
directions between sections, or leaves it to the data, cannot be read at all. Where both exist in
one product, the direction follows from what the user is doing — reviewing history, or following a
plan.

**Read:** the direction is stated, and the same one in every frame of that timeline.

### The type scale is a scale

`14 / 15 / 16` on one screen is drift, not hierarchy — nobody can perceive that difference as a
level, so it reads as inconsistency. Steps have to be big enough to be seen as steps.

**Read:** the distinct font sizes used on the screen, against the scale in the design system.
