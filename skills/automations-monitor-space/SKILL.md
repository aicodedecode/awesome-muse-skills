---
name: automations-monitor-space
description: Build an automations inventory Space that mirrors every scheduled job and event listener your assistant runs: totals, enabled and disabled counts, failed last runs, and a Needs Attention set that gets fixed, not just reported. Use when the user wants visibility into their automations, asks what is scheduled or failing, or wants a board for automation health.
category: muse
---

# Automations Monitor Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own automation inventory. Nothing here depends
on any particular person's setup.

## What this space is

One board for everything the assistant runs unattended: scheduled
jobs (crons) and event listeners. It shows totals, how many are
enabled or disabled, which failed their last run, and the full list
with cadence, owner, enabled state, and last status. A second view
covers event listeners: status, last cycle, and how much each one
processed, woke on, or logged.

## How it works

A daily refresh rebuilds the board from the live automation
definitions and their run statuses. The space is a mirror of those
definitions: an automation appears only while its source definition
exists and matches its enabled state, and disappears when the
source does. Nothing is edited away by hand to make the board look
clean.

## Data connections

- The user's scheduled-job inventory and run history (the Muse
  cron system or the user's own scheduler).
- The user's event-listener ledgers or logs, if they run listener
  style automations.
- Any project or space roster the refresh needs to attribute
  ownership.

## Components

### 1. Totals header

Total automations, enabled and disabled counts, failed-last-run
count, and a visible data-as-of stamp.

Build plan: recompute every count from the rebuilt data on each
refresh; never carry a count forward.

### 2. Automation list

One row per automation: name, cadence, owner, enabled state, last
run status.

Build plan: rows are generated from the source definitions, sorted
so failures and disabled items are easy to scan for.

### 3. Listeners view

One row per listener: status, last cycle time, and cycle counts
(wakes, items processed, items logged or coalesced).

Build plan: read the listener ledgers fresh each refresh; a
listener with no recent cycle shows as stale, not as fine.

### 4. Needs Attention set

Every automation whose last run failed, that has stalled, or whose
refresh is stale.

Build plan: membership is computed from the same data as the list;
the set is a fix queue, not a report (see rules).

### 5. Refresh job

A daily refresh that rebuilds all views in one run.

Build plan: silent on success; on failure, surface a message
naming what failed instead of baking a partial board.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions or
  justifying a count; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps instead
  of backfilling them from memory or estimates.

## Rules that keep it honest

- Needs Attention means fix, never just report: triage the root
  cause, fix what standing authority covers in the same handling,
  verify by re-run or read-back, and surface only what the fix
  could not complete or what genuinely needs the user.
- The space is a mirror. A removed or disabled automation is
  reflected from its source definition, never hidden by editing
  the board.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- One refresh job owns the board; do not add a second cleanup
  automation alongside it.
