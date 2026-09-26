---
name: clean-code
description: Write readable, maintainable code: naming, small functions, clear control flow, and honest abstractions. Use when writing new code, refactoring, or reviewing for readability.
category: development
---

# Clean Code

## Overview

Clean code is **code that respects its reader**: the next person (often you) should understand what
it does, why it exists, and how to change it safely — without archaeology. This isn't about
aesthetics; it's economics. Code is read far more than written, and every minute of confusion
compounds across the team.

This skill distills the durable practices: intention-revealing names, small focused units, flat
control flow, and abstractions that earn their keep.

## When to use

- Writing new functions, classes, or modules.
- Refactoring code that's hard to understand or change.
- Reviewing code for readability and maintainability.
- Naming things (functions, variables, types, files).
- Deciding whether an abstraction (helper, base class, framework) is justified.

## Core concepts

- **Names are documentation.** A name should answer *what* and *why*, not *how*: `daysUntilExpiry`
  beats `d`; `retryWithBackoff` beats `doThing2`. Names carry the domain language — if the business
  says "shipment," the code says `shipment`, not `item2`.
- **Small, single-purpose units.** A function does one thing at one level of abstraction. If you
  need "and" to describe it ("validates and saves and notifies"), it's three functions. Aim for
  functions you can read without scrolling; classes you can summarize in one sentence.
- **Flat over nested.** Deep nesting hides logic. Guard clauses, early returns, and extracted
  helpers keep the happy path at the left margin where eyes naturally go.
- **Honest abstractions.** An abstraction must hide real complexity or remove real duplication —
  not hypothetical future flexibility. The wrong abstraction is worse than duplication: duplication
  is visible and fixable; a wrong abstraction infects everything built on it.
- **Comments explain why, not what.** `// retry because the payment gateway drops 1% of webhooks`
  is gold; `// increment i by 1` is noise. If the *what* needs a comment, rename instead.
- **Boy Scout Rule.** Leave every file a little cleaner than you found it — a renamed variable,
  a clarified comment, a removed dead branch. Compound interest for codebases.

## Practical workflow

1. **Draft for correctness first**, then do a readability pass before committing. Writing and
   polishing are different modes; don't interleave them.
2. **Readability pass checklist:**
   - Can I delete a comment because the name now says it?
   - Is any function doing two things? Split it.
   - Is nesting deeper than 2 levels? Extract or invert.
   - Are magic values named constants with units (`TIMEOUT_MS = 30_000`)?
3. **Hunt duplication with judgment.** Duplicated *knowledge* (business rules, magic formulas) →
   extract. Duplicated *incidental shape* (two similar loops doing different things) → often leave
   alone; premature extraction couples unrelated code.
4. **Simplify conditionals.** Replace nested `if/else` chains with guard clauses, lookup tables,
   or polymorphism. Boolean parameters (`doSave(user, true)`) → two named functions.
5. **Check the seams.** Every function/class should have an obvious answer to: what does it need,
   what does it promise, what can go wrong? Vague contracts produce defensive spaghetti.
6. **Get a second pair of eyes** on anything clever. If it needs explaining in review, it needs
   simplifying in code.

Before/after — flat control flow:

```python
# Before: nested, hard to scan
def process(order):
    if order:
        if order.is_paid():
            if not order.is_shipped():
                ship(order)
                return True
    return False

# After: guards first, happy path obvious
def process(order):
    if order is None or not order.is_paid() or order.is_shipped():
        return False
    ship(order)
    return True
```

## Common pitfalls

- **Cleverness as a virtue.** One-liners, exotic language tricks, and "elegant" hacks optimize for
  the writer's amusement and the reader's suffering. Boring code ships and survives.
- **Premature abstraction.** Extracting a "framework" from one use case. Rule of three: first use,
  second use, third use → then extract the pattern you can actually see.
- **Commenting the what.** Comments that restate the code rot when the code changes. Comment the
  *why* and the *non-obvious*: business rules, workarounds with ticket links, surprising behavior.
- **Inconsistent naming.** `getUser`, `fetch_user`, `retrieveUser` in one codebase. Pick one
  convention per concept and enforce it — inconsistency forces readers to wonder if the difference
  is meaningful (it never is).
- **God functions and god classes.** The 400-line function that "just grew." Split by
  responsibility, not by line count — each piece should have one reason to change.
- **Dead code and commented-out code.** "We might need it later" — that's what version control is
  for. Delete it; the history remembers.
- **Over-DRYing.** Merging two similar-but-different code paths into one parameterized monster with
  five flags. Some duplication is cheaper than the wrong abstraction.
