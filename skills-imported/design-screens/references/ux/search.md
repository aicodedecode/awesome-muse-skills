# Search and filters

Reached from `references/ux-rules.md`. Read when the screen lets the user narrow a set — a search
field, filter controls, a saved query, a column filter.

The empty result itself is in `ux/states.md` ("nothing found" is one of the three empties). This
file is about getting there.

### Name which kind of search this is

They are different features that look alike. **Keyword** — free text over the record's text.
**By property** — the user picks a field and a value from what exists. **By column** — narrowing
inside one column of a table. **By popular parameter** — the two or three filters most people
actually use, promoted to the surface as chips or tabs. A field that silently does keyword search
while the user expects property search returns nothing and looks broken.

**Read:** for each search affordance, which of the four it is, and what it searches over.

### The field says what it searches

"Search" alone forces a guess. "Search orders by number, customer or email" tells the user whether
their string has a chance — and it is the cheapest fix available for a search nobody uses.

**Read:** the placeholder names the scope, not just the verb.

### Results update on a rhythm the user can predict

Either as they type — with a pause long enough that a half-typed word doesn't produce a flash of
wrong results — or on submit. Not both, and not "as you type" over an expensive query where the
screen thrashes. Whichever it is, the field keeps the string that produced what is on screen.

**Read:** which event refreshes the results, and whether the field still holds the query afterwards.

### Say how many were found, and against what

A count answers the question the user actually has — did this narrow anything. And it belongs next to
what produced it: "24 of 1 380" says more than "24 results" because it shows how much was excluded.

**Read:** the result count is present and states the total it narrowed from.

### Applied filters are visible outside the panel they were set in

A filter that lives only inside a closed dropdown is a filter the user forgets, and then reads the
list as the whole set. Applied filters appear as removable chips above the results, each one
removable on its own, with one clear-all.

**Read:** the filtered frame shows every active filter outside its panel, each individually
removable.
**Blocking:** an active filter with no visible trace — the user will draw conclusions from a subset
believing it is everything.

### Clearing is one action, and it is not hidden

"Clear all" next to the filters, not buried in the panel. And clearing returns the set to its
default state, which is not always "everything" — a list with a default filter says so after the
clear rather than pretending it is unfiltered.

**Read:** the clear affordance's position; what the state after clearing actually shows.

### Nothing found offers the next move, not a shrug

Which filter to widen — named, not "adjust your filters" — and, where the product allows it, the
option to create the thing that was searched for: a query that finds nothing is the best possible
moment to offer "add it". See `ux/states.md` for the frame itself.

**Read:** the no-results frame names a filter to relax, and an add action where creation is possible.

### A search worth repeating is worth saving

Where users run the same narrowing daily — a work queue, a report, a segment — the query gets saved
with a name and comes back. Without it, they rebuild it every morning, and half of them rebuild it
slightly differently each time.

**Read:** whether the flow has repeat queries; if it does, whether saving them exists.

### Filters survive leaving and coming back

Opening a record and pressing back returns to the same narrowed set, at the same position
(`ux/navigation.md`). A filter reset by navigation makes the list unusable for the one job filters
exist for: working through a subset one record at a time.

**Read:** the back path from the detail — filter, sort, page and scroll all preserved.

### Keyboard access to search is worth designing, not inheriting

In a product where search is the main way in, the shortcut that focuses it is part of the design —
stated in the mockup and shown in the field's own hint. Where it isn't the main way in, don't invent
one; a shortcut nobody discovers is a decision that cost design time and bought nothing.

**Read:** whether the flow's primary entry is search; if so, the shortcut is specified and visible.
