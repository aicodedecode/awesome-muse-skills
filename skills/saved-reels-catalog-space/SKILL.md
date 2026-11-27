---
name: saved-reels-catalog-space
description: Build a saved reels catalog Space: a searchable visual catalog of your saved short-form videos, grouped by what each one actually contains and labeled with its topic and collection, with links back to the originals. Use when the user's saved videos have become an unsearchable pile and they want them organized.
category: muse
---

# Saved Reels Catalog Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own social account. Nothing here depends on
any particular person's setup.

## What this space is

A catalog of the user's saved short-form videos (for example
Instagram Reels): searchable, visual, grouped by useful topic,
and labeled by what each video actually contains, with a link
back to the original. Categories are topics, not the platform's
collection names; each entry records both its topic and the
collection it lives in.

## How it works

A weekly refresh pulls the user's saved posts through the
platform connector and catalogs the new ones under standing
curation rules (below). Every cataloged save ends up organized:
exactly one collection on the platform, chosen by fit, and one
topic in the catalog.

## Data connections

- The user's account on the short-form video platform, through
  its Muse connector (saved posts, collections).

## Components

### 1. Catalog grid

Entries with a thumbnail or still, the topic, the collection,
and the link to the original.

Build plan: labels describe what the video actually contains,
verified by looking at it, not just its caption.

### 2. Curation rules (part of the build)

- Catalog every save; no collection-based exclusions.
- Organize-always: every cataloged save ends in exactly one
  platform collection, chosen by fit.
- Low confidence means inspect visually before filing; never
  file from weak text evidence alone, and never guess.
- Unavailable posts are deleted from the catalog entirely, and
  their ids recorded so they are never re-added.
- Report endpoint coverage honestly; never invent saves the
  endpoint did not return, and never keep dead entries to pad
  counts.

### 3. Refresh job

A weekly refresh that pulls new saves, applies the curation
rules, and swaps the catalog data into the space.

Build plan: verify counts and entries by read-back after every
edit. One refresh job owns the catalog; do not add a second.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing (one search, one filter surface).
- No prose inside the space narrating design decisions; the
  catalog is the content.
- Show a visible data-as-of stamp.

## Rules that keep it honest

- A label is a claim about content: if it was not checked, it is
  not labeled.
- Refresh edits swap catalog data only. Layout, styling, and
  name changes are a separate, explicit request.
- Verify by read-back after every refresh edit.
