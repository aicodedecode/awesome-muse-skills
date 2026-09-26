---
name: flow-cytometry
description: Flow cytometry experimental design and analysis — panel design, compensation, gating, and QC.
category: scientific
---

## Overview

flow-cytometry covers multicolor flow cytometry from panel design to analyzed data: fluorochrome
selection, compensation and controls, gating strategies, and the QC that keeps cytometry honest.
Flow generates single-cell data on millions of cells in minutes — but panel-design errors and
bad gating produce confident-looking wrong answers at the same speed.

## When to use

- Designing antibody panels: fluorochrome assignment, spillover minimization.
- Controls: unstained, FMO, isotype, biological controls, viability dyes.
- Compensation: setup, validation, when to use beads vs cells.
- Gating: hierarchical strategies, doublet exclusion, dump channels.
- Analysis: manual gating vs automated clustering (FlowSOM, UMAP).
- Sorting: purity vs yield, sterile sort considerations.
- Troubleshooting: high background, poor resolution, clogging.

## Core concepts

- **Panel design.** Assign bright fluorochromes to low-density antigens and dim ones to
  high-density markers; minimize spillover into critical channels (check the spillover matrix
  for your instrument); respect laser/filter configurations. Use panel-design tools
  (FluoroFinder, BD spectrum viewer) — don't design from memory. Include viability dye always
  (dead cells bind antibodies nonspecifically and ruin everything).
- **Spillover and compensation.** Fluorescence bleeds across detectors; compensation
  mathematically corrects it using single-stain controls. Compensation must be calculated per
  experiment (tandem dyes degrade — lot-to-lot variation is real). Validate with N×N plots:
  properly compensated populations show no diagonal correlation.
- **Controls.** Unstained (autofluorescence baseline); FMO (fluorescence-minus-one — defines
  gates where spillover spreading affects the positive/negative boundary; essential for
  every channel in multicolor panels); biological controls (known positive/negative
  populations); isotype controls are largely obsolete (they don't control what people think
  they do — FMOs replaced them).
- **Gating hierarchy.** FSC/SSC (cells vs debris) → singlets (FSC-H vs FSC-A, doublets
  excluded — doublets create fake double-positives) → viable (viability dye negative) →
  dump channel (exclude unwanted lineages) → populations of interest. Gate on controls, apply
  to samples; back-gate to verify populations land where expected.
- **Spillover spreading error.** Compensation corrects the mean but not the spread — dim
  populations adjacent to bright ones in spillover-receiving channels lose resolution. This is
  physics, not fixable post-hoc: it's why panel design matters more than analysis tricks.
- **Counting and quantitation.** Use counting beads for absolute counts; report percentages
  with the parent gate defined (percent of what?). MFI comparisons need identical instrument
  settings and controls across runs — or calibration beads.
- **Automated analysis.** Dimensionality reduction (UMAP/t-SNE) + clustering (FlowSOM,
  PhenoGraph) for high-parameter data. Validate clusters against manual gating; automated
  methods find structure but also noise — always sanity-check with known populations.
- **Sorting.** Purity vs yield trade-off (purity mask settings); keep cells cold and fast;
  sterility for culture downstream; sort controls to verify post-sort purity and viability.

## Practical workflow

1. **Design.** Marker list → fluorochrome assignment (brightness-matched, spillover-checked) →
   include viability + dump; order antibodies with lead time.
2. **Titrate.** Antibody titration per lot (saturating concentration with best signal:noise —
   more antibody is not better).
3. **Stain.** Consistent protocol: Fc block, surface stain, viability dye timing, fix/perm for
   intracellular (fixation changes fluorochromes — validate).
4. **Controls.** Unstained + FMOs + single-stain compensation controls (beads or cells) every
   run.
5. **Acquire.** Consistent voltages (use application settings/CS&T beads); record enough
   events for rare populations (statistics: need ~100+ events in the rarest gate).
6. **Analyze.** Compensation check (N×N) → gating hierarchy on controls → apply → back-gate →
   statistics with defined parent gates.
7. **Report.** Panel table (clone, fluorochrome, vendor, lot), gating strategy figure,
   control summary, and FCS files archived.

## Common pitfalls

- No viability dye (dead-cell artifacts presented as populations).
- No doublet exclusion (fake double-positives).
- Missing FMOs (gates drawn where spillover spreading corrupts boundaries).
- Tandem-dye degradation ignored (compensation from a fresh lot applied to old reagents).
- Under-acquiring rare populations (20 events is not a population).
- MFI compared across runs without calibration.
- Manual gates drawn to produce the desired result (gate on controls, blinded).
