---
name: radio-astronomy-basics
description: Radio astronomy fundamentals — interferometry concepts, spectral lines (HI, CO), calibration, and imaging basics.
category: scientific
---

## Overview

Radio astronomy sees the cold universe: neutral hydrogen, molecular gas,
synchrotron jets, and pulsars — through clouds and across cosmic time.
This skill covers the essentials: single-dish vs interferometry, the
calibration chain (bandpass, gain, flux scale), spectral-line work (HI,
CO), continuum imaging basics, and reading radio data products critically.

## When to use

- Planning observations: sensitivity estimates, array configuration, frequency choice
- Understanding interferometric images: beam, sidelobes, CLEAN artifacts
- Working with HI 21-cm or CO line data: masses, kinematics, rotation curves
- Interpreting continuum maps: spectral index, polarization, AGN vs star formation
- Evaluating a radio result: is that feature real or a calibration artifact?

## Core concepts

- **Interferometry:** arrays sample the Fourier transform of the sky (visibilities in the uv-plane); angular resolution ~ λ/B_max (baseline), largest recoverable scale ~ λ/B_min — missing short spacings lose extended flux, always.
- **The dirty beam and CLEAN:** incomplete uv-coverage gives a dirty image convolved with a sidelobe-ridden beam; CLEAN deconvolves iteratively — CLEAN artifacts (bowls, stripes) are the classic false features.
- **Calibration chain:** bandpass (frequency response), complex gain (amplitude/phase vs time from calibrators), flux scale (primary calibrators like 3C286) — phase calibration is the make-or-break step; bad phases scatter flux everywhere.
- **Spectral lines:** HI 21 cm (neutral gas mass and kinematics), CO rotational lines (molecular gas, redshifted into radio bands at high z), recombination lines, masers — each with rest frequencies that set the observing band.
- **Continuum mechanisms:** synchrotron (power-law, polarized, AGN/jets/SNRs) vs thermal free–free and dust (star formation) — the spectral index α (S ∝ ν^α) discriminates: steep (~−0.7) = synchrotron, flat/inverted = thermal or self-absorbed.
- **Radiometer equation:** σ ∝ T_sys/√(Δν·τ) — sensitivity from system temperature, bandwidth, and integration time; the sensitivity calculator is step zero of every proposal.

- **Faraday rotation:** magnetized plasma rotates the polarization angle ∝ λ² — rotation measure (RM) maps magnetic fields along the line of sight; multi-frequency polarization data are required.
- **Spectral-line stacking:** aligning and averaging many weak lines (recombination lines, molecular transitions) beats down noise as √N — detections impossible in single lines emerge from stacks.
- **Very-long-baseline interferometry (VLBI):** continental-scale baselines give milliarcsecond resolution — AGN jets, masers, and pulsar astrometry; calibration is brutal (atmosphere dominates) and the field of view tiny.

## Practical workflow

### 1. Plan the observation

1. Run the sensitivity calculator (ALMA OT, VLA exposure calculator): required rms → integration time, given T_sys and bandwidth.
2. Choose configuration for the needed resolution AND largest angular scale — one configuration rarely does both; plan multi-configuration synthesis for extended sources.
3. Budget calibrator overheads (15–30% of time); check calibrator suitability (flux, proximity, structure) in catalogs.

### 2. Calibrate

1. Inspect raw visibilities first: amplitude vs time/frequency reveals RFI, bad antennas, and shadowing — flag before calibrating, not after.
2. Solve bandpass on a strong calibrator, then time-dependent gains on the phase calibrator; apply and re-inspect — residuals should be noise-like.
3. Set the flux scale from the primary calibrator model; verify by imaging the phase calibrator (it should be a point source at the expected flux).

### 3. Image

1. Choose weighting: natural (sensitivity) vs uniform/Briggs (resolution) — Briggs robust ~0.5 is the usual compromise.
2. CLEAN deeply but not into noise; use masks (auto-multithresh) to avoid CLEAN bias — cleaning noise creates fake sources.
3. Check the residual image: structured residuals mean under-cleaning or calibration errors; compare integrated flux with single-dish values to catch missing extended flux.

### 4. Measure and interpret

1. **Continuum:** integrated flux, spectral index across bands, polarization fraction — classify the emission mechanism before overinterpreting morphology.
2. **Spectral line:** moment maps (0: intensity, 1: velocity field, 2: dispersion) with masking (smooth-and-clip) — unmasked moment maps are noise festivals.
3. **HI mass:** M_HI from integrated line flux and distance (optically thin assumption — state it); rotation curves from position–velocity diagrams.

### 5. Reduce a spectral-line dataset

1. Calibrate in the visibility domain (bandpass flattest where the line sits — check bandpass solutions at the line frequency, not just the band center).
2. Subtract continuum in uv-space (uvcontsub) before imaging the line — image-plane subtraction leaves artifacts around bright continuum sources.
3. Image with masking informed by the expected velocity structure; make moment maps with smooth-and-clip masking and always inspect individual channel maps — moment maps hide sins.

### 6. Quick-reference checklist

- [ ] Sensitivity calculated before observing (radiometer equation)
- [ ] Configuration covers both needed resolution and largest angular scale
- [ ] Raw visibilities inspected and flagged before calibration
- [ ] Phase calibrator images verified (point source, expected flux)
- [ ] Weighting choice justified (natural vs uniform/Briggs)
- [ ] Residual image inspected; CLEAN stopped above the noise
- [ ] Missing-flux check against single-dish data for extended sources
- [ ] Spectral indices computed from matched uv-coverage only

## Common pitfalls

- **Missing short spacings:** interferometers resolve out extended emission — "no detection" of a diffuse source may be a uv-coverage statement, not a physical one.
- **CLEAN artifacts as science:** sidelobe patterns around bright sources, clean bowls — always inspect residuals and the dirty beam.
- **RFI blindness:** terrestrial interference mimics spectral lines — check that the "line" isn't at a known RFI frequency and appears in independent data.
- **Phase-calibration failure:** decorrelation from bad phases looks like low flux — verify calibrator images before believing faint targets.
- **Over-cleaning:** cleaning noise builds flux out of nothing — stop at ~2–3σ and mask rigorously.
- **Spectral-index errors:** comparing fluxes at different resolutions/uv-coverages manufactures spectral indices — match uv-ranges first.
- **Continuum subtraction in the image plane:** residuals around bright sources fake line emission — subtract in uv-space.
- **Primary-beam correction forgotten:** fluxes fall off with distance from the pointing center — mosaic or correct, or outer sources are systematically faint.
