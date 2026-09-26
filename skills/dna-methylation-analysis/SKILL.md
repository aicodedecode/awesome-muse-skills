---
name: dna-methylation-analysis
description: DNA methylation analysis — array and bisulfite-seq processing, DMP/DMR calling, and epigenetic clocks.
category: scientific
---

## Overview

dna-methylation-analysis covers measuring and analyzing DNA methylation (5mC): Illumina arrays
(450K/EPIC) and bisulfite sequencing (WGBS/RRBS), processing pipelines (minfi, Bismark),
differential methylation (DMPs/DMRs), cell-type deconvolution, and epigenetic clocks. Methylation
is tissue- and cell-type-specific — every analysis must reckon with cellular heterogeneity.

## When to use

- Platform choice: EPIC arrays vs WGBS vs RRBS vs targeted bisulfite-seq.
- Array processing: minfi pipeline — QC, normalization (functional/BMIQ), probe filtering.
- Bisulfite-seq: Bismark alignment, methylation calling, coverage requirements.
- DMP/DMR analysis: limma-based, bumphunter, DMRcate.
- Cell-type heterogeneity: reference-based deconvolution, ReFACTor.
- Epigenetic clocks: Horvath, Hannum, PhenoAge, GrimAge — computing and interpreting.
- EWAS design: confounders, batch effects, multiple testing at 850K CpGs.

## Core concepts

- **Platform trade-offs.** EPIC arrays (~935K CpGs): cheap, standardized, great for EWAS —
  but biased to promoters/CpG islands and miss most of the methylome. WGBS: whole-genome,
  unbiased, expensive (30x needed), heavy compute. RRBS: enriches CpG-dense regions at
  moderate cost. Targeted: deep coverage of candidate regions. Match platform to question
  and budget.
- **Beta vs M values.** Beta (0-1, interpretable as methylation proportion) for display;
  M-value (logit, homoscedastic) for statistics. Run tests on M-values, present betas —
  testing on betas violates linear-model assumptions at the extremes.
- **Array QC (minfi).** Detection p-values (failed probes/samples), control probes
  (bisulfite conversion, staining, hybridization), sex prediction vs reported sex
  (mislabeled samples), SNP probes for sample identity tracking. Remove failed samples
  before normalization, not after analysis.
- **Normalization.** Functional normalization (uses control probes — good default),
  BMIQ (Type I/II probe bias correction), Noob (background + dye-bias). Type I vs Type II
  probe chemistry differences must be corrected — uncorrected, they dominate the signal.
  Check density plots before/after: bimodal betas (0/1 peaks) should be clean.
- **Probe filtering.** Cross-reactive probes (Chen et al. list), SNP-overlapping probes
  (genetic variation masquerading as methylation), sex chromosomes (unless studying them).
  Filter before analysis — these probes generate false DMPs reliably.
- **Cell-type heterogeneity.** Blood methylation reflects cell composition; a "disease DMP"
  may just be shifted neutrophil/lymphocyte ratios. Solutions: reference-based
  deconvolution (Houseman/IDOL libraries) with cell proportions as covariates; ReFACTor
  (reference-free) when no reference exists; or sort cells upfront (best, expensive).
  Always address this — reviewers will ask.
- **DMPs and DMRs.** DMPs: limma on M-values with FDR (850K tests — genome-wide
  significance ~1e-7-ish by Bonferroni, FDR standard). DMRs: bumphunter/DMRcate find
  spatially correlated regions — biologically more interpretable than isolated CpGs
  (single-CpG hits are often technical). Report effect sizes (delta-beta): statistically
  significant 1% methylation differences are rarely biologically meaningful.
- **Batch effects.** Arrays are batch-sensitive (plate, chip position): randomize samples
  across chips, include batch in models, use ComBat/sva when needed. Never confound batch
  with phenotype.
- **Epigenetic clocks.** Horvath (multi-tissue), Hannum (blood), PhenoAge/GrimAge
  (mortality-trained) predict biological age; age acceleration (residual vs chronological
  age) associates with disease/mortality. Compute with published coefficients; interpret
  as biomarker, not as "true aging rate" — clocks are correlative and tissue-dependent.

## Practical workflow

1. **Design.** Platform choice; randomization across batches; collect cell-count or
   sorting data; power for 850K tests (n in hundreds for EWAS).
2. **QC.** Detection p-values, control probes, sex check, identity SNPs; drop failures.
3. **Normalize.** Functional normalization + BMIQ; probe filtering (cross-reactive, SNP,
   sex); density-plot checks.
4. **Deconvolve.** Cell proportions estimated; include as covariates (or analyze sorted
   cells).
5. **Test.** limma on M-values (DMPs, FDR); bumphunter/DMRcate (DMRs); delta-beta effect
   sizes; batch in the model.
6. **Interpret.** Annotate to genes/regulatory features; pathway enrichment on DMR genes;
   validate top loci by targeted bisulfite-seq/pyrosequencing.
7. **Clocks (if relevant).** Compute age acceleration; associate with phenotype; report
   clock version.
8. **Report.** Platform, normalization, filtering, cell-type handling, full summary
   statistics, GEO deposition.

Example (R sketch):
```r
library(minfi)
rgSet <- read.metharray.exp("idats/")
qc <- getQC(preprocessRaw(rgSet)); plotQC(qc)
mSet <- preprocessFunnorm(rgSet)          # functional normalization
beta <- getBeta(mSet); M <- getM(mSet)
fit <- eBayes(lmFit(M, design))           # DMPs on M-values
```

## Common pitfalls

- Testing on beta values instead of M-values.
- Cell-type confounding presented as disease signal.
- Cross-reactive/SNP probes left in (false DMPs).
- Batch confounded with phenotype.
- Single-CpG hits over-interpreted (prefer DMRs).
- Tiny delta-betas (1-2%) treated as biologically meaningful.
- Array findings extrapolated to the whole methylome.
- Epigenetic age acceleration equated with proven aging biology.
