---
name: elisa-assay-design
description: ELISA development and validation — sandwich vs competitive formats, standard curves, and assay qualification.
category: scientific
---

## Overview

elisa-assay-design covers developing enzyme-linked immunosorbent assays from scratch or
optimizing kits: format selection, antibody pairing, blocking and buffer optimization, standard
curves, and the validation parameters (accuracy, precision, LLOQ/ULOQ) that make an ELISA a
measurement tool rather than a color-change ritual.

## When to use

- Choosing ELISA format: direct, indirect, sandwich, competitive.
- Antibody pair selection and validation for sandwich ELISAs.
- Optimization: coating, blocking, detection antibody, substrate, buffers.
- Standard curves: 4PL/5PL fitting, weighting, acceptance criteria.
- Validation: precision, accuracy, dilutional linearity, spike-recovery, LLOQ/ULOQ.
- Troubleshooting: high background, low signal, hook effect, edge effects.
- Transferring assays between labs or to kit format.

## Core concepts

- **Format selection.** Sandwich (capture + detection antibodies — most specific and sensitive,
  needs two non-competing antibodies); indirect (antigen-coated, labeled secondary — simpler,
  less specific); competitive (labeled vs unlabeled antigen compete — for small molecules that
  can't be sandwiched, e.g. steroids, drugs); direct (labeled primary — fast, insensitive).
  Small analytes force competitive; everything else prefers sandwich.
- **Antibody pairs.** The critical reagent decision: capture and detection antibodies must bind
  non-overlapping epitopes (test empirically — datasheet claims aren't enough); validate
  specificity against related analytes (cross-reactivity panels); monoclonal-monoclonal for
  consistency, with polyclonal detection as sensitivity fallback. Lot-to-lot variation is real
  — qualify new lots against old.
- **Blocking and buffers.** Block unbound surface (BSA, casein, non-fat milk — test which;
  milk contains biotin, which matters for streptavidin systems); sample diluent should mimic
  matrix; wash thoroughly (insufficient washing is the top cause of high background).
  Heterophilic antibody interference (human anti-mouse antibodies) needs blockers in clinical
  samples.
- **Standard curves.** Recombinant/known-concentration standards in matrix-matched diluent;
  4PL or 5PL fit (5PL for asymmetric curves); 1/y² weighting (variance scales with signal);
  7-8 points spanning the range plus blank. Curve acceptance: back-calculated standards within
  ±20% (±25% at LLOQ/ULOQ), R² not sufficient alone — inspect residuals.
- **Validation parameters.** Precision (intra/inter-assay CV: ≤20%, ≤25% at limits);
  accuracy (spike-recovery 80-120% in matrix); dilutional linearity (serial dilutions of high
  samples parallel the curve); LLOQ/ULOQ (lowest/highest standard meeting precision+accuracy);
  selectivity (related analytes, hemolyzed/lipemic samples); stability (freeze-thaw, bench-top).
- **Hook (prozone) effect.** Very high analyte saturates both antibodies → falsely low signal.
  Suspect when strong positives read low; test by diluting samples. Sandwich assays for
  analytes with huge dynamic ranges need dilution protocols built in.
- **Matrix effects.** Serum/plasma components shift the curve vs buffer standards. Mitigate:
  matrix-matched standards, minimum required dilution, spike-recovery validation in the actual
  matrix. An assay validated in buffer and run in serum is unvalidated.
- **Controls.** High/medium/low QCs on every plate, tracked on Levey-Jennings charts; plate
  acceptance by QC rules (not by whether the samples "look right"). Trending QCs catch
  reagent degradation before it ruins data.

## Practical workflow

1. **Format and reagents.** Choose format by analyte size; screen antibody pairs empirically;
   qualify lots.
2. **Checkerboard optimization.** Titrate capture vs detection antibody (and sample vs
   conjugate) in a matrix; select for signal:background ratio, not just signal.
3. **Buffer optimization.** Blocking agent, wash stringency, incubation times/temperatures —
   one factor at a time after the checkerboard.
4. **Standard curve.** Matrix-matched; 4PL/5PL with weighting; define acceptance criteria.
5. **Validate.** Precision, accuracy, linearity, LLOQ/ULOQ, selectivity, stability — the full
   panel before generating study data.
6. **Run with QCs.** Every plate: standards + QCs + blanks; Levey-Jennings tracking; documented
   plate-acceptance rules.
7. **Troubleshoot systematically.** High background → washing/blocking/antibody concentration.
   Low signal → antibody activity, substrate, incubation. Edge effects → plate sealing,
   temperature uniformity, avoid outer wells for critical samples.

## Common pitfalls

- Antibody pairs assumed (not tested) to be non-competing.
- Standards in buffer, samples in serum (matrix mismatch).
- Hook effect unrecognized (high samples reading falsely low).
- No dilutional linearity testing.
- QC trending ignored until assays fail outright.
- Lot changes without bridging qualification.
- Curve fit by R² alone without back-calculation checks.
