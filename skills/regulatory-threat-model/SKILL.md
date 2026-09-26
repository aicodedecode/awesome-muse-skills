---
name: regulatory-threat-model
description: Threat-model regulatory and compliance risk — mapping legal obligations to security controls and residual exposure.
category: security
---

## Overview

Regulatory threat modeling applies threat-modeling discipline to compliance risk: systematically identifying which regulations apply, where the organization is exposed, what controls mitigate the exposure, and what residual risk remains. It turns "we need to be compliant" from a vague anxiety into a structured, prioritized work program.

This skill covers the method: obligation inventory, exposure analysis per obligation, control mapping, residual-risk assessment, and the ongoing monitoring that keeps the model honest as regulations evolve. It is practical guidance, not legal advice.

Think like an attacker, but the attacker is a regulator with a checklist and penalty schedule: where would they find you non-compliant, what evidence would they ask for, and what would the finding cost? That adversarial framing finds the gaps that self-assessed "we're probably fine" misses.

## When to use

- Entering new jurisdictions or sectors with unfamiliar regulatory landscapes.
- Building the compliance roadmap with prioritized, costed work items.
- Assessing regulatory exposure before M&A, funding, or major product launches.
- Rationalizing overlapping obligations into one control program.
- Preparing for regulatory examinations or inquiries.

## Core concepts

- **Obligation inventory.** Every applicable law, regulation, and contractual requirement, versioned and sourced — GDPR, NIS2, CRA, DORA, sector rules, state privacy laws, customer contract clauses. If it is not inventoried, it is not managed.
- **Exposure analysis per obligation.** For each: what does it require, where do we stand, what is the gap, what is the penalty and enforcement likelihood. Score exposure as gap × penalty × likelihood, not just "are we compliant."
- **Control mapping.** Map each obligation to the controls that satisfy it (reuse the compliance-mapper unified set) — one control program serving many obligations is the efficiency engine.
- **Residual risk.** After controls, what exposure remains? Document it explicitly with owner and acceptance — regulators respect honest residual-risk management more than claimed perfection.
- **Change detection.** Regulations evolve: new laws, updated guidance, enforcement precedents. Assign ownership for monitoring each obligation's evolution — the model decays without it.
- **Evidence posture.** For each obligation, define what evidence a regulator would request and whether you could produce it in 30 days. Evidence you cannot produce on demand is a finding waiting to happen.
- **Enforcement intelligence.** Track actual enforcement actions in your sectors — penalties levied, for what failures. Real enforcement patterns beat theoretical penalty maximums for prioritization.
- **Cross-obligation conflicts.** Some obligations pull in opposite directions (data retention vs minimization, disclosure vs confidentiality). Identify conflicts explicitly and resolve with counsel — do not let them resolve by accident.

- **Regulatory horizon scanning.** Assign ownership for tracking proposed (not just enacted) regulation — the EU AI Act-style pipeline means today's proposal is next year's obligation.
- **Jurisdiction interaction effects.** Operating across jurisdictions creates compound obligations (data localization vs breach notification); model the interactions, not just each regime alone.

## Practical workflow

1. **Inventory obligations:** with counsel, list every applicable regime per jurisdiction, sector, and contract portfolio. Version and source each entry.
2. **Assess exposure:** per obligation — requirement summary, current state, gap analysis, penalty range, enforcement likelihood. Score and rank the exposure.
3. **Map controls:** link each obligation to controls in the unified set; identify uncovered obligations (new control projects) and over-controlled areas (efficiency opportunities).
4. **Plan remediation:** costed, sequenced work items owned by named people, prioritized by exposure score. Present as a roadmap with decision points, not a wish list.
5. **Build evidence posture:** define the evidence package per obligation; close the gaps where evidence is missing; test retrieval with a simulated regulator request.
6. **Monitor and refresh:** quarterly regulatory-change review; annual full-model refresh; trigger-based updates on new laws, enforcement actions, or business changes (new markets, new products, M&A).

### Quick wins

- Inventory applicable obligations with counsel and version each entry
- Score exposures (gap × penalty × likelihood) and brief leadership on the top 5
- Run a mock evidence-retrieval exercise for your highest-exposure obligation

### Sustaining the practice

- Review the obligation inventory quarterly for new or changed regulations
- Track enforcement actions in your sectors as prioritization input
- Re-score exposures annually — gaps close, penalties change, likelihoods shift
- Test evidence retrieval yearly with a mock examination

### Metrics that prove it works

- % of obligations with mapped controls and current evidence
- Exposure-score trend (should decline as remediation lands)
- Time to produce a complete evidence package per obligation
- Regulatory findings per examination cycle, trending down

## Common pitfalls

- **Treating it as a legal project only.** Regulatory exposure is mitigated by security controls — the model needs security engineering input, not just counsel's memo.
- **Binary compliance thinking.** "Compliant / not compliant" misses the prioritization. Exposure scoring (gap × penalty × likelihood) focuses effort where it matters.
- **Ignoring enforcement reality.** Optimizing for theoretical maximum penalties while ignoring where regulators actually enforce. Follow the enforcement data.
- **Stale obligation inventory.** New products, new markets, and new laws silently expand the obligation set. Review on business change, not just annually.
- **Evidence assembled at examination time.** Scrambling to produce evidence under regulator deadlines guarantees gaps. Maintain the evidence posture continuously.
- **Unresolved obligation conflicts.** Retention-vs-minimization tensions decided implicitly by whoever configured the system last. Surface conflicts and resolve deliberately with counsel.
- **No owner per obligation.** "Everyone" owns regulatory risk means nobody does. Name an owner for each obligation's compliance state.
- **One-and-done modeling.** A regulatory threat model built once and shelved is a snapshot, not a capability. The refresh cadence is the program.
- **Analysis paralysis.** A perfect obligation inventory that never becomes a remediation roadmap is procrastination. Time-box analysis and start remediating the top exposures.
- **Ignoring contractual obligations.** Customer and partner contracts often exceed statutory requirements. The contract portfolio belongs in the obligation inventory.
