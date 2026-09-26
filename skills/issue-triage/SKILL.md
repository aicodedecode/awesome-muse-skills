---
name: issue-triage
description: Triaging error reports — prioritization, ownership, and keeping the backlog actionable — works with any error tracker.
category: sentry
---

## Overview

An error tracker without triage becomes a write-only database of sadness:
thousands of open issues, nobody looking. Triage is the discipline of
regularly reviewing new errors, assigning ownership, and keeping the backlog
a true reflection of product health. This skill covers the process.

## When to use

- Setting up a triage rotation or process for error reports
- Prioritizing which errors to fix first (frequency × severity)
- Defining ownership of errors across teams/services
- Reducing a massive untriaged backlog to something manageable
- Deciding when to ignore, mute, or archive error issues

## Core concepts

**Triage is a cadence, not an event.** 15–30 minutes daily (or a few times
weekly) reviewing new/unresolved issues beats quarterly "error bankruptcy"
sessions. Small, frequent, owned — like inbox zero for production errors.

**Prioritize by impact: frequency × severity × trend.** A crash affecting
10% of sessions outranks a rare edge-case warning. Rising trends outrank
stable ones (something changed). New issues from the latest release outrank
old known issues (possible regression). Build the priority order from these,
not from gut feel.

**Every issue needs a state and an owner.** States: new (untriaged),
triaged/assigned, in progress, resolved, archived/ignored (with a reason).
Owner = the team/service that owns the code path. Unowned issues rot; route
by service ownership mapping (which team owns which stack frames/paths).

**Not every error deserves a fix.** Some errors are external (user's network,
browser extensions, bots), some are acceptable (validated input rejected
correctly — though that might be a UX signal), some are duplicates. It's
fine to archive with a documented reason — what's not fine is leaving them
"new" forever, which hides real problems in noise.

**Regressions get fast-tracked.** A previously resolved issue reappearing —
especially right after a deploy — is the highest-priority class: it means a
fix was reverted or a deploy reintroduced a bug. Alert on regressions
specifically and investigate immediately.

## Practical workflow

1. **Set the cadence:** daily 15-min triage (rotating owner or per-team),
   with a slightly deeper weekly review of trends and the backlog.
2. **Work the queue:** for each new issue — reproduce/assess impact, check
   if it's a regression, assign owner + priority, or archive with reason.
   Don't leave anything "new" past the triage session.
3. **Attack the backlog systematically:** sort by frequency, work top-down
   in batches; bulk-archive the provably-harmless with documented reasons;
   set a target (e.g. zero untriaged, <50 open) and track it.
4. **Maintain ownership mapping:** service → team, kept current as code
   moves; auto-assign where the tracker supports rules.
5. **Track metrics:** new issues per release, mean time to triage, % of
   issues resolved vs archived, top issues by user impact — trends tell you
   whether quality is improving.
6. **Feed back into prevention:** recurring error classes → better
   validation, better types, better tests; the triage notes are a roadmap
   for reliability work.

## Common pitfalls

- **No cadence** — triage "when someone has time" means never; schedule it
  like any other operational duty.
- **Everything is P1** — without real prioritization, nothing is; use
  impact-based ordering ruthlessly.
- **Orphan issues** — no owner, no state changes, aging silently; ownership
  mapping is non-optional.
- **Deleting instead of archiving with reason** — the same error returns
  next month and nobody remembers why it was dismissed; reasons are
  documentation.
- **Fixing symptoms in triage** — triage assigns and prioritizes; the fix
  happens in normal engineering workflow (sprint, not the triage meeting).
- **Ignoring trends** — individual issues look small, but a 5x rise in a
  category signals a systemic problem; watch the aggregates, not just the
  items.
