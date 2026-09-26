---
name: compliance-mapper
description: Map security controls across frameworks — one control set satisfying ISO 27001, SOC 2, NIST, PCI DSS, and more.
category: security
---

## Overview

Most organizations face multiple compliance frameworks simultaneously — ISO 27001, SOC 2, PCI DSS, NIST CSF, plus sector and regional rules — and auditing each separately multiplies cost and fatigue. Control mapping solves this: build one unified control set, map each control to every framework's requirements, and test once to satisfy many.

This skill covers building and operating the mapping: framework analysis, unified control design, evidence reuse, and keeping the mapping current as frameworks evolve.

Map to the strongest requirement, not the average: when frameworks differ on a control (e.g., review frequency), implement the strictest version once. A single control that satisfies the toughest framework automatically satisfies the lenient ones — this is where the efficiency comes from.

## When to use

- Facing 2+ frameworks and drowning in duplicate audit work.
- Building the initial control set for a growing company.
- Preparing for a new certification while maintaining existing ones.
- Rationalizing controls after mergers or rapid growth.
- Responding to customer questionnaires efficiently.

## Core concepts

- **Unified control framework.** One set of controls with clear ownership, each mapped to the relevant clauses of every applicable framework (ISO 27001 Annex A, SOC 2 criteria, PCI DSS requirements, NIST CSF subcategories).
- **Map once, test once, use many times.** A single test of access reviews produces evidence usable for ISO A.5.17, SOC 2 CC6.2, and PCI DSS 7.x — the mapping is what makes reuse legitimate.
- **Gap analysis per framework.** The unified set reveals exactly what each new framework adds — usually 10–20% net-new controls, not a whole new program. Scope new certifications precisely.
- **Authoritative sources.** Use official mappings where they exist (framework crosswalks published by the bodies) and validate custom mappings with auditors before relying on them.
- **Evidence architecture.** Centralized evidence repository tagged by control — when the SOC 2 auditor asks, you pull the same tested evidence the ISO auditor saw, with the mapping as the bridge.
- **Framework versioning.** Frameworks update (ISO 27001:2022, PCI DSS v4.0, NIST CSF 2.0) — track versions in the mapping and run delta analyses on each release.
- **Control inheritance.** Cloud providers and shared services provide some controls (physical security, hypervisor patching) — document inheritance explicitly rather than re-testing what you cannot test.

- **Control inheritance documentation.** For cloud/shared-service inherited controls, document exactly what is inherited, from whom, and the evidence source — vague inheritance claims fail audits.
- **Mapping maintenance ownership.** Assign an owner to the mapping itself with a review cadence; unowned mappings rot silently as frameworks evolve.

## Practical workflow

1. **Inventory obligations:** list every framework, regulation, and customer requirement in scope, with versions and audit cycles. This is the demand side.
2. **Build the unified set:** draft controls covering the union of requirements, mapped clause-by-clause. Start from the strictest requirements; consolidate duplicates ruthlessly.
3. **Assign ownership and evidence:** every control gets an owner, a defined evidence artifact, and a testing cadence. Unowned controls are unimplemented controls.
4. **Run gap analyses:** for each framework, show mapped vs missing. New certifications become scoped projects (the 15% delta), not new programs.
5. **Test once:** execute the control testing program on its own cadence; tag evidence to controls; auditors across frameworks consume the same tested evidence via the mapping.
6. **Maintain:** update mappings on framework revisions; review control effectiveness annually; prune controls that no framework or risk requires.

### Quick wins

- Pick your two heaviest frameworks and map their overlap this quarter
- Centralize audit evidence in one tagged repository before the next audit cycle
- Run a delta analysis on the most recent framework version update

### Sustaining the practice

- Review framework updates within 90 days of publication; run delta mappings
- Re-validate custom mappings with auditors annually
- Audit the evidence repository for completeness before each audit cycle
- Retire controls that have lost their framework or risk justification

### Metrics that prove it works

- Audit effort hours per framework, trending down with reuse
- % of controls with current, tested evidence
- Time to onboard a new framework (should shrink with each addition)
- Audit finding recurrence across frameworks (same root cause, multiple reports)

## Common pitfalls

- **Mapping without testing.** A beautiful spreadsheet of mappings with untested controls is fiction. The mapping's value comes from tested evidence behind it.
- **Framework-of-the-month controls.** Bolting on controls per audit creates sprawl. Route every new requirement through the unified set first.
- **Ignoring version drift.** Auditing against ISO 27001:2013 mappings two years after 2022 published. Track versions explicitly.
- **Over-mapping.** Mapping every control to every framework "just in case" creates maintenance hell. Map where genuine overlap exists; keep the rest framework-specific.
- **No auditor buy-in.** Custom mappings the auditor rejects waste the effort. Validate mapping approaches with auditors early.
- **Evidence silos.** Each audit team collecting its own evidence destroys the reuse model. Centralize the repository and enforce tagging.
- **Confusing mapping with compliance.** The map shows coverage; only implemented, tested controls provide it. Report control effectiveness, not mapping completeness.
- **Static mapping.** Frameworks, products, and risks change. An unmaintained mapping quietly becomes wrong — schedule its maintenance like any control.
- **Mapping at the wrong granularity.** One-to-one clause mapping where many-to-many is the reality (or vice versa) produces misleading coverage claims. Map honestly.
- **Letting consultants own the mapping.** External mappings you cannot maintain internally decay the day the engagement ends. Build internal ownership from the start.
