---
name: pet-tracker-space
description: Build a pet tracker Space that mirrors your pet's records: profile, treatments, vaccinations, conditions, supplies, and daily care logs. Use when the user wants a pet health and care overview Space fed by their pet records.
category: muse
---

# Pet Tracker Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own pet records. Nothing here depends on any
particular person's setup.

## What this space is

One board for a pet's life admin: profile, treatments and their
schedules, vaccination history, known conditions, supplies on
hand, and the daily care log (feedings, outings, walks). It
answers "when was that last done, and when is it due" without
digging through vet paperwork and chat threads.

## How it works

A daily refresh rebuilds the space from the pet tracker records
and the care logs. The records are the source of truth: care is
logged in the records first and mirrored here. If a parallel
record exists somewhere else (for example a pet-care app from a
tracker tag vendor), it never feeds this space automatically; if
its vet records ever diverge from the tracker, the tracker wins
and the divergence is flagged to the user.

## Data connections

- The user's pet tracker records (profile, treatments,
  vaccinations, conditions, supplies), kept in their notes,
  files, or a pet app with an export.
- The user's daily care logs (feeding and outing logs, however
  they capture them).

## Components

### 1. Profile header

Pet name, species and breed, age or birthdate, and weight if
tracked.

Build plan: read from the profile record at refresh time.

### 2. Treatments and vaccinations

One row per treatment or vaccine: what, last given, next due,
computed from the recorded interval.

Build plan: due dates derive only from recorded dates and
intervals; an unrecorded treatment does not appear.

### 3. Conditions and supplies

Known conditions as recorded, and supplies with rough on-hand
state.

Build plan: copy from the records; supply state changes in the
records first.

### 4. Care log

Recent feedings, outings, and walks with times, from the care
logs.

Build plan: entries are mirrored from the logs, never invented to
fill a quiet day.

### 5. Refresh job

A daily refresh rebuilding the data and advancing the visible
data-as-of stamp.

Build plan: silent on success; on failure, surface a message
naming what failed. The refresh never edits the underlying pet
records or care logs.

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

- Never invent a feeding, outing, treatment, or vet fact. Only
  what the records and logs show.
- The tracker records outrank any parallel app profile when they
  disagree, and the disagreement gets flagged rather than silently
  resolved.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
