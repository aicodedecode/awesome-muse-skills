
# Data Broker Removal Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own removal tracker records. The template
describes structure only and contains no one's personal data.
(The removal workflow itself, finding brokers and filing opt-outs,
is covered by the data-broker-removal skill; this template is the
Space that tracks that work.)

## What this space is

A status board for getting your personal data off data brokers:
the roster of brokers, each one's status (found, opt-out filed,
removed, suppressed, recheck due), totals, which parts of the
process are automated, and recent activity. A separate section
tracks search-engine "results about you" style monitoring:
enrollment state, review counts, and open cases.

## How it works

A daily refresh rebuilds the space from the removal tracker,
which is the source of record. A broker shows as removed or
suppressed only when the tracker records it; the space never
marks a removal complete ahead of the tracker evidence. The
search-results section rebuilds from its own latest status record
in the same handling, so a fresh board never hides a stale
section behind a new stamp.

## Data connections

- The user's data broker removal tracker (their records of
  brokers, opt-outs, and rechecks).
- The user's latest search-results-about-you status record, if
  they use that monitoring.

## Components

### 1. Broker roster

One row per broker: name, status, date of last action, and next
recheck date where one applies.

Build plan: statuses copy from the tracker; totals recompute
from the rows on every refresh.

### 2. Automation states

Which steps of the removal process run automatically (periodic
rechecks, inbox watching for broker replies) and their last run
state.

Build plan: states come from the automations' own records, not
from assumption.

### 3. Search results section

Monitoring status (enrolled, monitoring on or off), last verified
check date and last attempt date labeled as such (a blocked
attempt never masquerades as a fresh check), counts (results to
review, in progress, approved, declined), open cases, queued
targets, and the next scheduled check. If checks are blocked, the
section says so plainly in one line with the last verified date.

Build plan: this section rebuilds from its own status record on
every refresh, on the same cadence as the rest of the board.

### 4. Refresh job

A daily refresh rebuilding all sections and advancing the
visible data-as-of stamp.

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

- The tracker is the source of record; the space is its mirror.
- Never expose personal identifiers in the space beyond what the
  tracker itself needs to show; statuses and dates, not dossiers.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
