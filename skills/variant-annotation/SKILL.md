---
name: variant-annotation
description: Annotating genetic variants — consequence prediction, population frequency, and clinical interpretation.
category: scientific
---

## Overview

variant-annotation covers turning raw variant calls into interpretable information: predicting
molecular consequence, filtering by population frequency, scoring deleteriousness, and
connecting variants to phenotype and clinical significance. Annotation is where a VCF of
millions of variants becomes a shortlist — and where most interpretation errors originate.

## When to use

- Annotating VCFs: VEP, ANNOVAR, snpEff — choosing and configuring.
- Consequence prediction: coding, splice, regulatory effects.
- Population frequency filtering: gnomAD, 1000 Genomes, population-specific databases.
- Deleteriousness scores: CADD, REVEL, SIFT, PolyPhen, SpliceAI.
- Clinical interpretation: ClinVar, ACMG classification support.
- Custom annotation: adding lab-specific or phenotype-specific data.

## Core concepts

- **Consequence hierarchy.** VEP/SnpEff assign Sequence Ontology terms: stop-gained,
  frameshift, splice-donor/acceptor, missense, synonymous, intronic, UTR, intergenic.
  Prioritize by predicted molecular impact — but remember these are predictions about
  transcripts, and transcript choice (canonical vs MANE) changes everything. Use MANE
  transcripts for clinical work.
- **Population frequency is the strongest filter.** Common variants don't cause rare
  disease: gnomAD allele frequency is the first filter for Mendelian analysis (typically
  AF < 0.1-1% depending on inheritance model and disease prevalence). Check all gnomAD
  populations — a variant common in one ancestry and rare in another needs ancestry-aware
  interpretation. Also check homozygote counts: observed homozygotes in gnomAD argue
  against dominant pathogenicity.
- **Deleteriousness scores.** CADD (genome-wide, PHRED-scaled; >20 = top 1% deleterious),
  REVEL (missense-specific ensemble), SIFT/PolyPhen (older, still used), SpliceAI (splice
  effects — genuinely good, use delta score ≥0.5 as review threshold). These are supporting
  evidence (ACMG PP3/BP4), never standalone proof. Correlated scores don't constitute
  independent evidence.
- **ClinVar.** Curated variant-disease assertions with review status (stars). Check the
  review status and submission dates — a single-submitter "pathogenic" from 2015 without
  updates deserves re-evaluation, and conflicting interpretations are common. Never treat
  ClinVar as ground truth; treat it as a starting point.
- **Splice prediction.** SpliceAI (and Pangolin) predict cryptic splice effects from
  sequence — critical because many "intronic" or "synonymous" variants actually disrupt
  splicing. Validate predictions with RNA-seq when possible.
- **Regulatory variants.** Non-coding variants: overlap with enhancers (ENCODE, Roadmap),
  eQTL colocalization, conservation (GERP, phyloP). Interpretation is much weaker than for
  coding variants — be honest about the uncertainty.
- **Annotation pitfalls.** Wrong transcript (non-canonical), unnormalized variants
  (representation mismatches break database joins — normalize with bcftools norm first),
  multi-allelic sites split inconsistently, and reference-build mismatches (liftover errors).
  Normalize, then annotate, then join.
- **ACMG integration.** Annotation feeds ACMG classification: population data (BA1/BS1/PM2),
  computational (PP3/BP4), functional (PS3/BS3), segregation, de novo. The annotation is
  evidence assembly, not the verdict.

## Practical workflow

1. **Normalize.** `bcftools norm -f ref.fa` (left-align, split multiallelics) before any
   database joins.
2. **Annotate.** VEP with: consequence (MANE transcripts), gnomAD AF (all populations +
   popmax), ClinVar, CADD/REVEL, SpliceAI, conservation. Cache versions recorded.
3. **Filter.** Frequency → consequence → inheritance model → phenotype match. Keep the full
   annotated VCF; filtering is a view.
4. **Prioritize.** Rank by evidence convergence: rare + damaging-predicted + phenotype-match
   + (segregation/de novo if family data).
5. **Validate.** IGV inspection of reads (alignment artifacts are common); Sanger/long-read
   confirmation for clinical-grade calls.
6. **Report.** HGVS (c. and p. with transcript version), all annotation sources with
   versions, ACMG criteria applied, and explicit uncertainty.

Example command sketch:
```bash
bcftools norm -f GRCh38.fa -m -both raw.vcf -o norm.vcf
vep -i norm.vcf -o annotated.vcf --cache --mane --af_gnomad \
    --plugin CADD --plugin SpliceAI --custom ClinVar.vcf.gz
```

## Common pitfalls

- Annotating unnormalized VCFs (database joins silently miss variants).
- Wrong/non-MANE transcript changing the consequence call.
- Single-population gnomAD AF missing ancestry-specific common variants.
- In-silico scores treated as diagnostic evidence.
- ClinVar assertions accepted without checking review status.
- Synonymous/intronic variants dismissed without splice prediction.
- Reference build mismatches between VCF and annotation databases.
