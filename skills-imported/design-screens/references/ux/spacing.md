# Spacing — the scale, the grid, and when to leave it

Reached from `references/ux-rules.md`. Read whenever a number is about to be typed into a padding,
a gap, a margin or a position.

### Every distance comes from the named scale, not from a number

XS / S / M / L / XL — or whatever the product calls its steps. The designer picks a step, not a
value, because a step survives a change to the scale and a value does not. A screen assembled from
raw numbers cannot be retuned later without touching every node on it.

**Read:** each padding and gap against the product's scale. Where the product has spacing
variables, the value is bound to one (`figma-plugin-api-rules/references/variables-and-tokens.md`
for the mechanics); where it has none, the number still has to be a step of the scale in
`design.md`.

### The product's own step wins; 8 is what to use when there is none

**Read the grid out of the design system before assuming one.** A product on a 4-step or a 10-step
scale is not making a mistake, and reporting its spacing as findings against someone else's grid is
the exact failure this set warns about in "Growing this set". The step belongs to the product.

Where there is nothing to inherit — a new product, a file with no scale — start at 8, for reasons
that are worth knowing either way. An 8-based step divides cleanly into the great majority of real
screen widths, which makes fitting a layout to a device arithmetic rather than negotiation. It
survives fractional scaling: at 1.5× an odd number lands on a half pixel — 5 becomes 7.5 — and the
renderer rounds it somewhere nobody chose. And a step of 8 is far enough apart to be told apart by
eye, so whoever builds the screen measures less and guesses right more often. Smaller steps stop
constraining anything, because neighbouring values become indistinguishable; much larger ones make
the layout coarse.

**Read:** the step recorded in `design.md` or read from the design system, then every spacing value
on the screen against *that* step.

### Half a step is the exception, and it is written down

Half of whatever the step is exists for the cases that genuinely need it — an icon against its
label, a badge on an avatar, optical alignment of two shapes with different weights. It is not the
general-purpose escape hatch, and a screen where half-steps outnumber whole ones has no scale at
all.

**Read:** count the half-steps; each one should have a reason you can name.

### Align to the grid on both axes, including the text

Vertical rhythm and horizontal alignment come from the same grid, and left-aligned text starts on
it. An element placed by eye between two grid positions is the thing that makes a careful screen
look slightly wrong in a way nobody can point at.

**Look:** the frame with the layout grid visible.
**Read:** integer coordinates — a node at `x=132.5` splits its edges across two pixels
(`references/checks.md`, Accuracy).

### Density is a decision, not a leftover

The same scale can be applied tightly or loosely, and which one this product uses is a product
decision — a data-dense admin table and a marketing page cannot share a density and both be right.
Where the product has more than one, the screen says which it is using rather than mixing them.

**Read:** the step choices on this screen against the density recorded in `design.md`.
