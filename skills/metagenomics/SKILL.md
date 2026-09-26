---
name: metagenomics
description: Metagenomic analysis — taxonomic profiling, assembly, binning, and functional annotation of microbiomes.
category: scientific
---

## Overview

metagenomics covers shotgun sequencing of microbial communities: taxonomic profiling (who's
there), assembly and binning (recovering genomes), functional annotation (what they can do),
and the compositional statistics that microbiome data demands. It complements amplicon
(16S) approaches with strain-level resolution and functional insight — at higher cost and
complexity.

## When to use

- Study design: shotgun vs 16S, sequencing depth, controls (blanks, mocks).
- Taxonomic profiling: Kraken2, MetaPhlAn, and database biases.
- Assembly: MEGAHIT, metaSPAdes for complex communities.
- Binning: MetaBAT2, CONCOCT, DAS Tool → MAGs and quality assessment (CheckM).
- Functional annotation: HUMAnN, eggNOG, KEGG pathways.
- Compositional analysis: CLR transforms, ANCOM-BC, avoiding rarefaction pitfalls.
- Contamination: decontam, blank controls, low-biomass precautions.

## Core concepts

- **Shotgun vs 16S.** 16S: cheap, taxonomic (genus-level typically), no functional data,
  PCR biases. Shotgun: species/strain resolution, functional genes, viruses/fungi included —
  10-100x the cost and host-DNA contamination issues. Choose by question: community
  structure on a budget → 16S; function and strain tracking → shotgun.
- **Controls are mandatory.** Extraction blanks and no-template controls (reagent
  contamination — the "kitome" — dominates low-biomass samples); mock communities (known
  composition validates the whole pipeline); positive controls per batch. Without blanks,
  you cannot distinguish signal from contamination.
- **Host depletion.** Human/host DNA can exceed 90% of reads (gut ~1%, skin/nasal much
  higher). Deplete computationally ( Bowtie2/hostile against host genome) and consider
  experimental depletion for high-host samples. Report the host fraction — it determines
  effective microbial depth.
- **Taxonomic profiling.** Kraken2 (k-mer, fast, huge databases — watch false positives
  from database contamination); MetaPhlAn (marker-gene, conservative, lower false-positive
  rate). Databases are biased toward culturable/reference organisms — novel taxa get
  misassigned or missed. Report database versions; re-profile when databases update.
- **Assembly and binning.** MEGAHIT (fast, memory-efficient) or metaSPAdes (better for
  complex communities, resource-heavy) → contigs → binning by coverage + tetranucleotide
  composition (MetaBAT2, CONCOCT) → DAS Tool consensus → MAGs. CheckM for completeness/
  contamination: high-quality MAG >90% complete, <5% contamination (MIMAG standards).
  Binning is error-prone — chimeric bins are common, validate key MAGs.
- **Functional profiling.** HUMAnN (pathway abundance from reads), eggNOG-mapper (ortholog
  annotation), resistance genes (CARD/RGI), virulence factors. Gene presence ≠ expression —
  metagenomics shows potential; metatranscriptomics shows activity.
- **Compositional data.** Sequencing yields relative abundances (they sum to 1) — standard
  statistics on proportions produce spurious correlations. Use compositional methods: CLR
  transformation, ANCOM-BC, ALDEx2, or qPCR/flow-cytometry for absolute quantification.
  Rarefaction throws away data and is statistically inadmissible — don't rarefy.
- **Strain tracking.** StrainPhlAn, inStrain for within-species variation — transmission
  tracking, engraftment after FMT. Needs adequate coverage of the species; low-abundance
  strains can't be resolved.

## Practical workflow

1. **Design.** Shotgun vs 16S decision; depth calculation (host fraction considered);
   blanks + mocks per batch; metadata standards (MIxS).
2. **QC.** Adapter/quality trimming; host depletion; report host fraction and microbial
   read counts.
3. **Profile.** Kraken2/Bracken or MetaPhlAn with versioned databases; decontam using
   blanks (prevalence/frequency methods).
4. **Assemble + bin (if MAGs needed).** MEGAHIT → MetaBAT2/CONCOCT → DAS Tool → CheckM;
   keep only medium/high-quality MAGs.
5. **Function.** HUMAnN pathways; CARD for resistome; eggNOG for orthologs.
6. **Statistics.** Compositional methods (ANCOM-BC/ALDEx2 on CLR); account for confounders;
   validate with absolute quantification where claims are load-bearing.
7. **Report.** Database versions, decontamination, MAG quality stats, compositional methods,
   and data deposition (SRA + MAGs).

Example command sketch:
```bash
kneaddata --input R1.fq --input R2.fq --reference-db human -o dehosted/
kraken2 --db standard --paired dehosted/*_1.fq dehosted/*_2.fq --report kraken.report
bracken -d standard -i kraken.report -o bracken.out -r 150
megahit -1 dehosted_1.fq -2 dehosted_2.fq -o assembly/
```

## Common pitfalls

- No blank controls (kitome presented as biology).
- Rarefaction instead of compositional methods.
- Standard stats on relative abundances (spurious correlations).
- Database version unreported; novel taxa misassigned.
- Chimeric MAGs presented as real genomes (no CheckM filtering).
- Gene presence equated with activity (no transcriptomics).
- Host fraction ignored (1M "microbial" reads that are 95% human).
