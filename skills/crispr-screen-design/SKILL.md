---
name: crispr-screen-design
description: Designing CRISPR screens — library choice, pooled screen workflow, MOI, and hit validation.
category: scientific
---

## Overview

crispr-screen-design covers pooled CRISPR screens (knockout, CRISPRi, CRISPRa): choosing libraries
and modalities, designing the screen for statistical power, executing selection and sequencing,
analyzing with MAGeCK-style tools, and validating hits. Pooled screens are powerful but
unforgiving — design errors (low coverage, wrong MOI, bad selection) are discovered after weeks
of work.

## When to use

- Choosing screen modality: knockout (Cas9) vs CRISPRi vs CRISPRa for the question.
- Library selection: genome-wide vs focused, sgRNA count per gene.
- Screen design: cell number, coverage (cells per sgRNA), MOI, replicates.
- Selection schemes: viability, FACS-based, single-cell readouts.
- Analysis: count normalization, hit calling (MAGeCK, BAGEL), QC metrics.
- Hit validation: individual sgRNAs, rescue experiments.

## Core concepts

- **Modality choice.** Knockout (Cas9 cutting): permanent loss-of-function, best for
  non-essential genes; essential genes drop out (useful for essentiality screens, confounding
  for others). CRISPRi (dCas9-KRAB): reversible knockdown, tunable, better for essential
  genes and lncRNAs. CRISPRa (dCas9-VP64/SAM): gain-of-function, for suppressor screens and
  drug-resistance mechanisms. Match modality to the biology — a KO screen for essential-gene
  biology is the wrong tool.
- **Libraries.** Genome-wide (Brunello, GeCKO: ~4-6 sgRNAs/gene, ~75k sgRNAs) vs focused
  (kinases, epigenetic regulators, custom). More sgRNAs per gene = more power but bigger
  screens. Use validated libraries; custom libraries need sgRNA efficiency prediction
  (Rule Set 2, DeepHF) and off-target filtering.
- **Coverage.** 500-1000x cells per sgRNA at transduction, maintained through the screen
  (bottlenecks during passaging destroy representation). For a 75k library at 500x: 37.5M
  cells transduced — plan incubator space accordingly. Coverage is the screen's sample size;
  skimping here is the commonest fatal error.
- **MOI.** 0.3-0.5 (Poisson: mostly single integrants). Higher MOI confounds (multiple KOs
  per cell); verify by antibiotic-resistance titration or fluorescent reporter. Low MOI wastes
  cells but keeps interpretation clean — accept the waste.
- **Selection.** Viability/proliferation (simplest; dropout = essential/sensitizing,
  enrichment = resistance/suppressor); FACS (reporter-based, e.g. surface marker or fluorescent
  sensor — bins must be wide enough for coverage); single-cell (Perturb-seq: transcriptome per
  perturbation — rich but expensive). Match selection stringency to keep coverage in the
  selected population.
- **Controls.** Non-targeting sgRNAs (negative; ~1000 for good null distribution), essential-
  gene sgRNAs (positive controls for dropout screens — if they don't drop out, the screen
  failed), and safe-targeting controls. QC the screen on controls before believing hits.
- **Analysis.** NGS of integrated sgRNA cassettes → counts → normalization (median ratio,
  control-based) → hit calling: MAGeCK (RRA), BAGEL (essentiality), or CRISPhieRmix. Check:
  library representation (Gini index, missing sgRNAs), replicate correlation, control
  behavior. Hits need FDR control and effect-size ranking.
- **Validation.** Individual sgRNA knockouts (2-3 per gene, distinct from screen guides),
  rescue by cDNA re-expression (gold standard for on-target proof), and orthogonal
  perturbations (CRISPRi vs KO agreement). Screen hits are candidates until validated —
  expect 30-70% validation rates.

## Practical workflow

1. **Design.** Modality, library, coverage calculation, MOI, replicates (≥3), controls,
   selection scheme — all on paper first.
2. **Pilot.** Transduction titration (MOI), Cas9 activity test (essential-gene dropout or
   reporter), selection condition calibration.
3. **Execute.** Transduce at scale, select, maintain coverage through passaging (count cells!),
   harvest with representation preserved.
4. **Sequence.** PCR of sgRNA cassettes with UMIs/indexing; sequence to adequate depth
   (≥100 reads/sgRNA average).
5. **Analyze.** QC (Gini, controls, replicates) → MAGeCK/BAGEL → ranked hits with FDR.
6. **Validate.** Top hits with individual guides + rescue; dose-response where relevant.
7. **Report.** Library version, coverage, MOI, selection details, analysis parameters, and
   validation rates (including failures).

## Common pitfalls

- Under-coverage (the screen's silent killer — bottlenecks during passaging).
- MOI too high (multiple perturbations per cell).
- Wrong modality for the question (KO screen for essential-gene function).
- No positive controls (can't tell a failed screen from a negative result).
- Over-stringent selection wiping out library representation.
- Screen hits published without individual validation.
- Off-target effects ignored (no rescue experiments).
