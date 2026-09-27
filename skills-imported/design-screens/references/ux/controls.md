# Controls — which control, and how it behaves

Reached from `references/ux-rules.md`. Read when the screen has a link, a button, a dropdown, a
picker, or any panel that opens. What the controls are *called* is in `ux/labels.md`.

## Choosing the control

### The number of options picks the control

| Options | Single choice | Multiple choice |
|---|---|---|
| 2–6 | radio buttons | checkboxes |
| more than 6, or labels of more than a few words | a dropdown | a multi-select |
| more than fits a panel, or unknown in advance | a combobox — search in the field itself | a multi-select with search |

A **segmented group** is a presentation choice inside the first row, not a fourth option: it works
at three to five short labels and stops working past that — five long labels is a row of tabs
pretending to be a control, and then it should be tabs. Radio buttons past six become a list nobody
reads to the end.

**Read:** the option count and the longest label against the control chosen.

### Toggle applies now; a checkbox waits for Save

They look interchangeable and they are not. A **toggle** states that the thing is on and takes
effect the moment it moves — no confirmation, no Save. A **checkbox** marks a choice that something
else applies later: a Save button, a submit, a bulk action. Using a toggle inside a form with a Save
button means the user cannot tell which of their changes are already live, which is the same defect
as mixing the two save models in `ux/actions.md`.

**Read:** each toggle against whether its effect is immediate; each checkbox against what applies it.

### Text links get no enlarged tap zone

The minimum-target rule is for buttons and fields. Applied to an inline link it inflates the
wrapper, detaches the underline from the text, and breaks the vertical rhythm — set no `minHeight` on
link wrappers. Inline targets are explicitly exempted by WCAG 2.2's own target-size criterion, so
this is not a trade-off against accessibility; it is what the criterion says.

Note the trap: a checklist that says "tap zones ≥ 44" is itself what causes this defect, because the
agent applies it to everything interactive (`ux/accessibility.md` on which number even applies).

**Read:** link wrappers have no `minHeight`; their height equals the text's.

### Search over a long list is typed into the field itself

A combobox — not a separate search input inside the dropdown. Two inputs for one task make the
focus jump, and the typed text ends up somewhere other than the field being filled.

**Read:** whether the dropdown panel contains an input of its own. One inside a panel whose trigger
field is not itself typable is the defect.

### Which way a panel opens is arithmetic, not preference

Measure the space below the field to the edge of its container: if it is smaller than the panel, the
panel opens upward, because that is what every platform's own controls do. A dropdown drawn downward through the
bottom of a card is a drawing, not a state.

**Read:** container bottom minus field bottom, against the panel's height.

### On touch there is no hover

A control whose meaning is only visible on hover has no meaning on a phone. If a mockup is for
touch, every affordance the user needs must be visible in the resting state; hover styling is an
extra for pointer devices, never the carrier of information.

**Look:** the resting state alone, with no hover layer, and ask what the user can tell from it.

### A copy affordance appears next to the value, on hover

Text the user will need to copy — an identifier, a key, an address — gets a copy control
immediately beside the value at a fixed offset, at the lowest control tier. On a pointer device it
appears on hover, so it does not compete with the content it belongs to. On touch there is no hover,
so there it is permanent, or it lives in the row's action set — a hover-only copy button is a copy
button that does not exist on a phone (`ux/controls.md` above, `ux/responsive.md`).

**Read:** copyable values have the affordance in both the pointer and the touch frames; the offset
matches the one recorded in `design.md`.

### Chips wrap; they never truncate their row

A set of tags or chips flows to the next line with a consistent gap, rather than clipping the row or
scrolling sideways. An individual chip whose label is too long truncates *itself*, with the full
value reachable elsewhere (`ux/content.md`). Any chip pinned by the user sorts first.

**Read:** the chip container wraps, the gap is one token, long labels truncate per chip.

### An interactive element has every state it can be in, drawn

Default, hover, pressed, focus-visible, disabled, and — where the action takes time — loading. A
component shipped with two of the six leaves the other four to be invented during the build, which
is where inconsistency between screens comes from.

**Read:** the component's variants against that list; note which are genuinely not applicable
(hover on touch-only) rather than leaving them missing.

### A button that starts something slow says so in place

On press it becomes a loading state — the same size, in the same place, no longer pressable. A
button that stays idle while a request runs gets pressed again, and the second press is a duplicate
submit the design invited.

**Read:** the loading variant exists, keeps the button's dimensions, and is not interactive.
**Blocking:** a submit with no loading state on a request that can be slow.

### Targets need space between them, not just size of their own

Two minimum-size targets flush against each other still produce mis-taps, because the finger's
contact patch is wider than the visual edge — which is also why WCAG's target-size criterion accepts
a smaller target when it has spacing around it. Leave a gap, or make the boundary between them
unambiguous — the risk is worst where the neighbours do opposite things.

**Read:** the spacing between adjacent controls. *Touch: worst case is a destructive action next to
a frequent one.*

### A gesture never has to compete with the platform's own

Horizontal swipe on a row inside a horizontally-paged view, pull-down inside a scroll container,
edge swipes that fight the system back gesture: the platform wins, and the user experiences the
product's gesture as broken. Every custom gesture also has a visible control that does the same
thing.

**Read:** each custom gesture against the platform gestures in the same direction, and its visible
equivalent. *Mobile.*
