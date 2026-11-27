---
name: group-trip-space
description: Build a group trip Space for one specific trip: the event details, dates, bookings with their evidence state, and a planning checklist, refreshed daily from the event page, calendar, and mail. Use when the user is going on a group trip and wants one board for what is actually booked versus merely planned.
category: muse
---

# Group Trip Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own calendar and mail. Nothing here depends on
any particular person's setup or any specific trip.

## What this space is

One board for one trip: where and when, the event or gathering at
its center, the bookings (lodging, flights, ground transport)
with an honest state for each, and the planning checklist. Its
distinguishing discipline: it separates what is actually booked
from what is merely priced, started, or intended.

## How it works

A daily refresh re-checks the sources: the event page or listing
for the gathering (venue announcements, date changes), the
calendar invitation, and the user's mail and calendar for booking
records inside the trip's date range. If nothing changed, the
refresh finishes silently without editing (updating the stamp
only when a source check actually ran).

## Data connections

- The event page or invitation for the trip's gathering, through
  the public web or the user's calendar.
- The user's calendar, for the trip's events and any booking
  holds recorded there.
- The user's email, for booking confirmations.

## Components

### 1. Trip header

Destination, dates, and the gathering's name and venue as the
sources currently state them.

Build plan: a date or venue disagreement between sources is
shown as a disagreement to resolve, never silently picked over.

### 2. Booking rows

One row per booking element (lodging, each flight, transfers):
what, provider, dates, and state.

Build plan: state follows the evidence rule below; the row links
or cites its booking record when one exists.

### 3. Checklist

Planning tasks with their states (open, done), from the user's
own list for the trip.

Build plan: checklist state changes at the user's word or on
booking evidence, not on the refresh's guess.

### 4. Refresh job

A daily refresh as described above.

Build plan: silent on no-change and on success; on failure,
surface a message naming the source that could not be checked.

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
- Show a visible data-as-of stamp.

## Rules that keep it honest

- A booking counts only when a real booking record exists in
  mail or calendar. A price seen, a checkout started, or an RSVP
  is not a booking and is never written as one.
- This board is not a booking lane: it never books, holds, or
  pays for any flight, room, or event under its own refresh.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit.
