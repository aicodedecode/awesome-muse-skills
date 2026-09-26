---
name: security-auditor
description: Plan and execute security audits against controls frameworks (ISO 27001, SOC 2, NIST CSF) with evidence-based findings.
category: security
---

## Overview

A security audit is an independent, evidence-based check that security controls exist, are designed well, and actually operate. Unlike a penetration test (which attacks), an audit *verifies*: it samples configurations, interviews owners, and inspects evidence against a control framework. The output is assurance — or a precise list of where assurance is missing.

This skill covers audit planning, evidence collection, finding write-ups, and remediation tracking, oriented toward internal auditors, GRC teams, and engineering teams preparing for external audits.

Good auditors are translators: they convert control frameworks into questions engineers can answer and convert engineering reality into assurance executives can trust. The audit's value is not the finding count but the credibility of the opinion — which is earned through fair process, accurate facts, and consistent severity.

## When to use

- Preparing for ISO 27001 certification, SOC 2 Type II, or a customer security review.
- Running an internal audit of a control family (access reviews, logging, change management).
- Validating that post-incident or post-pentest remediations are actually in place.
- Assessing a vendor's or business unit's security posture before integration.

## Core concepts

- **The three lines:** operations own controls (1st), security/GRC oversees (2nd), internal audit independently assures (3rd). Know which line you are in — it sets your independence requirements.
- **Design vs operating effectiveness:** a policy that exists but nobody follows fails operating effectiveness. Test both.
- **Frameworks as control catalogs:** ISO 27001 Annex A, SOC 2 Trust Services Criteria, NIST CSF 2.0 functions (Govern, Identify, Protect, Detect, Respond, Recover). Pick one as the audit baseline and map evidence to it.
- **Sampling:** you cannot check everything. Define a sampling approach (e.g., 25 of 400 access grants, all privileged changes in the quarter) and document it.
- **Evidence hierarchy:** system-generated logs and configs > documented procedures > interviews. Corroborate interviews with artifacts.
- **Findings need criteria:** every finding states the requirement (criterion), what was observed (condition), why it matters (cause/effect), and what to do (recommendation).

- **Independence vs familiarity.** Long auditor tenure on one area builds knowledge but erodes skepticism. Rotate assignments periodically to keep fresh eyes on high-risk domains.
- **Control rationalization.** Before testing 200 controls, ask which actually mitigate material risk — auditing low-value controls wastes everyone's time and buries real issues.
- **Management responses are commitments.** Vague responses ('we will improve processes') are not action plans. Require owner, action, and date for every finding.

## Practical workflow

1. **Define the audit program:** scope (systems, time period, framework), objectives, and materiality. Get management sign-off before fieldwork.
2. **Build the control matrix:** list each in-scope control, its owner, the expected evidence, and the test procedure. This becomes your fieldwork checklist.
3. **Collect evidence:** pull configs, logs, tickets, and review records. Use read-only access; record what you sampled and when.
4. **Test:** for each control, check design (does the control address the risk?) then operating effectiveness (did it work across the period? re-perform a sample).
5. **Draft findings:** use the criterion/condition/cause/effect/recommendation structure. Rate severity by risk, not by audit effort. Share drafts with control owners for factual accuracy — this is not negotiation of the finding, it is error-checking.
6. **Report and track:** issue the report with an overall opinion, agreed action plans with owners and dates, and a follow-up mechanism. Re-test remediations; do not close on promises.

### Evidence request list (starter)

- Asset inventory and data classification policy
- Access review records (last two cycles) and joiner/mover/leaver tickets
- Privileged access logs and MFA enrollment reports
- Change management records for production changes
- Vulnerability scan reports and remediation SLA tracking
- Incident log and post-incident reviews for the period
- Backup/restore test results, logging/retention configs

### Sustaining the practice

- Trend control effectiveness year over year; declining trends trigger deeper dives
- Maintain the evidence repository so repeat audits do not re-request everything
- Calibrate severity ratings across auditors with example-based guidance
- Follow up on action plans on schedule — overdue items escalate, not linger

### Metrics that prove it works

- % of controls effective in both design and operation
- Repeat findings year over year (the accountability metric)
- Mean time to remediate audit findings, by severity
- Sampling coverage vs plan (did fieldwork match the program?)

## Common pitfalls

- **Auditing against vibes.** No framework, no criteria → findings are opinions. Anchor everything to a control catalog.
- **Checkbox evidence.** A policy PDF with no implementation evidence proves nothing. Always test operation.
- **Surprise findings.** Control owners should never first learn of a finding in the final report. Factual-accuracy review is standard practice.
- **Severity inflation.** Rating everything "high" destroys credibility and buries real risk. Reserve high for genuine control failures with material risk.
- **Closing on remediation plans.** Track to verified closure with re-testing, or the audit program is theater.
- **Ignoring the positive.** Reporting what works well builds the credibility needed for hard findings to land.
- **Letting scope get negotiated away.** Pressure to drop "difficult" areas usually points at the highest-risk areas. Hold the line on material scope.
- **Findings without root cause.** "Access review not performed" recurring three years running means the finding format is fine and the follow-through is broken — escalate the pattern, not just the instance.
- **Surprise scope expansion mid-fieldwork.** New areas discovered during testing need scoping discipline — document, assess materiality, and agree with management before expanding.
- **Confusing compliance with security.** A control can pass the audit and still be ineffective against real threats. Note residual risk honestly even when the checkbox is ticked.
