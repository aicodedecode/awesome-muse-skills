---
name: pdu-tracker-space
description: Build a professional development units Space that tracks certification continuing-education credits: activities with their stage (logged, submitted, approved), the approved total against the requirement, and evidence links. Use when the user must earn and document PDUs or CEUs for a certification renewal.
category: muse
---

# PDU Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own activity records. Nothing here depends on
any particular person's setup.

## What this space is

A tracker for certification continuing-education credits (PDUs,
CEUs, or the user's equivalent): every earning activity with its
stage, the approved total against the renewal requirement, and
the evidence behind each activity. The rows baked into the space
are the working store: if it is not on the board, it is not
counted.

## How it works

A daily refresh checks three places for newer activity since the
board's data-as-of stamp: the certifying body's approvals or
registrations visible in the user's mail, the user's own evidence
sweep notes or files, and activities the user reported in chat.
If activities were added or stages changed, the board rebuilds
with the full activity list and a recomputed approved total. If
nothing changed, the correct outcome is no edit at all.

## Data connections

- The user's email, for approval and registration notices from
  the certifying body.
- The user's evidence files or notes for completed activities.
- The user's own reports in conversation (an activity they say
  they finished is a lead to verify, not a stage promotion).

## Components

### 1. Requirement header

Approved total against the required total, credits in progress,
and the renewal deadline if one is recorded.

Build plan: the approved total counts approved-stage rows only,
recomputed on every rebuild.

### 2. Activity rows

One row per activity: title, provider, date, credits, stage, and
an evidence link.

Build plan: rows carry their evidence with them; an activity
without evidence can be logged but shows that gap.

### 3. Refresh job

A daily check-and-maybe-rebuild as described above.

Build plan: a silent no-edit finish is a success outcome, not a
skipped run. Surface failures by naming the source that could not
be checked.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions; clean
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- Stage adjudication is a judgment call: never promote an
  activity's stage on mechanical evidence alone. If a stage is
  ambiguous, leave it and flag the ambiguity to the user.
- No change, no edit: do not churn the board to look busy.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every rebuild.
