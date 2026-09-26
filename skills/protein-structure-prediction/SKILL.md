---
name: protein-structure-prediction
description: Predicting protein structures with AlphaFold/ESMFold — setup, confidence assessment, and honest interpretation.
category: scientific
---

## Overview

protein-structure-prediction covers modern AI-based structure prediction (AlphaFold2/3,
ESMFold, RoseTTAFold): running predictions, interpreting confidence metrics (pLDDT, PAE),
and knowing what predicted structures can and cannot tell you. Predicted structures are
models with quantified uncertainty — the confidence metrics are as important as the
coordinates.

## When to use

- Predicting structures: AlphaFold2 (monomer gold standard), AlphaFold3 (complexes,
  ligands), ESMFold (fast, no MSA needed).
- Interpreting confidence: pLDDT per residue, PAE for domain orientation.
- Multimer/complex prediction and interface assessment.
- When prediction fails: disordered regions, novel folds, shallow MSAs.
- Using predicted structures: docking, variant interpretation, construct design.
- Limitations: dynamics, conformational states, and what needs experiments.

## Core concepts

- **pLDDT (predicted local distance difference test).** Per-residue confidence, 0-100:
  >90 very high, 70-90 confident, 50-70 low, <50 very low (often disordered). Color
  structures by pLDDT and look before interpreting — conclusions drawn from <70 regions
  are speculation. Low pLDDT often means intrinsic disorder, which is itself biological
  information.
- **PAE (predicted aligned error).** Expected position error of residue x when aligned on
  residue y — the domain-orientation metric. Low PAE blocks = rigid domains; high PAE
  between blocks = flexible linkers or uncertain relative orientation. For multimers, PAE
  across chains assesses interface confidence.
- **MSA depth drives accuracy.** AlphaFold2's accuracy comes largely from evolutionary
  information in the multiple sequence alignment. Shallow MSAs (orphan proteins, viral
  proteins, designed sequences) → poor predictions. Check MSA depth (Neff); ESMFold
  (language-model-based, no MSA) is the fallback for shallow-MSA cases but generally less
  accurate.
- **What it can't do.** Conformational dynamics (one static model — usually the dominant
  state), induced-fit binding (apo structures mislead docking), disordered regions (low
  pLDDT, not "unstructured artifact"), membrane protein subtleties, and the effects of
  PTMs, pH, or partners not in the prediction. A predicted structure is a hypothesis for
  the folded state, not the protein's full reality.
- **Multimers.** AlphaFold-Multimer/AlphaFold3 predict complexes; assess with interface
  pTM (ipTM) and chain-pair PAE. Works well for stable complexes with co-evolutionary
  signal; weak for transient interactions. Validate interfaces experimentally (mutagenesis,
  crosslinking) before mechanistic claims.
- **Variant interpretation.** Map missense variants onto predicted structures: buried vs
  surface, proximity to active sites, steric clashes. Useful prior, not proof — combine
  with conservation and functional data. Don't over-interpret small side-chain differences
  in medium-confidence regions.
- **Databases.** AlphaFold DB (UniProt proteomes, precomputed) — check before computing;
  ESM Metagenomic Atlas for metagenomic proteins. Download with confidence metrics, not
  just coordinates.
- **Experimental validation.** Cryo-EM/X-ray still required for: novel folds without
  homologs, drug-design campaigns (induced fit matters), and any claim where atomic detail
  is load-bearing. Prediction accelerates experiments; it doesn't replace them.

## Practical workflow

1. **Check databases.** AlphaFold DB / ESM Atlas may already have your protein — with
   versioned predictions.
2. **Predict.** AlphaFold2/ColabFold for monomers (with MSAs); AlphaFold3 for complexes
   and ligands; ESMFold for speed or shallow MSAs. Record versions and settings.
3. **Assess confidence.** pLDDT coloring, PAE plots, MSA depth. Define the confident core
   vs uncertain regions before any interpretation.
4. **Interpret within confidence.** Domain architecture, active-site geometry (high-pLDDT
   regions only), variant mapping, construct boundaries (cut at domain edges per PAE).
5. **Downstream use.** Docking into high-confidence pockets (with dynamics caveats);
   mutagenesis design targeting confident regions.
6. **Validate.** Experimental structure for load-bearing claims; functional assays for
   mechanistic hypotheses.
7. **Report.** Method + version, pLDDT/PAE summaries, MSA depth, and explicit statements
   of which conclusions rest on high- vs low-confidence regions.

Example (ColabFold sketch):
```bash
colabfold_batch input.fasta output/ --msa-mode mmseqs2 --num-models 5
# then inspect ranked_0.pdb colored by pLDDT + PAE JSON plots
```

## Common pitfalls

- Interpreting low-pLDDT regions as structured (they're usually disordered/uncertain).
- Ignoring PAE (confident domains, wrong relative orientation).
- Shallow-MSA predictions presented at face value.
- Docking into apo predicted structures without dynamics caveats.
- Treating one static model as the protein's conformational repertoire.
- Novel-fold claims without experimental validation.
- Forgetting prediction versions (models improve; old predictions may be stale).
