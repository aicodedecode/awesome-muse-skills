---
name: pathway-enrichment
description: Pathway and gene-set enrichment analysis — ORA, GSEA, background sets, and honest interpretation.
category: scientific
---

## Overview

pathway-enrichment covers testing whether gene lists or ranked gene profiles concentrate in
known pathways: over-representation analysis (ORA), gene set enrichment analysis (GSEA),
topology-aware methods, database choice (GO, KEGG, Reactome, MSigDB), and the interpretation
discipline that keeps enrichment from becoming story-telling. Enrichment generates hypotheses —
it doesn't confirm mechanisms.

## When to use

- Interpreting DE gene lists: which pathways are over-represented (ORA).
- Ranked-list analysis without thresholds: GSEA/fgsea.
- Choosing gene-set databases: GO, KEGG, Reactome, WikiPathways, MSigDB Hallmark.
- Background/universe selection and why it matters.
- Topology-aware methods: accounting for pathway structure.
- Visualizing and reporting enrichment: dot plots, enrichment maps, tables.

## Core concepts

- **ORA (over-representation analysis).** Hypergeometric/Fisher test: are pathway genes
  over-represented in your DE list vs background? Threshold-dependent (your padj/log2FC
  cutoffs choose the input) — different thresholds give different "pathways." Always report
  the thresholds; test sensitivity to them.
- **The background set is the analysis.** The universe must be the genes that could have
  been detected — for RNA-seq, expressed genes; for proteomics, detected proteins; for
  CRISPR screens, library genes. Whole-genome background inflates everything (your assay
  never tested most of those genes). This single choice changes results more than the
  method.
- **GSEA.** Walks the ranked gene list (ranked by signed statistic — log2FC × −log10 padj,
  or Wald statistic), scoring pathway enrichment without thresholds. Preferred when you
  have a meaningful ranking; permutation-based significance (phenotype permutation when
  n permits, gene-set permutation otherwise). fgsea is the fast implementation.
- **Multiple testing.** Hundreds-thousands of gene sets tested: FDR control (BH) mandatory;
  report adjusted p-values and the number of sets tested. Unadjusted p<0.05 across 5000
  sets guarantees ~250 false positives.
- **Redundancy.** GO terms overlap massively (parent-child, shared genes) — the top 20
  "pathways" are often one pathway restated. Handle with: REVIGO semantic clustering,
  enrichment maps (Cytoscape), or focused databases (MSigDB Hallmark's 50 sets). Report
  the redundancy, don't hide it.
- **Database choice.** GO (comprehensive, redundant, mixed quality); KEGG (pathway maps,
  licensing caveats); Reactome (curated, human-centric); MSigDB Hallmark (distilled,
  interpretable); WikiPathways (community). Match database to organism and question;
  annotation quality varies — a "significant" term from a poorly annotated set means little.
- **Topology-aware methods.** SPIA, graphite-based approaches incorporate pathway topology
  (which genes are upstream) — theoretically superior, practically sensitive to pathway
  diagram accuracy. Useful secondary analysis, not the primary.
- **Direction matters.** Mixed up/down gene lists blur interpretation — run enrichment
  separately for up- and down-regulated genes, or use signed rankings in GSEA. A pathway
  "enriched" with half genes up and half down is ambiguous, not informative.
- **Interpretation limits.** Enrichment reflects annotation bias (well-studied pathways
  enrich more), correlation (co-expressed genes share terms trivially), and the
  threshold/background choices above. It's hypothesis generation — validate with
  experiments, not with more enrichment.

## Practical workflow

1. **Prepare.** DE results with statistics; define background (detected/expressed genes);
   choose database(s) appropriate to organism.
2. **ORA.** clusterProfiler enrichGO/enrichKEGG on thresholded lists (up/down separately);
   universe = background; BH correction.
3. **GSEA.** fgsea on the full ranked list (signed statistic); MSigDB Hallmark + GO/KEGG.
4. **De-redundify.** Enrichment maps or REVIGO; report representative terms with the full
   table in supplements.
5. **Sensitivity.** Vary thresholds and background; note which findings are robust.
6. **Report.** Database versions, thresholds, background definition, full results tables,
   and explicit hypothesis-not-conclusion framing.

Example (R sketch):
```r
library(clusterProfiler); library(fgsea)
ego <- enrichGO(de_genes, OrgDb=org.Hs.eg.db, universe=expressed_genes,
                pAdjustMethod="BH", qvalueCutoff=0.05)
ranks <- setNames(res$stat, rownames(res))
fgseaRes <- fgsea(pathways=hallmark, stats=ranks, nperm=10000)
```

## Common pitfalls

- Whole-genome background (inflated enrichment).
- Unadjusted p-values across thousands of sets.
- Redundant GO terms reported as independent findings.
- Up/down genes pooled (direction lost).
- Threshold shopping until favorite pathway appears.
- Annotation bias ignored (well-studied = enriched).
- Enrichment presented as mechanistic proof.
