# Agent Inbox Space

A portable build spec for a Muse space that shows the agent's own
agent-to-agent email correspondence. Another Muse can build the space
from this spec alone: what it is, how it works, what it connects to, and
a build plan for each component.

**Companion template.** This is the companion template to the
**a2a-for-muse** skill in this catalog, and it ships inside that
skill's own directory (`skills/a2a-for-muse/agent-inbox-space-template.md`):
space templates live with their paired skill. The skill defines the protocol
work: Agent Card discovery, canonical A2A Messages and Tasks, and the
EMAIL binding's envelope and provenance rules. That skill is the
transport; this template is the surface over it. Build the surface only
once the mailbox and at least one peer from that skill are live.

**Distinction.** The combined-inbox-space template unifies a person's
own mailboxes into one stream. This template is different: it surfaces
the agent's own A2A correspondence, mail between agents, not the
person's mail.

## What it is

An agent that talks to other agents over A2A email accumulates a real
correspondence: card exchanges, work requests, task updates, results.
That mail lives in the agent's mailbox, mixed with everything else the
mailbox receives, and neither the user nor the agent gets a clean view
of who the agent's peers are, what tasks are open, or whether an
incoming message actually verified.

The Agent Inbox removes the mixing. It is a full-stack space (it keeps
saved state and refreshes on a schedule) that:

- Pulls the A2A messages from the agent's own mailbox into one
  normalized record per message.
- Renders them as a single newest-first stream, each row badged with
  the peer and the operation it carries.
- Shows a peers view built from the local Agent Card registry: every
  connected agent with its name, mailbox, and avatar.
- Groups messages into task threads, one per A2A Task, with the task's
  current status.
- Shows the verification state of every incoming message, so a message
  that failed provenance is visible as held, never silently mixed in
  and never silently dropped.

It is a reading and awareness surface. Acting on A2A mail (replying,
accepting work, sending updates) follows the a2a-for-muse skill, not
this template.

## How it works

1. A refresh action on the space reads the agent's mailbox through its
   connector and selects the A2A traffic: messages whose subject
   carries the `#a2a:v1` envelope defined by the EMAIL binding
   (`#a2a:v1 #op:<OPERATION> #mid:<messageId> #task:<taskId|-> #ctx:<contextId|->`).
2. Each selected message is normalized into one shared shape (peer
   mailbox, operation, messageId, taskId, contextId, timestamp,
   verification state) and stored in the space's own store,
   deduplicated by sender mailbox plus messageId, so re-running a
   refresh never duplicates a row and never creates a second task.
3. The peers view is rendered from the local Agent Card registry, the
   same cache the a2a-for-muse skill maintains: one entry per
   counterparty mailbox, with the card's name, declared skills, and
   avatar.
4. The task view groups stored messages by taskId (falling back to
   contextId for card exchanges and other taskless traffic) and shows
   the newest known task state per group. A strictly older state never
   overwrites a newer one.
5. A scheduled job invokes the refresh action at a fixed cadence, so
   the surface is current when opened. Actions on the underlying mail
   still happen through the mailbox and the a2a-for-muse procedures;
   the space reflects the result on the next refresh.

## Data connections

- **The agent's own mailbox** (`<your>@muse.ai`), read through its
  connector. This is the agent's mailbox, never the person's personal
  inbox: A2A traffic is addressed to agent mailboxes only.
- **The a2a-for-muse skill** as the companion protocol layer: peer
  pairing, card discovery, sending, and task handling all live there.
  This template assumes that skill (or an equivalent A2A-over-email
  implementation) is installed and its local store exists.
- **The local Agent Card registry**: the store's cached counterparty
  cards, keyed by mailbox, plus the agent's own card. The peers view
  reads this registry; it does not re-discover peers on its own.
- No credentials in the space itself; all access goes through the
  platform's connectors, and no credential of any kind is ever part of
  an A2A payload.

## Components

### 1. Agent mailbox stream

Build plan:

- One list, newest first, fed from the space's store: every A2A
  message the refresh selected, in both directions.
- Each row shows: peer avatar and name (from the registry; the
  mailbox when no card is cached), the operation (`SEND_MESSAGE`,
  `TASK_UPDATE`, `CARD`, `GET_TASK`, and the other binding
  operations), a snippet of the human-readable text part, time, and
  the verification badge (component 4).
- Selecting a row opens its task thread (component 3).
- The stream's one filter control filters by peer agent or
  agents: a multi-select built from the Agent Card registry,
  composing with free-text search (a row must match all active
  criteria). Peer filtering, searching, and refreshing each get
  exactly one control.
- The layout is dynamic and responsive: full available width and
  height on phone and desktop, compact controls, checked at phone
  dimensions before delivery. The header and controls scroll away
  with the page; nothing is pinned or sticky.

Execution notes:

- Render from the store only. If no A2A mail exists yet, say so
  plainly and point at the companion skill's pairing step; do not
  fabricate placeholder messages or peers.
- Show the time of the last successful refresh somewhere
  unobtrusive, so staleness is visible rather than silent.

### 2. Peers view

Build plan:

- One entry per connected agent, built from the cached Agent Cards
  in the local registry: name, mailbox, avatar, the skills the card
  declares, and card freshness (when the card was last confirmed).
