---
name: connector-shortlist-space
description: Build a connector shortlist Space: the short, honest list of integrations actually installed, connected, or in use on your account, refreshed weekly from the real inventory. Use when the user wants a clean reference of what their assistant can actually reach, or asks which connectors they have.
category: muse
---

# Connector Shortlist Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own connector inventory. Nothing here depends
on any particular person's setup.

## What this space is

The shortlist: every integration that is genuinely installed,
connected, or in use on the user's account, and nothing else. It
is the quick-reference answer to "what can my assistant actually
do with my accounts right now", kept honest by a strict keep-list
rule.

## How it works

A weekly refresh rebuilds the list from the real inventory: the
user's installed custom connectors plus platform connectors with a
verified connected flag or verified real usage. A connector that
merely exists in a catalog of connectable services is not
included, however relevant it looks.

## Data connections

- The user's custom connector directory (what they have built or
  installed themselves).
- The platform connector catalog, read only for connection status
  on the user's own account.

## Components

### 1. Shortlist rows

One row per connector: name, what it is for in one line, and its
basis for inclusion (installed, connected, or in active use).

Build plan: the basis must be verifiable at refresh time; when in
doubt, leave the connector off and let the next refresh re-add it
on evidence.

### 2. Refresh job

A weekly refresh that re-derives the whole list from the
inventory.

Build plan: full rebuild each time, never an incremental append,
so retired connectors fall off on their own. Silent on success;
on failure, surface a message naming what failed.

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
- Show a visible data-as-of stamp, and label gaps as gaps instead
  of backfilling them from memory or estimates.

## Rules that keep it honest

- Never claim a connector is connected without a verified flag or
  verified real usage behind it.
- The refresh never connects, disconnects, or reconfigures
  anything; it only reads the inventory.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
