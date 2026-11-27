---
name: energy-dashboard-space
description: Build a daily energy Space that shows last night's sleep against your sleep need, weight trend, and the recent entries from your other trackers that affect energy, with gaps labeled instead of hidden. Use when the user wants a daily energy or recovery overview Space fed by their wearable or phone health data.
category: muse
---

# Energy Dashboard Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own health data sources. Nothing here depends
on any particular person's setup.

## What this space is

A one-glance daily energy picture: how last night's sleep compares
to the sleeper's actual sleep need, the current weight trend, and
recent entries from adjacent trackers (for example medication or
symptom logs) that plausibly bear on energy. Known gaps, like a
night with no sleep stages or a stretch with no weigh-ins, are
shown as labeled gaps, not smoothed over.

## How it works

A daily morning refresh pulls the latest sleep sessions and weight
from the user's health platform, reads the sleep-need figure from
wherever it is computed (never deriving it inside the space), and
rebuilds the board. The space mirrors its sources; corrections are
made in the source tracker first and flow in at the next refresh.

## Data connections

- The user's phone or wearable health platform (sleep sessions,
  weight) through its Muse connector.
- A sleep-need figure computed outside the space (from a sleep
  tracker or a clinician's guidance the user has recorded).
- Adjacent tracker records the user keeps (medication, symptoms,
  or similar) for the recent-entries strip.

## Components

### 1. Sleep vs need

Last night's sleep duration and timing next to the sleep-need
figure, with the shortfall or surplus plain.

Build plan: both numbers come from the sources at refresh time;
if either is missing, show the gap labeled rather than estimating.

### 2. Weight trend

Recent weight with a short trend window, in the user's preferred
unit.

Build plan: show the actual recorded points and their dates; a
missing stretch reads as no data, never as a flat line.

### 3. Recent tracker entries

The last few entries from adjacent trackers that affect energy,
with dates.

Build plan: entries are copied from the source records, never
summarized into claims the records do not support.

### 4. Refresh job

A daily early-morning refresh rebuilding the data and advancing
the visible data-as-of stamp.

Build plan: silent on success; on failure, surface a message
naming the source that failed.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions or
  justifying a number; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps instead
  of backfilling them from memory or estimates.

## Rules that keep it honest

- Never invent a health value. What the sources do not contain,
  the space does not show.
- Sleep need is an input, never a number the space computes or
  adjusts on its own.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit: the new data and
  the advanced stamp are live before anyone calls the board
  current.
