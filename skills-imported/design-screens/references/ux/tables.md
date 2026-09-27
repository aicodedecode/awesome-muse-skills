# Tables and lists of records

Reached from `references/ux-rules.md`. Read when the screen shows rows of the same kind of thing —
a table, a list, a grid of cards standing in for records.

Number formats and truncation are in `ux/content.md`; pagination is in `ux/navigation.md`; the empty
and loading variants are in `ux/states.md` and `ux/loading.md`. This file is the table itself.

### A table is read, so it is set like text

The job is scanning, not decoration. That sets the priorities: white space separates better than
rules, fills are used sparingly or not at all, and every visual device has to earn its place against
"does this help someone find a row". Zebra striping is a fallback for when the row height forces it,
not a default.

**Look:** the table with every border and fill removed — is it still readable? If yes, put back only
what you missed.

### Text left, numbers right, and the header follows its column

Digits compare only when they line up, so numeric columns are right-aligned and their headers go
right with them. Text columns are left-aligned, headers left. A header aligned opposite to its own
data is the single most common table defect, and it makes the column read as two columns.

**Read:** each column's alignment and its header's alignment — they match.

### Numeric columns use tabular figures

Proportional digits have different widths, so `1` is narrower than `8` and a column of them will not
line up no matter what alignment is set. The typeface's tabular (lining, monospaced-digit) variant
is what makes a column of numbers scannable — and it matters only in the columns that hold numbers.

**Read:** the font variant on numeric cells; a variable font needs the numeric feature set
explicitly.

### Align on the decimal separator, not on the last character

`1.5` and `12.25` right-aligned by their last character put the decimal points in different places
and the eye has to re-find the fraction on every row. Pad to a fixed number of decimals per column
so the separators form a line, and keep that precision the same down the whole column
(`ux/content.md`).

**Read:** decimal places per numeric column — one value, and the separators line up.

### Don't stretch a table to the width available

A table sized to the viewport puts a gap of nothing between columns that belong together, and on a
wide monitor turns a row into a journey. Give the columns the width their content needs and let the
table end where it ends — the empty space to its right is not a mistake to fix.

**Look:** the table at the widest supported width; the columns' relationship should still be
visible.

### Column widths come from the content, and the ones that vary get the slack

The column holding a name or a description absorbs the remaining space; the ones holding a status, a
date, an amount are as wide as their longest plausible value and no wider. A layout that distributes
width evenly across columns wastes it on the short ones and starves the long one.

**Read:** the fixed columns' widths against their longest realistic content (`ux/content.md` on
realistic worst-case data).

### The header stays while the rows scroll

Past a screen of rows, a header that scrolls away leaves the user counting columns to work out what
they are looking at. It pins. In a horizontally scrolling table, the identifying column pins too —
otherwise a scrolled row cannot be told from its neighbours.

**Read:** the scrolled frame shows the header, and the identity column if the table scrolls sideways.

### Horizontal scroll is a decision, with its edge shown

A wide table may scroll sideways rather than shrink its columns to illegibility — but the scroll has
to be discoverable: a visible edge, a shadow, a partially cut column. A table that simply ends at the
container's edge looks complete and hides half its data.

**Read:** the frame shows the cut edge or the affordance; the scroll container is not the page.

### The whole row opens the record; actions live in their own column

Two conventions fighting inside one row — a clickable row *and* clickable cells — produce accidental
navigation. Pick one: either the row opens the detail and the actions sit in a column of their own at
the end, or nothing in the row navigates and there is an explicit link. Actions that appear on hover
still need a permanent home on touch (`ux/controls.md`).

**Read:** what a click on a cell does, per column; the action column is not also part of the row's
click target.

### Selection says how many, and what the actions will apply to

A checkbox column with a select-all in the header, a visible count of what is selected, and actions
that name the number they will affect (`ux/actions.md`). Select-all under an active filter selects
the filtered set — and has to say so, because the user cannot see the difference.

**Read:** the selected state shows a count; bulk actions name it; select-all states its scope.

### Editing in place is one of three modes, chosen deliberately

**Inline** — a cell becomes editable where it is: fastest for one value, and it needs a visible
save/discard because there is no form around it. **Row** — the whole row switches to fields: right
when the values validate against each other. **Detail** — the record opens elsewhere: right when
editing needs more room or context than a row has. Mixing modes in one table teaches nothing that
transfers between columns.

**Read:** the edit affordance per column, and which of the three modes each one enters.

### An expanded row does not become a second table

Expanding a row to show more of the same record is cheaper than a navigation, and it earns its place
when the extra fields are few and read-only. Once the expansion holds its own columns, actions and
scroll, the record needed a page.

**Read:** the expanded content's field count and whether it holds interactive controls of its own.

### Where "seen" matters, the row shows it

Lists of things that arrive — messages, tasks, notifications, imports — need read and unread to be
distinguishable by more than one weight of the same colour, and the state has to survive the sort. If
the product has no concept of seen, the list should not imply one with subtle styling that means
nothing.

**Read:** the unread state's second channel (`ux/accessibility.md` on colour alone).

### A simple table on a narrow screen becomes a list

Below the width where columns stop being legible, a table of few columns turns into a stack of cards
— label and value per line, one record per card. A complex table does not: it keeps its shape and
scrolls, because a fifteen-column record flattened into a card is unreadable in a different way.
Which of the two this table is, is a decision made once and recorded.

**Read:** the narrow frame exists and states which strategy it uses (`ux/responsive.md`).
