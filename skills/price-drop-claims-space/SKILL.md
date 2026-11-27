---
name: price-drop-claims-space
description: Build a price drop claims Space that tracks watched purchases, the lower prices found for them with dated evidence, and the money-back claims ready to file, where filing always waits for the user's approval. Use when the user buys from retailers with price-adjustment windows and wants drops caught and claims prepared.
category: muse
---

# Price Drop Claims Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own purchase records. Nothing here depends on
any particular person's setup.

## What this space is

A claims board for price adjustments: purchases being watched
inside a retailer's price-adjustment window, what was paid, the
lower price found and when, the dated evidence for it, and the
money back a claim would recover. Claims are prepared here, never
filed here.

## How it works

Two jobs with different jobs. A watch job checks watched purchases
on a cadence and acts only on a qualifying drop (a threshold the
user sets, inside the retailer's window): it captures dated
evidence, updates the space, and sends the user one message naming
the item, the price paid, the new price, and the money back,
stating the claim is ready to file once they approve. If the price
is the same, higher, or unreadable, the watch sends nothing. A
separate periodic refresh keeps the board current from the claims
record; it does not replace the watch.

## Data connections

- The user's purchase records (order confirmations in email, or
  their shopping account) for what was paid and when the window
  closes.
- The retailer's own product pages, for the current price and
  dated evidence.

## Components

### 1. Claim rows

One row per watched purchase or claim: item, price paid, best
lower price found with its date, evidence link, money back, and
state (watching, ready to file, filed with approval, closed).

Build plan: every row must match its source purchase evidence at
refresh; totals recompute from the rows.

### 2. Watch job

The conditional price check described above.

Build plan: evidence is a dated capture from the retailer's own
page, not a price-aggregator snippet. The window end date is part
of the watch's configuration; after it, the watch does nothing.

### 3. Refresh job

A periodic rebuild of the board from the claims record,
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
- No prose inside the space narrating design decisions; clean
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps (an
  unreadable price is unreadable, not unchanged).

## Rules that keep it honest

- Never file, submit, or start a claim with any merchant without
  the user's explicit approval for that claim. Preparation is
  the whole job.
- A drop that cannot be evidenced from the retailer's own page
  is not reported as a drop.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
