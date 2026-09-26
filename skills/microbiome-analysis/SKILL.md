---
name: microbiome-analysis
description: 16S and microbiome data analysis — denoising, diversity, differential abundance, and compositional methods.
category: scientific
---

## Overview

microbiome-analysis covers marker-gene (16S/ITS) and general microbiome data analysis:
denoising to ASVs, taxonomic assignment, diversity analysis (alpha/beta), differential
abundance with compositional methods, and linking microbiome to host phenotypes. For shotgun
metagenomics, see metagenomics — this skill focuses on the amplicon workflow and the
statistical principles shared across microbiome data types.

## When to use

- 16S experimental design: variable region, controls, sequencing depth.
- Denoising: DADA2 (ASVs) vs OTU clustering — and why ASVs won.
- Taxonomic assignment: SILVA, Greengenes2, RDP — database choice.
- Alpha diversity: Shannon, Faith's PD, observed ASVs — and rarefaction debates.
- Beta diversity: UniFrac, Bray-Curtis, ordination (PCoA/NMDS).
- Differential abundance: ANCOM-BC, ALDEx2, MaAsLin2 — compositional correctness.
- Contamination: decontam with blanks, low-biomass precautions.

## Core concepts

- **ASVs over OTUs.** DADA2 denoising resolves exact sequence variants (single-nucleotide
  resolution) — superior to 97% OTU clustering in accuracy and comparability across
  studies. OTUs are legacy; use ASVs for new work.
- **Variable region choice.** V4 (515F/806R): the standard, good for gut; V3-V4: longer,
  better resolution, harder to merge paired reads; V1-V2: skin/oral. Region choice affects
  taxonomic resolution and cross-study comparability — match the field standard for your
  environment or justify deviation.
- **Controls.** Extraction blanks + PCR negatives every batch (decontam identifies
  contaminants by prevalence in blanks vs samples, or by inverse correlation with DNA
  concentration); mock communities validate the pipeline end-to-end. Low-biomass samples
  (lung, skin, placenta) are contamination-dominated without rigorous controls.
- **Taxonomy.** SILVA (comprehensive, regularly updated) or Greengenes2 (unified
  16S/shotgun taxonomy) for assignment; naive-Bayes classifiers trained on the amplified
  region outperform BLAST for short reads. Species-level 16S assignment is unreliable for
  most taxa — report genus-level as the working resolution.
- **Alpha diversity.** Within-sample: observed ASVs (richness), Shannon (richness +
  evenness), Faith's PD (phylogenetic). Compare with appropriate models — rarefying to
  equal depth is common but statistically criticized; alternatives include coverage-based
  rarefaction or model-based approaches. Never compare alpha diversity across wildly
  different depths without addressing depth.
- **Beta diversity.** Between-sample: Bray-Curtis (abundance), UniFrac (phylogenetic —
  weighted/unweighted). Ordinate with PCoA; test with PERMANOVA (adonis2) including
  confounders and checking dispersion (betadisper — PERMANOVA confounds location and
  dispersion differences). Visual clusters need statistical testing, and significant
  PERMANOVA needs effect-size reporting (R²).
- **Differential abundance: compositional or wrong.** 16S data are compositional (relative).
  Use ANCOM-BC, ALDEx2, or MaAsLin2 — not t-tests on relative abundances, not LEfSe
  (inflated false positives). Report effect sizes and prevalence alongside significance;
  a "significant" taxon present in 5% of samples is usually noise.
- **Confounders.** Diet, medication (especially antibiotics/proton-pump inhibitors), age,
  geography, and technical batch dominate microbiome variation — often exceeding the
  biological signal of interest. Collect metadata exhaustively; model confounders
  explicitly; be skeptical of disease associations that vanish after adjustment.
- **Correlation ≠ causation.** Almost every disease has a published "dysbiosis" signature;
  most don't replicate and none establish causality alone. Gnotobiotic transfer experiments
  or longitudinal/interventional designs are needed for causal claims.

## Practical workflow

1. **Design.** Variable region, blanks + mocks per batch, metadata collection, depth
   (10-50k reads/sample typical for gut).
2. **Denoise.** DADA2: filter/trim by quality profiles, learn errors, infer ASVs, remove
   chimeras; track read retention at each step.
3. **Decontaminate.** decontam with blanks; remove mitochondria/chloroplast; filter
   ultra-rare ASVs judiciously.
4. **Assign.** Region-trained classifier vs SILVA/Greengenes2; sanity-check top taxa
   against expectations for the environment.
5. **Diversity.** Alpha (with depth handling) and beta (UniFrac/Bray-Curtis + PERMANOVA
   with confounders + dispersion check).
6. **Differential abundance.** ANCOM-BC/ALDEx2/MaAsLin2 with covariates; prevalence
   filters; effect sizes.
7. **Report.** QIIME 2 provenance or full code, database versions, decontamination
   results, confounder modeling, and data deposition (SRA).

Example command sketch:
```bash
qiime dada2 denoise-paired --i-demultiplexed-seqs demux.qza \
  --p-trim-left-f 0 --p-trunc-len-f 240 --p-trunc-len-r 200 --o-table table.qza ...
qiime feature-classifier classify-sklearn --i-classifier silva-v4-classifier.qza ...
```

## Common pitfalls

- OTU clustering on new data (use ASVs).
- No blanks in low-biomass studies (contamination as discovery).
- t-tests/LEfSe on relative abundances (compositional fallacies).
- PERMANOVA without dispersion checks or confounder modeling.
- Rare taxa over-interpreted (prevalence matters).
- Cross-region comparisons (V4 vs V3-V4 don't compare directly).
- Causal language for cross-sectional associations.
