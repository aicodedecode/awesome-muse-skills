# Forms — fields, validation, data entry, flow steps

Reached from `references/ux-rules.md`. Read when the screen has a field, a form, validation, or one
step of a multi-step flow. Message wording itself is in `ux/copy.md`.

## Validation

### The submit button stays enabled, including on an empty form

A disabled button states that something is wrong and refuses to say what; the user is left guessing
which field is the problem. Let them press it and answer with the reason.

The boundary: a submit that is expensive or irreversible when it goes through — a payment, a
destructive import, a rate-limited request — may gate the press, because there the cost of a wrong
attempt is not a message. What is never acceptable is gating it *silently*: the screen still has to
say what is missing, gate or no gate.

**Read:** the submit button's state in the empty-form frame; if it is disabled, what on the screen
says why.

### Then the answer has to be words

On press, every unfilled field takes an error outline *and its own message* — never a bare red
border. WCAG 3.3.1 requires the error to be identified in text. Group fields that form one logical
value (a date entered as day / month / year) take one message between them, not three.

**Read:** each field in the error frame has a text message; grouped fields have exactly one.

### Never build a disabled state out of opacity

Keep the disabled variant in the component for the states that genuinely have no cause to explain —
loading, no permission. A translucent black button dims its background and its label at the same
time, so the label disappears and the state still doesn't read as inactive. Use dedicated tokens.

**Read:** the disabled variant's fill and label are bound to disabled tokens; `opacity` is 1.

### Validate on leaving the field, not on every keystroke

A message that appears while the user is still typing tells them they are wrong before they have
finished being right — the email is invalid at `a@`, and saying so is noise. Validate on blur, or on
submit. The exception runs the other way: confirmation that a constraint is *met* (a password rule,
an available username) is useful live, because it tells the user they can stop.

**Read:** which event each field's error state is tied to.

### The message sits with the field, not at the top of the form

A summary at the top and nothing at the field means scrolling back and forth to find which one
failed. Where a summary is genuinely useful — long forms, screen-reader flow — it is *in addition*
to the per-field message and each entry links to its field.

**Read:** every failing field in the error frame carries its own message.

## Data entry

### The field summons the right keyboard and accepts the right shape

An email field brings up the email keyboard, a phone field the numeric one, a code field the numeric
one with no autocorrect. On a mockup this is a spec line, not a visual: state the input type per
field, because nobody can infer it from a drawing and the default is always the wrong one.

**Read:** every field records its input type. *Mobile: the keyboard it produces is part of the spec.*

### Never ask twice for something the product already has

WCAG 2.2 **3.3.7 Redundant Entry** (A) requires this, and it is good practice besides. A value the
user entered on a previous step, or that the account already holds, is prefilled and editable — not
asked again. Re-entry is where flows lose people, and the second copy is where the two values
diverge.

**Read:** for each field, whether the value exists earlier in the flow or on the account.

### Autofill has to be able to work

Fields the browser or OS can fill — name, email, address, card, one-time code — must be
recognisable ones, in the conventional order, not split into creative sub-fields. A three-part
"custom" name control breaks autofill and buys nothing.

**Read:** the fields map to standard autofill categories; the order is the conventional one.

### Mark what is required, and mark it the same way every time

Whichever convention the product uses — an asterisk on required, "optional" on the rest — it holds
across the whole product. Mixed conventions mean the user has to test the form to learn its rules.
Marking nothing works only when *every* field is required, and then the form says so once.

**Read:** the required convention on the screen, against the one recorded in `design.md`.

### A password field can be revealed

A masked field with no reveal makes the user type blind and then retype the whole thing on a typo.
The reveal is a toggle on the field, and it defaults to hidden.

**Read:** the password field has a reveal control.

### Prefer typing to picking for values with a wide range

A date of birth behind a modal calendar that opens on the current month costs 20+ years of paging,
and the read-only field forbids the faster route. Three fields — day, a month select, year — remove
the modal, and with it every defect the modal had.

**Look:** count the interactions from the resting state to a value at the far end of the range.

### A label that vanishes on input takes the context with it

Turn the floating label on as soon as the field holds a value: reviewing a filled form otherwise
shows "Vietnam", "Sarah", "14" with no indication of which field is which.

**Read:** in the filled-form frame every field still shows its label.

### A date picker opens where the user was, and refuses impossible ranges

These three make a calendar decent; they do not make it the right control for a wide range — for
that, see "Prefer typing to picking" above, which still applies to a date of birth. It opens on the current month by
default — but if a date is already chosen, it opens on *that* month, not back at today. Dates
outside the permitted range are disabled and inert: a future-only field does not let the past be
clicked, and neither half of a two-month view is an exception. And a range cannot be inverted: if
the user picks the later date first, the field reorders the pair rather than rejecting the input.

**Read:** the picker frames show the opened month, the disabled range, and the reorder behaviour.

### An upload field offers both routes, and reports per file

At rest it accepts a drop and opens a picker — both, because users reach for different ones. With a
single-file limit, the chosen file replaces the control, with its own remove and replace actions.
With several, the files list below the field, each with its own state, and the field itself stays in
its resting form rather than looking "filled". Past a few files the list shows the next one clipped,
so the count is visibly longer than what fits.

And when the user drops more than the limit: an error that names the limit, while the files that
*do* fit still upload. Rejecting the whole batch because one file was extra is a design decision,
and almost never the right one.

**Read:** the upload states — rest, dropping, uploading, one failed, all failed, over the limit.

## Flow steps

### A container that holds one step of a flow gets a minimum height, not a fixed one

The success step of a flow had a third of the content of the form before it, and the card collapsed
— the layout jumped on the last step. A minimum equal to the form's height holds short steps steady
while error states are still free to grow.

**Read:** the step container has `minHeight` set and is not `FIXED` on that axis.
