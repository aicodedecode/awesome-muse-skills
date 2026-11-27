---
name: daily-brief-space
description: Build a daily brief Space: a living briefing compiled several times a day from your calendar, open items, and what changed, with sections for top of mind and looking ahead. Use when the user wants a briefing surface that stays current through the day instead of a single morning message.
category: muse
---

# Daily Brief Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own sources. Nothing here depends on any
particular person's setup.

## What this space is

A briefing that lives in a Space instead of a chat message: what
is top of mind today, what is looking ahead, and anything blocked
or needing a decision, compiled from the user's calendar, tracked
items, and the day's developments. It is rebuilt several times a
day, so the afternoon edition reflects the afternoon.

## How it works

Editions compile from current sources only: a morning compile, a
midday refresh, and an evening refresh, with a lightweight refresh
between editions so closures land promptly. Lists in the brief
sync as a full current set with a retirement path, never
upsert-only, because upsert-only lists accumulate ghosts: items
that closed but never left.

## Data connections

- The user's calendar, for today's and upcoming events.
- The user's tracked items and goals, for open items and
  blockers.
- The day's inputs: messages or notes the assistant has already
  triaged as brief-worthy through the user's normal lanes.

## Components

### 1. Top of mind

The few things that matter most today, in order.

Build plan: compiled fresh each edition from current sources;
an item that closed since the last edition is absent, not
struck through.

### 2. Looking ahead

Upcoming events and deadlines in the next few days, with the
prep each one needs if any is recorded.

Build plan: rendered from the calendar and tracked items at
compile time.

### 3. Blockers and decisions

Anything waiting on the user or on someone else, stated with
what it is waiting for.

Build plan: an item appears here only while its source record is
open; the same item never also lives on the user's needs-you
board (see the assistant dash template): nothing already on the
dash belongs in the brief.

### 4. Refresh machinery

Scheduled compiles and refreshes through the space's own actions
or the assistant's scheduler.

Build plan: refresh rebuilds from current sources only; a closed
item may not be re-ingested. If a source record is still
annotated open, that record is the defect to fix, not a brief
problem.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions; the
  brief's own content is the content.
- Show the edition time visibly, so a stale brief reads as stale.

## Rules that keep it honest

- Same-handling retirement: when an item in the brief closes
  anywhere, close its source, retire it from the brief through
  the brief's own mechanisms (never by hand-editing its store),
  and verify by reading the brief again. Only the second read
  counts as verification.
- Full-set sync for every list, every edition.
- Refresh edits go through the space's own refresh and cleanup
  actions. Layout, styling, and name changes are a separate,
  explicit request.
