---
name: on-call-guide
description: Sustainable on-call — rotations, alert hygiene, handoffs, and burnout prevention — use when setting up or fixing on-call.
category: operations
---

## Overview

On-call is how teams keep promises to users around the clock — and how teams
burn out if done badly. Sustainable on-call means: alerts that matter,
rotations that respect sleep, handoffs that transfer context, and a feedback
loop that converts pages into fixes. This skill covers the human system behind
the pager.

## When to use

- Designing an on-call rotation (follow-the-sun, weekly, etc.)
- Fixing alert fatigue (too many pages, too much noise)
- Writing handoff docs and onboarding new on-call engineers
- Setting up escalation policies and backup coverage
- Measuring and improving on-call health and sustainability

## Core concepts

**Pages must be actionable and urgent.** A page should mean: something is
wrong (or imminently will be), a human must act now, and the runbook says
what to do. Everything else is a ticket, an email, or a dashboard. Every page
that wasn't actionable is a bug in your alerting — fix the alert, not the
human.

**Alert fatigue is a safety issue.** Engineers who get paged 10 times a night
for noise stop responding urgently to real pages. Track pages per
rotation-week; if it's regularly above a handful, you have an alerting problem
masquerading as an operations problem.

**Rotations respect humans.** Weekly rotations are the common default;
follow-the-sun for global teams; never single-person coverage without backup.
Cap consecutive on-call weeks, guarantee handoff overlap, and protect
post-incident rest — an engineer who fought a SEV1 at 4am shouldn't be in
standup at 9am.

**Handoffs transfer context, not just the pager.** The outgoing on-call
briefs the incoming: known flaky alerts, in-flight incidents, recent deploys,
things to watch. A written handoff note beats "ping me if anything's weird."

**Compensation and credit.** On-call is real work with real costs (interrupted
sleep, constrained weekends). Recognize it explicitly — pay, time off, or
both — and count on-call load in capacity planning. Uncompensated on-call
breeds resentment and attrition.

## Practical workflow

1. **Audit current alerts:** classify each as page-worthy (actionable +
   urgent) or not; demote the rest to tickets/dashboards; add runbook links
   to every remaining page.
2. **Define the rotation:** length, primary/secondary, escalation chain
   (primary → secondary → manager), and override/holiday coverage — written
   down, visible to the whole team.
3. **Write the on-call handbook:** how to ack/escalate, where runbooks live,
   who to call for what system, severity definitions, and comms templates.
4. **Run structured handoffs:** outgoing posts a note (open issues, risky
   changes, watch items); incoming acknowledges; overlap on complex weeks.
5. **Measure:** pages per week, % actionable, time-to-ack, time-to-mitigate,
   and a periodic on-call satisfaction pulse — review monthly.
6. **Close the loop:** every unactionable page gets a follow-up task (tune
   the alert, fix the flakiness, automate the response); track alert-noise
   reduction as an explicit goal.

## Common pitfalls

- **Paging on symptoms, not user impact** — CPU at 90% pages while users are
  fine; alert on SLIs and burn rate instead.
- **Noisy alerts nobody fixes** — each ignored page trains the team to ignore
  pages; treat noise as a defect with an owner.
- **Single-person on-call with no backup** — vacations, illness, and 3am
  brain fog need a secondary; always.
- **Handoff as a calendar event only** — the pager moves but the context
  doesn't; require the written brief.
- **On-call as invisible labor** — not counted in sprint capacity, not
  compensated, not thanked; make the cost visible and paid.
- **New hires thrown onto rotation day one** — shadow shifts and a buddy
  system first; on-call readiness is earned, not assumed.
