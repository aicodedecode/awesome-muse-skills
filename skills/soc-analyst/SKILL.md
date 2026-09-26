---
name: soc-analyst
description: Run security operations center workflows — alert triage, investigation, escalation, and shift handover for detection and response.
category: security
---

## Overview

A SOC analyst turns the firehose of security telemetry into decisions: is this alert real, what is its scope, and what happens next? The work is triage under time pressure — distinguishing true positives from noise, containing what matters, and escalating with clean evidence. Good SOC work is a disciplined workflow, not heroics.

This skill covers alert triage, investigation method, severity classification, escalation, and the hygiene (runbooks, tuning, handover) that keeps a SOC effective instead of drowning.

The SOC is the organization's nervous system — it does not prevent every injury, but it determines how fast the body reacts. Analyst quality compounds: every well-investigated alert improves the runbook, every tuning ticket reduces tomorrow's noise, and every clean escalation builds IR trust. Protect analyst time for investigation, not just queue-clearing.

## When to use

- Triaging SIEM/EDR/IDS alerts and deciding true vs false positive.
- Investigating a suspicious host, user, or network pattern end to end.
- Building or improving detection runbooks and alert tuning.
- Handling shift handover so nothing in flight gets dropped.
- Measuring and improving SOC performance (MTTD, MTTR, false-positive rate).

## Core concepts

- **The triage question:** "Is there evidence of malicious activity, and if so, what is the blast radius?" Everything else is detail.
- **Alert severity vs incident severity:** an alert is a signal; an incident is a confirmed event with impact. Do not declare incidents from single alerts.
- **Kill chain / ATT&CK mapping:** map observed activity to tactics (initial access → execution → persistence → exfil → impact). It tells you what to look for next and what the attacker still needs.
- **Blast radius first:** before deep forensics, bound the scope — which hosts, users, data. Containment decisions need scope, not perfect attribution.
- **Evidence preservation:** note timestamps, capture volatile data early, avoid destructive actions on the affected host until forensics is consulted.
- **Runbooks:** every high-volume alert type gets a written triage path. Analysts follow the runbook; the runbook gets improved from analyst feedback.

- **Analyst tiers with clear escalation.** L1 triages against runbooks, L2 investigates deeply, L3 hunts and engineers detections. Blurred tiers mean everything lands on whoever is most senior and available.
- **Threat intel with context.** IOC feeds are noise without relevance filtering — prioritize intel matching your industry, geography, and technology stack.
- **Shift-left feedback.** Analysts should have a direct, fast path to detection engineers — the people closest to the alerts know best what is broken.

## Practical workflow

1. **Triage the queue:** sort by severity and asset criticality. For each alert: check the runbook, validate the signal (is the source reliable? is the asset real?), and disposition within the SLA — true positive, false positive, or benign-true (real activity, not malicious).
2. **Investigate true positives:** pivot on indicators — user, host, process tree, network connections, auth logs. Build a timeline. Ask: first observed, how it got in, what it touched, whether it persists, whether data left.
3. **Scope and classify:** determine affected hosts/users/data; classify severity (use a fixed rubric: e.g., confirmed compromise of a production host = P1). Map to ATT&CK for the handover.
4. **Contain (with approval):** isolate host, disable account, block indicator — per playbook authority levels. Record every containment action with a timestamp.
5. **Escalate cleanly:** incident ticket with summary, timeline, scope, evidence links, actions taken, and open questions. Page incident response per the escalation matrix; do not freelance beyond your authority.
6. **Tune and hand over:** false positives get a tuning ticket (not silent dismissal); shift handover lists in-flight investigations, their state, and next steps. Update the runbook with what you learned.

### Triage checklist (per alert)

- [ ] Alert source and fidelity known; runbook exists
- [ ] Asset/user verified real and in scope
- [ ] Corroborating evidence checked (2+ sources before "true positive")
- [ ] Timeline started; first/last seen noted
- [ ] Blast radius estimated before containment
- [ ] Disposition + rationale logged; tuning ticket filed if FP

### Sustaining the practice

- Review the top-10 noisiest rules monthly; tune or justify each
- Run quarterly purple-team or adversary-emulation validations of key detections
- Rotate analysts through threat-intel and detection-engineering stints to build skill
- Track analyst retention and burnout signals — turnover destroys institutional knowledge

### Metrics that prove it works

- MTTD and MTTR, trended monthly by severity
- False-positive rate per detection rule (tune the worst offenders first)
- % of alerts triaged within SLA; escalation accuracy (incidents confirmed / escalations)
- Analyst feedback loop: tuning tickets filed and closed per quarter

## Common pitfalls

- **Alert fatigue → click-through triage.** If analysts close alerts without investigation, the SOC is a checkbox. Tune noisy rules; measure FP rate per rule.
- **Declaring incidents too early (or too late).** Single uncorroborated alert ≠ incident; confirmed lateral movement you sat on for a shift = breach of duty. Use the rubric.
- **Forensics-destroying "help."** Rebooting, reimaging, or running AV sweeps before evidence capture can destroy the timeline. Contain first, preserve second, remediate third.
- **No blast-radius estimate.** Deep-diving one host while the attacker moves laterally elsewhere. Scope early, scope wide.
- **Silent false positives.** Every FP dismissed without a tuning ticket returns next week. The tuning backlog is a SOC health metric.
- **Bad handovers.** "Watch the queue" is not a handover. State, next steps, and watch items — written, every shift.
- **Working the queue oldest-first.** Triage by severity × asset criticality, not arrival order — a P1 aging while you clear informational alerts is a process failure.
- **Not recording benign-true dispositions.** "Real activity, not malicious" is tuning gold. Log it or the same alert returns forever.
- **Treating every alert as equal effort.** A 5-minute runbook triage and a 4-hour investigation are different work items. Staff and SLA them differently.
- **Knowledge trapped in chat.** Investigation findings shared only in chat threads are lost to the next shift. Conclusions belong in the ticket and the runbook.
