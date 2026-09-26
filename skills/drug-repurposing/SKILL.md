---
name: drug-repurposing
description: Systematic drug repurposing — computational screening, evidence triangulation, and validation strategy.
category: scientific
---

## Overview

drug-repurposing covers the systematic search for new uses of existing drugs: computational
prediction (signature matching, network approaches, structure-based), evidence triangulation
across data types, and the validation path from prediction to clinical testing. Repurposing is
attractive (known safety, faster trials) but littered with false positives — the skill is about
separating plausible candidates from computational noise.

## When to use

- Generating repurposing hypotheses for a disease or target.
- Signature-based screening: disease signatures reversed by drug signatures (Connectivity Map
  logic).
- Network-based repurposing: drug-target-disease networks, proximity measures.
- Real-world evidence: EHR/pharmacoepidemiology signals for repurposed indications.
- Prioritizing candidates: safety, PK, IP, and trial-feasibility filters.
- Designing validation: from in vitro to observational to interventional.

## Core concepts

- **Why repurposing works (sometimes).** Known human PK/safety de-risks development; the
  biology rationale is that drugs hit pathways shared across diseases. It works best when the
  mechanism is specific and the new indication shares the pathway — worst when it's pure
  computational association.
- **Signature reversal.** Disease gene-expression signature vs drug-induced signatures
  (Connectivity Map/LINCS): drugs that invert the disease signature are candidates. Caveats:
  cell-line signatures ≠ human disease; reversal correlation is weak evidence alone; validate
  the signature's disease relevance first.
- **Network proximity.** In drug-target-disease networks, efficacious drugs tend to target
  proteins proximal to disease modules. Useful for hypothesis generation; the networks are
  incomplete and biased toward well-studied proteins (which conveniently are also the
  druggable ones).
- **Real-world evidence.** EHR analyses asking "do users of drug X have better outcomes for
  disease Y?" — subject to massive confounding by indication. Use active comparators,
  new-user designs, and negative controls (see ehr-data-analysis). RWE generates hypotheses;
  it doesn't confirm them.
- **Triangulation.** A candidate supported by signature reversal AND network proximity AND
  genetic evidence (Mendelian randomization implicating the target) AND RWE is worth
  pursuing. Single-evidence candidates are usually noise — require convergence.
- **Practical filters.** Safety at the needed dose/duration (a cancer drug's safety profile may
  not transfer to chronic use); PK (does it reach the target tissue? CNS penetration for
  neuro indications?); formulation and IP status; and whether anyone will fund the trial.
- **Mendelian randomization as target validation.** Genetic variants mimicking drug action
  (e.g. in the target gene) associated with disease risk support the target. One of the
  strongest human-genetics validations available — check MR evidence for top candidates.
- **Validation ladder.** In vitro disease-relevant assay → in vivo model (with PK confirming
  exposure) → observational/human-genetics support → small proof-of-concept trial. Skipping
  rungs is how repurposing fails expensively.

## Practical workflow

1. **Define the target profile.** Disease, desired mechanism, acceptable safety, target tissue,
   and commercial/practical constraints — before screening.
2. **Computational screen.** Signature reversal and/or network proximity across approved drugs;
   rank transparently with all scores reported.
3. **Triangulate.** MR evidence, RWE signals, literature — require ≥2 independent evidence
   lines for shortlisting.
4. **Filter.** Safety at indication-appropriate exposure, tissue PK, IP/regulatory path,
   trial feasibility.
5. **Validate experimentally.** Disease-relevant assays (not just easy cell lines); confirm
   target engagement and exposure in vivo.
6. **Clinical path.** Proof-of-concept trial design with biomarkers of target engagement;
   consider platform/basket designs for efficiency.
7. **Report.** Full ranked list (not just hits), methods, negative results — the field needs
   the misses too.

## Common pitfalls

- Single-evidence candidates (pure computational hits) advanced as discoveries.
- Cell-line signatures treated as disease truth.
- Confounding by indication in RWE repurposing signals.
- Safety profiles assumed to transfer across doses, durations, and populations.
- CNS indications for drugs that don't cross the blood-brain barrier.
- No IP/regulatory path — great science nobody can develop.
- Publication bias: only positive repurposing stories get told.
