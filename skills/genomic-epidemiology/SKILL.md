---
name: genomic-epidemiology
description: Pathogen genomics for epidemiology — phylogenetics of outbreaks, transmission inference, and variant surveillance.
category: scientific
---

## Overview

genomic-epidemiology uses pathogen genome sequences to answer epidemiologic questions: who
infected whom, where a lineage came from, how fast it's spreading, and whether a new variant
matters. It combines phylogenetics with field epidemiology — sequences alone rarely answer
anything without epidemiologic metadata (dates, locations, exposures).

## When to use

- Outbreak phylogenetics: lineage assignment, cluster identification.
- Transmission inference: combining genomics with contact tracing.
- Molecular-clock dating: when did a lineage emerge or enter a region?
- Variant surveillance: detecting and characterizing concerning lineages.
- Phylodynamics: estimating Re and growth rates from sequences.
- Evaluating sequencing strategy: sampling fraction, turnaround, representativeness.

## Core concepts

- **Sequences + metadata.** A genome without collection date and location is nearly useless for
  epidemiology. Metadata standards (date, location, clinical context) must be enforced at
  sample collection — retroactive metadata recovery fails.
- **Lineage assignment.** Pangolin lineages (SARS-CoV-2), genotypes, clades — standardized
  nomenclatures that make sequences comparable across labs. Assign with maintained tools and
  versioned nomenclatures; designations evolve, so record the version.
- **Phylogenetic basics for epi.** Maximum-likelihood trees (IQ-TREE, RAxML) from aligned
  genomes; branch support (ultrafast bootstrap); rooting with outgroups or molecular clock.
  For outbreak-scale data with low diversity, few SNPs separate cases — tree topology is
  uncertain, and over-interpreting single branches is the commonest error.
- **Molecular clocks.** Substitution rate × time = divergence. Calibrated clocks date lineage
  emergence and introductions (BEAST, TreeTime). Rates vary by pathogen and genomic region —
  use pathogen-specific rates, and present date estimates with credible intervals, not points.
- **Transmission inference.** Genomic similarity constrains who-infected-whom but rarely
  determines it: identical genomes are consistent with direct transmission, common source, or
  coincidence in low-diversity outbreaks. Combine with contact data and timing (outbreak
  simulators like outbreaker2 integrate both). Never claim a direction of transmission from
  genomics alone without epidemiologic support.
- **Phylodynamics.** Coalescent and birth-death models estimate Re, growth rates, and
  introduction counts from sequence data (BEAST2). Powerful when surveillance is sparse, but
  sensitive to sampling bias — non-random sequencing (e.g. only severe cases) distorts
  everything.
- **Variant assessment.** A new lineage matters if it changes transmissibility, severity, or
  immune escape. Genomic features (mutations in key sites) generate hypotheses; epidemiologic
  data (growth advantage, vaccine breakthrough rates) test them. Sequence-first alarm without
  epi follow-up produces false panics.
- **Sampling strategy.** Representativeness beats volume: random population sampling with
  known denominators outperforms convenience sequencing of interesting cases. Track and report
  the sampling fraction and any selection criteria.

## Practical workflow

1. **Collect with metadata.** Enforce date/location/context at sampling; maintain cold chain
   and sequencing QC (coverage, contamination checks).
2. **Process.** Consensus genomes with QC thresholds (e.g. >90% coverage, <X ambiguous bases);
   deposit in public databases (GISAID/GenBank) per policy.
3. **Assign and align.** Lineage assignment (versioned); multiple sequence alignment
   (Nextclade/MAFFT); mask problematic sites.
4. **Phylogeny.** ML tree + molecular-clock dating (TreeTime for speed, BEAST for rigor);
   annotate with epi metadata.
5. **Integrate.** Overlay contact-tracing links; test transmission hypotheses with combined
   models; estimate introductions and growth.
6. **Surveil.** Track lineage frequencies over time with CIs; flag growth advantages;
   characterize concerning mutations with epi follow-up.
7. **Report.** Tree with support values, dating with intervals, sampling description, and
   explicit limits on transmission-direction claims.

Example command sketch:
```bash
nextclade run sequences.fasta --output-dir qc/      # QC + clade assignment
iqtree -s aligned.fasta -m GTR -bb 1000              # ML phylogeny
treetime --tree ml.tree --aln aligned.fasta --dates dates.csv  # molecular clock
```

## Common pitfalls

- Transmission direction claimed from genomics alone.
- Over-interpreting low-diversity tree topology (few SNPs, high uncertainty).
- Non-representative sequencing presented as population surveillance.
- Missing metadata making sequences uninterpretable.
- Molecular-clock dates reported as points without intervals.
- Variant alarm from sequence features without epidemiologic evidence.
- Contamination/quality failures creating fake "novel lineages."
