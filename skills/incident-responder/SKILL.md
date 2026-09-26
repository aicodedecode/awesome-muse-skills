---
name: incident-responder
description: Lead security incident response end to end — preparation, detection, containment, eradication, recovery, and lessons learned.
category: security
---

## Overview

Incident response is what happens when prevention fails: a structured effort to understand what happened, stop the bleeding, remove the attacker, restore service safely, and learn. The classic lifecycle is **Prepare → Detect & Analyze → Contain → Eradicate → Recover → Lessons Learned** (NIST SP 800-61). Discipline matters more than speed — rushed containment without understanding scope just moves the attacker.

This skill is a field guide for running that lifecycle, from the first alert to the post-incident review.

Incident response is a team sport played under time pressure with incomplete information — which is why the plan, roles, and relationships must exist before the incident. The organizations that respond well are not the ones with the best tools but the ones that practiced the boring parts: call trees, severity calls, evidence handling, and executive communication.

## When to use

- A confirmed or suspected compromise: malware, intruder activity, data breach indicators.
- Ransomware, business email compromise, credential theft, insider incidents.
- Building or testing the IR plan before you need it (tabletops).
- Deciding severity, invoking the war room, and communicating under pressure.

## Core concepts

- **Incident vs event:** an event is observable; an incident is an event with adverse impact or high likelihood of it. Classify early using a fixed severity matrix.
- **Containment vs eradication:** containment stops spread (isolate, block); eradication removes the cause (kill persistence, rotate creds). Doing eradication before full scoping lets the attacker re-enter through the door you missed.
- **Order of volatility:** capture memory, network state, and logs before disk images — volatile evidence disappears first.
- **Chain of custody:** every piece of evidence needs who collected it, when, how, and where it is stored. Sloppy custody kills legal options later.
- **Communication discipline:** one spokesperson, pre-approved templates, need-to-know updates. Loose talk creates liability and tips off attackers.
- **War-room roles:** incident commander, scribe, comms lead, technical leads. Decide in advance; do not improvise under fire.

- **Parallel workstreams.** Technical investigation, communications, legal, and customer notification run concurrently with a shared sync cadence — not sequentially after 'we figure out what happened.'
- **Decision logs.** Record key decisions with rationale and timestamp (e.g., 'kept the service up despite active intrusion because...'). They protect responders and inform the review.
- **Pre-authorized containment.** Define in advance which actions (isolate host, disable account, block IP) responders may take without waiting for approval chains.

## Practical workflow

1. **Prepare (before anything happens):** IR plan with severity matrix, escalation paths, and contact lists; pre-authorized containment actions; logging that actually captures what you will need; tabletop exercises twice a year.
2. **Detect & analyze:** validate the signal, open the incident ticket, assign severity, stand up the war room for P1/P2. Build the timeline: first indicator, entry point, affected assets, data touched.
3. **Contain:** short-term (isolate hosts, disable accounts, block C2 at the perimeter) then long-term (network segmentation, credential resets) — with change-control records for every action.
4. **Eradicate:** remove malware/persistence, close the exploited vector (patch, config fix), rotate all potentially exposed credentials and tokens. Verify with fresh scans, not assumptions.
5. **Recover:** restore from known-good backups, bring systems up in priority order, and *monitor intensely* — the highest-risk window is right after recovery.
6. **Lessons learned (within 1–2 weeks):** blameless review — timeline, what worked, what failed, root causes (use "5 whys"), action items with owners and dates. Feed findings into detection, hardening, and the IR plan itself.

### Severity matrix (example — adapt to your org)

- **P1 Critical:** active data breach, ransomware in progress, compromise of core infrastructure. War room, exec + legal notified immediately.
- **P2 High:** confirmed compromise contained to limited scope, or high-likelihood imminent threat.
- **P3 Medium:** malware blocked at endpoint, phishing with no credential loss, suspicious activity under investigation.
- **P4 Low:** blocked attempts, policy violations, informational.

### First-hour checklist

- [ ] Incident declared, severity assigned, commander named
- [ ] Ticket opened; scribe logging all actions/decisions with timestamps
- [ ] Scope estimate started (affected hosts/users/data)
- [ ] Volatile evidence capture initiated before remediation
- [ ] Legal/privacy/comms looped in per matrix (breach-notification clocks may be running)
- [ ] Containment actions authorized and recorded

### Sustaining the practice

- Tabletop twice a year minimum, with executives in at least one
- Keep the call tree and contact list tested quarterly — stale contacts fail at 2 AM
- Review and update the IR plan after every real incident and exercise
- Maintain retainer or on-call relationships with external IR before you need them

### Metrics that prove it works

- MTTR by severity, trended quarterly
- % of P1/P2 incidents with a completed lessons-learned review within 2 weeks
- Action-item closure rate from post-incident reviews
- Tabletop exercise frequency and participant coverage

## Common pitfalls

- **No plan until the incident.** Writing the IR plan during the incident is the incident. Tabletop it beforehand.
- **Eradicating before scoping.** Wiping the one host you found while the attacker persists elsewhere guarantees a sequel.
- **Forgetting the notification clock.** Breach-notification laws (GDPR 72h, sector rules) start ticking early — involve legal at P1/P2 immediately.
- **Poor evidence handling.** Reimaging before capture, or undocumented handling, destroys forensic and legal value.
- **Skipping the post-incident review.** The most expensive lesson is the one you refuse to learn twice. Track action items to closure.
- **Blame culture.** Blameless reviews get honest timelines; blame gets cover-ups and repeat incidents.
- **Declaring "all clear" without a monitoring tail.** The post-recovery window is prime time for attacker re-entry. Keep heightened monitoring for days, not hours.
- **Forgetting the customer-communication track.** Breach notification prep (draft holding statements, legal review) should run parallel to technical response, not start after it.
- **Letting the war room become permanent.** Extended incidents need shift rotations with formal handovers — exhausted responders make bad containment calls.
- **Announcing attribution early.** Public or internal attribution claims before forensics completes create retraction risk. Report facts; attribute cautiously and late.
