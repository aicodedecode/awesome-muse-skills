---
name: money-dashboard-space
description: Build a money dashboard Space that mirrors a snapshot built from your bank data and budgeting app: net worth, accounts, budget categories, findings, recurring items, and recent transactions. Use when the user wants a personal finance overview Space that stays current on a daily refresh.
category: muse
---

# Money Dashboard Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own financial data sources. The template
describes structure only; it contains no one's financial data.

## What this space is

A daily money picture in one place: net worth, every account with
its balance, budget category state, notable findings (unusual
charges, drift, upcoming bills), recurring items, and recent
transactions. It is a read-only mirror: it explains the user's
money, it never moves it.

## How it works

The space rebuilds from a single snapshot file produced by a
snapshot chain: first sync the bank-data source, then build the
snapshot (balances plus live budget state pulled from the
budgeting app), then rebuild the space from that snapshot only.
A daily refresh runs the chain and the rebuild in order. Figures
are never hand-edited in the space; a wrong figure is fixed in the
snapshot chain at its source.

## Data connections

- The user's bank and card data through a bank-data aggregator
  connector (balances and transactions).
- The user's budgeting app (their YNAB, or equivalent) through
  its connector, for category state.

## Components

### 1. Net worth and accounts header

Net worth computed from the snapshot, and one row per account
with balance and type.

Build plan: totals are recomputed from the snapshot's account
rows on every refresh.

### 2. Budget categories

Category groups with budgeted, activity, and available figures
from the budgeting app.

Build plan: category state comes from the live budget pull inside
the snapshot chain, never from a stale copy.

### 3. Findings

Short, evidence-backed observations the snapshot supports:
anomalies, overspent categories, large recent charges.

Build plan: a finding cites the figure it rests on; no finding
without a number behind it.

### 4. Recurring items and recent transactions

Detected recurring charges with cadence and amount, and the most
recent transactions across accounts.

Build plan: both lists are regenerated from the snapshot each
refresh, not accumulated by hand.

### 5. Refresh job

A daily refresh running the snapshot chain and rebuilding the
space, advancing the visible data-as-of stamp.

Build plan: the refresh is read-only over financial data: it
never moves money, edits the budget, or changes an account.
Silent on success; on failure, surface a message naming the step
that failed.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions or
  lecturing about spending; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps (an
  account that failed to sync shows as stale, not as zero).

## Rules that keep it honest

- One snapshot, one source: the space renders the snapshot and
  nothing else, so two surfaces can never disagree about a
  balance.
- Fix figures at the source chain, never by patching the space.
- Verify by read-back after every refresh edit.
