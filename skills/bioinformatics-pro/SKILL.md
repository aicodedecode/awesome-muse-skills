---
name: bioinformatics-pro
description: End-to-end bioinformatics analysis — sequence QC, alignment, and omics pipelines for research data.
category: scientific
---

## Overview

bioinformatics-pro covers the full lifecycle of a bioinformatics analysis: from raw sequencing reads to
publication-ready results. It focuses on reproducible pipelines for genomics, transcriptomics, and
multi-omics data, emphasizing quality control at every step, correct choice of tools for the question
at hand, and results that can be validated rather than merely generated.

The skill is tool-agnostic but assumes familiarity with the standard ecosystem: command-line workflows
(Bash/Python), workflow managers (Nextflow, Snakemake), and the core sequence-analysis suite
(FastQC, Trimmomatic/cutadapt, BWA, Bowtie2, STAR, samtools, GATK). It does not replace domain
expertise — it structures how you plan, run, and sanity-check analyses.

## When to use

- Planning a new NGS project: choosing library prep implications, sequencing depth, and analysis tools
  before data exists.
- QC and preprocessing: adapter trimming, quality filtering, contamination checks, and batch-effect review.
- Read alignment and variant calling: DNA-seq, RNA-seq, or amplicon pipelines.
- Building a reproducible pipeline with Nextflow or Snakemake so someone else can rerun it.
- Sanity-checking an existing pipeline's output: coverage uniformity, mapping rates, unexpected biases.
- Writing methods sections: what parameters and versions to report for reproducibility.

## Core concepts

- **Quality control first.** Every dataset gets FastQC/MultiQC before any interpretation. Key metrics:
  per-base quality scores, adapter content, duplication rate, GC bias, and overrepresented sequences.
  Low-quality data does not get rescued by fancier statistics.
- **Know your aligner.** BWA-MEM for DNA, STAR or HISAT2 for spliced RNA, Bowtie2 for short reads.
  The wrong aligner for the data type produces quietly wrong results.
- **File formats and their contracts.** FASTQ (reads + quality), SAM/BAM (aligned reads, coordinate-
  or name-sorted), VCF (variants), BED/GTF (intervals/annotations). Sort order and indexing
  (.bai, .tbi) matter — most tools fail loudly or silently on unsorted input.
- **Reference genome discipline.** Pin the reference (e.g. GRCh38.p14 vs hg19), keep the same build
  through alignment, annotation, and variant calling, and record it. Mixed builds are a classic silent
  error.
- **Variant calling workflow.** MarkDuplicates → base quality score recalibration → HaplotypeCaller/
  DeepVariant → hard filtering or VQSR → annotation (VEP, ANNOVAR). Each step has expected failure
  modes; check them.
- **Normalization in RNA-seq.** Raw counts are not comparable across samples. DESeq2/edgeR size
  factors, TMM, or TPM/FPKM for visualization — and never run differential expression on TPMs.
- **Reproducibility.** Version-pin tools (conda env or containers), fix random seeds, log every
  command. If you cannot rerun it from scratch, it is not a pipeline, it is a notebook.

## Practical workflow

1. **Project setup.** Create a layout: `data/raw/`, `data/processed/`, `results/`, `env/`, `workflow/`.
   Write an environment file (conda `environment.yml` or a Dockerfile) before touching data.
2. **QC raw reads.** Run FastQC + MultiQC on all FASTQs. Decision rules: trim if adapter content
   >5%, discard reads with mean Phred <20 over sliding windows, flag samples with duplication >30%
   for library-prep review.
3. **Preprocess.** Trim adapters/low-quality bases (`cutadapt -q 20 -m 36`), re-run MultiQC.
   Screen for contamination with a quick k-mer classifier if mapping rates look off.
4. **Align.** Pick the aligner by data type; record version and non-default flags. Check mapping rate,
   properly-paired rate, and coverage uniformity (`samtools flagstat`, `mosdepth`).
5. **Downstream.** DNA: variant calling + annotation + filtering. RNA: count (featureCounts/
   Salmon) → DESeq2 → enrichment. Always run a PCA/sample-correlation first — outliers and batch
   effects show up here before they ruin an analysis.
6. **Report.** MultiQC report, key figures (PCA, volcano, coverage plots), and a methods paragraph
   with tool versions, references, and parameters.

Example command sketch:
```bash
fastqc data/raw/*.fastq.gz -o results/qc/raw
cutadapt -q 20 -m 36 -a AGATCGGAAGAGC -o data/trimmed/sample_R1.fq.gz data/raw/sample_R1.fastq.gz
bwa mem -t 8 ref/GRCh38.fa data/trimmed/sample_R1.fq.gz | samtools sort -o data/aligned/sample.bam
samtools index data/aligned/sample.bam && samtools flagstat data/aligned/sample.bam
```

## Common pitfalls

- Running analysis on the wrong reference build, or mixing builds between steps.
- Skipping PCA/QC of count matrices — batch effects discovered after the paper draft is painful.
- Treating TPM/FPKM as input to DESeq2/edgeR (they need raw counts).
- Over-trimming short reads until alignment becomes ambiguous.
- Hard-filtering variants with one-size-fits-all thresholds copied from a different organism.
- No seed control or version pinning, making the "pipeline" unrerunnable.
- Confusing correlation with mechanism: an enriched pathway is a hypothesis, not a finding.
