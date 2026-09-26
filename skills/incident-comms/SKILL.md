---
name: incident-comms
description: Communicate during incidents — stakeholder updates, severity frameworks, war-room comms, and post-incident reviews.
category: enterprise-communication
---

## Overview

When systems fail, communication determines whether an incident is a blip or a crisis. This skill covers incident communications: severity frameworks, stakeholder update cadences, war-room communication discipline, customer messaging, executive briefings, and blameless post-incident reviews.


Incident communication is crisis communication at operational speed: telling affected customers what is happening, what you are doing, and when they will hear more — while the incident is still unfolding. Done well, it preserves trust through the worst moments; done poorly, it amplifies every failure. This is a rehearsed discipline, not improvisation.
## When to use

- Defining incident severity levels
- Communicating during an active outage
- Briefing executives during incidents
- Writing customer-facing incident updates
- Running post-incident reviews
- Improving incident response processes

- Major outages affecting customers
- Security incidents requiring disclosure
- Data-impacting bugs needing proactive outreach
- Coordinating communication across multiple incident teams
- Communicating to enterprise customers with SLAs
- Handling media inquiries during major incidents
## Core concepts

**Severity framework.** SEV1 (critical: major outage, all hands), SEV2 (major: significant degradation), SEV3 (minor: limited impact), SEV4 (cosmetic/low). Each level defines: who responds, response time SLA, communication cadence, and who gets notified. Clear criteria prevent both under- and over-escalation.

**Comms roles.** Incident Commander (decisions, coordination), Comms Lead (all external/internal updates — not the person fixing), Scribe (timeline log). Separating comms from fixing ensures updates happen while engineers work.

**Update cadence.** SEV1: every 15–30 min; SEV2: every 30–60 min; SEV3: hourly or at transitions. Cadence is a promise — set it, keep it. "No update yet, next at 14:30" counts as an update.

**Stakeholder tiers.** Customers (status page, in-app), internal teams (dedicated channel), executives (brief summaries: impact, ETA, actions — not technical deep-dives), and support (talking points + macros before customers ask). Tailor detail per audience.

**War-room discipline.** One channel for coordination, decisions logged, no side-channel decisions, time-boxed debugging (avoid rabbit holes — set check-ins), and explicit "all clear" declarations. Chaos in the war room leaks into customer comms.

**Blameless postmortems.** What happened (timeline), impact, root causes (usually systemic, not individual), what went well, what didn't, and action items with owners and dates. Blameless isn't "no accountability" — it's accountability for systems, not scapegoating people.


**The incident comms triangle.** Three audiences, three messages: affected customers (what is happening to me, what to do, when next update), internal teams (technical detail, coordination needs, customer impact scope), executives (business impact, ETA, reputational risk). One person drafts all three from the same facts — consistency across audiences prevents leaks and contradictions.

**Severity-driven playbooks.** SEV-1 (critical): war room + status page + proactive customer outreach + executive briefing within 30 min. SEV-2 (major): status page + support enablement. SEV-3 (minor): status page note. Pre-written templates for each level mean communicators fill in facts instead of composing under pressure.

**Blameless language.** "We" not "they," systems not individuals, facts not speculation. Never promise ETAs you cannot keep — "next update in 30 minutes" is a promise you can keep; "fixed by 3pm" usually is not. Under-promise on timing, over-deliver on update frequency.

**Stakeholder mapping.** Tier 1: directly affected customers (proactive outreach) → tier 2: all customers (status page) → tier 3: internal teams (coordination channel) → tier 4: executives and board (business impact briefs) → tier 5: media/regulators (if SEV-1 with broad impact).
Pre-build contact lists and templates per tier — assembling them mid-incident wastes critical minutes.
**Message discipline.** One voice (single comms lead), one channel of record (status page), consistent facts across all tiers.
Draft internally, publish externally — never compose customer-facing updates in public threads.
Version-control major updates; confusion about "what did we say when" compounds incidents.
**Regulatory and contractual triggers.** Know in advance: which customers have contractual notification SLAs, which regulators require breach notification (and timelines: GDPR 72 hours), and who approves legal-sensitive language.
Discovering these mid-incident causes dangerous delays — document them in the playbook.
## Practical workflow

