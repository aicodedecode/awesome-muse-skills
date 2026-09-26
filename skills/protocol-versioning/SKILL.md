---
name: protocol-versioning
description: Version-controlled lab protocols — writing, reviewing, versioning, and change control for SOPs.
category: scientific
---

## Overview

protocol-versioning covers managing laboratory protocols as versioned documents: writing clear
SOPs, version control (semantic or date-based), review and approval workflows, change control,
and ensuring everyone works from the current version. "We updated the protocol" means nothing
unless you know which version, when, what changed, and who was trained on it.

## When to use

- Writing new SOPs: structure, level of detail, acceptance criteria.
- Versioning schemes and change logs.
- Review/approval workflows: author, reviewer, approver roles.
- Training records linked to protocol versions.
- Change control: evaluating and documenting modifications.
- Deviation handling: when reality departs from the SOP.
- Audits: demonstrating version control to inspectors.

## Core concepts

- **SOP anatomy.** Purpose → scope → responsibilities → materials/equipment (with catalog
  numbers) → procedure (numbered steps, imperative voice) → acceptance criteria/QC →
  troubleshooting → references → revision history. Write for a competent newcomer, not for
  yourself — if it requires tribal knowledge, it's incomplete.
- **Versioning scheme.** Semantic (v1.0 major rewrite, v1.1 minor clarification) or
  date-based (2026-09-26); every version immutable once approved. Draft → review → approved →
  effective; superseded versions archived, never deleted (auditors ask about old versions).
- **Change control.** Proposed change → impact assessment (does it affect validated results?
  regulatory filings? safety?) → approval → new version → training → effective date.
  Minor clarifications fast-track; method changes need re-validation proportional to impact.
  Undocumented "improvements" by individual bench workers are the enemy — channel them into
  the change process.
- **Effective dates and training.** A new version isn't live until the effective date, and
  staff must be trained on changes before it (documented training records: who, when, on
  which version). "I didn't know the protocol changed" is a system failure, not a personal one.
- **Deviations.** Planned deviations (approved before execution, with rationale) vs unplanned
  (documented promptly, assessed for impact on results). Deviations are data about the
  protocol's fitness — recurring deviations signal a protocol that needs revision, not staff
  that need scolding.
- **Periodic review.** Every SOP reviewed on schedule (annually typical; more often for
  critical methods) even without changes — confirms continued fitness and catches drift.
  Record the review even when the outcome is "no change."
- **Single source of truth.** One approved location (ELN protocol library, QMS); uncontrolled
  copies (personal printouts, shared-drive duplicates) are forbidden or clearly marked
  uncontrolled. Audits always find the outdated printout taped to the hood — eliminate it.
- **Linkage.** Protocols link to: equipment calibration records, reagent lots used,
  training records, validation data, and the ELN entries that executed them. A protocol is a
  node in a quality system, not a standalone document.

## Practical workflow

1. **Write.** SOP anatomy above; numbered steps; acceptance criteria; troubleshooting section
   from real experience.
2. **Review.** Technical reviewer (does it work?) + QA reviewer (is it compliant/complete?) +
   approver. Record review comments and resolutions.
3. **Approve and version.** Immutable version number; effective date; archive prior version.
4. **Train.** Affected staff trained before effective date; records filed.
5. **Execute.** ELN entries reference protocol ID + version used (not "the standard protocol").
6. **Handle deviations.** Document, assess impact, feed back into protocol review.
7. **Review periodically.** Scheduled review; revise via change control; retire obsolete
   protocols formally.

Example header block:
```
SOP-042 | Plasmid miniprep (spin column) | v2.3 | Effective: 2026-09-01
Author: J. Rao | Reviewer: M. Chen | Approver: QA
Changes from v2.2: elution volume 50→75 µL (yield data, DEV-118)
Training required: yes (all wet-lab staff) | Review due: 2027-09-01
```

## Common pitfalls

- "Current" protocol ambiguous (multiple versions in circulation).
- Changes made at the bench without documentation.
- Training records missing ("everyone knows the new version").
- Deviations hidden instead of documented.
- Overdue periodic reviews (protocol drift unnoticed).
- Uncontrolled printouts as the de facto procedure.
- ELN entries not recording which protocol version was used.
