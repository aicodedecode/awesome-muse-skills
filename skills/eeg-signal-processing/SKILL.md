---
name: eeg-signal-processing
description: EEG preprocessing and analysis — filtering, artifact removal, time-frequency decomposition, and ERP workflows.
category: scientific
---

## Overview

eeg-signal-processing covers the full EEG analysis pipeline: from raw multichannel recordings to
interpretable neural measures. It emphasizes principled preprocessing (filtering, re-referencing,
artifact rejection), the major analysis families (ERPs, time-frequency, connectivity), and the
statistical discipline that noisy, high-dimensional EEG data demands.

EEG has millisecond temporal resolution but poor spatial resolution and a terrible signal-to-noise
ratio — most of the work is removing everything that is not brain signal while proving you did not
remove the brain signal too.

## When to use

- Designing an EEG experiment: sampling rate, electrode montage, reference choice, trial counts.
- Preprocessing: filtering, bad-channel handling, re-referencing, ICA-based artifact removal.
- ERP analysis: epoching, baseline correction, component measurement (N170, P300, N400, etc.).
- Time-frequency analysis: ERSP, inter-trial coherence, band-power (alpha, beta, gamma) dynamics.
- Connectivity: coherence, phase-locking value, Granger causality — with volume-conduction caveats.
- Group statistics: cluster-based permutation tests for the multiple-comparisons problem.
- BCI or real-time pipelines: low-latency preprocessing trade-offs.

## Core concepts

- **Sampling and filtering.** Sample at ≥2x your highest frequency of interest (practically 250-1000
  Hz). High-pass at 0.1-1 Hz (higher risks distorting slow ERPs), low-pass at 30-100 Hz depending on
  the question. Use zero-phase (filtfilt) filters; filter continuous data before epoching to avoid
  edge artifacts.
- **Referencing.** The reference defines every voltage you measure. Average reference is common for
  high-density caps; mastoid/linked-ears for ERPs; REST/rREST for reference-free estimates. Never
  compare amplitudes across studies with different references.
- **Artifacts and ICA.** Eye blinks, saccades, muscle, line noise, heartbeats. ICA separates
  statistically independent sources — remove components that are clearly artifactual (frontal
  topography + blink time course), but verify removal did not flatten genuine ERPs.
- **Bad channels.** Interpolate (spherical spline) rather than delete when possible; >10-15% bad
  channels means the recording is suspect. Report interpolation counts per subject.
- **ERPs.** Time-locked averaging: epoch (-200 to 800 ms typical), baseline-correct (pre-stimulus),
  average by condition. Components are defined by polarity, latency, and topography — a "P300" that
  peaks at 200 ms at Oz is probably not a P300.
- **Time-frequency.** Morlet wavelets or multitapers: power changes (ERD/ERS) and phase consistency
  (ITC/PLV). Baseline-normalize (dB or percent change); choose cycles to trade time vs frequency
  resolution.
- **The multiple-comparisons problem.** Thousands of time points × channels × frequencies. Use
  cluster-based permutation tests (Maris & Oostenveld) rather than uncorrected t-tests at every
  sample — the latter guarantees false positives.
- **Volume conduction.** Nearby electrodes share signal through the skull/scalp. Connectivity
  measures must use phase-lag-based metrics (PLI, wPLI, imaginary coherence) or source-space
  analysis; raw coherence between neighbors is mostly conduction.

## Practical workflow

1. **Inspect raw data.** Plot continuous traces; note bad channels, drifts, line noise, movement
   bursts. Decide exclusion criteria before preprocessing.
2. **Filter.** High-pass 0.5 Hz (ICA benefits from 1 Hz), low-pass 40-100 Hz, notch at line
   frequency only if needed (notch filters ring; prefer CleanLine-style approaches).
3. **Clean.** Interpolate bad channels → re-reference → run ICA (on 1-Hz-filtered copy, apply
   weights to 0.5-Hz data) → remove artifact components → epoch → reject residual bad epochs
   (amplitude/step criteria).
4. **Analyze.** ERPs: average and measure mean amplitude in a priori windows. Time-frequency:
   wavelets, baseline-normalized. Keep analysis choices preregistered where possible.
5. **Statistics.** Cluster-based permutation tests across the full time×channel×frequency space;
   report cluster p-values, not cherry-picked electrodes.
6. **Report.** Preprocessing steps with parameters, trial counts retained per condition, reference
   scheme, and exact statistical tests. Share code and (anonymized) data when possible.

Example (MNE-Python sketch):
```python
raw.filter(l_freq=0.5, h_freq=40)
ica = mne.preprocessing.ICA(n_components=20).fit(raw)
ica.exclude = [0, 3]  # identified blink/muscle components
epochs = mne.Epochs(raw, events, tmin=-0.2, tmax=0.8, baseline=(-0.2, 0))
evoked = epochs["target"].average()
```

## Common pitfalls

- Filtering epoched data (edge artifacts) instead of continuous data.
- Double-dipping: selecting electrodes/time windows from the same data you then test.
- Reporting uncorrected p-values across hundreds of tests.
- Confusing muscle artifact (broadband, high-frequency) with gamma-band "cognition."
- Over-aggressive ICA removing genuine neural components along with blinks.
- Baseline-correcting with a baseline that contains condition differences.
- Comparing ERP amplitudes across different reference schemes.
