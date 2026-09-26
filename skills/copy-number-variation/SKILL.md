---
name: copy-number-variation
description: Copy-number variant analysis — detection from sequencing/arrays, segmentation, and clinical interpretation.
category: scientific
---

## Overview

copy-number-variation covers detecting deletions and duplications from genomic data: read-depth
methods for WGS/WES, SNP-array approaches (BAF/LRR), segmentation algorithms, and interpreting
CNVs for rare disease and cancer. CNVs are a major cause of Mendelian disease and a key somatic
alteration class — but detection is noisier than SNV calling and interpretation leans heavily on
population databases.

## When to use

- Germline CNV calling from WES/WGS: read-depth methods (GATK gCNV, CNVnator, Manta).
- SNP-array CNV analysis: PennCNV, LRR/BAF interpretation.
- Somatic copy-number in cancer: FACETS, ASCAT (purity/ploidy-aware), GISTIC for recurrent
  regions.
- Segmentation: CBS, HMM approaches, tuning sensitivity.
- Interpretation: DGV, gnomAD-SV, ClinGen dosage sensitivity.
- Validation: qPCR, MLPA, microarray confirmation.

## Core concepts

- **Read-depth principle.** More copies → more reads. Normalize for GC content, mappability,
  and library size; compare against a reference panel (batch-matched — CNV calling without
  a good reference panel is unreliable). WES is uneven by capture efficiency — expect noisier
  calls than WGS; intronic/intergenic CNVs are invisible to WES.
- **WGS structural-variant callers.** Manta, Delly, LUMPY, GRIDSS combine read-depth with
  discordant-pair and split-read evidence — more precise breakpoints than depth alone.
  No single caller finds everything; ensemble approaches (e.g. Parliament2) improve recall.
  Validate breakpoint precision claims — many are ±kb, not base-pair.
- **SNP arrays: LRR and BAF.** Log R Ratio (total intensity → copy number) + B allele
  frequency (allelic ratio → LOH, mosaicism). PennCNV (HMM on LRR/BAF) remains standard.
  Arrays detect mosaicism and UPD that sequencing misses at standard depth — don't discard
  arrays as obsolete.
- **Segmentation.** Circular binary segmentation (DNAcopy), HMMs: partition the genome into
  constant-copy segments. Tuning sensitivity/specificity trade-off: permissive segmentation
  finds small events with more false positives. Require ≥3-10 consecutive probes/bins
  (platform-dependent) to call.
- **Somatic copy-number.** Tumor purity and ploidy confound everything: a deletion in 30%
  pure tumor looks like noise. FACETS/ASCAT jointly estimate purity, ploidy, and
  allele-specific copy number from tumor-normal pairs. GISTIC2 identifies significantly
  recurrent regions across cohorts. Report purity/ploidy with every somatic CNV call.
- **Interpretation: population data.** DGV and gnomAD-SV catalog benign CNVs — a "rare"
  deletion that's common in gnomAD-SV is not pathogenic. Check frequency by ancestry;
  small CNVs (<10 kb) are abundant in healthy genomes.
- **Dosage sensitivity.** ClinGen dosage-sensitivity map: haploinsufficiency (HI) and
  triplosensitivity (TS) scores per gene/region. A deletion's pathogenicity depends on
  whether it hits dosage-sensitive genes — a 2 Mb deletion of gene desert differs from
  200 kb deleting a HI gene.
- **De novo and inheritance.** Trio analysis: de novo CNVs are strong candidates in rare
  disease; inherited CNVs need segregation and population-frequency assessment. Mosaic
  CNVs (detectable by BAF deviation or read-depth mixtures) explain some "negative" cases.
- **Validation.** qPCR/MLPA for small events, microarray for larger, FISH for mosaicism
  questions. NGS-only CNV calls, especially from WES, should be orthogonally confirmed
  before clinical reporting.

## Practical workflow

1. **Choose method.** WGS for comprehensive SVs; WES for coding CNVs (with caveats);
   arrays for mosaicism/UPD or cost.
2. **Build reference.** Batch-matched normals for read-depth calling (≥30 samples ideal).
3. **Call.** GATK gCNV / Manta / PennCNV as appropriate; ensemble for WGS SVs.
4. **Filter.** Size, probe/bin support, population frequency (gnomAD-SV, DGV), quality
   scores.
5. **Interpret.** Gene content, ClinGen HI/TS scores, inheritance (trio), phenotype match.
6. **Validate.** qPCR/MLPA/array confirmation of candidates.
7. **Report.** Coordinates (with build), size, gene content, classification rationale,
   validation status.

Example command sketch:
```bash
# GATK gCNV (cohort mode needs a panel of normals built first)
gatk GermlineCNVCaller --run-mode COHORT -L intervals.list \
  --contig-ploidy-calls ploidy-calls --output cnv_cohort/
```

## Common pitfalls

- WES CNV calls without batch-matched reference panels.
- Tumor CNVs without purity/ploidy estimation.
- Common gnomAD-SV variants reported as pathogenic.
- Gene-desert CNVs over-interpreted; HI-gene deletions missed.
- Breakpoint precision overstated (kb-level presented as exact).
- Mosaicism missed (no BAF analysis).
- NGS-only calls clinically reported without orthogonal validation.
