---
name: opsgenie-pro
description: Run Opsgenie for alerting and on-call — integrations, routing rules, schedules, and incident collaboration.
category: enterprise-communication
---

## Overview

Opsgenie (Atlassian's alerting and on-call platform) centralizes alerts and routes them to the right responders. This skill covers operating it effectively: team and schedule setup, integration and routing design, alert policies, incident collaboration, and on-call analytics — as transferable on-call practices with Opsgenie as the reference.


Opsgenie is Atlassian's incident response platform: alerting, on-call scheduling, and incident coordination integrated with Jira and the Atlassian suite.
Mastery covers alert routing, escalation design, and the integrations that make Opsgenie the connective tissue of incident response.
## When to use

- Setting up Opsgenie teams and rotations
- Designing alert routing rules
- Integrating monitoring tools
- Reducing alert noise
- Running incidents with responder collaboration
- Measuring on-call load

- Setting up on-call rotations in Opsgenie
- Routing alerts from monitoring tools
- Coordinating incident response with Jira
- Reducing alert noise and fatigue
## Core concepts

**Teams and ownership.** Teams own services and their alerts: define team membership, roles, and responsibilities clearly. Routing rules direct alerts to teams based on source, tags, or content. Clear ownership eliminates "not my alert" delays.

**Schedules and rotations.** Rotation types (weekly, daily, custom), participants, time restrictions, and overrides. Forwarding rules for personal preferences. Keep schedules accurate — stale rotations page the wrong people at 3am.

**Integrations.** Monitoring, ticketing (Jira), chat (Slack/Teams), and custom webhooks. Per integration: field mapping, alert creation rules, and bidirectional sync (acknowledge in chat → reflected in Opsgenie). Test integrations before relying on them.

**Alert policies.** Routing, suppression (duplicate/flapping), auto-close on recovery, and delay policies. Policies are the noise filter — invest in them. Untagged, unfiltered alert streams destroy on-call morale.

**Escalations.** Rules per team: escalate if unacknowledged in X minutes, escalate to next rotation layer, then to managers. Schedule-based vs. rule-based escalations. Escalation chains should be short and tested — long chains delay response.

**Incident collaboration.** Incident creation from alerts, responder management, timeline notes, conference bridges, stakeholder updates, and post-incident reports. Centralized incident context prevents scattered war rooms.


**Alert lifecycle.** Created → acknowledged → closed (or snoozed/escalated).
Every alert needs: clear description, priority, source, tags, and runbook link.
Alerts without runbooks are just noise with extra steps — link or do not alert.
**Routing rules.** Match alerts to teams by: source system, tags, time of day, and alert content.
Route precisely — misrouted alerts delay response and erode trust in the system.
Review routing monthly; team structures change faster than routing rules.
**Escalation policies.** Time-based escalation chains with round-robin or load-balanced routing.
Design for the 3am scenario: the right person paged, with context, within minutes.
Test escalations quarterly — policies rot as teams change.
**Jira integration.** Auto-create Jira issues from alerts, link incidents to postmortems, and track follow-up actions.
The alert-to-action loop closes in Jira — integration turns incidents into improvements.
## Practical workflow

1. **Structure teams.** Define teams aligned to service ownership, set up memberships and roles, and document who's responsible for what.
2. **Build schedules.** Rotations per team, overrides process, forwarding rules, and coverage verification (no gaps, fair distribution).
3. **Integrate sources.** Connect monitoring with alert-creation rules: severity mapping, tagging for routing, and suppression of known noise. Validate with test alerts.
4. **Design policies.** Routing rules (source/tag → team), escalation rules (timeouts per layer), suppression (dups, flapping), and auto-close conditions. Document the policy logic.
5. **Run incidents.** Alert → acknowledge → collaborate (timeline, bridge, responders) → resolve → post-incident review. Use the timeline religiously — it's the record.
6. **Analyze and tune.** Alert volume per team/person, ack/resolve times, after-hours load, escalation frequency. Monthly tuning: suppress noise, fix flaky alerts, rebalance load.

**Alert policy checklist:** routing correct? → severity mapped? → duplicates suppressed? → flapping handled? → auto-close configured? → escalation tested? → runbook linked?


**Setup sequence:** define teams and rotations → configure integrations (monitoring sources) → build routing rules → design escalation policies → create alert templates → link runbooks → test end-to-end (fire test alerts) → train teams → go live with hypercare.
Test with real pages before going live — untested paging fails when it matters.
**Noise reduction program:** weekly alert review (actionable? correctly routed? timely?) → tune thresholds → deduplicate and correlate → suppress known-noise → track alerts per person per week.
Target: every alert deserves a human. Anything less is noise to eliminate.
## Common pitfalls

- **Unfiltered integrations.** Every monitoring blip becomes an alert. Filter at the integration level.
- **Vague ownership.** Alerts routed to "the team" with no clear responder. Named rotations, always.
- **Stale schedules.** People paged who left the team. Audit membership quarterly.
- **No suppression.** Duplicate storms during outages. Dedup and group aggressively.
- **Escalation theater.** Chains so long nobody responds in time. Short, tested chains.
- **Ignoring analytics.** Alert volume creeping up unnoticed. Review monthly; tune continuously.
- **Skipping post-incidents.** Resolving without learning. Reports with action items for significant incidents.
- **Alert fatigue.** Hundreds of unactionable alerts. Engineers stop responding — then miss the real one. Ruthless tuning is safety work.
- **No rotation hygiene.** Stale rotations paging people who left. Audit rotations monthly; tie to HRIS if possible.
- **Missing runbooks.** Alerts without response procedures. Every alert links to a runbook or gets deleted — no exceptions.
- **Overlapping tools.** Opsgenie + PagerDuty + Slack alerts creating confusion. One alerting system of record; others notify, not page.
