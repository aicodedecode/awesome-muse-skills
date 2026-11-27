---
name: lookbook-space
description: Build a lookbook Space over your wardrobe inventory: what you own, organized for outfit planning and gap-spotting, refreshed daily from the wardrobe records. Use when the user keeps a wardrobe inventory and wants a visual lookbook Space over it.
category: muse
---

# Lookbook Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own wardrobe records. Nothing here depends on
any particular person's setup.

## What this space is

A visual wardrobe board: the user's clothing inventory presented
for outfit planning, seeing combinations, and spotting gaps. The
inventory records are the source; the space is the mirror you
browse.

## How it works

A daily refresh rebuilds the space from the wardrobe records and
the inventory list. A slower seasonal pass keeps the inventory
itself current (what arrived, what left, what is stored), and it
feeds the inventory rather than editing the space directly.
Wardrobe changes land in the records first; the space follows.

## Data connections

- The user's wardrobe records (their clothing inventory file or
  notes, with photos where they keep them).
- The user's inventory list, if it is kept separately from the
  records.

## Components

### 1. Wardrobe grid

Items grouped the way the user plans outfits (by type, season,
or occasion, following their records' own organization), with
photos where the records have them.

Build plan: grouping follows the records' fields; an item with
no photo shows as a text row, never with a substitute image.

### 2. Refresh job

A daily rebuild from the records, advancing the visible
data-as-of stamp.

Build plan: silent on success; on failure, surface a message
naming what failed.

### 3. Seasonal inventory pass

A periodic (for example monthly) pass that reconciles the
inventory against the records: arrivals, departures, storage.

Build plan: this pass edits the inventory only; the daily refresh
carries its results into the space.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions; the
  wardrobe is the content.
- Show a visible data-as-of stamp, and label gaps as gaps (an
  unphotographed item is unphotographed, not hidden).

## Rules that keep it honest

- The space governs presentation only: it never buys clothing or
  generates shopping picks on its own.
- Records first: a wardrobe change that is not in the records
  does not appear in the space.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
