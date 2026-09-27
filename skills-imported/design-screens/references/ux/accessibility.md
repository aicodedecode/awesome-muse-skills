# Accessibility — while drawing, not afterwards

Reached from `references/ux-rules.md`, with no exemption: every screen has text, targets and
states. These are the design-time rules — what to do while the screen is being built.

**The audit-time twin** is `audit-design-system/references/accessibility-checklist.md`: the
same ground as yes/no questions for auditing a file someone else drew. When a rule here changes,
change the question there too — two copies that drift are worse than one.

### Targets meet the platform's minimum, and there is more than one number

There is no single 44. Apple's guidance is 44pt, Material's is 48dp, and WCAG 2.2 sets two different
bars: **2.5.8 Target Size (Minimum)** at AA requires 24 × 24 CSS px — with exceptions for spacing,
inline targets and platform-controlled controls — while **2.5.5** at AAA asks for 44 × 44. A design
checked against the wrong one of those produces either false findings or false confidence.

So: record which target the product holds itself to in `design.md`, and check against that. **Inline
text links are excluded** from all of them — see `ux/controls.md`; enlarging them is a defect this
checklist itself causes when applied blindly.

**Read:** the product's stated minimum, then every control's hit area against it; links exempt.

### Contrast covers non-text too

Text contrast, and also borders, icons, focus rings and selected states. A selected state carried
only by a 1px border of low contrast is not a state anyone can see.

**Read:** foreground and background token values through the same contrast formula. **Look:** the
selected and focused states next to their neutral neighbours.

### Focus-visible exists and isn't styled away

Every interactive element has a focus state in the component, and it survives whatever custom
styling the product applies. A design that ships without one hands keyboard users a screen with no
cursor.

**Read:** the component has a focus variant; it is not identical to the default.

### Keyboard order follows visual order

The order fields and controls appear in the layout is the order they will be reached. A field
placed out of flow (absolute positioning, a column reordered visually) creates a tab sequence that
jumps around the screen.

**Look:** walk the layout top to bottom and say the order out loud; compare with the DOM-ish order
the layout implies.

### Colour is never the only carrier of meaning

Status, errors, selection, required-ness: each needs a second channel — text, an icon, a shape, a
position. A red border with no message fails this and `ux/forms.md` at once.

**Look:** desaturate the frame mentally and ask what is still distinguishable.

### Disabled content stays legible

Disabled is not invisible. The user has to be able to read what they cannot use, or they can't tell
what to do to unlock it. See `ux/forms.md` on never building this from opacity.

**Read:** the disabled label's contrast is still above the text threshold.

### Icon-only controls carry a name

An icon button with no visible label needs its accessible name documented — in the component's
description or an annotation, so the developer has something to implement.

**Read:** the icon-only component's `description` names the action.

### Motion is reducible

Any animation the screen depends on has a still equivalent, and the mockup specifies it rather than
leaving it to the build. The full rule, with what the reduced variant should be, is in
`ux/motion.md` — it is an accessibility requirement first and a motion decision second.

**Look:** the frame as a still — does it still communicate the same thing?

### Headings are a hierarchy, not a set of sizes

One first-level heading per screen, no skipped levels going down. Sizes are how the hierarchy
*looks*; the levels are what it *is*, and a screen where the level is inferred from the font size
gives whoever builds it nothing to implement.

**Read:** the heading levels present on the screen, in order, with no gaps.

### The focus ring is visible against every background it will land on

A ring in the brand colour disappears on a brand-coloured surface. It needs its own contrast
against each background where a focusable element sits, and enough thickness or offset to be seen —
a 1px ring of a mid-tone is technically present and practically invisible.

**Read:** the focus ring's contrast against each surface it appears on.

### Nothing covers the element that just took focus

WCAG 2.2 **2.4.11 Focus Not Obscured (Minimum)** (AA); 2.4.12 raises it to *not obscured at all* at
AAA. Sticky headers, floating action buttons, cookie bars: when focus moves through the page, the
focused element has to end up somewhere visible, not behind a fixed layer. This is the failure that
makes a keyboard user's cursor vanish for three tab stops.

**Look:** walk the focus order past every fixed element and say where the ring is at each stop.

### Anything done by dragging has a non-drag route

WCAG 2.2 **2.5.7 Dragging Movements** (AA). Reordering, sliders, drawing, swipe-to-act: a
single-pointer alternative exists — buttons to move an item up and down, a number to type instead of
a handle to drag. Dragging demands precision that not every user has.

**Read:** every drag interaction on the screen has a named alternative.
**Blocking:** a drag with no alternative, when the action cannot be completed any other way.

### Help sits in the same place on every screen

WCAG 2.2 **3.2.6 Consistent Help** (A). Support, contact, documentation: whatever the product
offers, it appears in the same relative position across screens rather than migrating between the
header, a footer and a floating bubble. Users learn one location, once.

**Read:** the help affordance's position, compared with the other screens in the flow.

### The layout survives larger text and looser spacing

Users enlarge text and increase letter, word and line spacing. A layout built on fixed heights and
single-line assumptions breaks: labels clip, buttons overlap, content disappears. Check the
tightest containers with text a step or two larger than designed.

**Look:** the frame with the type scale bumped up — what clips, what overlaps.