1. **Declare and assess.** Severity assignment, page the right people, open the incident channel, assign IC/Comms/Scribe. First 5 minutes set the tone.
2. **Communicate early.** Internal channel notice, status page update ("investigating"), support talking points, executive ping for SEV1/2. Speed over completeness — "we're on it" beats silence.
3. **Maintain cadence.** Updates at the promised intervals: current status, impact, actions in progress, next update time. Comms Lead drives this; IC feeds facts.
4. **Coordinate resolution.** War-room discipline, stakeholder management (execs get summaries on schedule, not play-by-play), customer updates at transitions. Declare resolution explicitly — don't let incidents fade out.
5. **Close out.** Final "resolved" communications, monitoring period, preliminary timeline. Thank responders.
6. **Review blamelessly.** Postmortem within 5 business days: timeline, impact quantification, root cause analysis (5 whys), action items with owners/dates, and communication effectiveness review. Share learnings org-wide.

**Executive update format:** Impact (who/what affected, since when) → Current status (one line) → Actions (what's being done) → ETA (or next update time) → Customer comms status → Needs (anything from leadership).


**First-30-minutes checklist:** confirm impact scope (who is affected, how badly) → declare severity → activate playbook → post initial status (facts only, no speculation) → notify internal stakeholders → brief support with talking points and macros → set update cadence timer. Assign a dedicated comms lead — the incident commander fights the fire; comms tells the story.

**Post-incident:** public postmortem within 5 business days (timeline, root cause, what we are changing) → direct outreach to most-affected customers → internal retrospective (blameless) → comms retrospective (what worked in our messaging?) → update playbooks with learnings. The postmortem is where trust is rebuilt — write it for customers, not engineers.

**Comms runbook per severity:** SEV-1: war-room channel + status page in 15 min + tier-1 customer calls + exec brief in 30 min + media holding statement ready.
SEV-2: status page + support enablement + tier-2 notifications.
SEV-3: status page note + internal awareness.
Rehearse quarterly with tabletop exercises — muscle memory matters at 3am.
**Status update formula:** what is happening (plain language) → who is affected → what we are doing → what you should do (if anything) → when the next update comes.
Five elements, every update, no exceptions. Consistency under pressure is the skill.
## Common pitfalls

- **Silent incidents.** Engineers fixing while nobody tells anyone. Comms starts at declaration, not resolution.
- **No severity framework.** Everything is "urgent" or nothing is. Define levels and follow them.
- **Comms person also fixing.** Updates stop when debugging gets intense. Separate the roles.
- **Overpromising ETAs.** "Fixed in 10 minutes" (it's not). Give ranges, update honestly, never guess silently.
- **Blameful reviews.** "Who broke it?" Postmortems that punish produce cover-ups, not learning.
- **Fading out.** Incident "resolves" with no all-clear. Declare resolution explicitly, every time.
- **Skipping the retro.** Moving on without learning. The postmortem is where incidents pay for themselves.
- **Executive surprise.** Leadership learning about SEV1 from customers. Notify up the chain immediately.
- **Speculating publicly.** Guessing at causes or ETAs. Wrong guesses destroy more trust than the outage itself — state what you know and when you will know more.
- **Internal-external inconsistency.** Support saying one thing, status page another. Single source of truth, single drafter.
- **Going dark.** Stopping updates because "nothing new." "Still working on it, next update at :30" maintains trust; silence invites the worst assumptions.
- **Legal bottlenecks.** Waiting for legal review on every update. Pre-approve template language with legal in advance; reserve review for genuinely sensitive disclosures.
- **Forgetting internal audiences.** Support and sales blindsided by customer questions. Internal briefing precedes or parallels external posting — always.
