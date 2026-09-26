---
name: genomics-pro
description: Genome-scale analysis — variant calling, annotation, GWAS, and structural variation for research and clinical genomics.
category: scientific
---

## Overview

genomics-pro covers analysis at genome scale: whole-genome and whole-exome sequencing, variant
discovery and interpretation, population-scale association studies, and structural variation. Where
bioinformatics-pro handles the general NGS mechanics, this skill goes deep on genomic questions —
what variants exist, what they do, and how they associate with traits or disease.

It spans germline and somatic analysis, single-sample and cohort workflows, and the annotation
resources (ClinVar, gnomAD, COSMIC, dbSNP) that turn a VCF of millions of variants into a shortlist
worth investigating.

## When to use

- Designing a WGS/WES study: coverage targets (30x germline WGS, 100x+ tumor), capture kits,
  trio vs singleton design.
- Germline variant calling: GATK best practices, joint genotyping across cohorts.
- Somatic analysis: tumor-normal pairs, mutational signatures, copy-number and LOH.
- Variant annotation and filtering: population frequency, predicted consequence, clinical databases.
- GWAS: QC, association testing, fine-mapping, polygenic scores.
- Structural variants and CNVs: detection from short reads, long-read validation.
- Interpreting a clinical-grade report: ACMG classification, incidental findings policy.

## Core concepts

- **Germline vs somatic.** Germline variants are inherited, ~diploid, and called per-sample then
  joint-genotyped; somatic variants are acquired, often subclonal, and need tumor-normal comparison
  with allele-frequency-aware callers (Mutect2, Strelka2). Mixing the two workflows corrupts both.
- **The VCF contract.** CHROM/POS/REF/ALT plus genotype fields (GT, AD, DP, GQ, PL). Understand
  normalization (left-alignment, parsimony) — the same variant can be written multiple ways, which
  breaks naive comparisons; always normalize before intersecting callsets.
- **Filtering strategy.** Common variants are rarely causal for rare disease: filter by population
  allele frequency (gnomAD AF, typically <1% or <0.1% for rare disease), consequence (VEP: stop-gain,
  frameshift, missense with CADD/REVEL), inheritance model, and phenotype match (HPO terms).
- **Cohort QC for GWAS.** Sample call rate, heterozygosity outliers, sex checks, relatedness
  (IBD/kinship), population stratification (PCA against 1000 Genomes, include PCs as covariates).
  Genomic inflation factor λ should be near 1; λ >> 1 means uncontrolled structure.
- **Association testing.** Linear/logistic regression per variant with covariates, or mixed models
  (BOLT-LMM, SAIGE) for relatedness and case-control imbalance. Genome-wide significance: p < 5e-8.
- **Structural variation.** Deletions, duplications, inversions, translocations — detected via
  discordant pairs, split reads, and read depth (Manta, Delly, LUMPY). Short reads miss many SVs;
  long reads (PacBio/ONT) are the gold standard for complex regions.
- **ACMG variant classification.** Pathogenic / likely pathogenic / VUS / likely benign / benign —
  based on population, computational, functional, segregation, and de novo evidence. A VUS is not a
  diagnosis; report it as uncertainty, not a finding.
- **Reference matters more here.** GRCh38 vs T2T-CHM13 changes variant coordinates and resolves
  previously "dark" regions. Liftover between builds is lossy — realign when it matters.

## Practical workflow

1. **Design.** Trio WES for rare disease (de novo detection), 30x WGS for comprehensive SVs,
   tumor-normal 100x/30x for somatic. Record capture kit and reference build.
2. **Process.** Align → MarkDuplicates → BQSR → HaplotypeCaller (germline) or Mutect2 (somatic).
   For cohorts: joint genotyping with GenomicsDBImport + GenotypeGVCFs.
3. **QC.** Ti/Tv ratio (~2.0-2.1 WGS, ~3.0 WES), het/hom ratio, call rate, contamination
   (VerifyBamID), sex concordance. Outliers get investigated, not deleted silently.
4. **Annotate.** VEP with gnomAD frequencies, ClinVar, CADD/REVEL, splice predictors (SpliceAI).
   Keep the full annotated VCF; filtering is a view, not a deletion.
5. **Filter/interpret.** Frequency → consequence → inheritance → phenotype → literature. For GWAS:
   association → clumping/fine-mapping → colocalization with eQTLs → polygenic scoring.
6. **Validate.** Sanger or long-read confirmation for clinical-grade calls; replication cohort for
   GWAS hits. Report with ACMG terms and explicit limitations.

Example command sketch:
```bash
gatk HaplotypeCaller -R ref.fa -I sample.bam -O sample.g.vcf.gz -ERC GVCF
gatk GenomicsDBImport --genomicsdb-workspace-path db -V s1.g.vcf.gz -V s2.g.vcf.gz -L chr1
vep -i variants.vcf -o annotated.vcf --cache --af_gnomad --plugin CADD
plink2 --bfile cohort --glm --covar pcs.txt --out assoc
```

## Common pitfalls

- Calling somatic variants without a matched normal — germline contamination of the "somatic" list.
- Comparing VCFs without normalization; same variant, different representation.
- Population stratification in GWAS mistaken for signal (always plot the QQ plot).
- Over-interpreting VUS or in-silico predictors as clinical evidence.
- Ignoring sex chromosomes and mitochondrial DNA in "genome-wide" analyses.
- Using hg19 coordinates with GRCh38 annotations (or vice versa).
- Treating a polygenic risk score as diagnostic — it is probabilistic and ancestry-sensitive.
