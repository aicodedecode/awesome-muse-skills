---
name: sample-biobanking
description: Biobanking best practices — consent, SOPs, cold chain, sample tracking, and quality management.
category: scientific
---

## Overview

sample-biobanking covers the professional management of biological sample collections: ethical
and legal foundations (consent, governance), standard operating procedures for collection and
processing, cold-chain logistics, inventory tracking (LIMS), and quality management. A biobank's
value is entirely in sample quality and annotation — poorly collected samples with thin metadata
are freezer filler, not a resource.

## When to use

- Establishing a biobank or biorepository: governance, infrastructure, SOPs.
- Consent design: broad vs tiered consent, re-contact, withdrawal, commercial use.
- Collection SOPs: pre-analytical variables (time to freeze, tube types, aliquoting).
- Cold chain: freezers, LN2, monitoring, backup power, disaster planning.
- LIMS: sample tracking, barcoding, chain of custody.
- Quality management: QC metrics, audits, accreditation (CAP, ISO 20387).
- Sample sharing: MTAs, access committees, cost recovery.

## Core concepts

- **Consent.** Broad consent for future unspecified research (with ethics approval) vs
  tiered/specific consent; must cover: re-contact, return of results policy, commercial use,
  data sharing, withdrawal (and what withdrawal means for already-distributed samples).
  Consent forms need ethics-committee approval and periodic review — regulations evolve
  (GDPR, national biobank laws).
- **Pre-analytical variables.** The dominant quality factor: time from collection to
  processing/freezing (record it — "cold ischemia time"), tube type (EDTA vs heparin vs
  citrate changes downstream assays), centrifugation protocol, aliquot size (avoid
  freeze-thaw by aliquoting single-use volumes). Standardize ruthlessly; document deviations.
- **SPREC codes.** Standard PREanalytical Code: documents pre-analytical conditions in a
  compact code (sample type, collection tube, time to freeze, storage). Use it — it's how
  downstream users judge fitness-for-purpose.
- **Cold chain.** −80°C freezers for most analytes, LN2 vapor phase for cells/DNA long-term;
  continuous temperature monitoring with alarming; backup power (generator + UPS); disaster
  plan (where do samples go if a freezer dies at 2 AM?). Map freezer contents — digging
  through boxes warms everything.
- **Aliquoting strategy.** Multiple small aliquots beat one large tube (freeze-thaw cycles
  degrade proteins, RNA, and many metabolites — typically limit to 1-2 cycles). Plan aliquot
  numbers from expected use cases, not convenience.
- **LIMS and barcoding.** Every sample barcoded at collection; chain of custody from bedside
  to freezer to distribution; 2D barcodes on tubes (human-readable labels fail in frost).
  The LIMS is the biobank's memory — paper logs don't scale and get lost.
- **Quality management.** QC program: periodic integrity testing (DNA/RNA integrity numbers,
  hemolysis checks), temperature log review, inventory audits, SOP version control, staff
  training records, non-conformance tracking. Accreditation (ISO 20387, CAP biorepository)
  formalizes this — pursue it for any serious biobank.
- **Governance and sharing.** Access committee (scientific + ethics review of requests),
  MTAs/DTAs for transfers, cost-recovery pricing (biobanks hemorrhage money giving samples
  away free), publication/acknowledgment policies, and benefit-sharing where applicable.

## Practical workflow

1. **Govern.** Ethics approval, consent forms, governance structure, legal review (data
   protection, human-tissue legislation).
2. **Write SOPs.** Collection, processing, aliquoting, freezing, shipping — versioned,
   trained, audited.
3. **Set up infrastructure.** Freezers with monitoring + backup power, LN2 supply, barcoding,
   LIMS configured before the first sample.
4. **Collect.** Trained staff, SPREC documentation, pre-analytical times recorded, chain of
   custody unbroken.
5. **Store.** Mapped locations, aliquot strategy, temperature monitoring with escalation.
6. **QC.** Periodic integrity testing, audits, non-conformance handling.
7. **Share.** Access committee review, MTAs, cost recovery, distribution tracking.

## Common pitfalls

- Consent that doesn't cover actual future uses (re-consent nightmares).
- Pre-analytical variables unrecorded (samples of unknown quality).
- Single large aliquots guaranteeing freeze-thaw damage.
- No temperature alarming (discovering freezer failure Monday morning).
- Paper-based tracking that collapses at scale.
- Free distribution bankrupting the biobank.
- No disaster plan (it's a matter of when, not if).
- Withdrawal requests with no defined process for already-distributed samples.
