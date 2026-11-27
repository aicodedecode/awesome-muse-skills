---
name: assistant-dash-space
description: Build an assistant dash Space: the single board of everything that needs the user's attention or decision, compiled from open tracked items and active goals, plus today's agenda. Use when the user wants one "what needs me" board for their assistant, or when items keep getting handled in chat but left open on the board.
category: muse
---

# Assistant Dash Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own tracking system. Nothing here depends on
any particular person's setup.

## What this space is

The needs-you board: every open item that needs the user's action
or decision, compiled from the assistant's tracked items and
active goals, with today's agenda and what's coming up alongside.
It is the surface the user checks instead of asking "what is
waiting on me" in chat. Many tracker and dashboard Spaces borrow
its layout pattern: a fixed page, data embedded in one data block,
a visible data-as-of stamp.

## How it works

A simple morning refresh rebuilds the board from what is
currently tracked: open tracked items, active goals, today's
agenda and upcoming events, and a small daily extra (a crossword
or quote) if the user wants one. The refresh stays deliberately
simple forever; honesty comes from a discipline rule, not from a
smarter refresh: no source, no board item; closed source, no
board item. An item is eligible only while a source of record
behind it is currently open (an active tracked item, an active
goal, an open annotation on its owning queue or record).

## Data connections

- The user's tracked items and goals (the assistant's tracking
  system).
- The user's calendar, for today's agenda and upcoming events.

## Components

### 1. Needs-you list

One row per open item: what it is, its area, and its age or due
state.

Build plan: rows generate from eligible sources only; yesterday's
board data, a chat summary, or a daily log narrative are never
sources.

### 2. Agenda strip

Today's events and the next few upcoming, read from the calendar
at refresh time.

Build plan: times render from the calendar pull; nothing is
carried over from yesterday's strip.

### 3. Refresh job

A daily morning refresh with the simple build described above.

Build plan: silent on success. Do not grow the refresh into a
reconciliation engine, and do not add a second cleanup automation
behind it; the source-of-record rule below is what keeps it
honest.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing. In particular, do not add done buttons or per-device
  local state to the board to manage closure; closure lives in
  the assistant's process, not in board widgets.
- No prose inside the space narrating design decisions; clean
  structured data only.
- Show a visible data-as-of stamp, and label gaps as gaps.

## Rules that keep it honest

- Same-handling closure: when work closes anywhere (a tracked
  item completes, a question is answered, a delivery lands), the
  source closes first and the board item is removed in the same
  handling, verified by read-back. Only after that verification
  may anyone tell the user the item is handled. A chat claim of
  closure without the board edit and read-back is the failure
  this template exists to prevent.
- Counts come from read-backs of the live board, never from
  subtracting decisions in conversation.
- When work opens that belongs on the board but has no source of
  record, create the source first, then the board item. A
  board-only item with nothing behind it is a defect at creation.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
