---
name: genome-assembly
description: Genome assembly fundamentals — long-read assembly, polishing, QC metrics, and annotation.
category: scientific
---

## Overview

genome-assembly covers de novo genome assembly: data requirements, long-read assemblers
(HiFi and ONT), assembly QC (N50, BUSCO, k-mer completeness), scaffolding (Hi-C), polishing,
and annotation. Assembly quality determines every downstream analysis — a fragmented,
contaminated assembly poisons variant calling, annotation, and comparative genomics.

## When to use

- Planning sequencing: coverage, read type (HiFi vs ONT vs short-read), Hi-C needs.
- Assembling: hifiasm, Flye, Verkko — choosing by data type.
- QC: N50/L50, BUSCO, Merqury k-mer spectra, contamination screening.
- Scaffolding: Hi-C (YaHS, SALSA), optical maps.
- Polishing: when needed, with what reads.
- Haplotype-resolved assembly: trio, Hi-C phasing.
- Annotation: BRAKER, liftoff, functional annotation basics.

## Core concepts

- **Read type determines outcome.** PacBio HiFi (99.9% accurate, 15-20 kb): the current
  gold standard — accurate enough to skip polishing. ONT (100+ kb reads, ~99% accurate):
  best for the hardest repeats, needs polishing. Short reads alone: fragmented assemblies
  of complex genomes — acceptable for bacteria, inadequate for most eukaryotes.
- **Coverage.** 30x HiFi for a good human-scale assembly; 60x+ for the hardest regions;
  ONT 30-50x. More coverage helps to a point — beyond ~60x HiFi, returns diminish and
  compute costs balloon.
- **Assemblers.** hifiasm (HiFi — best-in-class for phased assembly), Flye (ONT and
  metagenomic), Verkko (HiFi + ONT ultra-long integration, telomere-to-telomere attempts).
  Match assembler to data; don't run a short-read assembler on long reads.
- **Haplotype resolution.** Diploid genomes: collapsed (mosaic), primary/alternate, or
  fully phased (trio data or Hi-C). Collapsed assemblies create false duplications and
  break variant calling — phase when the biology needs it (heterozygous organisms always
  benefit).
- **QC metrics.** N50/L50 (contiguity — N50 of 50 Mb vs 50 kb is a different universe);
  BUSCO (gene completeness vs lineage expectations — >95% for good assemblies);
  Merqury (k-mer completeness and consensus quality QV — reference-free truth);
  assembly size vs expected genome size (too big = uncollapsed haplotypes/contamination,
  too small = missing sequence). Check all four, not just N50.
- **Contamination screening.** BlobTools (coverage vs GC vs taxonomy): symbionts, food,
  and lab contaminants assemble alongside your organism. Screen before publishing —
  contaminated "genome papers" are embarrassing and common.
- **Scaffolding.** Hi-C contact data orders contigs into chromosomes (YaHS); validate with
  contact maps (suspicious joins show as off-diagonal breaks). Scaffolding doesn't fix a bad
  contig assembly — it organizes a good one.
- **Polishing.** Needed for ONT (not HiFi): Racon/Medaka with long reads, then short-read
  polishing (Pilon/NextPolish) for residual errors. Over-polishing a good assembly can
  introduce errors — verify with Merqury QV before/after.
- **Annotation.** BRAKER (RNA-seq + protein evidence → gene models); liftoff (transfer
  annotation from a related genome — fast, reference-biased); functional annotation
  (InterProScan, eggNOG). Annotation quality limits every downstream analysis — budget
  real effort here.

## Practical workflow

1. **Plan.** Genome size estimate (flow cytometry/k-mers), heterozygosity, repeat content →
   read type + coverage + Hi-C decision.
2. **QC reads.** Read length/N50 distributions, quality; screen for contamination early.
3. **Assemble.** hifiasm (HiFi) / Flye (ONT) with appropriate parameters; try defaults
   first — they're good now.
4. **QC assembly.** N50, BUSCO, Merqury QV/completeness, size sanity, BlobTools
   decontamination.
5. **Scaffold (if Hi-C).** YaHS; inspect contact maps; break misjoins.
6. **Polish (if ONT).** Long-read then short-read; verify QV improvement.
7. **Annotate.** BRAKER with RNA-seq evidence; functional annotation; validate gene count
   vs relatives.
8. **Deposit.** INSDC submission with metadata; assembly QC report alongside.

Example command sketch:
```bash
hifiasm -o asm -t 32 --h1 r1.fq --h2 r2.fq hifi.fq   # trio-phased
busco -i asm.bp.p_ctg.fa -l mammalia_odb10 -m genome
merqury.sh reads.meryl asm.bp.p_ctg.fa merqury_out/
```

## Common pitfalls

- Short-read-only assembly of a complex eukaryote (hopeless fragmentation).
- N50 worship without BUSCO/Merqury/contamination checks.
- Uncollapsed haplotypes doubling the assembly size.
- Contamination published as novel sequence (no BlobTools screening).
- Scaffolding a bad contig assembly (garbage organized into chromosomes).
- Over-polishing degrading a good HiFi assembly.
- Annotation as an afterthought (bad gene models poisoning downstream work).
