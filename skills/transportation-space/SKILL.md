---
name: transportation-space
description: Build a transportation Space: a daily snapshot of measured travel times from home to your saved destinations, plus a next-trip snapshot from your calendar. Use when the user wants travel times to their regular places visible at a glance, without a live routing engine.
category: muse
---

# Transportation Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own maps and calendar accounts. Nothing here
depends on any particular person's setup.

## What this space is

A snapshot board, not a routing engine: measured travel times
from home to the user's saved destinations (workplace, family,
the airport, regular venues) by the modes they actually use, plus
a snapshot of the next trip on the calendar. It answers "how long
to the usual places, as of this morning" in one glance.

## How it works

One daily snapshot refresh measures the routes and rebuilds the
board. That is the whole cadence: no standing periodic route
checks. Live route checks happen at the two moments they matter,
when an event is created and right before the user has to leave
for it, and those checks live in the assistant's trip handling,
not in this board's refresh.

## Data connections

- A maps or routing service through its Muse connector, for
  measured routes and live transit status.
- The user's calendar, for the next-trip snapshot.
- The user's own walking pace, if they have one recorded, applied
  to walking legs of measured routes.

## Components

### 1. Destination rows

One row per saved destination: name, travel time by the relevant
modes, and when it was measured.

Build plan: destinations are configuration the user chooses;
every time shown comes from a live measured route at snapshot
time.

### 2. Next-trip snapshot

The next calendar trip with its route summary and leave-by time
as of the snapshot.

Build plan: rendered from the calendar at refresh time; it is a
snapshot and labels itself with its check time.

### 3. Refresh job

One daily snapshot refresh.

Build plan: silent on success; on failure, surface a message
naming what failed, and never bake a partial picture as current.

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
- Show a visible data-as-of stamp on every figure's row or
  section.

## Rules that keep it honest

- Never estimate a duration. Every number comes from a live
  measured route, or it stays at its previous value with the
  stamp noting when it was last checked.
- Never present a stale snapshot as a live ETA; when no live
  check has run at an allowed moment, say routing is unverified.
- One step-by-step path beats a menu of options in any trip
  guidance tied to this board: exactly which service, from
  where, at what time, where to get off, with a practiced
  fallback stated as a fallback step.
- Refresh edits are data-only. Layout, styling, destination list,
  and name changes are a separate, explicit request.
- Verify by read-back after every refresh edit.
