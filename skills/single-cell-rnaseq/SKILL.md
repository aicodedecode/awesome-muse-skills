---
name: single-cell-rnaseq
description: Single-cell RNA-seq analysis — QC, normalization, clustering, annotation, and trajectory inference.
category: scientific
---

## Overview

single-cell-rnaseq covers the standard scRNA-seq analysis pipeline: quality control at the cell
level, normalization for sparse count data, dimensionality reduction, clustering, cell-type
annotation, differential expression, and trajectory inference. Single-cell data is sparse,
noisy, and batch-sensitive — the pipeline choices matter more here than in bulk RNA-seq.

## When to use

- QC: doublet detection, ambient RNA, mitochondrial content, empty droplets.
- Normalization: log-normalization, SCTransform, size factors for sparse data.
- Dimensionality reduction: PCA, UMAP/t-SNE (and their limits).
- Clustering: Louvain/Leiden, resolution selection, cluster validation.
- Cell-type annotation: marker genes, reference mapping (Azimuth, SingleR).
- Differential expression between clusters or conditions (pseudobulk vs single-cell tests).
- Trajectory/pseudotime: Monocle, Slingshot, RNA velocity — with skepticism.
- Integration: Harmony, Seurat integration, scVI for batch correction.

## Core concepts

- **QC metrics per cell.** nUMI (total counts), nGene (detected genes), mitochondrial %
  (high = dying/stressed cells; threshold tissue-dependent, typically 10-20%), ribosomal %.
  Filter dead cells and empty droplets — but set thresholds from the data distribution, not
  from a tutorial's defaults. Doublet detection (Scrublet, DoubletFinder): expected rate rises
  with cell loading; remove predicted doublets before clustering.
- **Ambient RNA.** Soup from lysed cells contaminates every droplet (SoupX, CellBender).
  Decontamination matters most for tissues with fragile cell types — marker genes of absent
  cell types appearing everywhere is the telltale sign.
- **Normalization.** Log-normalize (counts per 10k, log1p) is the baseline; SCTransform
  (regularized negative binomial) stabilizes variance better for heterogeneous data. The
  choice affects variable-gene selection and clustering — check robustness.
- **Highly variable genes.** Select 2000-3000 HVGs for PCA; exclude cell-cycle genes if cell
  cycle isn't of interest (or regress it out); beware that HVG selection drives everything
  downstream — it's a choice, not a fact.
- **Clustering.** PCA → nearest-neighbor graph → Leiden/Louvain; resolution parameter sets
  granularity — there is no "correct" resolution, only resolutions matched to the biological
  question. Validate clusters with marker genes; over-clustering creates meaningless
  subdivisions (check with differential expression — clusters without markers are suspect).
- **Annotation.** Manual (canonical markers — the gold standard, requires expertise),
  reference-based (Azimuth, SingleR, scArches — fast, but reference quality limits results),
  or hybrid. Never trust automated labels blindly — verify with marker expression.
- **Differential expression.** Pseudobulk (aggregate by sample, then DESeq2/edgeR) is
  statistically sound for condition comparisons — single-cell-level tests (Wilcoxon on cells)
  inflate significance massively by treating cells as independent replicates. This is the
  most consequential analysis choice in the field.
- **Integration.** Harmony, Seurat CCA, scVI align batches/conditions. Danger: over-correction
  erases real biological differences between conditions. Integrate for cell-type structure;
  be conservative when conditions are the comparison of interest — check that known biology
  survives integration.
- **Trajectories.** Pseudotime orders cells along inferred paths; RNA velocity adds direction
  via spliced/unspliced ratios. Both are inference, not measurement — validate with lineage
  tracing or time-series data; velocity is fragile to gene-selection and kinetic assumptions.

## Practical workflow

1. **QC.** Distributions of nUMI/nGene/mito%; doublet detection; ambient RNA removal;
   filter with data-driven thresholds.
2. **Normalize + HVG.** SCTransform or log-normalize; select HVGs; decide on cell-cycle
   handling.
3. **Reduce + cluster.** PCA (check elbow), UMAP for visualization, Leiden at 2-3
   resolutions; marker-based validation.
4. **Annotate.** Canonical markers first; reference mapping as support; document evidence
   per cluster.
5. **Compare conditions.** Pseudobulk DE; compositional analysis (proportions need proper
   methods — scDC, propeller — not t-tests on percentages).
6. **Trajectories (if warranted).** With validation, not as default output.
7. **Report.** QC thresholds and cell counts at each step, normalization, resolution,
   annotation evidence, and the code + count matrices.

Example (scanpy sketch):
```python
import scanpy as sc
sc.pp.filter_cells(adata, min_genes=200); sc.pp.filter_genes(adata, min_cells=3)
sc.pp.normalize_total(adata); sc.pp.log1p(adata)
sc.pp.highly_variable_genes(adata, n_top_genes=2000)
sc.tl.pca(adata); sc.pp.neighbors(adata); sc.tl.leiden(adata, resolution=0.5)
sc.tl.umap(adata); sc.pl.umap(adata, color=["leiden", "CD3D", "MS4A1"])
```

## Common pitfalls

- Single-cell-level DE tests treating cells as replicates (massive false positives).
- Over-integration erasing condition differences.
- Clustering resolution chosen to produce "interesting" results.
- Automated annotation accepted without marker verification.
- Pseudotime presented as measured developmental time.
- QC thresholds copied from tutorials, inappropriate for the tissue.
- Doublets/ambient RNA ignored (phantom cell types).
