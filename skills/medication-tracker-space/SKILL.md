---
name: medication-tracker-space
description: Build a medication tracker Space that mirrors your medication records: current medications, dose logs, and related routines, mirrored strictly from records and never inferred. Use when the user wants a medication overview Space fed by their own medication tracker or health records.
category: muse
---

# Medication Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own medication records. The template describes
structure and safety discipline only; it contains no one's
medication data.

## What this space is

A calm mirror of a medication record set: the medications on
record, their schedules as recorded, the dose log as recorded, and
any related routine logs the user keeps alongside (for example
skincare or allergy treatments). Its job is to show what the
records say, completely and without embellishment.

## How it works

A daily refresh rebuilds the space from the medication tracker
records. Logging a dose happens in the tracker itself (or through
whatever logging flow the user has set up), never from the space;
the space is read-only over the records.

## Data connections

- The user's medication tracker records (a dedicated tracker, a
  health app, or structured health notes) through its connector
  or files.
- Adjacent routine logs the user keeps in the same store (for
  example allergy treatment actuals).

## Components

### 1. Current medications

One row per medication on record: name, recorded schedule, and
form, exactly as the records state them.

Build plan: rows are copied from the records; a medication leaves
the list when the record ends it, not when it scrolls away.

### 2. Dose log

Recent dose entries with dates and times, as logged.

Build plan: the log shows recorded entries only. A missing entry
is a gap in the log; it is never rendered as a taken or a missed
dose.

### 3. Related routines

Adjacent routine logs the user tracks with their medications,
shown with the same as-recorded discipline.

Build plan: same source-first rule as the dose log.

### 4. Refresh job

A daily refresh rebuilding the data and advancing the visible
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
- No prose inside the space narrating design decisions or
  commenting on adherence; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- Never infer that a dose was taken. The space mirrors records;
  it does not manufacture adherence, schedules, or doses the
  records do not contain.
- Never log, change, or discontinue a medication from the space
  or its refresh; those changes belong to the user's own tracker
  and their clinician's guidance.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
