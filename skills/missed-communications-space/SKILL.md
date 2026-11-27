---
name: missed-communications-space
description: Build a missed communications Space: a reply queue across all your messaging channels showing every thread and group chat whose latest inbound is unread with no reply yet, with a draft where one exists. Use when the user wants one place that answers "who is waiting on me" across channels.
category: muse
---

# Missed Communications Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
against the user's own messaging accounts. Nothing here depends
on any particular person's setup.

## What this space is

A reply queue, not an inbox: the individual threads and group
chats, across every channel the user messages on, whose latest
inbound message is unread and has no later outbound reply. Each
entry shows who, which channel, when, what they sent, and a draft
reply where one has been prepared. Header totals are the queue's
size, split by individual threads and groups.

## How it works

A daily refresh regenerates the queue from the user's message
store (a local index the assistant maintains across channels, or
each channel's unread state). Queue membership is computed, never
hand-adjusted: a thread enters when an inbound lands unanswered
and leaves when a reply goes out at the source channel. The space
is a mirror of that state.

## Data connections

- The user's messaging channels (text messages, chat apps, email
  if they treat it as messaging) through their Muse connectors.
- A message index or store the assistant maintains, if the setup
  uses one, as the refresh's single input.

## Components

### 1. Queue header

Total needing a reply, split into individual threads and group
chats, plus a visible data-as-of stamp.

Build plan: totals are recomputed from the entries shown on every
refresh, never hand-set: total = threads + groups; individual
count = the thread list's length.

### 2. Filter by contact

The queue filters to a single person or contact across every
channel, so "everything this person is waiting on" is one tap.
This is the queue's one filter control; there is no second
filter surface.

Build plan: filtering is a view over the same computed queue, not
a separate list; totals restate for the filtered view.

### 3. Thread entries

One entry per waiting thread: person, channel, time, the message
that is waiting, and a draft where one exists.

Build plan: entry text is the data itself and nothing else (see
rules). Group entries render without inventing fields the data
does not have.

### 4. Refresh job

A daily refresh regenerating both lists and the stamp.

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
- Show a visible data-as-of stamp, and label gaps as gaps (a
  channel that could not be read is listed as unreadable, not as
  empty).

## Rules that keep it honest

- Data only, never notes: the space shows clean structured data
  and nothing else. No subtitle lines explaining a count, no
  banners about corrections, no panels explaining how items were
  counted or filtered, no captions narrating a decision. Per-entry
  text is limited to who, which channel, when, what they sent,
  and a draft where one exists.
- An item leaves the queue only when it is handled at its source
  channel, never by hiding it in the space.
- Drafts are drafts: nothing is sent from the space or its
  refresh without the user's own approval flow.
- Refresh edits are data-only. Layout, styling, and name changes
  are a separate, explicit request.
- Verify by read-back after every refresh edit: totals match the
  rebuilt data and the stamp advanced.
