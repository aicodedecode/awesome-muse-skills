# Actions and their consequences — save, cancel, delete, bulk

Reached from `references/ux-rules.md`. Read when the screen changes something the user owns:
settings, a form that persists, anything deletable, anything that acts on a selection.

## Saving

### An explicit Save button has to earn its place

Default to applying each control as it is touched. An explicit **Save** is right in five cases,
and naming which one applies is part of designing the screen:

1. **The change needs confirming.** Changing a password, an email, a payout account.
2. **An accidental change is expensive.** Requiring a press is what stops a stray click from
   reconfiguring something that matters.
3. **The user must be able to reconsider** — which is what makes a **Cancel** meaningful.
4. **Several changes belong together.** Multi-select, interdependent options: one press applies the
   set, not each element separately.
5. **Process integrity.** All changes on one page, without interruption or conflict between
   settings that depend on each other.

Where none of the five holds, per-control autosave is less work and less stress for the user, who
otherwise has to remember to press Save at all.

**Read:** the screen uses one model, not both. Autosaving toggles next to a Save button is the
defect — the user cannot tell which of their changes are already live.

### A Cancel that cannot revert is worse than no Cancel

If the screen offers Cancel, the previous state has to be recoverable at the moment it is pressed.
A Cancel that leaves half the changes applied teaches the user that the button lies, and they stop
trusting it everywhere else in the product.

**Read:** for each Cancel in the flow, name what it restores. No answer means the button shouldn't
be there.

## Destroying

### The confirmation ladder — pick the rung from the data, not from the feeling

Three questions about the action, answered before choosing anything:

1. **Is user-generated data lost?** Filled forms, results, uploads, anything the user made.
2. **How much time and effort would recreating it cost?**
3. **Is recreating it *exactly* possible at all?**

The answers pick the rung:

| Rung | When |
|---|---|
| **Undo instead of confirmation** | the action can be reversed after the fact — always preferred to a dialog: it costs the user nothing when they meant it |
| **No confirmation** | the data is trivial and easily recreatable |
| **Confirmation prompt** | recreating costs a moderate amount of time or effort |
| **Alert** | the data is significant and losing it would genuinely inconvenience the user |
| **Type the text to confirm** | the data is critical, hard, or impossible to recreate |

A dialog on a reversible action is friction with no payoff; a bare button on an irreversible one is
a trap. Both are the same mistake — the rung not matching the answers.

**Read:** every destructive action in the flow names its rung, and the rung follows from the three
answers rather than from how dangerous it felt.

### Type-to-confirm text does more than confirm

It exists because a click can be automatic — experienced users press through dialogs without
reading. Typing a phrase cannot be done absent-mindedly: it forces the decision back into
awareness, and it also resists someone who has physical access to an unlocked device.

So the phrase is chosen to **state the precondition**, not to be a hurdle. "I know where my backup
is" makes the user check that they do before the data is gone; "DELETE" only proves they can type.

**Read:** the phrase names the thing the user must have secured before proceeding.

## Acting on many things

### A bulk action states its count and its scope

"Delete 24 items", not "Delete". And when a filter or a select-all is active, the label says what
is really included — a select-all over a filtered list means something different from a select-all
over everything, and the user cannot see which one they got.

**Read:** the button label carries the number; with a filter active, the confirmation names the
scope.
