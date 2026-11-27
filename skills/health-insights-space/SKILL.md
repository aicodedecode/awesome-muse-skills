---
name: health-insights-space
description: Build a health insights Space that mirrors your health record store: current weight and body composition, recent labs and events, active hypotheses and signals with their evidence, and open questions. Use when the user wants a health overview Space fed by their own health records rather than a chat summary.
category: muse
---

# Health Insights Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own health record store. Nothing here depends
on any particular person's setup, and the template contains no
one's health data: it describes structure only.

## What this space is

A structured mirror of a personal health record store: the current
snapshot (weight, body composition), recent labs and health
events, the medications on record, and the analytical layer the
user keeps over it: hypotheses being tracked, signals noticed,
the evidence for each, and open questions. It also shows how
complete the record store is, so thin data reads as thin.

## How it works

A daily refresh rebuilds the space from the health record store
and its insights pipeline. When an underlying record closes or
changes (a lab results, a medication changes, a hypothesis
resolves), the space reflects it at the next refresh, or in the
same handling when the assistant made the change. The space never
contradicts the record store by hand.

## Data connections

- The user's health record store (their health warehouse, health
  app exports, or structured health notes) through whatever Muse
  connector or files they use for it.
- The user's insights notes: hypotheses, signals, and open
  questions they track over the records.

## Components

### 1. Current snapshot

Current weight and body composition in the user's preferred unit,
plus a recent-era summary and a completeness indicator for the
record store.

Build plan: every value is read from the store at refresh time;
the completeness indicator counts what is actually present.

### 2. Labs, medications, and events

Recent labs with dates, the medications on record, and recent
health events in chronological order.

Build plan: copy from the records; a resulted lab replaces its
pending entry, never sits beside it as a duplicate.

### 3. Hypotheses and signals

Each tracked hypothesis or signal with its supporting evidence
and its status (open, supported, resolved).

Build plan: status changes happen in the record store first; the
space mirrors them.

### 4. Open questions

Questions the user wants answered from future data or a clinician
visit.

Build plan: a question leaves the list when it is answered in the
store, not when it scrolls out of view.

### 5. Refresh job

A daily refresh rebuilding the data and advancing the visible
data-as-of stamp.

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
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps instead
  of backfilling them from memory or estimates.

## Rules that keep it honest

- Never invent a health value, a lab result, or a medication.
  What the store does not contain, the space does not show.
- The space observes and organizes; it does not diagnose. A
  hypothesis is labeled as the user's tracked hypothesis, never
  presented as a medical conclusion.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
