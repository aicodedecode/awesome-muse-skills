---
name: spike-sorting
description: Spike sorting for extracellular electrophysiology — detection, clustering, and quality metrics for single units.
category: scientific
---

## Overview

spike-sorting is the process of detecting action potentials in extracellular recordings and assigning
each spike to the neuron that produced it. It is the gateway to single-unit neuroscience: every
tuning curve, place field, and decoding result downstream depends on sorting done honestly.

Modern high-density probes (Neuropixels) record hundreds of neurons simultaneously, and the field has
moved from manual cluster-cutting to automated sorters (Kilosort, MountainSort, SpyKING Circus) plus
manual curation. The skill covers choosing a sorter, validating its output, and the quality metrics
that separate real single units from multi-unit hash.

## When to use

- Planning a recording: probe choice, sampling rate (≥20-30 kHz), reference strategy.
- Running a sorter: Kilosort2/3/4, MountainSort5, SpyKING Circus — parameters and drift correction.
- Curating output: merging, splitting, and rejecting clusters in Phy.
- Quality metrics: ISI violations, amplitude cutoff, presence ratio, SNR, isolation distance.
- Deciding single-unit vs multi-unit: honest labeling criteria.
- Troubleshooting: drift, double-counted spikes, over-splitting, electrical artifacts.

## Core concepts

- **Detection vs clustering vs curation.** Detection finds threshold-crossing events; clustering
  groups similar waveforms (now usually template-matching, which handles overlapping spikes);
  curation is the human step of merging/splitting/rejecting. Automation reduced but did not
  eliminate curation — blindly trusting sorter output is the commonest failure.
- **Drift.** The brain moves relative to the probe (microns over minutes). Sorters with drift
  tracking (Kilosort's drift correction) are mandatory for long recordings; without it, one
  neuron becomes several fake clusters over time.
- **Template matching.** Modern sorters detect spikes by matching waveform templates rather than
  simple thresholding, which resolves overlapping spikes from nearby neurons firing together —
  critical on dense probes where overlaps are common.
- **Quality metrics (report all of these).**
  - *ISI violations:* fraction of inter-spike intervals <1.5-2 ms (refractory period); <0.5-1%
    for a clean single unit.
  - *Amplitude cutoff:* estimated fraction of spikes missed below detection threshold; <0.1.
  - *Presence ratio:* fraction of the recording during which the unit fires; >0.9 (catches
    units that drift in and out).
  - *SNR / isolation:* waveform amplitude relative to noise; isolation distance or L-ratio for
    cluster separation.
- **Single vs multi-unit.** A cluster passing all metrics is a single unit; one failing
  (e.g. high ISI violations) is multi-unit activity — still usable for population analyses but
  not for claims about individual neurons. Label honestly; mixed analyses should test robustness
  to the single-unit subset.
- **Ground truth.** The only real validation is simultaneous juxtacellular/intracellular recording
  or hybrid synthetic data. Published sorter benchmarks use these; your curation criteria should be
  at least as strict as the benchmark's.
- **Common-path rejection.** Stimulation artifacts, movement, and electrical noise create
  synchronous events across channels — remove or blank these periods before sorting, and check
  cross-correlograms for suspicious zero-lag synchrony.

## Practical workflow

1. **Preprocess.** Band-pass filter (300-6000 Hz), common-average or median referencing across
   the probe, detect and blank stimulation artifacts.
2. **Sort.** Run Kilosort (with drift correction enabled) or MountainSort5 on the full recording.
   Save the raw output — never curate the only copy.
3. **Curate in Phy.** Inspect each cluster: waveform shape and stability over time, autocorrelogram
   (clean refractory gap?), cross-correlograms with neighbors (merge if refractory-gap-free and
   similar waveforms; split if bimodal).
4. **Apply metrics.** Compute ISI violations, amplitude cutoff, presence ratio automatically
   (e.g. quality-metrics packages); label single vs multi-unit by fixed thresholds decided in
   advance.
5. **Sanity checks.** Firing-rate distributions, waveform drift plots, fraction of spikes in
   bursts. Compare unit counts/yield across sessions — sudden changes flag problems.
6. **Export.** Spike times + cluster labels + quality metrics + probe geometry, in a standard
   format (NWB or NWB-like). Downstream analyses read this, never the sorter's raw files.

Example command sketch:
```bash
# Kilosort4 via Python
python -m kilosort --data_dir rec/ --probe neuropixels1.mat --do_drift_correction
# then curate in Phy, then:
python compute_quality_metrics.py --recording rec/ --sorting curated/
```

## Common pitfalls

- Skipping drift correction on long recordings (one neuron → many fake units).
- Over-splitting: treating waveform drift as two neurons.
- Under-merging: the same neuron split across adjacent channels' templates.
- Calling everything a "single unit" without metric thresholds.
- Sorting each session independently when tracking neurons across days (needs explicit
  across-day matching, which is hard — don't pretend it's automatic).
- Including stimulation/movement artifact periods, creating giant fake clusters.
- Changing curation criteria between experimental groups (observer bias — curate blind).
