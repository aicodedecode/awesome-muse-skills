---
name: on-call-handoff
description: Run clean on-call handoffs — shift transitions, knowledge transfer, runbook currency, and sustainable rotations.
category: enterprise-communication
---

## Overview

On-call handoffs are where context transfers between humans: what happened, what's fragile, what's pending. Done well, they prevent dropped incidents and repeated pages; done poorly, they cause both. This skill covers handoff rituals, documentation, runbook maintenance, and designing sustainable on-call rotations.


On-call handoffs transfer operational responsibility between engineers: what is happening, what to watch, what is fragile, and who to call.
Good handoffs prevent the 3am "I have no context" disaster; bad handoffs (or none) turn every incident into an archaeological expedition.
This skill covers handoff rituals, documentation, and shadowing for sustainable on-call.
## When to use

- Designing on-call rotations
- Creating handoff checklists
- Reducing repeat pages
- Improving runbook quality
- Fixing painful shift transitions
- Making on-call sustainable

- Designing on-call rotation handoffs
- Onboarding engineers to on-call
- Reducing incident resolution times
- Handing off during major incidents
- Handoffs during security incidents
## Core concepts

**Handoff ritual.** A structured transfer at rotation change: review open incidents, known fragile areas (recent deploys, flaky systems), pending follow-ups, and schedule quirks (holidays, planned maintenance). Written, not just verbal — memories fade, docs persist. 15–30 minutes, scheduled, non-optional.

**Shadow rotations.** New on-call members shadow experienced ones for 1–2 rotations before solo duty: they observe pages, practice runbooks, and build confidence. Nobody's first page should be alone at 3am.

**Runbook currency.** Runbooks rot: steps reference old dashboards, commands no longer work, contacts left. Rule: every page that uses a runbook ends with "was the runbook accurate?" — fix immediately if not. Quarterly runbook audits catch the rest.

**Follow-the-sun vs. follow-the-clock.** Global teams: follow-the-sun (each region covers business hours) minimizes night pages. Single-region: weekly rotations with fair distribution. Choose by team geography; hybrid models need clear boundary rules.

**Compensation and sustainability.** On-call is real work: compensate (pay, time-off, or both), cap consecutive weeks, track burden per person, and treat frequent night pages as a reliability problem to fix (not a badge of honor). Burnout from on-call is a leading cause of engineer attrition.

**Psychological safety.** Blameless pages (nobody gets shamed for escalating), permission to page broadly when unsure, and post-incident reviews focused on systems. Fear of paging delays response; over-paging from fear creates noise — calibrate with feedback.


**Handoff document.** Active incidents (status, next steps, owner) → recent changes (deploys, config changes, migrations) → known issues (flaky alerts, degraded components) → upcoming risks (planned maintenance, traffic events) → key contacts.
Template it; free-form handoffs miss things.
Review the previous handoff at shift start — continuity compounds.
**Shadowing.** New on-call members shadow 2–4 rotations before solo: observe incidents, practice runbooks in staging, then reverse-shadow (veteran observes newcomer).
Throwing engineers into on-call without shadowing produces panic and mistakes.
Certify readiness explicitly — "shadowed 3 rotations, ran 2 game days" — not by tenure.
**Live incident handoff.** When incidents span shifts: structured briefing (situation, actions taken, current hypothesis, next steps) → shared timeline review → explicit transfer of commander role → overlap period (30 min minimum for SEV-1).
Never hand off mid-mitigation without overlap — context transfer needs conversation, not documents.
## Practical workflow

1. **Design rotations.** Length (1–2 weeks typical), primary/secondary layers, shadow period for newcomers, fairness tracking, and maximum consecutive rotations.
2. **Create the handoff template.** Open incidents → recent changes/deploys → known issues/watch items → pending follow-ups → upcoming risks (maintenance, launches) → personal notes. Written in a shared doc, reviewed live.
3. **Build runbooks.** Per service/alert type: symptoms, diagnosis steps, common fixes, escalation criteria, and contacts. Link from alerts. Keep each runbook to one page of actionable steps.
4. **Run handoffs.** Scheduled meeting or async doc review at each rotation change. Outgoing briefs incoming; incoming asks questions. Both sign off.
5. **Maintain.** After each significant page: runbook accuracy check. Quarterly: rotation fairness review, runbook audit, handoff process retro.
6. **Measure sustainability.** Pages per person per week, % after-hours, repeat pages (same alert twice = fix the alert or the system), handoff quality feedback, and on-call satisfaction surveys.

**Handoff template:** Date/outgoing/incoming → Open incidents (status, next step) → Recent deploys (what changed, risk) → Watch items (fragile systems) → Pending follow-ups → Upcoming events → Notes/questions.


**Weekly handoff ritual (15 min):** outgoing shares handoff doc → walk through active items → incoming asks questions → confirm paging setup (test page) → update rotation calendar → outgoing truly disconnects.
The "truly disconnects" part matters — hovering ex-on-call undermines the rotation.
**Game days.** Monthly simulated incidents: inject failures in staging → new on-call responds with veteran observing → debrief on runbook gaps.
Game days build muscle memory; the first real incident should not be the first practice.
## Common pitfalls

- **Verbal-only handoffs.** "You're up, good luck." Context lost; incidents dropped. Written + reviewed, always.
- **No shadow period.** Throwing new engineers into solo on-call. Shadow first, always.
- **Rotten runbooks.** Steps that don't work at 3am. Verify after every use; audit quarterly.
- **Unfair distribution.** Same senior engineers always on-call. Track and balance load.
- **Hero culture.** Celebrating all-nighters instead of fixing the paging causes. Sustainable > heroic.
- **Skipping handoffs.** "Nothing happened, no need." The quiet weeks still need the ritual — habits persist through calm.
- **No compensation.** Treating on-call as free. Compensate fairly or lose people.
- **Tribal knowledge.** Critical procedures living in someone's head. If only one person knows it, it is not a procedure — document during calm, not during incidents.
- **No handoff for quiet weeks.** Skipping handoffs when "nothing is happening." Quiet weeks still need context transfer — changes shipped, alerts tuned, risks emerging.
- **Punishing escalations.** Culture where asking for help signals weakness. Escalation is a feature — celebrate early escalations that prevented bigger incidents.
- **Assuming context.** "You know the system" handoffs. Never assume — document explicitly, verify understanding.
- **No written record.** Verbal-only handoffs. Written handoffs survive memory failures — always write it down.
