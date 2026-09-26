---
name: proteomics-pro
description: Mass-spectrometry proteomics — experimental design, data processing, quantification, and functional interpretation.
category: scientific
---

## Overview

proteomics-pro covers mass-spectrometry-based proteomics from experimental design to biological
interpretation: sample preparation, LC-MS/MS acquisition strategies (DDA, DIA, targeted), database
searching, quantification (label-free, TMT/iTRAQ, SILAC), and downstream analysis including
differential expression, PTM analysis, and pathway enrichment.

Proteomics data is noisier and more incomplete than transcriptomics — missing values are the norm,
dynamic range spans orders of magnitude, and peptide-to-protein inference is genuinely ambiguous.
This skill emphasizes designs and statistics that are robust to those realities.

## When to use

- Designing a proteomics experiment: DDA vs DIA vs targeted (PRM/MRM), labeling strategy,
  replication, and randomization of run order.
- Processing raw MS data: database search (MaxQuant, FragPipe/MSFragger, Proteome Discoverer),
  FDR control, protein inference.
- Quantification: label-free (LFQ), isobaric tags (TMT), or metabolic labeling (SILAC) — trade-offs
  and analysis per method.
- Differential analysis: which proteins change, with proper missing-value and multiple-testing
  handling.
- PTM analysis: phosphorylation, ubiquitination, acetylation enrichment and site localization.
- Interpreting results: enrichment, networks, integration with transcriptomics.
- Troubleshooting: low IDs, high missingness, batch effects across MS runs.

## Core concepts

- **Acquisition modes.** DDA (data-dependent): stochastic, deep, but missing values across runs.
  DIA (data-independent): systematic, reproducible quantification, needs spectral libraries or
  library-free tools (DIA-NN). Targeted (PRM/MRM): maximum sensitivity for a predefined panel.
  DIA is now the default for discovery; DDA for library building; targeted for validation.
- **FDR at three levels.** PSM, peptide, and protein FDR (target-decoy, typically 1%). Protein
  FDR is what matters for the final list — 1% PSM FDR does not imply 1% protein FDR.
- **Protein inference problem.** Shared peptides map to multiple proteins; parsimony groups them.
  Report protein groups, not "proteins," and beware single-peptide identifications.
- **Quantification methods.** Label-free: simple, unlimited samples, needs careful normalization
  and suffers run-to-run missingness. TMT: multiplexed (up to 18-plex), great throughput, but
  ratio compression underestimates fold changes. SILAC: accurate, but limited to culturable cells
  and few conditions.
- **Missing values are structural.** In DDA, missingness correlates with low abundance (MNAR) —
  imputing with zeros or means biases results. Use methods that model censoring, or switch to DIA.
  Always report missingness rates per condition before any test.
- **Normalization.** Median centering, variance stabilization (vsn), or TMM-like approaches on
  log-intensities. Check MA plots and PCA — MS batch effects (column changes, instrument drift)
  are common and strong.
- **PTM analysis.** Enrichment (TiO2/IMAC for phospho, antibodies for ubiquitin remnant motifs)
  is mandatory — unenriched runs see almost no modified peptides. Site localization probability
  (e.g. >0.75) separates confident sites from ambiguous ones.
- **Dynamic range.** Plasma spans ~10 orders of magnitude; without depletion or fractionation you
  will measure albumin and ~200 friends. Match the sample prep to the question.

## Practical workflow

1. **Design.** ≥3 biological replicates per condition (more for clinical cohorts); randomize run
   order; include pool QCs every ~10 runs; decide DDA/DIA/targeted and labeling upfront.
2. **Sample prep.** Consistent lysis, reduction/alkylation, digestion (trypsin, check missed
   cleavages), desalting. Document everything — prep variation dominates technical variation.
3. **Acquisition.** DDA for libraries, DIA for quantification. Record instrument, gradient length,
   and method files. Run pool QCs to monitor drift.
4. **Search.** MSFragger/FragPipe or MaxQuant against the right proteome (UniProt, correct
   species + isoforms), 1% PSM/peptide/protein FDR, fixed carbamidomethylation, variable
   oxidation/acetylation. Check ID counts and missed-cleavage rates.
5. **QC.** PCA, correlation heatmaps, missingness per sample, intensity distributions. Remove or
   flag failed runs before statistics — never after seeing which removal "helps."
6. **Statistics.** Log-transform, normalize, then limma-style moderated tests or MSstats with FDR
   control. Report log2 fold changes with adjusted p-values; validate top hits by targeted MS or
   orthogonal assays.
7. **Interpretation.** Enrichment (GO/KEGG/Reactome via clusterProfiler), network analysis
   (STRING), PTM motif analysis. Integrate with RNA-seq where available — correlation is modest,
   and the discordance is often the interesting part.

Example command sketch:
```bash
fragpipe --headless --config phospho.config    # MSFragger search + Philosopher
# then in R:
library(MSstats); library(limma)
fit <- lmFit(log2(exprs), design); fit <- eBayes(fit)
topTable(fit, adjust = "BH", number = Inf)
```

## Common pitfalls

- Too few replicates (n=2 per group cannot support a t-test worth trusting).
- Running samples in group order — instrument drift becomes a "biological" difference.
- Imputing DDA missing values with zeros, creating fake significant hits.
- Reporting single-peptide protein identifications as confident.
- TMT ratio compression interpreted as small biological effect.
- Wrong database (wrong species, outdated UniProt) silently losing identifications.
- Over-interpreting GO enrichment from a biased background (use the detected proteome, not the
  whole genome, as background).
