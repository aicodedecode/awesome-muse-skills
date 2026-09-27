# Motion — what a mockup has to say about movement

Reached from `references/ux-rules.md`. Read when the screen has anything that appears, disappears,
expands, or moves — which is most screens, even when the mockup is still.

A static mockup still specifies motion by omission: whoever builds it will invent the transition if
the design does not state one. These rules are about what the design owes the build.

### Motion carries a relationship or it is decoration

Every animation answers one question: where did this come from, or where did it go. A panel slides
from the edge it belongs to; a row that was deleted leaves, it does not blink out; an item that
expanded grew from the row the user pressed. Movement that answers nothing is noise, and noise
costs the user the same attention as information.

**Look:** name the relationship each transition expresses. No name — remove it.

### Duration is short, and inversely related to size

Small things move fast, large things a little slower — a toggle in tens of milliseconds, a sheet
covering the screen in a couple of hundred. Anything that makes the user wait to see a result they
have already asked for is too slow, and half a second is where it starts being noticeable as a
delay rather than as a transition.

**Read:** the durations recorded for the screen, against the size of what moves.

### Easing has a direction: things enter decelerating and leave accelerating

Entering, the element slows as it arrives; leaving, it speeds up as it goes. Linear motion reads as
mechanical because nothing physical moves that way. A single easing curve applied to both
directions is the usual shortcut and it makes exits feel sluggish.

**Read:** enter and exit curves are specified separately.

### Anything that moves on its own has a control and a stop

Carousels, auto-advancing banners, looping animations: the user can pause them, and they stop on
focus or hover. Content that changes while being read takes the reading away, and for some users it
makes the screen unusable.

**Read:** every auto-advancing element has a pause and manual controls.
**Blocking:** an auto-rotating element with no way to stop it.

### Reduced motion is a state the design specifies, not a decision left to the build

For every transition, what happens when the user has asked for less motion: usually a cross-fade or
an instant change, never nothing at all — the element still has to appear. A design that specifies
motion without specifying the reduced variant delegates an accessibility requirement to whoever
writes the CSS.

**Read:** each specified transition has a reduced-motion equivalent recorded next to it.

### A transition the user can interrupt must be interruptible

If a panel takes 300 ms to open and the user presses close at 100 ms, it closes from where it is —
it does not finish opening first. Transitions that queue instead of interrupting make a product feel
stuck exactly when the user is in a hurry.

**Read:** for each transition, what happens when the opposite action arrives mid-flight.

### Hover is an enhancement; tap is the contract

Motion that only exists on hover does not exist on a touch device. If a hover animation carries
information — that something is interactive, that more is available — the touch design needs
another way to say it (`ux/controls.md`).

**Look:** the touch frames with no hover state applied.
