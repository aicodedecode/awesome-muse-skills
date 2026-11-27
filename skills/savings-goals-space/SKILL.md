---
name: savings-goals-space
description: Build a savings goals Space that shows each goal's target, funded percentage, and a long-horizon projection at the current monthly pace, all recomputed from the goal records and live balances. Use when the user wants a savings or early-retirement progress Space tied to their real accounts and budget.
category: muse
---

# Savings Goals Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own goal records and financial snapshot. The
template describes structure only; it contains no one's financial
data.

## What this space is

A progress board for savings goals, including a long-horizon one
like early retirement: each goal with its target amount, how much
is funded, the funded percentage, and a projection of where the
current monthly pace leads. It turns "are we on track" into a
glance.

## How it works

A daily refresh recomputes everything from three sources: the
goal records (targets and any long-horizon decision the user has
recorded), current account balances from the user's finance
snapshot, and the current month's budget category spending from
their budgeting app. Goal amounts and targets change at their
sources first; the space recomputes from them.

## Data connections

- The user's goal records (a goals file, decision journal, or
  notes where targets are recorded).
- The user's finance snapshot or bank-data connector, for current
  balances.
- The user's budgeting app, for current-month category spending.

## Components

### 1. Goal rows

One row per goal: name, target, funded amount, funded percentage.

Build plan: percentages are recomputed from balances and targets
on every refresh, never typed.

### 2. Long-horizon projection

The headline goal's projection at the current monthly savings
pace, with the method stated on the page in one line (pace source
and horizon).

Build plan: recompute with the same documented method every time;
never restate a projection computed a different way, and never
present a projection as a guarantee.

### 3. Refresh job

A daily refresh recomputing the rows and the projection,
advancing the visible data-as-of stamp.

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
- No prose inside the space narrating design decisions; clean
  structured data only, plus the one-line projection method.
- Show a visible data-as-of stamp, and label gaps as gaps (a
  balance that failed to sync is stale, not zero).

## Rules that keep it honest

- Targets change at their source records first; the space never
  leads them.
- A projection is an arithmetic illustration of the current pace,
  labeled as such, never a promise.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
