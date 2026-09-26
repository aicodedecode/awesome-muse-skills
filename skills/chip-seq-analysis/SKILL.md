---
name: chip-seq-analysis
description: ChIP-seq analysis — peak calling, differential binding, motif discovery, and QC with phantom-peak metrics.
category: scientific
---

## Overview

chip-seq-analysis covers chromatin immunoprecipitation sequencing from raw reads to biological
interpretation: QC specific to ChIP (fragment size, enrichment metrics), peak calling (MACS2),
differential binding (DiffBind/DESeq2), motif discovery, and annotation of peaks to regulatory
function. ChIP-seq quality is dominated by the antibody — the analysis can only work with what
the IP enriched.

## When to use

- Experimental design: antibody validation, controls (input/IgG), replicate numbers, depth.
- QC: cross-correlation, FRiP, library complexity, strand cross-correlation.
- Peak calling: MACS2 parameters for narrow (TFs) vs broad (histone marks) peaks.
- Differential binding: DiffBind, proper count-based statistics.
- Motif discovery: HOMER, MEME — finding and validating motifs.
- Peak annotation: genomic distribution, target-gene assignment, overlap analysis.
- Visualization: genome browser tracks, heatmaps, metaplots.

## Core concepts

- **Antibody first.** Validate by western blot + IP-western or, ideally, ChIP-qPCR on known
  positive/negative loci before sequencing. ENCODE antibody validation guidelines exist for
  a reason — most failed ChIP-seqs trace to unvalidated antibodies. Polyclonal lot variation
  is real; record lots.
- **Controls.** Input (sonicated chromatin, no IP) is the essential control — models local
  biases (copy number, chromatin accessibility, mappability). IgG controls for non-specific
  binding but doesn't replace input. Sequence input to comparable depth.
- **Fragment size.** Sonication/MNase to 200-500 bp; verify on Bioanalyzer before IP.
  Fragment size determines resolution — and MACS2's shifting model estimates it, but garbage
  in (kilobase fragments) means garbage out.
- **QC metrics.** NSC/RSC (normalized/relative strand cross-correlation — measures
  clustering of reads; ENCODE thresholds: NSC >1.05, RSC >0.8); FRiP (fraction of reads in
  peaks — the enrichment summary; good TF ChIP >1%, great >5%; histone marks higher);
  library complexity (PCR bottleneck coefficient — low complexity = over-amplified);
  replicate concordance. Check these before peak interpretation.
- **Peak calling (MACS2).** Narrow peaks (TFs): default MACS2 with q-value cutoff
  (q<0.01-0.05). Broad peaks (H3K27me3, H3K36me3): `--broad` mode. Always call against
  input control; don't call peaks on merged replicates then "validate" in individuals
  (call in each, assess overlap — IDR framework for replicate concordance).
- **IDR (irreproducible discovery rate).** Ranks peaks by consistency across replicates —
  the principled way to define a consensus peak set. ENCODE standard; use it instead of
  arbitrary overlap thresholds.
- **Differential binding.** DiffBind: consensus peak set → count reads per peak per sample
  → DESeq2/edgeR statistics. This is RNA-seq-style count modeling on peaks — same rules
  (replicates, FDR, effect sizes). Don't compare peak lists by Venn diagram overlap;
  test quantitatively.
- **Motif discovery.** HOMER or MEME-ChIP on top peaks (500-1000 strongest); expect the
  known motif for the factor (positive control — if the factor's own motif isn't enriched,
  question the experiment); de novo motifs need validation (don't name a "novel motif"
  from one experiment). Central enrichment of motifs within peaks supports direct binding.
- **Annotation.** Genomic distribution (promoter/intronic/intergenic vs expected); target
  gene assignment (nearest TSS is crude — use GREAT or activity-by-contact models for
  enhancers); overlap with other marks (chromatin states via ChromHMM). A peak list without
  functional annotation is a phone book.

## Practical workflow

1. **Validate antibody.** IP-western/ChIP-qPCR before sequencing; record lot.
2. **Prepare.** Fragment to 200-500 bp; input control; ≥2 biological replicates;
   20M+ reads for TFs, more for broad marks.
3. **Align + QC.** Bowtie2/BWA; deduplicate; compute NSC/RSC, FRiP (after preliminary
   peaks), complexity; check replicate correlation.
4. **Call peaks.** MACS2 (narrow or broad mode) vs input; IDR across replicates for
   consensus set.
5. **Differential.** DiffBind consensus → counts → DESeq2; FDR + fold-change thresholds.
6. **Motifs.** HOMER/MEME on top peaks; check known motif; central enrichment.
7. **Annotate + visualize.** Genomic distribution, target genes, browser tracks
   (normalized bigWigs), heatmaps/metaplots at peak sets.
8. **Report.** Antibody (vendor/catalog/lot), QC metrics, peak counts, IDR thresholds,
   GEO deposition.

Example command sketch:
```bash
macs2 callpeak -t chip.bam -c input.bam -f BAM -g hs -n tf_x -q 0.01
# broad marks:
macs2 callpeak -t h3k27me3.bam -c input.bam -f BAM -g hs -n k27 --broad -q 0.05
```

## Common pitfalls

- Unvalidated antibody (enrichment of nothing, confidently peak-called).
- No input control (CNV/accessibility artifacts as "peaks").
- Merged-replicate peak calling without IDR.
- Venn diagrams instead of quantitative differential binding.
- Motif "discovery" without the known-motif positive control.
- Nearest-gene assignment for enhancer peaks (often wrong).
- Ignoring FRiP/NSC failures and interpreting anyway.
