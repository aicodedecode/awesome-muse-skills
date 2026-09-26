---
name: eln-workflows
description: Electronic lab notebook workflows — structuring entries, templates, linking data, and audit-ready records.
category: scientific
---

## Overview

eln-workflows covers using electronic lab notebooks effectively: structuring entries so
experiments are reproducible from the record alone, template design, linking raw data and
protocols, collaboration, and maintaining audit-ready records for regulated or IP-sensitive
work. An ELN is only as good as the habits around it — software doesn't create good records,
workflows do.

## When to use

- Choosing/structuring an ELN: entry organization, projects vs experiments.
- Designing templates: experiment records, instrument logs, meeting notes.
- Daily habits: what goes in an entry, when, with what links.
- Linking: raw data files, protocols, samples, inventory.
- Collaboration: sharing, commenting, permissions.
- Regulated/IP work: signatures, witnessing, audit trails, 21 CFR Part 11 basics.
- Migrating from paper: what to digitize, what to leave.

## Core concepts

- **The reproducibility standard.** An entry should let a competent colleague repeat the
  experiment without asking you questions. That means: objective, full protocol (or link to
  versioned protocol), materials with lot/catalog numbers, instrument settings, raw data
  links, observations (including failures), and interpretation kept separate from results.
- **Entry anatomy.** Title (searchable, dated) → objective → methods/protocol link →
  materials → procedure notes with timestamps → observations → raw data attachments/links →
  results → interpretation → next steps. Interpretation clearly labeled as such — future-you
  must distinguish what happened from what you thought it meant.
- **Templates.** Standardize recurring work: experiment template, instrument-run log,
  sample-receipt log, meeting notes. Templates reduce omission errors and make entries
  searchable/comparable. Keep them short — a 50-field template nobody completes is worse
  than a 10-field one everyone uses.
- **Link, don't duplicate.** Protocols live in the protocol library (versioned); entries link
  to the version used. Raw data lives in managed storage; entries link to it. Samples link to
  inventory records. Duplication drifts out of sync — linking keeps one source of truth.
- **Contemporaneous records.** Write it when you do it. End-of-week reconstruction from
  memory is fiction with good intentions. For regulated/IP work, contemporaneous dating is a
  legal requirement, not a nicety.
- **Failures are data.** Record what didn't work, with the same care as successes. Negative
  results prevent repeated mistakes across the lab and are often the most valuable entries
  for future troubleshooting.
- **Audit trails and signatures.** Regulated environments need: immutable history (who changed
  what, when), electronic signatures with meaning (reviewed/approved/witnessed), and access
  controls. Even unregulated labs benefit from witnessing for IP-sensitive work — know your
  institution's policy.
- **Searchability.** Consistent naming (project codes, sample IDs), tags, and titles make the
  ELN a knowledge base instead of a write-only archive. Agree on conventions lab-wide and
  enforce them in onboarding.

## Practical workflow

1. **Set up structure.** Projects/experiments hierarchy; naming conventions; tag taxonomy —
   decided once, documented, enforced.
2. **Build templates.** Experiment, instrument log, sample log — minimal viable fields.
3. **Daily habit.** Entry per experiment, written same-day: objective → methods (linked) →
   observations → data links → interpretation → next steps.
4. **Link everything.** Protocols (versioned), raw data (managed storage), samples (inventory),
   related entries.
5. **Review cycle.** Weekly self-review; PI/peer review for key experiments; sign and witness
   where required.
6. **Maintain.** Template updates, convention audits, onboarding training, periodic exports/
   backups independent of the vendor.

Example entry skeleton:
```
# EXP-2026-0142 | Kinase inhibitor dose-response, A549
Objective: Determine IC50 of KX-117 in A549 (protocol PROT-008 v3)
Materials: A549 p12, KX-117 lot KX2026-03, ...
Procedure: [timestamps, deviations noted]
Observations: Edge wells evaporated (excluded); ...
Data: → /data/2026-09-26/plate-reader-run-042.csv
Results: IC50 = 340 nM (95% CI 290-400)
Interpretation: ...
Next: repeat with 48h timepoint
```

## Common pitfalls

- Entries written days later from memory.
- Interpretation mixed inseparably with observations.
- Protocols pasted (not linked) — version drift.
- Raw data on personal laptops, not linked from entries.
- Templates so long nobody uses them.
- No naming conventions (unsearchable archive).
- Vendor lock-in with no export/backup strategy.
