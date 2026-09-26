---
name: incident-commander
description: Leading incident response — roles, communication, and decision-making under pressure — use when running or improving on-call response.
category: operations
---

## Overview

When production breaks, the difference between a 20-minute incident and a
4-hour one is rarely technical skill — it's coordination. The Incident
Commander (IC) role exists to bring order: clear roles, crisp communication,
and decisions that keep the response moving. This skill covers running
incidents effectively from declaration to resolution.

## When to use

- Acting as incident commander during an outage
- Setting up incident roles and severity levels for a team
- Improving incident communication (status pages, stakeholder updates)
- Running game days / incident simulations
- Writing postmortems that actually prevent recurrence

## Core concepts

**Roles beat heroics.** Commander (coordinates, decides, communicates — does
not debug), Operations/Responders (investigate and fix), Communications lead
(status updates, stakeholders), Scribe (timeline). One person, one role; the
IC explicitly hands off rather than silently burning out. Small incidents can
combine roles, but the IC hat stays distinct.

**Declare early, de-escalate freely.** A formal incident with a commander and
a channel costs little; a "quick look" that sprawls across 6 engineers for 2
hours costs a lot. Declare on user impact or strong suspicion of it; there's
no penalty for resolving as a non-issue.

**Communication cadence.** Internal updates every 15–30 minutes (what we know,
what we're trying, ETA of next update — even if it's "no change"). External
status page updates on a similar cadence during user-visible impact. Silence
breeds duplicate investigations and anxious stakeholders.

**Mitigate first, root-cause later.** The IC's priority order: stop the
bleeding (rollback, failover, feature-flag off, scale up), then restore full
service, then understand. Debugging the root cause while users are down is a
trap — stabilize, then investigate with the pressure off.

**Time-box and parallelize.** If the current theory hasn't produced results
in ~20–30 minutes, the IC pivots: pursue mitigation in parallel with a second
theory. Avoid tunnel vision on one hypothesis; explicitly ask "what else
could this be?"

## Practical workflow

1. **Declare:** severity level (SEV1 = major user impact … SEV4 = minor),
   open the incident channel/bridge, page the IC and initial responders.
2. **Stabilize the response:** IC confirms roles, scribe starts the timeline,
   comms posts the first update ("investigating reports of X").
3. **Assess impact:** who's affected, since when, what's the blast radius —
   drive all decisions from impact, not from technical curiosity.
4. **Mitigate:** rollback the last deploy, toggle the kill switch, fail over,
   shed load — prefer reversible actions; announce each action in the channel
   so work doesn't duplicate.
5. **Resolve and verify:** confirm metrics/alarms green and user impact gone
   before declaring resolved (not "looks fixed"); post the final update.
6. **Learn:** schedule the blameless postmortem within days; capture timeline,
   contributing factors, and action items with owners — then actually track
   them to completion.

**IC phrases that help:** "What do we know / not know?", "What's our current
theory and what's the falsifying test?", "Let's time-box this to 15 minutes,
then pivot to mitigation.", "Who's doing what right now?"

## Common pitfalls

- **The IC debugging instead of commanding** — the moment the coordinator
  goes heads-down, coordination stops and the incident slows.
- **No scribe / lost timeline** — reconstructing "what happened when" from
  memory produces bad postmortems; log as you go.
- **Skipping mitigation to find root cause** — users stay down while you
  learn; stabilize first.
- **Too many cooks** — 15 people in the channel "helping" creates noise;
  IC keeps the responder set small and parks observers in listen-only.
- **Declaring victory on the first green dashboard** — verify end-to-end
  user impact is resolved, including downstream queues and backlogs.
- **Postmortem action items without owners** — "we should add alerting"
  rots in a doc; assign, deadline, and track like any other work.
