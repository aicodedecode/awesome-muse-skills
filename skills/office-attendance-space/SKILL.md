---
name: office-attendance-space
description: Build an in-office attendance Space that derives office vs remote days from calendar work blocks, with tallies against a target average. Use when the user has a hybrid-work attendance expectation and wants it tracked from their calendar rather than self-reported.
category: muse
---

# Office Attendance Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own calendar. Nothing here depends on any
particular person's setup or employer.

## What this space is

An attendance ledger for hybrid work: which days were in-office
and which were remote, derived from the work blocks on the user's
calendar, with running tallies and the current average against
the user's target (for example a set number of office days per
week or month).

## How it works

The calendar is the source of record. A daily refresh reads the
work blocks, classifies each day, and rebuilds the tallies.
Attendance is never derived from chat claims, memory, or a
spreadsheet someone maintains by hand; if a day has no work
block, it shows as unrecorded rather than guessed.

## Data connections

- The user's calendar, specifically the work blocks or events
  they use to mark office vs remote days, through the calendar
  connector.
- The user's target setting (their expected office cadence),
  kept as configuration.

## Components

### 1. Day rows

One row per workday in the window: date, office or remote, from
the calendar block that decided it.

Build plan: classification follows a stated rule (which block or
location value means office); ambiguous days show as unrecorded
with the reason.

### 2. Tallies and average

Counts for the current period and the running average against
the target.

Build plan: tallies recompute from the day rows on every refresh;
the target renders from configuration, unchanged by refreshes.

### 3. Refresh job

A daily refresh re-reading the calendar window and rebuilding,
advancing the visible data-as-of stamp.

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
- No prose inside the space narrating design decisions; clean
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- Calendar blocks only: never create, move, or edit calendar
  events to make the tallies look right, and never backfill a
  day from what the user said in chat.
- If the user's employer counts attendance some other official
  way, this board is a personal mirror of the calendar, and it
  says so in one line rather than claiming to be the official
  record.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
