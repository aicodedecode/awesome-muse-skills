---
name: lab-data-management
description: Research data management for labs — storage tiers, naming, metadata, backups, and FAIR practices.
category: scientific
---

## Overview

lab-data-management covers the unglamorous infrastructure that keeps a lab's data usable:
storage architecture, file naming and organization, metadata standards, backup strategy
(3-2-1), access control, and FAIR practices for sharing. Data management is decided in advance
or not at all — retroactive organization of five years of "final_v2_REAL" files is a lost cause.

## When to use

- Setting up lab storage: tiers (hot/warm/cold), servers vs cloud.
- File naming conventions and directory structures.
- Metadata: what to capture, README templates, data dictionaries.
- Backup strategy: 3-2-1, testing restores, versioning.
- Managing large datasets: sequencing, imaging, screening data.
- Data sharing: repositories, DOIs, FAIR compliance, funder mandates.
- Offboarding: preserving departing members' data.

## Core concepts

- **Storage tiers.** Hot (active analysis — fast SSD/NVMe, backed up), warm (recent projects —
  network storage), cold (archive — tape/cloud archive, cheap, slow retrieval). Match data to
  tiers deliberately; don't let the hot tier fill with 2019 data nobody touches.
- **Naming conventions.** Machine-sortable, human-readable, no spaces: 
  `2026-09-26_project-code_experiment-042_raw.csv`. Include date (ISO 8601), project, and
  content descriptors. Ban `final`, `v2`, `new` from names — use version numbers or dates.
  Document the convention; enforce in onboarding.
- **Directory structure.** `project/data/{raw,processed}/`, `project/code/`,
  `project/results/figures/`, `project/docs/`. Raw data immutable (read-only permissions);
  processing scripts versioned; figures regenerable from code + data. If a figure can't be
  regenerated, it's not a result, it's clip art.
- **Metadata.** README per project (what, why, how, who, when); data dictionary per dataset
  (column definitions, units, missing-value codes); instrument/method metadata captured at
  acquisition. Metadata written at creation takes minutes; reconstructed later takes days and
  is wrong.
- **3-2-1 backup.** 3 copies, 2 different media, 1 offsite. Test restores regularly — an
  untested backup is a hope, not a backup. Version critical files (git for code, versioned
  storage for data); ransomware and accidental deletion are the threats, plan for them.
- **Raw data sanctity.** Raw files are read-only, checksummed (md5/sha256 manifests), and
  never edited in place. All processing is scripted from raw → processed. This is what makes
  analyses auditable and re-runnable.
- **FAIR.** Findable (persistent identifiers, indexed repositories), Accessible (clear access
  conditions), Interoperable (standard formats, vocabularies), Reusable (licenses, rich
  metadata). Funders and journals increasingly mandate it — build it in from the start,
  not at publication panic time.
- **Access and offboarding.** Role-based access (not everyone needs write to everything);
  departing members: data inventoried, transferred, and access revoked — with a checklist,
  not good intentions. Orphaned data on ex-members' laptops is a recurring tragedy.

## Practical workflow

1. **Plan.** Data management plan at project start: volumes, formats, storage, metadata,
   sharing, retention (funder templates help).
2. **Set up.** Directory structure, naming convention doc, README template, backup jobs —
   before data exists.
3. **Capture.** Metadata at acquisition; checksums on raw files; immutable raw storage.
4. **Process reproducibly.** Scripted pipelines, versioned code, processed data regenerable.
5. **Back up.** 3-2-1 running automatically; restore tests scheduled (quarterly).
6. **Share.** Repository deposit (domain-appropriate: SRA, GEO, Zenodo, etc.) with DOI;
   license chosen; metadata complete.
7. **Maintain.** Tier migration, offboarding checklists, convention audits, DMP updates.

Example layout:
```
project-x/
  README.md            # what/why/how/who
  data/raw/            # immutable, checksummed
  data/processed/      # regenerable via code/
  code/                # versioned (git)
  results/figures/     # regenerable
  docs/dictionary.csv  # column definitions, units
```

## Common pitfalls

- "final_v2" naming chaos (unfindable, ambiguous data).
- Raw data edited in place (provenance destroyed).
- Untested backups (discovered broken during the crisis).
- Metadata reconstructed from memory years later.
- No offboarding process (data walks out with people).
- Sharing as an afterthought (publication blocked on data cleanup).
- Everything on one drive with no offsite copy.
