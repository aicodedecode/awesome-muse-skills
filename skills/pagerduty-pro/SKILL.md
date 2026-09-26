---
name: pagerduty-pro
description: Operate PagerDuty effectively — on-call schedules, escalation policies, incident workflows, and alert hygiene.
category: enterprise-communication
---

## Overview

PagerDuty (the category-defining on-call platform) routes alerts to the right humans fast. This skill covers operating it well: service and schedule design, escalation policies, incident response workflows, alert hygiene, and analytics — written as transferable on-call platform practices with PagerDuty as the reference implementation.


PagerDuty is the industry-standard incident management platform: on-call scheduling, alert routing, incident orchestration, and response analytics.
Mastery covers the full incident lifecycle — from alert ingestion to postmortem — and the cultural practices (blameless retrospectives, sustainable on-call) that make tooling effective.
## When to use

- Setting up on-call rotations
- Designing escalation policies
- Reducing alert fatigue
- Running incidents in PagerDuty
- Analyzing on-call health metrics
- Integrating monitoring with paging

- Building incident response from scratch
- Managing on-call at scale across teams
- Integrating alerting with ChatOps workflows
- Measuring and improving incident metrics (MTTR, MTBF)
## Core concepts

**Services.** Model each service (or component) with: owning team, integrations (monitoring sources), escalation policy, alert grouping, and response plays. Good service boundaries (aligned to team ownership) make routing obvious; vague services route to everyone.

**Schedules and rotations.** Follow-the-sun for global teams, weekly rotations (the common sweet spot), overrides for swaps/time-off, and handoff hygiene (pending alerts briefed, not just "you're on"). Fair rotations sustain teams; unfair ones burn people out.

**Escalation policies.** Layered: primary on-call (5–15 min) → secondary/team lead (15–30 min) → manager → broader. Timeouts per layer, urgency levels (high = page now, low = notify only), and rules per service. Escalation is for unacknowledged alerts, not for FYIs.

**Alert grouping and suppression.** Group related alerts into one incident (per service, time-windowed), suppress flapping, and auto-resolve on recovery signals. Raw alert-to-page pipelines create fatigue; intelligent grouping preserves sanity.

**Incident workflows.** Declare → page → acknowledge → triage → mitigate → resolve → postmortem. Status updates, stakeholder notifications, conference bridges, and response plays (runbook links attached to incidents). Practice via game days.

**Analytics.** MTTA (mean time to acknowledge), MTTR (mean time to resolve), alert volume per service/person, after-hours page frequency, and escalation rates. These metrics diagnose on-call health — rising MTTA signals fatigue or misrouting.


**Service-oriented alerting.** Alerts route to services, services map to teams, teams own runbooks.
Service definitions are the foundation — vague ownership means alerts go nowhere.
Map every production component to a service with a named owner; review quarterly.
**Incident roles.** Commander (decision authority), scribe (timeline), communications (stakeholder updates), subject-matter experts (fixers).
Assign roles at incident start, not mid-crisis.
Small incidents need commander + fixers; large ones need the full structure.
**Response plays.** Pre-built workflows per incident type: who gets paged, which runbooks run, which stakeholders notify.
Plays turn chaos into procedure — build them from past incidents.
Review plays after every major incident; they encode organizational learning.
**Analytics.** MTTA (acknowledge), MTTR (resolve), alert volume per team, escalations, and postmortem action completion.
Trends matter more than absolutes — improving MTTR 20% quarterly compounds.
Share metrics transparently; they drive investment in reliability.
## Practical workflow

1. **Model services.** Inventory services, assign owners, define escalation policies per service, and set urgency rules. Align with actual team boundaries.
2. **Build schedules.** Rotation length (weekly typical), layering (primary/secondary), overrides process, follow-the-sun if global, and fair distribution tracking.
3. **Integrate monitoring.** Connect alert sources with: severity mapping (not everything pages), grouping rules, suppression for known noise, and enrichment (runbook links, dashboards, recent deploys).
4. **Define incident process.** Roles (commander, comms, scribe), communication channels, stakeholder update cadence, and postmortem requirements. Document the runbook; train the team.
5. **Fight fatigue.** Weekly: review alert volume per person, tune noisy alerts (fix or suppress), adjust thresholds, and ensure after-hours pages are truly page-worthy. Alert fatigue is a safety issue.
6. **Review metrics.** Monthly on-call health review: MTTA/MTTR trends, volume, after-hours burden, escalation patterns, and action items. Quarterly: schedule fairness and process improvements.

**On-call health dashboard:** alerts per person per week → % after-hours → MTTA/MTTR trends → escalations → unresolved postmortems → upcoming schedule gaps.


**Implementation roadmap:** inventory services and owners → configure integrations (monitoring → PagerDuty) → build escalation policies → create response plays for top 5 incident types → train teams (game days) → go live → weekly alert review → monthly incident metrics review.
Phase the rollout — big-bang incident tooling migrations fail under pressure.
**Postmortem process:** blameless template (timeline, impact, root causes, action items) → scheduled within 48h → action items tracked to completion → shared org-wide for SEV-1/2.
Postmortems without completed actions are theater — track completion ruthlessly.
## Common pitfalls

- **Everything pages.** No severity discipline. Only customer-impacting, actionable issues page; the rest notify.
- **No grouping.** 50 pages for one outage. Group by service and time window.
- **Unfair rotations.** Same people always on-call. Track and balance; burnout is a retention risk.
- **Stale schedules.** Overrides not recorded, gaps in coverage. Single source of truth, always current.
- **Missing runbooks.** Paged with no guidance. Attach runbooks to services; keep them current.
- **Skipping postmortems.** Incidents resolved, nothing learned. Blameless reviews with action items, every significant incident.
- **Ignoring analytics.** Never reviewing MTTA/MTTR/volume. Metrics reveal fatigue before resignations do.
- **Paging without context.** Alerts lacking runbooks, dashboards, or recent-change info. Enrich alerts at ingestion — context determines response speed.
- **Hero culture.** Rewarding all-night firefighting over preventing fires. Celebrate reliability improvements, not heroic recoveries.
- **Stale escalation policies.** Policies referencing reorganized teams. Quarterly audits; tie to org charts where possible.
- **Skipping postmortems for 'small' incidents.** Patterns hide in small incidents. Lightweight postmortems for SEV-3s catch systemic issues early.
