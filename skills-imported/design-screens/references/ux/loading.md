# Loading — skeletons, spinners, progress, reserved space

Reached from `references/ux-rules.md`. Read when anything on the screen arrives asynchronously.
What the screen says when the arrival fails, or when there is nothing to arrive, is in
`ux/states.md`.

### Loading shows the shape of what is coming

Skeletons that match the real layout — the same rows, the same column widths. A spinner centred in
an empty area throws away everything the layout already knows and makes the jump bigger when the
content lands.

**Look:** put the loading frame and the loaded frame side by side; the blocks should sit in the same
places.

### A skeleton only where the content can really be imitated

Skeletons pay off when the shape of what is coming is known closely enough to mimic. Where it is not
— content of unpredictable shape, a screen that may end up empty, a wait whose result is a redirect
— a plain loader is simpler, cheaper, and does not promise a layout that then fails to arrive.

**Read:** for each skeleton, whether the real content's shape is known in advance.

### The skeleton fills the first screen, not the whole page

Thirty cards below the fold do not need thirty skeleton cards; the five that fit do. A skeleton is
a promise about what is arriving, not a mirror of the finished page — and more content appearing
after it than it showed is normal, not a defect.

**Read:** the skeleton's block count against what fits in the viewport.

### Skeleton blocks are animated

A static grey layout is indistinguishable from a hung page. The movement is what says the wait is
progressing, and it also makes the wait feel shorter than it is (`ux/principles.md` — the labour
illusion runs in both directions).

**Read:** the skeleton frames specify the animation, not just the shapes.

### A text skeleton takes its height from the type and its length from the content

The rectangle standing in for a line of text is as tall as that line will be and as wide as the
string will be — not a generic bar. Blocks standing in for fixed elements are the exact size of the
element that replaces them.

**Read:** each skeleton block's dimensions against the node it stands in for.

### A first-screen skeleton does not scroll

Where the skeleton stands in for the whole first screen, scrolling it moves the user away from
content that has not arrived, and the position they scrolled to means nothing once it does — so
scroll arrives with the content.

This does **not** extend to a skeleton in one region of an otherwise loaded page, or to rows being
appended below a list the user is already reading: freezing the page there takes away work they can
actually do. The distinction is whether there is anything real to scroll to yet.

**Read:** which of the two this skeleton is, and whether the frame specifies scroll accordingly.

### Reserve the space that arriving content will occupy

Anything asynchronous — an image without fixed dimensions, a count badge, a banner — must have its
space held from the first paint. Content that pushes the layout after the user has already aimed at
something makes them press the wrong thing.

**Read:** every async element has a fixed size or a min-size in the loading frame.
**Blocking:** a layout that shifts under the pointer is a defect, not a rough edge.

### Below a second, no indicator; above ten, a way to leave

Response-time thresholds are old and stable: about 0.1 s reads as instant, about 1 s is where the
user notices a wait, and around 10 s is where attention leaves. So: under a second, showing a
spinner only makes it flash; over a second, show one; over ten, show progress *and* a way to cancel
or leave and come back.

**Read:** for each async action, the expected duration and the indicator chosen for it.

### Progress means a number, not just activity

An indeterminate spinner is honest only when the total is genuinely unknown. Uploads, imports and
multi-step operations know their total — show the step or the count. "Working…" for two minutes is
indistinguishable from a hang.

**Read:** determinate operations show a step or percentage; only unknowable ones spin.
