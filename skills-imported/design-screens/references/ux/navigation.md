# Navigation — where the user is, how they leave, what container to use

Reached from `references/ux-rules.md`. Read when the screen sits inside a flow, opens over
something, or is one of several places the user moves between.

### Modal, sheet or page — decided by the task, not by the size of the content

A **modal** interrupts and demands a decision before anything else continues; use it when the
answer really is required now. A **sheet** is for a short task that keeps the context visible
behind it. A **page** is for work with its own address that the user may leave and return to, or
share. The frequent mistake is a modal holding a full form: it cannot be linked to, cannot be
resumed, and traps the user between finishing and losing the input.

**Read:** for each overlay, which of the three it is, and why the task requires that container.

### Every overlay has exactly one obvious way out, and it never destroys work silently

Close, cancel, escape, the backdrop — however many ways there are, they agree on what happens to
the input. A backdrop click that discards a half-filled form is data loss with no confirmation;
either it does not discard, or it asks (the ladder in `ux/actions.md`).

**Read:** what each exit does with unsaved input; all exits agree.
**Blocking:** an exit that silently discards user input.

### Below a certain size, a modal should have been a side panel

A modal that holds two fields and a button is a heavy container for a light task: it blackens the
page, blocks everything, and demands a decision that isn't one. Products that have both a modal and
a side panel should name the threshold — below it, the panel; above it, the modal — rather than
deciding per screen.

**Read:** the modal's content against the threshold recorded in `design.md`.

### A modal never lets the page scroll behind it

The backdrop covers the page and the page underneath stays still. Scrolling the content behind a
modal is how a user loses their place while being asked a question, and on touch it is how they
scroll the wrong surface entirely.

**Read:** the modal frame specifies that the page behind does not scroll.

### A modal taller than the viewport pins its header and footer

Content scrolls; the title and the actions do not. Otherwise the user scrolls to read and then has
to scroll back to answer. And a fluid-width modal has a maximum: past it, it stops growing and
centres, because a dialog the width of a large monitor is unreadable.

**Read:** the tall variant pins header and footer; the fluid variant has a max width.

### A side panel's exits depend on whether it blocks the page

A panel that dims and blocks the page closes on outside click, on Escape, on its close button and
on Cancel — the outside is inert, so clicking it can only mean "leave". A panel that deliberately
does **not** block, so the user can keep working behind it, must not close on outside click: every
click out there is real work, and closing the panel on it destroys the thing the panel was for.

**Read:** for each panel, whether it blocks; the exit set matches.

### An explanatory panel is deliberately non-blocking

A panel whose content is guidance about the settings behind it exists so the user can read and apply
at the same time. Making it modal defeats its purpose: they read it, dismiss it, and then try to
remember what it said.

**Read:** panels containing instructions are non-blocking.

### A multi-level panel says how to get back one level

A back affordance before the title, not only a close button — otherwise the only way out of the
third level is to abandon the whole panel and start again.

**Read:** panels with nested levels carry a back control in the header.

### Back returns, it does not re-enter

Back from a detail lands on the list at the position the user left, with their filter and scroll
intact. Back after a submit does not re-submit or show a stale form. A back that rebuilds the
previous screen from scratch loses everything the user set up to get there.

**Read:** for each back path, what state is preserved — position, filter, tab, input.
*Mobile: also the system back gesture, which cannot be removed and will be used.*

### The user can always tell where they are

The active item in the navigation is marked in a way that survives the theme and does not rely on
colour alone (`ux/accessibility.md`). One screen, one active marker: two highlighted items means
neither is trusted.

**Read:** the active state exists in the navigation component and is set on exactly one item per
frame.

### A flow says how long it is before it starts

Multi-step means a step count or a progress bar from step one — "Step 2 of 4", not a wizard whose
length is discovered by walking it. And a step the user can leave says whether returning resumes or
restarts.

**Read:** the step indicator is present on the first step, not only on later ones.

### Onboarding is skippable, and skipping is not punished

Anything explanatory has a way past it, and taking that way does not hide the feature it was
explaining. A tour the user cannot dismiss is a tour they will click through blindly, which teaches
them nothing and costs them trust.

**Read:** the onboarding frames carry a skip affordance; the product is usable after skipping.

### Deep entry is a real entry point

Any screen reachable by link, notification or search can be the first screen of the session — so it
cannot depend on state that only the preceding screen would have set. Design what it shows when the
user arrives cold.

**Read:** for each screen, what it shows when opened directly, with no history behind it.

### Breadcrumbs earn their place from the third level down

At two levels they duplicate the back button. From three levels deep they start to carry real
orientation value. When there is no room for the full chain, collapse from the second item onward into a single
"more" — the root and the current page are the two parts that carry the orientation, so they are the
two that survive.

**Read:** the depth of the hierarchy before adding them; the collapsed form keeps first and last.

### The page size comes from the viewport, not from a round number

How many rows per page is an arithmetic question: roughly three or four screens of scrolling is
enough to feel substantial without turning the page into an endless one. Twenty because twenty is a
nice number produces pages that are half empty on a large monitor and interminable on a laptop.

**Read:** the page size against the row height and the viewport it is designed for.

### Pagination shows as many pages as fit, and hides what it cannot do

As many page links as the container holds without scrolling sideways; the rest collapse under an
ellipsis. On the first page there is no Back and on the last there is no Forward — hidden, not
disabled: a control that cannot ever work here is not a control, and a disabled one just makes the
user wonder what they did wrong.

**Read:** the first-page and last-page frames; the arrow that cannot apply is absent.
