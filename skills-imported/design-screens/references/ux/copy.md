# Copy — sentences, punctuation, tone

Reached from `references/ux-rules.md`. Read when the screen carries any prose: hints, messages,
descriptions, empty states, error text.

The shortest strings — buttons, links, menu items — are in `ux/labels.md`.

### One sentence takes no full stop; two or more take one after each

"Enter a valid email address" — no stop. "Invalid code. Please try again." — a stop after each. A
single label ending in a full stop reads as a fragment of prose rather than a piece of interface.

**Read:** find TEXT nodes whose content is exactly one sentence and ends in a stop.

### A list heading takes no terminal punctuation; a multi-sentence bullet does

The heading above a list is a label, so it ends bare. A bullet that is one fragment or one sentence
ends bare too; a bullet that runs to two sentences takes a stop after each, like any prose. Mixed
punctuation down one list is visible even to a reader who could not say what is wrong.

**Read:** the terminal characters down each list, and the heading above it.

### Say the point first, qualify it second

Main statement, then the detail that narrows it. Users read the first clause and act; a sentence
that opens with conditions makes them read to the end to find out whether it concerns them at all.

**Read:** each sentence's first clause — is it the point or the preamble?

### Active voice, except for the state of a thing

Name the actor and give them a verb: "A manager changed the order", not "changes were made to the
order". The exception is a status, where the thing itself is the subject and there is no actor worth
naming — "Version updated", "Payment received" — and short status strings are where passive
constructions are correct rather than lazy.

**Read:** each sentence for an actor; a missing one that isn't a status is a rewrite.

### Cut the modal verbs

"You must", "you should", "it is necessary to", "you need to" — delete them or replace with the
imperative. The interface is already telling the user what to do; the modal verb adds obligation
without adding information, and it makes short strings sound like a policy document.

**Read:** the screen's text for must / should / need to / have to.

### Turn nominalizations back into verbs

"Performs the consultation of clients" is "consults clients". A noun made out of a verb drags
helper words with it and buries the action two words deep. It is usually the shortest edit with the
largest effect on a sentence.

**Read:** nouns ending in the language's verbal-noun suffixes, each with a helper verb in front.

### Plain words, not the ones from the ticket

The words the team uses internally — the API's name for a thing, the term from the spec, the
engineering abbreviation — are not the words the user has. Say the simple thing about the complex
one. And where the product has a house convention for a term, follow it rather than inventing a
synonym on this screen.

**Read:** each domain term against what a first-time user would call it.

### An error message names the action, not the failure

"Enter your first name", not "This field is invalid" and not a bare red border. The user needs the
next move, not a verdict.

Where the error has a title and a body, they split the work: the **title** says what happened in the
user's words, the **body** says what to do about it. "Sync error with the server / unfortunately the
profile page could not be updated" fails both halves; "Couldn't load the profile / try refreshing in
a few minutes" passes both.

**Read:** every error string starts from what to do; a titled error splits into what-happened and
what-to-do. WCAG 3.3.1 requires the error to be identified in text at all.

### Apologise only when it is your fault

"Sorry" belongs where the product broke something. It does not belong on a maintenance window, a
plan limit, or an expired code — there, an apology reads as a substitute for the fix, and the
sentence would carry more if it said what to do instead. Never more than one clause of it.

**Read:** every apology against whether the cause was the product's own doing.

### The interface does not blame the user

"That code has expired" rather than "You entered an invalid code". Second-person accusation is worse
than useless: it makes the user defensive at exactly the moment they need to read the instruction.

**Read:** error and empty-state text for second-person attributions of fault.

### A heading names the thing, not the action that got you there

"Payment method" rather than "Add your payment method here" — the screen already is the place; the
heading is a label for it. Long instructional headings push the actual content below the fold and
duplicate what the fields already say.

**Read:** each heading is a noun phrase.

### Sentence case or title case — one of them, everywhere

Pick one and hold it across labels, headings and buttons. Mixed casing reads as several products
stitched together. The same goes for the product's abbreviations and terms: one spelling, recorded
in `design.md`, rather than decided per screen.

**Read:** the casing of every label and heading on the screen, against `design.md`.

### A placeholder is not a value

Bind it to the muted text token, never the primary one. A country placeholder left on the primary
token read as an already-selected country, and the field looked filled when it was empty.

**Read:** the placeholder node's bound colour token — muted, not primary.

### Format long text instead of pouring it out

Above a few sentences, prose needs structure to be read at all: a heading, a list, emphasis on the
words that carry the decision. This is the one place bold type earns its keep — marking what the
reader must not miss, not decorating.

**Look:** any block over a few sentences — does it have a way in other than reading all of it?
