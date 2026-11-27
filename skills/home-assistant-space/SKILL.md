---
name: home-assistant-space
description: Build a smart home status Space that mirrors your home setup: hub status, integration and device state, automations, blockers, and migration progress, reconciled against live device state before anything is shown. Use when the user wants a smart home dashboard Space, is migrating devices between hubs, or asks to track the state of their smart home setup.
category: muse
---

# Smart Home Status Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own smart home accounts. Nothing here depends on
any particular person's setup.

## What this space is

A status board for a smart home: whether the hub is up, which
integrations and devices are live, which are still on an old hub or
pending migration, which automations exist, and what is blocked.
Homes mid-migration between hubs are where it earns its keep: the
board answers "what is actually running my house right now" without
opening three vendor apps.

## How it works

The space is a mirror, refreshed on a short cadence by a refresh
job. Before anything is baked in, the refresh reconciles its saved
records against live hub state: a device with a matching fresh live
entity counts as live even if the record still says pending, and
the record is corrected with the verification date first. The space
never contradicts live state for the devices it can check.

## Data connections

- The user's smart home hub platform (for example Home Assistant)
  through its Muse connector, for live entity states.
- A second platform or bridge the user is migrating from, read
  sparingly (one canary read per refresh is enough to prove the
  bridge is alive).
- The user's own setup records: device inventory, migration plan,
  and blocker notes, kept wherever they track projects.

## Components

### 1. Status header

Hub status, counts of live vs pending devices, and a visible
data-as-of stamp.

Build plan: compute the counts from the device data on every
refresh; never hand-set a total.

### 2. Device and integration list

One row per device or integration: name, platform, state (live,
pending, blocked), and the date its state was last verified live.

Build plan: state comes from the reconciliation step, not from the
saved record alone.

### 3. Migration progress and blockers

Phases of the migration with their progress, and a blockers list
naming what each blocker needs (a credential, a decision, a
physical action).

Build plan: blockers are data rows, not prose essays; one line each
with the unblock condition.

### 4. Refresh job

A frequent refresh (every 15 to 30 minutes suits a status board)
that reconciles records against live state, corrects the records,
and rewrites only the space's data.

Build plan: if nothing changed, finish without editing. If the
bridge canary read fails, report the refresh as failed even when
the space data did not change; a silent stale board is the failure
this template exists to prevent.

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

- Live state wins: when the record and the hub disagree, verify
  against the hub, correct the record, and only then update the
  space.
- The space is a mirror, never a control surface: it reports
  device state; it does not switch devices or edit the hub.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit: the new data and
  the advanced stamp are live before anyone calls the board
  current.
