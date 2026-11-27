---
name: decision-journal-space
description: Build a decision journal Space that mirrors a canonical decision journal file: every entry, its dated predictions, and reviews coming due, recomputed on a daily refresh. Use when the user keeps (or wants) a decision journal and wants a browsable Space over it. This is the Space template companion to the decision-journal-method skill, which covers the journaling method itself.
category: muse
---

# Decision Journal Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own journal file. Nothing here depends on any
particular person's setup.

## What this space is

A browsable mirror of a decision journal: every recorded decision
with its context, options, and reasoning, the predictions each
entry made, and which reviews are due. The journal file is the
source of record; the space is how the user reads it at a glance.
(The journaling method itself, what to record and how to review,
is covered by the decision-journal-method skill; this template is
only the Space that mirrors the journal.)

## How it works

A daily refresh re-reads the canonical journal in full, including
entries added since the last refresh, and rebuilds the space. An
entry, prediction, or review appears in the space only while it
is in the journal; there are no space-only entries. A prediction
closes or a review completes in the journal first, and the space
update follows in the same handling.

## Data connections

- The user's decision journal file (a markdown journal, a
  document, or structured notes) wherever they keep it.

## Components

### 1. Entry list

One card or row per journal entry: date, decision, and status
(open prediction, review due, reviewed).

Build plan: entries render from the full journal re-read, sorted
newest first, with status computed from the entry's own dates.

### 2. Predictions and reviews due

Open predictions with their check dates, and reviews that are
due or overdue, recomputed on every refresh.

Build plan: due state is arithmetic on recorded dates, never a
hand-maintained flag.

### 3. Refresh job

A daily refresh rebuilding the mirror and advancing the visible
data-as-of stamp.

Build plan: silent on success; on failure, surface a message
naming what failed.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions; the
  entries' own words are the content.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- The journal is the only source. Never create, edit, or close
  an entry in the space; corrections land in the journal first.
- One refresh job owns the mirror; do not add a second cleanup
  automation for it.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
