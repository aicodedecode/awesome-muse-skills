---
name: multiple-sequence-alignment
description: Multiple sequence alignment — tool choice, alignment QC, trimming, and downstream-ready alignments.
category: scientific
---

## Overview

multiple-sequence-alignment covers aligning three or more sequences: choosing tools (MAFFT,
MUSCLE, Clustal Omega), alignment strategies for different data types (proteins, coding DNA,
non-coding, huge datasets), quality assessment, trimming, and producing alignments that
downstream analyses (phylogenetics, conservation, structure) can trust. Alignment error is the
silent corruptor of comparative analyses.

## When to use

- Aligning protein families: MAFFT/MUSCLE defaults and when to tune.
- Coding sequences: codon-aware alignment preserving reading frames.
- Large datasets: MAFFT FFT-NS-2, Clustal Omega for thousands of sequences.
- Non-coding RNA: structure-aware alignment (locARNA, MAFFT-Q-INS-i).
- Alignment QC: identifying misaligned regions, outliers, contamination.
- Trimming: trimAl, Gblocks — judicious region selection.
- Preparing alignments for phylogenetics, positive selection, or conservation analysis.

## Core concepts

- **Tool choice.** MAFFT (best all-rounder: `--auto` picks strategy; L-INS-i for <200
  sequences needing accuracy, FFT-NS-2 for thousands); MUSCLE v5 (accurate, good defaults);
  Clustal Omega (very large datasets, profile alignment). For most protein work, MAFFT
  L-INS-i or MUSCLE defaults are excellent — tool choice matters less than input quality.
- **Coding DNA: align as protein.** Translate, align amino acids, back-translate to codons
  (PAL2NAL, MACSE). Direct nucleotide alignment of coding sequences introduces frameshifting
  gaps that corrupt dN/dS and phylogenetic analyses. MACSE handles frameshifts/pseudogenes
  explicitly.
- **Adding sequences to existing alignments.** Profile alignment (MAFFT `--add`, Clustal
  Omega) preserves the curated alignment while placing new sequences — better than
  realigning everything when the reference alignment is trusted.
- **Alignment QC.** Visual inspection (Jalview/SeaView) is non-negotiable for important
  alignments: look for misaligned blocks, outlier sequences (contamination, wrong
  ortholog), and regions of uncertain homology. GUIDANCE2 scores per-column confidence —
  low-confidence columns should be trimmed or down-weighted downstream.
- **Outlier detection.** A sequence that won't align is telling you something: contamination,
  paralog instead of ortholog, frameshift, or reversed complement. BLAST outliers before
  deleting them — and check orientation (reverse-complemented sequences are a classic).
- **Trimming.** trimAl (`-automated1`) or Gblocks remove poorly aligned regions for
  phylogenetics. But: aggressive trimming discards signal along with noise (especially for
  closely related sequences where variable regions are the signal). Trim for deep
  phylogeny; keep more for population-level work. Always compare trimmed vs untrimmed
  results as sensitivity analysis.
- **Gap treatment.** Gaps are information (indels are evolutionary events) but most models
  treat them as missing data. Decide consistently: complete-deletion vs pairwise-deletion
  affects results. For coding sequences, gap patterns themselves can be phylogenetically
  informative — don't silently discard them.
- **Scale.** Thousands of sequences: MAFFT FFT-NS-2 or Clustal Omega, then iterative
  refinement on subsets. Tens of thousands: consider alignment-free or HMM-profile
  approaches. Know when alignment itself becomes the bottleneck and plan compute.

## Practical workflow

1. **Collect.** Orthologs verified by reciprocal BLAST or phylogeny; check orientation;
   remove fragments and contaminants.
2. **Align.** MAFFT `--auto` (or L-INS-i for accuracy-critical small sets); codon-aware
   for coding DNA via translation.
3. **Inspect.** Jalview: scan for misaligned blocks, outliers, frameshifts; GUIDANCE2
   column scores for critical alignments.
4. **Clean.** Remove/fix outliers (with documented reasons); trim judiciously per
   downstream use.
5. **Validate.** Alignment length sanity, gap patterns, conserved motifs present where
   expected (positive control: known catalytic residues align).
6. **Export.** FASTA/PHYLIP/NEXUS as needed; archive the untrimmed alignment alongside
   the trimmed one.

Example command sketch:
```bash
mafft --auto --thread 8 proteins.fasta > aligned.fasta
trimal -in aligned.fasta -out trimmed.fasta -automated1
# codon-aware:
mafft --auto proteins.fasta > prot_aln.fasta
pal2nal.pl prot_aln.fasta cds.fasta -output fasta > codon_aln.fasta
```

## Common pitfalls

- Nucleotide alignment of coding sequences (frameshifted gaps).
- Uninspected alignments (misaligned blocks → wrong trees).
- Reverse-complemented sequences left in (garbage alignment).
- Paralogs mixed with orthologs (wrong evolutionary story).
- Over-trimming that discards the phylogenetic signal.
- Contaminant sequences never BLAST-checked.
- Realignment destroying a trusted curated alignment (use profile-add instead).
