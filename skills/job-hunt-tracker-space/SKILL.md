---
name: job-hunt-tracker-space
description: Build a job hunt tracker Space that mirrors a job search pipeline: counts for applied, seen, skipped, and voided roles, recruiter and connection outreach, digests, and open questions awaiting the searcher. Use when the user (or someone they are supporting) is running an active job search and wants a status board over it.
category: muse
---

# Job Hunt Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the search's own source files. Nothing here depends on
any particular person's setup, and the template contains no one's
application data.

## What this space is

A status board for a job search: how many roles have been seen,
applied to, skipped, and voided; recruiter outreach and
connection outreach totals; the recent search digests; the
application rows themselves; and the open questions waiting on
the searcher (fit calls, preferences, decisions only they can
make).

## How it works

A daily refresh rebuilds the space from the job hunt source
files: the applied, seen, skipped, and outreach records, the
digest log, and the open-questions list. The space is a mirror of
those files; it is not the job-hunt workflow itself. Corrections
land in the source files first, and the space follows at the next
refresh.

## Data connections

- The job search's source records (application tracker, outreach
  logs, digest log, open questions), kept wherever the search is
  run from: files, a spreadsheet, or a job-search tool's export.

## Components

### 1. Pipeline counts

Applied, seen, skipped, and voided counts, plus outreach totals.

Build plan: counts recompute from the source records on every
refresh; a role is counted in exactly one state, the latest one
its record shows.

### 2. Application rows

One row per application: company, role, date, state, and the
next step if one is recorded.

Build plan: rows mirror the records; no row exists without a
source record behind it.

### 3. Open questions

Questions awaiting the searcher, with the context each one needs.

Build plan: a question leaves the list when it is answered in
the source records, and the answer's effect (a role skipped, a
preference recorded) lands in those records in the same handling.

### 4. Refresh job

A daily refresh rebuilding the board and advancing the visible
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
- No prose inside the space narrating design decisions; clean
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- Mirror only: the space and its refresh never apply to a job,
  message a recruiter, or change any job-hunt state. The search
  workflow does those things in its own lane, with its own
  approvals.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
