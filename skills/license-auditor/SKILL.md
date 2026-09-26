---
name: license-auditor
description: Audit open-source license compliance — inventory obligations, manage copyleft risk, and build approval workflows.
category: security
---

## Overview

Every dependency carries a license, and licenses carry obligations: attribution, source disclosure, or restrictions on distribution. License non-compliance creates legal exposure — especially copyleft licenses (GPL/AGPL) in distributed or SaaS products — and acquirers, customers, and regulators increasingly ask for proof of compliance.

This skill covers the license-compliance program: inventorying obligations, setting policy by license category, building approval workflows, and producing the attribution artifacts customers expect.

Treat license compliance as a product-shipping requirement, not legal trivia: the question to answer for every release is "can we ship this, and what must we include?" Build the inventory and policy so that question is answerable in minutes, not via a panicked audit the week before launch.

## When to use

- Setting open-source license policy for products (especially SaaS and distributed software).
- Auditing dependencies for copyleft or prohibited licenses.
- Preparing for due diligence (funding, acquisition) or customer license questionnaires.
- Generating attribution notices and SBOM license data for releases.
- Responding to a discovered GPL/AGPL violation.

## Core concepts

- **License categories.** Permissive (MIT, Apache-2.0, BSD): minimal obligations, usually attribution. Weak copyleft (LGPL, MPL): share modifications to the library itself. Strong copyleft (GPL, AGPL): share derivative work — AGPL's network clause triggers on SaaS use, not just distribution.
- **Policy by category.** Most orgs: permissive = auto-approve; weak copyleft = review; strong copyleft = legal review required, often prohibited in products. Document the policy; automate the classification.
- **Obligation inventory.** Attribution notices, license text inclusion, source-code offers — track what each dependency requires and generate the artifacts at release time, not retroactively.
- **Distribution vs SaaS vs internal.** Obligations trigger differently: GPL triggers on distribution; AGPL triggers on network use; internal-only tools face fewer triggers but still need inventory for hygiene.
- **Dual licensing and exceptions.** Some packages offer commercial licenses or linking exceptions — know when paying for a license is cheaper than re-architecting around copyleft.
- **Contribution policy.** Contributing to open source needs its own rules: CLA/DCO processes, employer IP considerations, and license compatibility of outbound contributions.
- **M&A and customer diligence.** Acquirers scan your code for license risk; enterprise customers ask for SBOMs with license data. A standing compliance program turns these from fire drills into exports.

- **SPDX license expressions.** Use standard SPDX identifiers everywhere — ambiguous license names ('GPL', 'Apache') cause misclassification. Precision in identifiers is precision in policy.
- **Container and artifact licensing.** Licenses propagate into shipped artifacts: container images, mobile bundles, and distributions all need license review, not just source repos.

## Practical workflow

1. **Inventory:** scan all repos and build outputs for licenses (SCA tools do double duty here); centralize results; flag unknown or ambiguous licenses for manual review.
2. **Set policy:** define approved / review-required / prohibited categories with legal input; encode in the SCA tool so violations block or alert automatically.
3. **Build the approval workflow:** lightweight self-service for permissive licenses; legal review queue for copyleft; SLA on reviews so developers do not route around the process.
4. **Generate artifacts:** attribution notices and license texts produced automatically per release; SBOMs include license identifiers (SPDX IDs); source offers where copyleft requires.
5. **Remediate violations:** for prohibited licenses found in products — replace the dependency, isolate usage, purchase a commercial license, or obtain legal risk acceptance. Document the decision.
6. **Sustain:** scan on every build (new dependencies get classified immediately); review policy annually as licenses and products evolve; train developers on the basics.

### Quick wins

- Run a full license scan this month and classify the unknown-license findings
- Generate attribution notices for your next release from the inventory
- Confirm AGPL-flagged dependencies get legal review before any SaaS use

### Sustaining the practice

- Re-scan the full estate quarterly; new repos and acquisitions get onboarded
- Review prohibited-license exceptions annually — they should shrink, not grow
- Keep the attribution generation tested per release pipeline
- Track license-review SLA; slow reviews drive shadow adoption

### Metrics that prove it works

- % of dependencies with classified, policy-compliant licenses
- Time from new-dependency introduction to license classification
- Prohibited-license findings remediated within SLA
- Release artifact completeness (attribution/SBOM license data present)

## Common pitfalls

- **Discovering GPL in the product at diligence.** The most expensive way to learn about license risk. Continuous scanning prevents it.
- **AGPL blindness in SaaS.** Teams check "we don't distribute" and miss AGPL's network-use trigger. SaaS products need AGPL-specific review.
- **Attribution as an afterthought.** Scrambling to assemble notices at release time guarantees incompleteness. Generate from the inventory automatically.
- **Policy without automation.** A wiki page saying "no GPL" with no scanning is a hope, not a control. Enforce in the pipeline.
- **Ignoring transitive licenses.** The dependency you chose is MIT; its dependency is GPL. Scan the full tree, not just direct dependencies.
- **No contribution policy.** Engineers contributing to copyleft projects or pasting Stack Overflow code create IP ambiguity. Set outbound rules too.
- **Treating legal as the enemy.** Slow, opaque legal review drives evasion. Make the process fast, transparent, and educational.
- **One-time audit mentality.** Dependencies change weekly; a point-in-time audit decays immediately. Continuous scanning is the program.
- **Assuming 'open source means free to use however we want.'** Every license has terms; permissive does not mean unconditional. Read the obligations, especially attribution.
- **License scanning only at release.** New dependencies arrive daily; release-time scanning finds violations after they are embedded. Scan on introduction.
