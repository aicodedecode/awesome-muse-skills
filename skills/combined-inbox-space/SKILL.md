---
name: combined-inbox-space
description: Build a Combined Inbox space that merges every connected mailbox into one live stream with a single filter control and a scheduled refresh. Use when the user has two or more mail accounts connected and wants one place to read all their mail instead of switching between mailboxes, or asks for a unified inbox, an all-mail view, or an inbox space or dashboard.
category: muse
---

# Combined Inbox Space

A portable build spec for a Muse space that shows every mailbox the user
has connected as one chronological stream. Another Muse can build the
space from this spec alone: what it is, how it works, what it connects to,
and a build plan for each component.

## What it is

Most people with an assistant have more than one mailbox: a personal
account, a work account, maybe a second provider or an assistant mailbox.
Reading them means opening each one in turn, and anything that arrives in
the mailbox you are not looking at waits.

The Combined Inbox removes the switching. It is a full-stack space (it
keeps saved state and refreshes on a schedule) that:

- Pulls recent mail from every connected mailbox into one normalized
  record per message.
- Renders all of it as a single newest-first stream, each row badged with
  the mailbox it came from.
- Filters the stream by mailbox through one control, and by free-text
  search.
- Opens a thread view per conversation, across mailboxes when a thread
  spans them.
- Stays current through a scheduled refresh action, not through edits to
  a static page.

It is a reading surface, not a triage method. It mirrors the state of the
source mailboxes; it does not replace them.

## How it works

1. A refresh action on the space reads each connected mailbox through its
   connector (recent messages with sender, subject, snippet or body,
   thread id, timestamp, and read state).
2. Each message is normalized into one shared shape and stored in the
   space's own store, deduplicated by source plus message id, so
   re-running a refresh never duplicates a row.
3. The page renders the store as one stream. Filtering and searching
   happen against the stored records, so the view is instant and does
   not re-query the mailboxes on every interaction.
4. A scheduled job invokes the refresh action at a fixed cadence
   (30 minutes is a good default), so the stream is never more than one
   cadence old when the user opens it.
5. Actions taken on mail (reply, archive, mark read) happen at the source
   mailbox through its connector. The space reflects the result on the
   next refresh. An item leaves the inbox only when it is handled at its
   source, never by hiding it in the space.

## Data connections

The space needs read access to each mailbox the user wants in the
stream, through whatever mail connectors they have connected. State
generically in the build which sources are wired in; typical sources:

- A Gmail account (personal or work).
- An Outlook / Microsoft 365 mailbox.
- An assistant or agent mailbox on the user's own domain.
- Any additional mail source the user has connected.

Optional extra lane: agent-to-agent messages. If the user's assistant
exchanges structured messages with other assistants (for example over an
agent protocol carried by email), those messages can be ingested as one
more lane in the same stream, badged so they are visually distinct and
reachable through search like everything else. Treat them as ordinary
records with a source badge; do not build a separate surface for them.

Requirements for each source:

- A read path that returns recent messages with thread ids and read
  state.
- A stable message id, used with the source name as the dedupe key.
- No credentials in the space itself; all access goes through the
  platform's connectors.

## Components

### 1. Unified stream view

Build plan:

- One list, newest first, fed from the space's store.
- Each row shows: source badge (which mailbox), sender name, subject,
  snippet, time, and an unread indicator.
- Rows group or link into threads by thread id; selecting a row opens
  the thread view (component 4).
- The layout is dynamic and responsive: it uses the full available width
  and height on phone and desktop, with compact controls, and is checked
  at phone dimensions before delivery.
- The header and controls scroll away with the page. Nothing is pinned
  or sticky at the top; pinned chrome wastes reading space, especially
  on a phone.

Execution notes:

- Render from the store only. If the store is empty, say so plainly and
  offer to run a refresh; do not fabricate placeholder mail.
- Show the time of the last successful refresh somewhere unobtrusive, so
  staleness is visible rather than silent.

### 2. Single filter control

Build plan:

- Exactly one filter control: a strip or menu with one entry per source
  (All, then each mailbox) that filters the stream by source badge.
- Search is a separate single input that matches sender, subject, and
  body text across all sources.
- One control per function, always. If a second strip, panel, or menu
  would duplicate what the filter control already does, remove the
  duplicate. Two controls doing the same thing is a defect, not a
  feature.

Execution notes:

- Filtering is client-side against the loaded records, so it is instant
  and never triggers a mailbox query.
- The active filter is visible at a glance, and returning to All is one
  tap.

### 3. Refresh job

Build plan:

- Implement refresh as a published action on the space (for example
  `refreshInbox`) that performs the read, normalize, dedupe, and store
  steps for every wired source.
- Schedule one job that invokes the action at the chosen cadence. One
  refresh automation only; never add a second one, and never retime it
  casually.
- The refresh is the only write path into the store. Do not edit the
  space's data by hand to fake a refresh, and do not substitute a
  hand-built data source for what the action reads.

Execution notes:

- A refresh that partially fails (one mailbox unreachable) stores what
  it got and records the failure per source, so the next run can be
  checked against it.
- After a refresh, verify by read-back: re-read the space and confirm
  the newest records and counts match what the sources returned.
- If the action fails outright, report the failure with its evidence.
  Never claim the inbox is current when it is not.

### 4. Thread view and read state

Build plan:

- Selecting a stream row opens the full thread: every message in the
  thread in order, with sender, time, and full body, plus the source
  badge on each message.
- Read and unread state comes from the source mailbox and is refreshed
  with everything else; the space does not keep a competing read-state
  of its own.
- Unread rows are visually distinct in the stream (weight or indicator),
  and an unread count per source can ride on the filter control entries.

Execution notes:

- Marking read, archiving, or replying is done at the source through its
  connector, then reflected here on refresh. Keep the space's job
  narrow: show mail faithfully, act at the source.
- Long bodies are fetched in full for the thread view even when the
  stream only stores a snippet.

## Design principles

State these as requirements when building, not as decoration:

- **Content only.** The space shows mail. It carries no subtitle,
  description line, or note that narrates a design decision or explains
  the layout. Justification prose inside a space is clutter; keep the
  reasoning in the build conversation, out of the surface.
- **One control per function.** Filtering, searching, and refreshing
  each get exactly one control. Duplicates get removed.
- **No pinned headers.** Headers and controls scroll with the page on
  every space, this one included.
- **Dynamic layout.** The design uses the full width and height
  available, adapts between phone and desktop, and is evaluated at
  phone dimensions before it is delivered.
- **Mirror, do not fork.** The space's state is a mirror of the source
  mailboxes. Anything that would make the space a second source of
  truth (local-only dismissals, local read state, hand-edited records)
  is out of scope.

## Build sequence

1. Confirm which mailboxes are connected and wire each as a source with
   its dedupe key.
2. Create the full-stack space with the record store and the stream and
   thread views, following the design principles above.
3. Add the refresh action and run it once; verify by read-back that real
   mail from every source appears, badged correctly.
4. Add the single filter control and search; confirm each filter shows
   only its source and All restores the full stream.
5. Install the scheduled refresh job at the chosen cadence and confirm
   the first scheduled run lands.
6. Check the finished space at phone dimensions and on desktop before
   calling it done.

## Operating rules once live

- Refresh through the action only. If the stream looks stale, run or
  check the refresh job; do not patch the data.
- An item leaves the inbox only when handled at its source mailbox.
- Verify closures by read-back: after something is handled at the
  source, re-read the space and confirm its state matches.
- Report refresh failures with evidence instead of working around them.
