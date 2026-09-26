---
name: sanger-sequencing
description: Sanger sequencing workflows — primer design, reaction setup, chromatogram QC, and variant interpretation.
category: scientific
---

## Overview

sanger-sequencing covers the still-essential chain-termination sequencing method: when Sanger
beats NGS (validation, small targets, plasmids, clinical confirmation), primer design, reaction
setup, chromatogram quality assessment, and interpreting variants including heterozygous calls.
Sanger remains the gold standard for validating NGS variants and sequencing short defined
targets — reports of its death are exaggerated.

## When to use

- Validating NGS variants (the classic Sanger confirmation).
- Plasmid/insert verification and colony screening.
- Primer design for sequencing (distinct from PCR primers).
- Chromatogram QC: Phred scores, mixed peaks, dye blobs.
- Heterozygous variant calling and mosaicism limits.
- Troubleshooting failed sequencing reactions.

## Core concepts

- **When Sanger wins.** Single variants to confirm, plasmids <10 kb, small gene panels in
  low-throughput settings, and clinical confirmation of NGS findings. When NGS wins:
  anything multiplexed, unknown variant location across large regions, or low-frequency
  variants (<15-20% allele fraction — Sanger's detection floor).
- **Sequencing primers.** 18-24 nt, Tm 55-65°C, positioned 50-100 bp upstream of the region
  of interest (first ~30-50 bases of reads are low quality); avoid SNPs under the primer;
  HPLC purification for critical work. PCR primers can double as sequencing primers if
  well-designed — but nested/internal primers give cleaner reads.
- **Template prep.** Clean PCR product (ExoSAP or column cleanup — residual primers/dNTPs
  ruin reads) or plasmid miniprep; quantify (too much template = mixed signals, too little =
  weak reads). For PCR products: single clean band on gel before sequencing.
- **Read quality.** Phred scores: Q20 = 99% accuracy per base; assess the quality-trimmed
  read length (typically 700-900 good bases). Inspect chromatograms, not just base calls —
  the trace reveals what the caller missed.
- **Chromatogram artifacts.** Dye blobs (unincorporated dye terminators — early-read blobs);
  mixed peaks (heterozygosity, contamination, or polyploidy); sudden quality drop (GC-rich
  regions, homopolymers, secondary structure); N-calls at heterozygous positions in bad
  software. Learn to distinguish biology (clean double peaks = heterozygote) from chemistry
  (messy baseline = failed reaction).
- **Heterozygous calling.** True heterozygotes show two clean overlapping peaks at ~50:50
  ratio; call with secondary-peak detection (typically ≥25-30% of primary peak height).
  Below ~15-20% minor allele fraction, Sanger can't reliably detect variants — use NGS for
  mosaicism or tumor heterogeneity.
- **Bidirectional sequencing.** Sequence both strands for variant confirmation — artifacts
  are strand-specific, true variants appear in both directions. Clinical confirmations should
  always be bidirectional.
- **Troubleshooting.** No read: primer failure (test primer), template too dilute/dirty.
  Mixed from base 1: contaminated template or primer. Clean then degrading: secondary
  structure (add DMSO/betaine, raise extension temp) or GC-rich template. Short reads:
  template quality or polymerase issues.

## Practical workflow

1. **Design.** Sequencing primers 50-100 bp upstream of target; check for SNPs/repeats;
   plan bidirectional coverage of variants.
2. **Template.** Clean PCR product (single band verified) or quality plasmid; quantify.
3. **React.** BigDye chemistry per kit protocol; appropriate primer/template amounts;
   include controls (known template + primer).
4. **QC traces.** Check read length, Q scores, baseline cleanliness; trim low-quality ends.
5. **Interpret.** Inspect chromatograms at variant positions; call heterozygotes by peak
   ratios; confirm in both directions.
6. **Report.** Variant in HGVS nomenclature (c. and p.), reference sequence + version,
   chromatogram excerpts for key findings, QC metrics.

Example QC checklist:
```
[ ] Read length ≥ 500 Q20 bases
[ ] Clean baseline, no dye blobs in region of interest
[ ] Variant visible in forward AND reverse reads
[ ] HGVS notation with reference transcript version (e.g. NM_000059.4)
```

## Common pitfalls

- Trusting base calls without inspecting chromatograms.
- Claiming low-frequency variants below Sanger's detection floor.
- Unidirectional "confirmation" (strand-specific artifacts).
- Dirty template (residual PCR primers) blamed on the sequencing facility.
- Wrong HGVS notation or missing reference version (uninterpretable reports).
- Sequencing too close to the primer (low-quality start overlapping the target).
