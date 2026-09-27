# States — empty, error, confirmation

Reached from `references/ux-rules.md`. Read when the screen shows anything that can be missing or
can fail — a list, a submit, an upload. Everything about the wait itself — skeletons, spinners,
progress, reserved space — is in `ux/loading.md`.

`references/checks.md` already requires the error, empty and loading states to be *drawn*. These
rules are about what has to be in them.

### There are three kinds of empty, and they are not interchangeable

**Nothing yet** (first run), **nothing found** (a filter or a search excluded everything), **nothing
left** (the user finished the work). Same list, three different texts and three different actions:
the first teaches, the second offers to widen the filter, the third confirms. One empty state drawn
for all three is the most common defect in this class — and the filter case is the one usually
missing.

**Read:** for each list on the screen, which of the three exist as frames.

### An empty state says what belongs here and offers the one action that fills it

Not "No data". What this place is for, and the single next step. An empty list is one of the few
moments the user has nothing else to read, and a blank panel spends that attention on nothing.

**Read:** the empty frame contains a sentence about the purpose and exactly one primary action.

### An error state says what happened, what it means, and what to do next — in place

Three parts, and the retry lives in the same place the failure happened. An error whose only action
is "Go back" strands the user with the work they had already done. Wording is in `ux/copy.md`; this
is about composition.

**Read:** the error frame carries a cause, a consequence and an action; the action is a retry or a
concrete fix, not navigation away.

### A failed action never leaves the screen telling a lie

If a row was removed optimistically and the delete failed, the row comes back — with a message. The
worst outcome is a screen that shows a state the server does not have, because the user will act on
it again.

**Read:** for each optimistic update, what the screen shows when the request fails.
**Blocking:** a screen that displays a state the backend rejected must not ship.

### A toast never carries something the user has to do

It disappears. Anything the user must act on — an error to fix, a decision to make, a conflict to
resolve — lives in the layout. Toasts confirm things that need no response.

**Read:** every toast in the flow is dismissible with no consequence; no toast contains the only
copy of an instruction.

### Success needs its own state only when the result is invisible

A settings screen that saved shows the saved values — that is the confirmation. A form the user is
leaving, a payment, a submission into someone else's queue: there the user cannot see the outcome,
so the screen has to state it.

**Read:** each success state answers "what could the user not otherwise see?" — no answer means the
state is noise.
