---
name: siem-engineer
description: Engineer SIEM platforms — log onboarding, parsing, detection content, correlation, and performance tuning.
category: security
---

## Overview

A SIEM (Security Information and Event Management) is the SOC's central nervous system: it collects logs from across the estate, normalizes them, and turns them into detections, investigations, and compliance evidence. But a SIEM is only as good as its engineering — log sources onboarded deliberately, parsing that preserves meaning, and detection content mapped to real threats. An unengineered SIEM is an expensive log pile.

This skill covers SIEM engineering as a discipline: source onboarding, normalization, detection-as-code, use-case development, and the performance tuning that keeps queries fast and costs sane.

Start with the questions the SIEM must answer, not the logs you can collect: which threats must we detect, which investigations must we support, which compliance reports must we produce. Every log source should map to at least one of those — onboarding without a use case is how SIEMs become unsearchable and unaffordable.

## When to use

- Deploying or re-architecting a SIEM (cloud or on-prem).
- Onboarding new log sources with proper parsing and field mapping.
- Developing detection use cases mapped to MITRE ATT&CK.
- Tuning performance: slow queries, ingestion costs, storage growth.
- Preparing SIEM evidence for audits and compliance reporting.

## Core concepts

- **Log sources in priority order:** identity/auth logs, EDR telemetry, firewall/proxy, cloud audit logs, DNS, email security, then application logs. Onboard by detection value, not by ease.
- **Normalization:** parse into a common schema (timestamp in UTC, user, host, action, result) — investigations spanning sources are impossible without it. Preserve the raw event too.
- **Detection-as-code:** detections versioned in git, peer-reviewed, tested against historical data for false positives, and mapped to ATT&CK. Treat them like software, because they are.
- **Use-case framework:** each detection needs a hypothesis, the data sources it requires, expected true/false positive rates, severity, and a linked runbook. No runbook, no detection.
- **Correlation over single events:** the highest-fidelity detections combine signals (impossible travel + new device + sensitive access) — single-event alerts are where false positives live.
- **Retention strategy:** hot storage for investigation (30–90 days), warm/cold for compliance and hunting (1–7 years per requirements). Retention is a cost and legal decision, not just a disk decision.
- **Health monitoring:** the SIEM must monitor itself — ingestion lag, parser failures, dropped events, and source silence. A blind SIEM is worse than none, because it pretends to see.
- **Cost control:** ingestion-based pricing punishes indiscriminate logging. Filter noise at the source, aggregate where fidelity allows, and charge back heavy sources to owners.

- **Event volume baselining.** Know normal EPS per source so anomalies (a 10x spike, or sudden silence) trigger investigation — volume changes are themselves detections.
- **Field extraction standards.** Define naming conventions for custom fields up front; inconsistent field names across parsers break every correlation and dashboard built later.

## Practical workflow

1. **Define use cases first:** list the top 20 detections and investigations the SIEM must support, mapped to your threat model. This drives source priority.
2. **Onboard sources deliberately:** per source — enable the right audit levels, verify time sync (NTP everywhere), build/test parsing, validate field mapping with sample events, and confirm volume expectations.
3. **Build detection content:** implement the use cases as detection-as-code; test each against 30 days of history for FP rate; deploy in alert mode only when the FP rate is acceptable; link runbooks.
4. **Tune continuously:** weekly review of top false positives; monthly use-case efficacy review (did it fire? was it actioned?); quarterly ATT&CK coverage mapping.
5. **Engineer performance:** optimize slow queries (time bounds, indexed fields, summary indexes); manage retention tiers; monitor ingestion lag and pipeline health with alerts.
6. **Prove value:** report detections fired and true-positive rate, investigations supported, MTTD contribution, and compliance reports delivered — the SIEM's budget defense.

### Sustaining the practice

- Review detection coverage against ATT&CK quarterly; fill gaps by threat priority
- Audit log-source health weekly — silent sources are failed controls
- Re-validate parsing after every source upgrade or format change
- Benchmark query performance monthly; optimize the slowest 10

### Keeping detections honest

- Every detection gets a documented expected FP rate and a review date
- Detections that have never fired in 12 months get reviewed: broken, or threat absent?
- Maintain a detection backlog prioritized by threat intel, not by requester volume
- Correlate detection coverage with purple-team and red-team results

### Metrics that prove it works

- Log-source onboarding coverage vs plan, with health SLAs
- Detection true-positive rate and analyst action rate per use case
- Mean time from log generation to searchable (ingestion lag)
- Query performance (p95 investigation query time) and cost per GB trends

## Common pitfalls

- **Onboarding everything.** Indiscriminate logging explodes cost and buries signal. Every source needs a use case and an owner.
- **Parsing that destroys meaning.** Regex parsers that drop fields or misinterpret timestamps corrupt every downstream detection. Test parsing with real samples.
- **Detections without runbooks.** An alert the analyst cannot triage is noise with extra steps. No runbook, no detection — enforce it.
- **Ignoring time sync.** Unsynced clocks across sources make correlation impossible. NTP everywhere is a SIEM prerequisite, not a nice-to-have.
- **No pipeline monitoring.** Parser failures and dropped events go unnoticed for months. Monitor the monitoring.
- **Vanity dashboards.** Pretty dashboards nobody uses during investigations are decoration. Build for the analyst workflow, validate with analysts.
- **Retention as an afterthought.** Discovering during an investigation that the logs you need aged out last month. Define retention by requirement up front.
- **Treating the SIEM as the SOC.** The SIEM is an instrument; analysts, runbooks, and tuning are the capability. Budget for the people, not just the platform.
- **Single points of ingestion failure.** One forwarder or one pipeline without redundancy means silent blindness during outages. Build redundant paths for critical sources.
- **Forgetting the cloud control plane.** Cloud audit logs (management-plane activity) are often the highest-value source and the last onboarded. Prioritize them early.
