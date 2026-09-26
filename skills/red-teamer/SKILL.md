---
name: red-teamer
description: Plan and execute authorized red-team operations that emulate real adversaries to test detection and response, with strict scoping and safety controls.
category: security
---

## Overview

Red teaming emulates a real adversary — objectives-based, stealthy, and persistent — to answer one question: **would we detect and stop a genuine attack?** Unlike a pentest (which finds as many vulns as possible), a red team has a mission (e.g., "exfiltrate the customer database undetected") and tests the *defenders*, not just the technology.

This skill covers operation planning, rules of engagement, and reporting from the defender's perspective: how to scope, authorize, run safely, and convert results into blue-team improvements. It describes methodology at the standard published level only — no TTP details, no payloads, no tooling instructions.

The best red teams measure themselves by blue-team improvement, not by trophies. Every undetected technique should become a detection; every slow response should become a faster playbook. If the same objectives succeed the same way a year later, the operation failed regardless of how impressive the initial access was.

## When to use

- Testing whether your SOC and IR actually work against a realistic adversary.
- Validating detection coverage for specific scenarios (ransomware, BEC, insider).
- After major defensive investments, to measure improvement.
- Never without explicit written authorization, defined objectives, and safety controls. Unauthorized "red teaming" is just attacking.

## Core concepts

- **Objectives, not vulnerabilities:** the operation is built around adversary objectives (access, persistence, collection, impact). Findings are gaps in *detection and response*, not CVE lists.
- **Rules of engagement (ROE):** written, signed, and specific — targets, allowed techniques, forbidden actions (no real data exfiltration, no destructive payloads, no targeting individuals' personal accounts), time windows, and abort criteria.
- **Trusted agents and white cards:** a small control group knows the operation is happening (to prevent a real IR meltdown or physical-security incident); everyone else does not. Pre-agreed "white cards" pause the op instantly.
- **Get-out-of-jail coordination:** legal, HR, and physical security briefed in advance where relevant; on-call contacts for false-alarm deconfliction.
- **Assume-breach starting points:** red teams often start with a foothold (phished creds, insider) to test *lateral* detection rather than spending the whole op on initial access.
- **The real deliverable is detection gaps:** every red-team action maps to "did we detect it? how fast? what fired, what was missing?"

- **Crown-jewel focus.** Objectives should target what the business cannot afford to lose — customer data, payment systems, core IP — not just 'get domain admin' as an abstract trophy.
- **Realistic constraints.** Real adversaries face time, risk, and OPSEC constraints. Emulate patient, careful actors sometimes — the noisy smash-and-grab is only one profile.
- **Document the negative space.** Techniques attempted but abandoned (and why) are valuable — they show where defenses actually worked.

## Practical workflow

1. **Define objectives with leadership:** 2–4 mission objectives tied to crown jewels (e.g., "access the finance system and demonstrate data access without triggering a P1"). Get written authorization from someone who can actually authorize it.
2. **Write the ROE:** scope, allowed/forbidden techniques, data-handling rules (synthetic data only; any real PII encountered = stop and report), time windows, abort/pause procedures, emergency contacts.
3. **Plan the campaign:** phases (recon → initial access → persistence → lateral movement → objective), mapped to MITRE ATT&CK for the debrief. Build in safety checks per phase.
4. **Execute with control:** maintain a detailed op log (every action timestamped). If anything touches real customer data, production stability, or goes out of scope — stop, document, notify the control group.
5. **Hot debrief:** immediately after, walk blue through the timeline: what was done, what was detected, what was missed, detection latency per step.
6. **Report and improve:** findings framed as detection/response gaps with concrete remediation (new detection rule, log source to onboard, playbook to write). Schedule a re-test of the same objectives in 6–12 months to measure improvement.

### ROE checklist

- [ ] Written authorization from accountable executive
- [ ] Objectives, in-scope and out-of-scope targets enumerated
- [ ] Forbidden actions explicit (destructive, data exfiltration, personal targeting)
- [ ] Data-handling rules for incidentally encountered real data
- [ ] Time windows and abort/white-card procedure
- [ ] Control group and emergency contacts; legal/HR/physical-security briefed as needed

### Sustaining the practice

- Re-test the same objectives annually to measure the improvement delta
- Feed every TTP into the detection backlog with ATT&CK mapping
- Vary operator styles and tooling so blue does not overfit to one red team
- Brief executives on the improvement story, not just the breach story

### Metrics that prove it works

- Detection rate per operation phase (where did blue see you?)
- Mean time to detect per technique used
- % of objectives achieved vs detected-and-stopped
- Blue-team improvement delta on re-test of the same objectives

## Common pitfalls

- **No written authorization.** This is non-negotiable. Verbal approval does not cover anyone when something breaks.
- **Testing the tech instead of the team.** A red team that just runs vuln scans is an expensive pentest. Keep the focus on detection and response.
- **Surprising your own SOC into chaos.** Deconfliction exists so a drill does not trigger a real company-wide incident response — or worse, law enforcement.
- **Real data handling failures.** Plan for incidental PII exposure: stop, report, delete per policy. Never retain or use it.
- **No follow-through.** A red-team report that does not produce detection engineering work is entertainment, not security.
- **Ego-driven ops.** The goal is a stronger blue team, not proving red is clever. Celebrate detections as loudly as misses.
- **Reusing the same TTPs every operation.** Blue overfits to your playbook and the assessment stops measuring real adversary coverage. Vary techniques deliberately.
- **No purple-team follow-up.** Findings that become a report instead of detection-engineering tickets are theater. Schedule the purple session before the op ends.
- **Testing during critical business periods.** Blackout windows (product launches, financial close) must be respected — an op that disrupts revenue loses executive support permanently.
- **Poor OPSEC hygiene in reports.** Op logs containing real credentials or sensitive paths need the same handling as the ROE demands for data.
