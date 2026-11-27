---
name: deal-watch-board-space
description: Build a deal watch board Space for a fixed, user-approved list of products during a sale event: today's best verified price per item across sellers, savings, and one batched message when any deal changes. Use when the user is tracking specific items through Black Friday, Cyber Monday, or another sale window.
category: muse
---

# Deal Watch Board Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against public retailer pages and the user's own watch list.
Nothing here depends on any particular person's setup.

## What this space is

A sale-event board for a fixed list of products the user approved
in advance: for each item, today's best price across the brand's
own store and a few major sellers (same variant, total price),
the usual price, and the saving. The board runs for the event
window and stops when the window closes.

## How it works

A daily refresh verifies each item's price on the sellers' own
product pages that day, and updates the board. The item list is
fixed: items are never added, dropped, or swapped mid-event, and
new items are never pulled from the user's interests. If an item
has been bought, it is marked bought on the board instead of
being price-tracked.

## Data connections

- Retailer product pages (public web) for prices, verified on the
  seller's own page.
- The user's approved watch list and board state, kept as the
  refresh's configuration and record.

## Components

### 1. Item rows

One row per item: photo if on file, today's best price and store,
usual price, saving, and a working product link.

Build plan: prices and savings render in a positive color (green
is the convention), never red. No countdown timers and no fake
"live" labels.

### 2. Deal-change message

When any item's deal status changes, one message to the user
covering all changes: item, new price, usual price, saving,
store, and link.

Build plan: one batched message per refresh, never one per item;
if nothing changed, send nothing.

### 3. Refresh job

A daily refresh through the event window only.

Build plan: the window's end date is configuration; the board
does not extend past it or add items without the user's explicit
ask. Silent on no-change; on failure, surface a message naming
what failed.

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
- Show a visible updated line and the deal count, kept current by
  the refresh.

## Rules that keep it honest

- Never report a price that was not verified on the seller's own
  page that day.
- The board is a watch, not a checkout lane: it never buys
  anything, and neither does its refresh.
- Refresh edits swap the data, the updated line, and the deal
  count only. Layout, styling, and name changes are a separate,
  explicit request.
- Verify by read-back after every refresh edit.
