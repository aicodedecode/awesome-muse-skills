---
name: nutrition-tracker-space
description: Build a nutrition tracker Space that mirrors your food diary against a fixed set of daily targets and lab watch flags, with the diary app as the single source of truth. Use when the user wants a nutrition dashboard Space fed by their food logging app.
category: muse
---

# Nutrition Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own food diary. Nothing here depends on any
particular person's setup.

## What this space is

A daily nutrition board: what the diary shows for today and recent
days against the user's target set (calories, macros, fiber, and
the other nutrients they track), plus a small set of lab watch
flags: nutrients or markers being watched because of recent lab
results, shown with their current status.

## How it works

The food diary app is the source of truth. A daily refresh pulls
the latest diary data and rebuilds the board. Food corrections are
made in the diary first, then flow into the space; the space is
never patched to disagree with the diary. Targets and watch flags
are configuration, not data: they change only when the underlying
records or the user's clinician-guided plan changes them, never
from a chat estimate.

## Data connections

- The user's food diary or nutrition app (their Cronometer,
  MyFitnessPal, or equivalent) through its connector or export.
- The user's target set and lab watch flags, kept as configuration
  alongside the tracker.

## Components

### 1. Daily rows

One row per recent day: totals for each tracked nutrient against
its target, with misses and hits readable at a glance.

Build plan: totals are recomputed from the diary pull on every
refresh, never typed in.

### 2. Target set

The fixed list of daily targets the board grades against.

Build plan: targets render from the configuration; a target
change is a configuration edit with its own confirmation, not a
refresh side effect.

### 3. Lab watch flags

The watched markers with their latest status and the date of the
lab they came from.

Build plan: a flag updates only from a newer lab record; a stale
flag shows its date so its age is obvious.

### 4. Refresh job

A daily refresh pulling the diary and rebuilding the board,
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
- No prose inside the space narrating design decisions or
  moralizing about a day's eating; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps (a day
  with no diary entries is an unlogged day, not a zero day).

## Rules that keep it honest

- The diary wins every disagreement. Fix the diary entry, then
  let the refresh carry it in.
- Never change a target or a watch flag from an estimate or a
  single conversation; they move on records.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
