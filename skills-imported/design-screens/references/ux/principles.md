# Principles — the why behind a composition decision

Reached from `references/ux-rules.md`. **This file is a different kind from the others.** The rest
of `ux/` holds rules with a verification line: they pass or they fail. These are decision aids for
step 3, when the agent states its intent and builds — they change *what you choose*, and none of
them can be checked off a screen afterwards. Do not report them as findings in the Accuracy pass.

Each carries "use it when" instead of a verification line. The names are standard industry
vocabulary; the point here is the one decision each one changes.

### Fewer options, faster decision — Hick's law

Decision time grows with the number of options. Where the count cannot be reduced, group them and
order them so the eye can skip — an unskimmable list of eight is worse than two groups of four.

**Use it when:** a screen offers more than about five choices at one level.

### Group into small sets — Miller, chunking

People hold few things at once. A fourteen-field form is not a fourteen-field problem; it is three
groups of four or five with a heading each. The grouping is the design work, not the fields.

**Use it when:** any list, form or menu passes roughly seven items.

### Frequent targets are big and close; dangerous ones are far — Fitts's law

Time to hit a target falls with its size and rises with distance. So the primary action is the
largest thing in its area, and the irreversible one is deliberately not adjacent to the frequent
one.

**Use it when:** placing a primary action, or placing anything destructive.

### One accent per screen — Von Restorff

The thing that differs is the thing that is remembered — which means two accents cancel each other
and three are wallpaper. If everything is emphasised, the screen has no emphasis.

**Use it when:** more than one element is claiming visual priority.

### The ends of a list are what people remember — serial position

First and last positions are recalled; the middle is not. Put what matters at the ends of a
navigation, a menu, a set of steps — and know that anything buried in the middle needs its own
affordance.

**Use it when:** ordering navigation items, menu entries, or a list you don't control the length of.

### Space groups more strongly than lines — proximity and similarity

Elements close together read as related, and elements that look alike read as the same kind. If a
divider is needed to explain the grouping, the spacing is already wrong; fix the spacing and the
divider becomes optional.

**Use it when:** reaching for a border, a card, or a divider to separate things.

### A layout that can be read two ways will be read the wrong one — Prägnanz

People take the simplest available reading. An arrangement that is technically correct but
ambiguous — a caption that could belong to the block above or below, a button that could apply to
either column — resolves itself in the user's head, not in yours.

**Use it when:** any element's ownership is not obvious from position alone.

### Show the common path, keep the rest one action away — progressive disclosure

The screen shows what most people need most of the time; advanced options exist behind a single
deliberate action. This is the alternative to both extremes: everything at once, or a feature nobody
can find.

**Use it when:** a screen holds options used by a minority of users.

### Show, don't ask to remember — recognition over recall

Recognising is far cheaper than recalling. Offer the choices instead of an empty field, keep the
user's previous input visible instead of asking them to re-enter it, and never require them to
remember a value from a previous screen.

**Use it when:** designing any input, filter or multi-step flow.

### The end of a flow is remembered out of proportion — peak-end rule

People judge an experience by its peak and its ending. The success step is therefore not a
throwaway frame: it is the part that decides how the whole flow is remembered.

**Use it when:** designing the last screen of anything.

### Visible progress pulls people to finish — Zeigarnik, goal gradient

An unfinished thing that is visibly unfinished creates the pull to complete it, and the pull
strengthens near the end. Show the remainder rather than the amount done, and never reset it — a
progress bar that jumps backwards costs more than it ever bought.

**Use it when:** a task has more than two steps.

### A wait that shows its work feels shorter — the labour illusion

People perceive a wait as shorter, and the result as worth more, when they can see that work is
being done. That is why a skeleton animates and a multi-step import names the step it is on, rather
than both sitting still. The effect runs the other way too: something that returns instantly can
read as not having tried — but manufacturing delay to exploit that is theatre, and users who notice
stop trusting the rest of the screen.

**Use it when:** designing any wait over a second (`ux/loading.md`).

### A polished screen hides its usability faults — aesthetic-usability effect

Users forgive, and fail to report, problems in an interface they find attractive. So "they liked
it" is not evidence that it works, and a beautiful first showing is the moment to be more
suspicious, not less.

**Use it when:** interpreting approval of a visual direction.

### The default is the decision most people will keep — default bias

Whatever is preselected is what the majority will live with. That makes the default the
highest-impact choice on the screen, and picking it by convenience — first alphabetically, first in
the enum — is picking it for the user by accident.

**Use it when:** any control has a preselected value.

### Losses weigh more than equivalent gains — loss aversion

The wording and the friction around removing, cancelling and downgrading matter more than around
creating. This is why the confirmation ladder in `ux/actions.md` is steeper on the destroying side
than intuition suggests.

**Use it when:** designing anything that takes something away.

### Load is the total, not the per-element cost — cognitive load

Every option, every word, every unlabelled icon adds to the same budget. Which makes removing an
element a design decision of the same weight as adding one, and "we can just add a toggle" the most
expensive sentence in the process.

**Use it when:** adding anything to a screen that already works.

### You know what the icon means; the user does not — curse of knowledge

Familiarity with the product makes its shorthand feel self-evident. An icon without a label is
legible to whoever chose it and ambiguous to everyone else — which is why icon-only controls need
their name documented (`ux/accessibility.md`).

**Use it when:** deciding whether a label can be dropped.
