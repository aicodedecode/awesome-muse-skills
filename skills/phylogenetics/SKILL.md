---
name: phylogenetics
description: Molecular phylogenetics — alignment, model selection, tree inference, and interpreting evolutionary trees.
category: scientific
---

## Overview

phylogenetics covers inferring evolutionary relationships from molecular sequences: multiple
sequence alignment, substitution-model selection, tree inference (maximum likelihood,
Bayesian), support assessment, and honest interpretation. Trees are hypotheses with
uncertainty — this skill emphasizes the uncertainty as much as the topology.

## When to use

- Building gene/species trees: marker selection, taxon sampling.
- Alignment: MAFFT/MUSCLE, trimming, alignment QC.
- Model selection: substitution models, partitioning, rate heterogeneity.
- Tree inference: IQ-TREE, RAxML, MrBayes/BEAST — ML vs Bayesian.
- Support: bootstrap, posterior probabilities, and what they mean.
- Molecular dating: clock models, fossil calibrations.
- Interpreting trees: monophyly, rooting, avoiding over-interpretation.

## Core concepts

- **Taxon sampling matters more than methods.** The single biggest determinant of tree
  accuracy is which sequences you include. Sparse sampling causes long-branch attraction;
  include close outgroups and break up long branches. A fancy model on bad sampling still
  gives the wrong tree.
- **Alignment is the foundation.** MAFFT (fast, accurate default) or MUSCLE; inspect
  alignments visually — misaligned regions produce confident wrong trees. Trim ambiguously
  aligned regions (trimAl, Gblocks) but don't over-trim (lost signal); coding sequences:
  align as codons/translated amino acids to preserve reading frame.
- **Substitution models.** ModelTest/ModelFinder select among JC, HKY, GTR + rate
  heterogeneity (+G gamma, +I invariant sites). Under-parameterized models mislead;
  over-parameterized ones waste power — use BIC-based selection. Partition by codon position
  or gene when combining loci (different regions evolve differently).
- **ML vs Bayesian.** Maximum likelihood (IQ-TREE, RAxML-NG): fast, bootstrap support,
  good default. Bayesian (MrBayes, BEAST): posterior probabilities, integrates over
  uncertainty, slower, needs convergence diagnostics (ESS >200, PSRF ≈1). They usually agree;
  when they don't, investigate (model misspecification, poor convergence) rather than picking
  the prettier tree.
- **Support values.** Ultrafast bootstrap (≥95% strong), standard bootstrap (≥70-80%
  moderate), posterior probabilities (≥0.95 strong but often inflated relative to bootstrap).
  Low-support branches are unresolved — collapse them or say so; presenting a fully resolved
  tree with 40% bootstrap branches as "the phylogeny" is misleading.
- **Long-branch attraction.** Rapidly evolving lineages artifactually group together,
  especially with simple models and sparse sampling. Mitigations: better models (+G),
  denser taxon sampling, removing the worst offenders as a sensitivity check, and
  site-heterogeneous models (CAT) for deep divergences.
- **Rooting.** Outgroup rooting (needs a proper outgroup — too distant causes LBA, too
  close may be ingroup), midpoint rooting (assumes clock-like rates — often violated),
  molecular-clock rooting. An unrooted tree can't tell you direction of evolution — root
  explicitly and justify the choice.
- **Molecular dating.** Relaxed clocks (BEAST) with fossil/node calibrations (as priors with
  uncertainty, not point dates). Calibrations are the dominant uncertainty source — run
  sensitivity analyses with alternative calibrations. Report HPD intervals, never point dates.

## Practical workflow

1. **Sample.** Dense, relevant taxa; appropriate outgroup; marker(s) with suitable rate for
   the timescale.
2. **Align.** MAFFT; visual inspection; codon-aware for coding sequences; judicious trimming.
3. **Model.** ModelFinder per partition; check for compositional heterogeneity.
4. **Infer.** IQ-TREE (ML, ultrafast bootstrap) as default; Bayesian for dating or when
   posteriors needed; check convergence.
5. **Assess.** Support values on every branch; collapse/test low-support nodes; LBA checks.
6. **Root and date (if needed).** Justified rooting; calibrated relaxed clock with
   calibration sensitivity.
7. **Interpret carefully.** Monophyly claims only on supported branches; distinguish gene
   trees from species trees (ILS, hybridization, HGT all cause discordance — one gene ≠ the
   species history).

Example command sketch:
```bash
mafft --auto sequences.fasta > aligned.fasta
trimal -in aligned.fasta -out trimmed.fasta -automated1
iqtree -s trimmed.fasta -m MFP -bb 1000 -alrt 1000 -nt AUTO
```

## Common pitfalls

- Poor taxon sampling (the #1 cause of wrong trees).
- Uninspected alignments with misaligned regions.
- Over-interpreting low-support branches.
- Gene tree presented as species tree without discussion.
- Midpoint rooting on non-clock-like data.
- Fossil calibrations as point dates (hiding the real uncertainty).
- Contaminated/mislabeled sequences (check with BLAST before aligning).
