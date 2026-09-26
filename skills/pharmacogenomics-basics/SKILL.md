---
name: pharmacogenomics-basics
description: Pharmacogenomics in practice — key gene-drug pairs, phenotype translation, and clinical implementation.
category: scientific
---

## Overview

pharmacogenomics-basics covers using genetic variation to guide drug therapy: the high-evidence
gene-drug pairs, translating genotypes to metabolizer phenotypes, and implementing testing in
clinical workflows. It focuses on what's actionable now — a small set of well-validated pairs —
rather than the polygenic future.

## When to use

- Learning the actionable gene-drug pairs (CPIC/DPWG guidelines).
- Translating genotypes to phenotypes: CYP2D6, CYP2C19, TPMT, DPYD activity scores.
- Preemptive vs reactive testing strategies.
- Interpreting pharmacogenomic test reports.
- Implementing: CDS alerts, EHR integration, result portability.
- Counseling patients on pharmacogenomic results.

## Core concepts

- **The high-value pairs.** CYP2C19-clopidogrel (poor metabolizers: reduced activation, more
  events — use alternative antiplatelet), CYP2D6-codeine/tramadol (ultrarapid: toxicity;
  poor: no analgesia), TPMT/NUDT15-thiopurines (poor metabolizers: severe myelosuppression),
  DPYD-fluoropyrimidines (poor metabolizers: severe toxicity), HLA-B*57:01-abacavir
  (hypersensitivity — test required), HLA-B*15:02-carbamazepine (SJS/TEN in Asian ancestry),
  SLCO1B1-simvastatin (myopathy risk), CYP2C9/VKORC1-warfarin (dosing). CPIC and DPWG
  guidelines give the actionable recommendations — follow them, not marketing.
- **Genotype → phenotype.** Star alleles (*1 = normal function, *2/*3... = defined variants);
  activity scores sum allele activities; phenotype bins: poor, intermediate, normal, rapid,
  ultrarapid metabolizer. Phenoconversion (drug interactions overriding genetics — e.g. a CYP2D6
  normal metabolizer on paroxetine functions as poor) must be considered alongside genotype.
- **CPIC levels.** CPIC assigns evidence levels; focus on level A/B pairs for clinical action.
  Most gene-drug associations in the literature are not actionable — actionability requires
  replicated evidence plus a viable alternative therapy.
- **Preemptive vs reactive.** Preemptive panel testing (genotype once, use for life) is
  cost-effective where prescribing volume is high; reactive testing (order when prescribing a
  high-risk drug) fits low-volume settings. Either way, results must live in the EHR
  discretely (not as PDF scans) to fire clinical decision support.
- **Implementation.** CDS alerts at prescribing (interruptive for high-risk, passive otherwise);
  pharmacist review workflows; result portability across encounters and systems. The genetics
  is the easy part — workflow integration determines whether testing changes prescribing.
- **Ancestry matters.** Allele frequencies differ by ancestry (HLA-B*15:02 relevant in Southeast
  Asian ancestry; CYP2D6 duplications in North African/Middle Eastern populations). Panels must
  cover population-relevant alleles; "normal" results from incomplete panels are misleading.
- **Limits.** Pharmacogenomics explains a fraction of response variability — age, organ
  function, interactions, and adherence usually dominate. Don't let a normal genotype provide
  false reassurance, or an abnormal one deny effective therapy without alternatives.
- **Counseling.** Results are probabilistic, not deterministic; most findings have implications
  for relatives (germline); GINA-type protections vary by jurisdiction — know the local legal
  context before testing.

## Practical workflow

1. **Select pairs.** Start with CPIC level-A pairs relevant to your prescribing volume.
2. **Choose strategy.** Preemptive panel vs reactive single-gene, based on volume and
   infrastructure.
3. **Test.** Validated panel covering ancestry-appropriate alleles; clear phenotype translation
   in the report.
4. **Integrate.** Discrete EHR results + CDS alerts + pharmacist workflow; portability across
   encounters.
5. **Act.** Follow CPIC/DPWG recommendations; document the genotype-guided decision;
   consider phenoconversion from interacting drugs.
6. **Counsel.** Explain what the result means and doesn't mean; discuss familial implications.
7. **Monitor.** Track alert override rates, prescribing changes, and outcomes; update as
   guidelines evolve.

## Common pitfalls

- Acting on low-evidence associations without CPIC/DPWG backing.
- Incomplete panels missing ancestry-relevant alleles ("normal" by omission).
- PDF-only results that can't drive CDS (testing without implementation).
- Ignoring phenoconversion (genotype overridden by interacting drugs).
- Alert fatigue from poorly tuned pharmacogenomic CDS.
- Overpromising: genetics as a small piece of response variability.
- No plan for result portability (re-testing at every institution).
- Copy-number variants (CYP2D6 duplications/deletions) missed by SNP-only panels.
