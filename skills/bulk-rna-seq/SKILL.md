---
name: bulk-rna-seq
description: Bulk RNA-seq differential expression — experimental design, count modeling with DESeq2/edgeR, and enrichment.
category: scientific
---

## Overview

bulk-rna-seq covers the standard bulk RNA-seq workflow: experimental design (replicates,
batching, depth), read quantification, differential expression with DESeq2/edgeR/limma-voom,
and downstream interpretation (enrichment, visualization). Bulk RNA-seq remains the workhorse
transcriptomic assay — cheaper and statistically better-powered than single-cell for
condition comparisons.

## When to use

- Experimental design: replicate numbers, randomization, batch planning, depth.
- Quantification: Salmon/kallisto (fast, bias-aware) vs STAR + featureCounts.
- Differential expression: DESeq2, edgeR, limma-voom — choosing and configuring.
- Contrasts and complex designs: interactions, time series, paired designs.
- QC: PCA, sample correlations, outlier handling, batch-effect diagnosis.
- Enrichment: ORA, GSEA, and background-set discipline.
- Visualization: volcano plots, heatmaps, MA plots.

## Core concepts

- **Design first.** ≥3 biological replicates per condition (more for variable systems —
  clinical samples need 6+); randomize processing order; block batches across conditions
  (never confound batch with condition — the cardinal sin); decide depth by question
  (20-30M reads standard; more for splicing/rare transcripts). Power analysis via
  Scotty/RNASeqPower for grant proposals.
- **Quantification.** Salmon/kallisto with GC/sequence-bias correction are fast and accurate
  for gene-level DE; STAR + featureCounts when you need alignments (splicing, variants).
  Summarize to gene level with tximport (transcript-level uncertainty matters — don't
  ignore it). Use the same annotation (GENCODE/Ensembl version) throughout.
- **Count models.** RNA-seq counts are overdispersed — Poisson is wrong. DESeq2/edgeR fit
  negative binomial models with empirical-Bayes dispersion shrinkage; limma-voom transforms
  for linear modeling (good for complex designs). All three agree most of the time —
  pick one and know it well.
- **Normalization.** DESeq2 size factors / edgeR TMM estimate library-size + compositional
  effects. Never run DE on TPM/FPKM/RPKM. Check size factors for outliers (a sample with
  extreme size factor is telling you something).
- **The DESeq2 workflow.** `DESeqDataSetFromTximport` → `DESeq` → results with contrast →
  lfcShrink (apeglm/ashr — shrinkage stabilizes noisy fold changes, essential for ranking
  and visualization) → FDR control (Benjamini-Hochberg, typically padj < 0.05 + |log2FC|
  threshold chosen biologically, not by default).
- **QC before DE.** PCA and sample-distance heatmaps first: outliers, batch effects, and
  mislabeled samples show up here. Investigate before modeling — removing an outlier
  post-hoc because it "ruins" the result is p-hacking; prespecified QC criteria aren't.
- **Batch effects.** Include batch in the design formula when unconfounded; use
  RUVSeq/sva when batch is unknown but PCA shows structure; ComBat-seq for
  batch-corrected counts. If batch is confounded with condition, the experiment is
  uninterpretable — redesign, don't "correct."
- **Enrichment.** ORA (hypergeometric on DE gene lists — threshold-dependent, use the
  detected gene universe as background, not the whole genome); GSEA (ranked-list, no
  threshold — generally preferred); both need multiple-testing correction and
  redundancy-aware interpretation (GO terms overlap heavily — use REVIGO or enrichment
  maps). An enriched pathway is a hypothesis, not a mechanism.
- **Complex designs.** Paired samples (`~patient + condition`), interactions
  (`~genotype*treatment`), time series (likelihood-ratio tests, impulse models). Write the
  design formula from the experimental structure, not by trial and error.

## Practical workflow

1. **Design.** Replicates, randomization, batch blocking, depth — on paper, before libraries.
2. **Quantify.** Salmon with bias correction → tximport to gene level; MultiQC over logs.
3. **QC.** PCA, distances, size factors; handle outliers by prespecified criteria.
4. **Model.** DESeq2/edgeR with the design reflecting the experiment; check dispersion plots.
5. **Extract.** Contrasts of interest; lfcShrink; padj + effect-size thresholds.
6. **Interpret.** Volcano/MA plots; GSEA on ranked lists; heatmaps of top genes (z-scored,
   annotated with condition bars).
7. **Validate.** qPCR on key genes (independent samples ideally); functional follow-up for
   load-bearing claims.
8. **Report.** Design, software versions, thresholds, full results tables (not just
   "significant" genes), GEO deposition.

Example (R sketch):
```r
library(DESeq2)
dds <- DESeqDataSetFromTximport(txi, colData, ~batch + condition)
dds <- DESeq(dds)
res <- lfcShrink(dds, coef="condition_treated_vs_control", type="apeglm")
plotMA(res); EnhancedVolcano(res, lab=rownames(res), x="log2FoldChange", y="padj")
```

## Common pitfalls

- Batch confounded with condition (unfixable).
- DE on TPM/FPKM instead of raw counts.
- Unshrunk log2FCs ranked and interpreted (noise at low counts).
- Outliers removed post-hoc to improve results.
- GO enrichment with whole-genome background (inflated).
- Enriched pathways reported as mechanistic findings.
- n=2 per group presented as adequately powered.
