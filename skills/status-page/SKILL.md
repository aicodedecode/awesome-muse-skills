---
name: status-page
description: Build and maintain status pages — incident communication, uptime transparency, and subscriber notifications.
category: enterprise-communication
---

## Overview

A status page is the single source of truth during incidents and the proof of reliability the rest of the time: system status, incident history, uptime metrics, and maintenance schedules. This skill covers status page strategy, incident communication, transparency practices, and subscriber management.


A status page is your trust infrastructure during incidents: the single source of truth customers check instead of flooding support. Companies with excellent status pages turn outages from trust-destroying events into trust-building ones through fast, honest, human communication. It is also proactive transparency — historical uptime data that sells reliability before sales calls happen.
## When to use

- Setting up a status page
- Writing incident updates
- Deciding what to show publicly
- Building uptime transparency
- Managing maintenance communications
- Reducing "is it down?" support tickets

- Communicating outages and maintenance
- Publishing uptime history for enterprise buyers
- Reducing support load during incidents
- Designing status page branding and UX
- Automating status updates from monitoring
- Using status pages for SLA reporting
## Core concepts

**Components and granularity.** Break status into meaningful components (API, web app, mobile, integrations) — "all systems operational" for a monolith hides partial outages. Granular enough to be truthful, simple enough to scan.

**Incident lifecycle.** Investigating → identified → monitoring → resolved. Update at each transition, plus regular cadence during long incidents (every 30–60 min even if "still investigating" — silence breeds speculation). Postmortems linked after resolution.

**Update writing.** Timestamped, plain language, specific: what's affected, who's affected, what you're doing, when the next update comes. Avoid: "some users" (say who), "shortly" (give times), jargon. Honesty about uncertainty ("we don't yet know the cause") beats false confidence.

**Transparency.** Publish real uptime (including the bad months), keep incident history public (deleting history destroys credibility), and distinguish partial vs. full outages. Transparency during incidents builds more trust than 100% uptime claims.

**Maintenance windows.** Announced in advance (days, not hours), with: what's changing, expected impact, duration window, and rollback plan. Update when starting/ending. Users forgive planned downtime communicated well; they don't forgive surprises.

**Subscriptions.** Let users subscribe per component via email, SMS, webhook, or RSS. Targeted subscriptions (only alert me about the API) reduce noise and increase trust in the alerts.


**Component architecture.** Break services into customer-meaningful components (API, dashboard, mobile sync, webhooks) rather than internal microservices. Each component gets independent status — partial outages are the norm, and accurate component status prevents "everything is down" panic when one service degrades. Keep the component list stable; churning it confuses historical comparisons.

**Honesty calibration.** Status pages must reflect reality: marking degraded performance as "operational" destroys credibility when customers feel the pain. Use four states honestly (operational, degraded, partial outage, major outage) and update within 5–15 minutes of detection. The short-term discomfort of honesty buys long-term trust that marketing cannot.

**Automation vs. human judgment.** Automate detection-triggered draft updates (monitoring flips component to investigating), but keep humans writing the narrative. Automated "we're investigating" in 2 minutes + human detail in 15 beats either alone.

**Automation architecture.** Monitoring alerts → incident creation → draft status updates → human approval → published updates → subscriber notifications.
Automate detection and drafting; keep humans on messaging.
False positives erode trust — tune automation thresholds carefully.
**Subscriber management.** Per-component subscriptions, multiple channels (email, SMS, webhook, RSS), and preference controls.
Make subscribing frictionless — prominent links in app, docs, and support.
Subscription growth is a trust metric; promote it.
**Historical transparency.** 90-day uptime history, incident archives with postmortems, and honest SLA reporting.
Prospects check status pages during evaluations — transparency sells reliability.
Never delete incident history; it destroys credibility instantly.
## Practical workflow

1. **Design the page.** Components (mapped to real architecture), metrics to display (uptime %, response times), incident history, maintenance calendar, and subscription options. Brand it — it's a trust asset.
2. **Define severity levels.** Criteria per level (e.g., SEV1: full outage; SEV2: major degradation; SEV3: minor), who declares, and what each triggers (page update within X minutes, who writes, notification blast or not).
3. **Write the runbook.** Incident communication steps: acknowledge within 15 min → updates every 30–60 min → resolution notice → postmortem within 5 days. Templates for each stage. Assign the comms role in every incident (separate from the fixers).
4. **Operate during incidents.** Post fast (even "investigating"), update regularly, be specific, give next-update times and keep them. One voice — the comms lead, not five engineers posting.
5. **Follow through.** Postmortems published (blameless, with action items), incident history maintained, and process improvements from communication gaps.
6. **Maintain.** Quarterly: component accuracy review, subscription health, template updates, and a drill (does everyone know the process?).

**Incident update template:** [Time] Status: Investigating/Identified/Monitoring/Resolved → What's happening (plain language) → Who's affected → What we're doing → Next update at [time] → Workarounds (if any).


**Incident update cadence:** initial post within 15 min of confirmed impact (what is affected, what we know, next update time) → updates every 30–60 min even if "still investigating" (silence breeds speculation) → resolution post (what happened, what we fixed) → postmortem link within 5 business days. Stale status pages ("investigating" for 6 hours) are worse than none.

**Maintenance communication:** announce 7+ days ahead (what, when, expected impact, rollback plan) → reminder 24h before → live updates during → all-clear after with verification. Allow subscriptions per component — users care about what affects them, not your full infrastructure.

**Provider selection:** evaluate uptime (ironic but critical), customization, automation integrations, subscriber options, and pricing.
Host separately from your infrastructure — status pages must survive your outages.
Test failover; a down status page during an outage is a special embarrassment.
**Maintenance workflow:** schedule → announce (7 days) → remind (24h) → execute with live updates → verify → all-clear → retrospective.
Communicate expected impact honestly; surprise downtime destroys trust.
## Common pitfalls

- **Slow first update.** 45 minutes of silence while Twitter explodes. Acknowledge within 15 minutes, even with little information.
- **Vague updates.** "We're experiencing issues." Say what's down, who's affected, what you're doing.
- **Deleting history.** Scrubbing bad incidents. Permanent credibility damage when discovered (and it will be).
- **All-green theater.** Marking degraded systems operational to protect metrics. Users notice; trust evaporates.
- **No postmortems.** Resolving without explaining. Postmortems close the loop and demonstrate learning.
- **Over-alerting subscribers.** Blasting all subscribers for minor issues. Severity-gated notifications.
- **Comms as afterthought.** Engineers fixing while nobody communicates. Dedicated comms role in every incident.
- **Green-washing the status page.** Perpetual 100% uptime claims nobody believes. Honest history with explained incidents builds more trust than fake perfection.
- **Slow first updates.** Taking an hour to acknowledge. The first 15 minutes define the narrative — post early, refine later.
- **No subscription options.** Forcing users to manually check. Email/SMS/webhook subscriptions turn the status page into a proactive channel.
- **Manual-only updates.** Relying on humans to notice and post. Automation catches what tired humans miss at 3am.
- **Overly technical language.** "Database failover in us-east-1" means nothing to most customers. Translate: what is affected, what to expect, when resolved.