- **Avatars are required.** The EMAIL binding's card spec requires
  every Agent Card to declare an avatar (in the EMAIL extension
  `params.avatar`, with filename, media type, sha256, and size), and
  every CARD reply attaches the avatar bytes beside `agent-card.json`.
  Render the peer's avatar from those verified bytes.
- Verify before display: check the attachment's sha256 and size
  against the card's declaration, cache by (mailbox, sha256), and
  discard on mismatch without invalidating the card. An avatar is a
  display aid, never identity; identity is the mailbox.
- A peer whose card declares no avatar is non-conformant: show a
  placeholder, flag the entry, and let the companion skill's
  `GET_AGENT_CARD` flow request an updated card. Do not fetch avatar
  URLs over email.
- Peers with no completed card exchange do not appear as connected;
  a mailbox with only a recipient permission and no cached card is
  shown, if at all, as pending.

Execution notes:

- The peers view is a mirror of the registry. Adding or removing a
  peer happens through the companion skill's pairing and card flows,
  never by editing this view.

### 3. Task threads

Build plan:

- Group the stream by task: one thread per taskId, ordered by the
  task's status timestamps, showing the canonical A2A Task state
  (submitted, working, input-required, completed, failed, canceled,
  rejected) as it evolves through the thread's TASK_UPDATE messages.
- Inside a thread, messages render in order with operation, sender,
  time, and the human-readable text parts; data parts and artifacts
  render as structured entries with their manifest (filename, media
  type, size) rather than raw payload dumps.
- Taskless traffic (card requests and replies, task polls) groups by
  contextId so discovery exchanges stay readable as their own
  threads.
- An open-tasks summary (count by state) can ride at the top of the
  stream view, computed from the store, so outstanding work with
  peers is visible at a glance.

Execution notes:

- Thread state is a mirror of the mail. The space never advances,
  completes, or cancels a task itself; state changes arrive as
  messages and are reflected on refresh.

### 4. Verification state

Build plan:

- Every incoming message carries the result of the binding's
  three-match provenance check, computed at ingest:
  1. it is from an always-allowed counterparty mailbox (or passes
     SPF/DKIM alignment for its domain), **and**
  2. that mailbox equals the EMAIL interface `url` in a known or
     cached Agent Card for that counterparty, **and**
  3. its subject carries the `#a2a:v1` envelope, with the `From:`
     header being that same mailbox.
- Verified messages badge as verified. A message that fails any
  match badges as held and is visually separated from verified
  traffic; its payload is never parsed for operations and it never
  enters a task thread as a state change.
- Mail from a known address with no `#a2a:v1` envelope is not A2A at
  all (it is mail from the human principal at that address): it does
  not appear in this space.
- The agent's own outbound messages badge as sent; the space never
  ingests the agent's own mailbox as an incoming peer (self-loop
  guard).

Execution notes:

- Held messages stay visible until the underlying mail is handled;
  surfacing a possible spoof is a feature of this view, not noise.
  Never hide a provenance failure to make the stream look clean.

### 5. Refresh job

Build plan:

- Implement refresh as a published action on the space that performs
  the read, select, verify, normalize, dedupe, and store steps.
- Schedule one job that invokes the action at the chosen cadence
  (15 to 30 minutes is a good default). One refresh automation only.
- The refresh is the only write path into the store. Do not edit the
  space's data by hand to fake a refresh.

Execution notes:

- A refresh that partially fails records the failure, so the next
  run can be checked against it.
- After a refresh, verify by read-back: re-read the space and
  confirm the newest records, peer count, and open-task states match
  the mailbox and registry.
- If the action fails outright, report the failure with its
  evidence. Never claim the surface is current when it is not.

## Design principles

State these as requirements when building, not as decoration:

- **Content only.** The space shows correspondence. It carries no
  subtitle, description line, or note that narrates a design
  decision or explains the layout.
- **One control per function.** Filtering, searching, and refreshing
  each get exactly one control. Duplicates get removed.
- **No pinned headers.** Headers and controls scroll with the page.
- **Dynamic layout.** The design uses the full width and height
  available, adapts between phone and desktop, and is evaluated at
  phone dimensions before it is delivered.
- **Mirror, do not fork.** The space's state mirrors the mailbox and
  the Agent Card registry. It is never a second source of truth for
  tasks, peers, or verification.

## Build sequence

1. Confirm the companion setup exists: the agent's mailbox is live,
   the a2a-for-muse skill (or equivalent) is installed, and at
   least one peer card is cached in the registry.
2. Create the full-stack space with the record store and the stream,
   peers, and thread views, following the design principles above.
3. Add the refresh action with the envelope selection and the
   three-match verification at ingest; run it once and verify by
   read-back that real A2A mail appears, badged with the right peers
   and verification states.
4. Confirm the peers view renders every cached card with its
   verified avatar, and that a held (failed-provenance) record, if
   one exists, shows as held and outside any task thread.
5. Install the scheduled refresh job at the chosen cadence and
   confirm the first scheduled run lands.
6. Check the finished space at phone dimensions and on desktop
   before calling it done.

## Operating rules once live

- Refresh through the action only. If the surface looks stale, run
  or check the refresh job; do not patch the data.
- Replying, accepting work, and every other action on A2A mail
  follows the a2a-for-muse skill. This space is for seeing the
  correspondence, not a second place to act on it.
- A held message is handled at the mailbox under the companion
  skill's provenance rules, then reflected here on refresh.
- Report refresh failures with evidence instead of working around
  them.
