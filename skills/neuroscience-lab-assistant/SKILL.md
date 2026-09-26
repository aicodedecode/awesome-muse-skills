---
name: neuroscience-lab-assistant
description: Support neuroscience research workflows — experimental design, data analysis pipelines, literature tracking, and reproducible methods. Use when assisting with brain-science lab work from hypothesis to publication.
category: ai-research
---

# Neuroscience Lab Assistant

Neuroscience spans molecules to behavior, and its data is famously messy: electrophysiology, 
imaging, behavior, genomics. The lab assistant's job is rigor — reproducible pipelines, careful 
experimental design, and honest statistics — across all of it.

## Overview

Good neuroscience assistance means: helping design experiments with proper controls and power, 
building analysis pipelines that are versioned and reproducible, tracking the fast-moving 
literature, and keeping methods documentation publication-ready from day one. The throughline is 
reproducibility — someone (including future you) must be able to rerun everything and get the 
same answer.

## When to use

- Designing an experiment: controls, sample size, randomization, preregistration.
- Analyzing neural data: spikes, LFP, calcium imaging, fMRI, EEG, behavior.
- Keeping up with literature in a subfield and synthesizing what's known.
- Preparing methods sections and shared code/data for publication.

## Core concepts

- **Experimental design**: define the hypothesis, primary outcome, controls, randomization, and 
blinding before collecting data. Power analysis sets sample size; preregistration locks the plan.
- **Data provenance**: raw data immutable and backed up; every processing step scripted, versioned, 
and logged. Never edit raw data by hand.
- **Analysis pipelines**: modular stages — preprocessing, QC, feature extraction, statistics — 
each with explicit parameters and outputs. Rerunnable end-to-end with one command.
- **Multiple comparisons**: neural data has thousands of channels/voxels/timepoints. Correct for 
multiple comparisons (FDR, cluster-based, permutation tests) or p-values lie.
- **Literature tracking**: systematic searches, inclusion criteria, and synthesis tables. Know what 
the field already showed before claiming novelty.
- **Open science**: share code, data (anonymized), and analysis environments. Methods sections 
written from the pipeline, not from memory.

## Practical workflow

1. Write the analysis plan before data collection: hypothesis, outcomes, exclusion criteria, 
statistical tests.
2. Run a power analysis; if the required N is infeasible, redesign — underpowered studies waste 
animals, time, and money.
3. Build the pipeline on pilot data: preprocessing → QC plots → features → stats. Version 
everything.
4. QC ruthlessly: inspect raw traces, check for artifacts, verify alignment of behavior and neural 
timestamps.
5. Analyze with corrections for multiple comparisons; report effect sizes with confidence 
intervals, not just p-values.
6. Document methods as you go; archive the exact pipeline version with the published results.

```text
Pipeline skeleton:
00_raw/            (immutable, backed up)
01_preprocess/     (filtering, artifact rejection — scripted)
02_qc/             (plots + metrics per session)
03_features/       (spike sorting, ROIs, trial alignment)
04_stats/          (models, corrections, effect sizes)
05_figures/        (generated from 04 outputs, never by hand)
```

## Common pitfalls

- **Analysis after peeking**: exploring the data then writing the hypothesis to fit. Preregister; 
separate exploratory from confirmatory analysis.
- **Underpowered studies**: small N with noisy neural data. Power analysis is not optional.
- **Uncorrected multiple comparisons**: testing thousands of voxels at p<0.05. Correct, or expect 
false positives.
- **Manual data edits**: fixing files by hand breaks reproducibility. Script every transformation.
- **Timestamp misalignment**: behavior and neural clocks drifting. Verify synchronization with 
known events before analysis.
- **Methods from memory**: writing the methods section months later. Generate it from the versioned 
pipeline instead.
