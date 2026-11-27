---
name: connectors-health-space
description: Build a connector health Space that mirrors the state of your connected services: a per-connector verdict from a fresh probe, the evidence behind it, repair notes, and counts. Use when the user wants to know which of their integrations are healthy, broken, or stale, or wants a board for connection upkeep.
category: muse
---

# Connector Health Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own connector inventory. Nothing here depends
on any particular person's setup.

## What this space is

A health board for integrations. Every connector the user actually
has installed or in use gets a verdict (healthy, degraded, broken,
stale) backed by evidence from a fresh probe, plus a repair note
when something is wrong. Verdict counts and the sweep time sit at
the top.

## How it works

A daily sweep probes each connector the way that connector's own
documentation says to check it (a status command, a cheap read, an
account check), records the evidence, and rebuilds the board. A
verdict changes only on fresh probe evidence from that run, never
on a prior sweep or an assumption.

## Data connections

- The user's installed custom connectors and their documented
  health probes.
- The platform connectors connected on the user's account, with
  their connection status.
- Any companion web apps or local services the user's setup
  depends on, checked for presence.

## Components

### 1. Verdict header

Counts per verdict and the sweep time as a visible data-as-of
stamp.

Build plan: recompute counts from the per-connector rows on every
sweep.

### 2. Connector rows

One row per connector: name, verdict, the evidence (what the probe
returned), and a repair note when the verdict is not healthy.

Build plan: evidence is the probe's actual output summarized in
one line; a row without fresh evidence cannot carry a healthy
verdict.

### 3. Keep-list rule

Only connectors actually installed, connected, or in use belong on
the board.

Build plan: never pad the list from a catalog of connectable
services; remove a connector when it is uninstalled or retired at
the source.

### 4. Refresh job

A daily sweep that probes everything and rebuilds the board in
one run.

Build plan: silent on success; on failure, surface a message
naming which probe or step failed.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- No prose inside the space narrating design decisions or
  justifying a count; clean structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps instead
  of backfilling them from memory or estimates.

## Rules that keep it honest

- Fresh evidence or no verdict change: yesterday's healthy is a
  claim about yesterday.
- The board reports health; repairing a connector happens in the
  connector's own lane, and the board reflects the result at the
  next sweep.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Never print or expose credentials while probing; a probe that
  needs a secret uses the platform's secure credential handling.
