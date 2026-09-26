---
name: incident-reporting-navigator
description: Navigate breach and incident notification duties — GDPR, NIS2, sector rules, and building the report-ready capability.
category: security
---

## Overview

When a security incident becomes a breach, the clock starts: GDPR's 72-hour supervisory notification, NIS2's staged incident reporting, SEC cyber disclosure rules, and sector-specific duties all run concurrently with different triggers, thresholds, and recipients. Missing a deadline or notifying the wrong authority turns a bad incident into a regulatory event.

This skill is a defensive compliance guide: mapping which regimes apply, building the decision-to-notify workflow, and preparing the evidence and communications machinery before an incident. It is practical guidance, not legal advice — counsel owns the final call on every notification.

Build the notification capability before the incident: pre-drafted templates, a decision tree for each applicable regime, named decision-makers with deputies, and a legal-engagement trigger in the IR plan. At 2 AM with a suspected breach, you should be executing a plan, not designing one.

## When to use

- Mapping incident-notification obligations across jurisdictions and sectors.
- Building the breach-notification decision workflow into incident response.
- Preparing notification templates and evidence packages in advance.
- Training executives on their disclosure duties and personal liability.
- After an incident: navigating the actual notification decisions.

## Core concepts

- **Regime inventory.** GDPR (personal data breaches, 72h to supervisory authority, without undue delay to individuals when high risk), NIS2 (significant incidents: early warning 24h, notification 72h, final report 1 month), SEC (material cybersecurity incidents, 4 business days on 8-K), plus sector rules (finance, telecom, health) and contract obligations. Map yours explicitly.
- **Triggers differ.** Each regime defines its own trigger: "personal data breach," "significant incident," "material cybersecurity incident." The same event may trigger some regimes and not others — assess per regime, document the reasoning.
- **Staged reporting.** Modern regimes expect iterative disclosure: early warning with what you know, fuller notification as facts develop, final report with root cause. "We don't have all the facts" is not a reason to miss the early deadline — report what you know and update.
- **Privilege and investigation.** Engage counsel early; structure investigation communications to preserve privilege where appropriate. The notification decision and the forensic investigation run in parallel with careful information handling.
- **Evidence readiness.** Notification requires facts: scope of data affected, categories and volumes, likely consequences, measures taken. Your IR evidence collection should anticipate these questions from the start.
- **Individual notification.** When required (high risk to individuals under GDPR, state breach laws), plan the mechanics in advance: contact data availability, notification channels, call-center capacity, and offered remediation (monitoring, etc.).
- **Regulator relationships.** Know your supervisory authorities and sector contacts before the incident. First contact during a crisis is harder than a pre-established channel.
- **Documentation discipline.** Record every notification decision — made or declined — with rationale, timestamp, and counsel involvement. Declined notifications need the same rigor as made ones.

- **Multi-regime decision matrix.** A single incident assessed once per regime with documented rationale beats ad-hoc per-regime debates under deadline pressure. Build the matrix, rehearse it.
- **Regulator communication discipline.** Designate one spokesperson for regulator contact; parallel informal contacts create inconsistent records. Log every interaction.

## Practical workflow

1. **Map with counsel:** for each jurisdiction and sector you operate in, document the regimes, triggers, deadlines, recipients, and content requirements. Keep it to a decision-ready matrix.
2. **Build the decision workflow:** integrate notification assessment into the IR plan at defined severity gates (e.g., any P1/P2 with data impact triggers a legal review within hours). Name decision-makers and deputies.
3. **Prepare templates:** draft notification templates per regime with fill-in sections for facts; pre-identify data sources for the required content (affected records, categories, consequences, mitigations).
4. **Rehearse:** include notification decisions in tabletop exercises — the 24-hour NIS2 early-warning decision under time pressure is a skill, not a document.
5. **Execute during incidents:** legal engaged at the severity gate; per-regime trigger assessment documented; notifications filed on deadline with counsel review; updates sent as facts develop.
6. **Review after:** post-incident assessment of the notification process itself — timeliness, accuracy, regulator feedback — and update the matrix, templates, and workflow.

### Quick wins

- Build the regime matrix with counsel before the next tabletop
- Draft notification templates for your top two regimes this quarter
- Add the legal-engagement trigger to the IR plan at the P1/P2 severity gate

### Sustaining the practice

- Review the regime matrix annually and on entering new jurisdictions
- Refresh templates after each real notification or regulatory guidance change
- Rehearse notification decisions in at least one tabletop per year
- Track regulatory developments — breach-notification law is actively evolving

### Metrics that prove it works

- Notification decisions documented within the target window (e.g., 12h for P1)
- Deadline compliance rate across regimes (target: 100%)
- Tabletop performance on notification scenarios
- Regulator feedback and follow-up inquiry rate

## Common pitfalls

- **Discovering obligations during the incident.** The most common and most expensive failure. Map regimes in peacetime.
- **Waiting for complete facts.** Early-warning deadlines expect incomplete information. Report what you know, commit to updates.
- **Notifying the wrong authority.** Multi-jurisdiction incidents need per-jurisdiction analysis. One notification does not cover all regimes.
- **Forgetting contract obligations.** Customer and vendor contracts often have breach-notification clauses stricter than law. Inventory them in the matrix.
- **No privilege planning.** Investigation communications without counsel structure can become discoverable. Engage counsel before the deep investigation, not after.
- **Individual notification unprepared.** Scrambling for contact data and call-center capacity mid-breach. Plan the mechanics in advance.
- **Treating notification as the end.** Regulators follow up; individuals ask questions; the final report needs root cause. Staff the aftermath, not just the filing.
- **Undocumented declinations.** Deciding not to notify without recording the rationale is indefensible later. Document every call.
- **Copy-pasting notifications across regimes.** Each regime wants specific content and has specific thresholds. Tailor each notification; document why each was or was not sent.
- **Forgetting downstream notifications.** Processors must notify controllers; vendors must notify customers per contract. Map the notification chain beyond regulators.
