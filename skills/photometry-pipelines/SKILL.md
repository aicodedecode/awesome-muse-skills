---
name: photometry-pipelines
description: Measuring brightness from images — aperture and PSF photometry, calibration to standard systems, and light curves.
category: scientific
---

## Overview

Photometry converts pixel counts into physical fluxes and magnitudes —
the basis of light curves, color–magnitude diagrams, and transient
detection. This skill covers aperture and PSF-fitting photometry, sky
background handling, calibration to standard systems (zero points, color
terms, extinction), and building reliable light curves.

## When to use

- Measuring magnitudes of stars, galaxies, or transients in images
- Building light curves: variable stars, exoplanet transits, supernovae, AGN
- Calibrating instrumental magnitudes to a standard system (SDSS, Pan-STARRS, Gaia)
- Doing difference imaging for transient detection
- Deciding between aperture and PSF photometry for a field

## Core concepts

- **Magnitude system:** m = −2.5 log₁₀(F) + ZP — logarithmic, relative; the zero point (ZP) ties instrumental counts to physical flux. Colors (differences of magnitudes) cancel the ZP.
- **Aperture photometry:** sum flux in a circular aperture, subtract sky from an annulus — simple, robust for isolated sources; aperture corrections account for flux outside the aperture (curve of growth).
- **PSF photometry:** fit the point-spread function (DAOPHOT/DoPhot/photutils) — mandatory in crowded fields; yields better precision and deblending at the cost of complexity.
- **Sky background:** the dominant error source for faint sources — measure locally (annulus or background mesh), watch for gradients and contamination by neighbors.
- **Calibration ladder:** instrumental mag → zero point (standard stars in the field) → color terms (filter mismatch) → atmospheric extinction (airmass correction) → standard system. Each rung needs doing.
- **Differential photometry:** for light curves, measure target relative to stable comparison stars in the same frame — cancels clouds, airmass, and most systematics without absolute calibration.

- **Difference imaging (DIA):** subtracting a reference template isolates variable sources in crowded fields — the standard for microlensing, supernova, and dense-cluster transient searches; convolution matching (Alard–Lupton) is the core algorithm.
- **Crowded-field PSF fitting:** DAOPHOT/DoPhot iteratively fit and subtract stars — aperture photometry is simply wrong in globular clusters and the Galactic bulge; use the right tool for the field.
- **Color terms:** filter+detector response never exactly matches the standard system — the linear (sometimes quadratic) color term in the calibration equation absorbs the mismatch; skipping it leaves 0.05–0.2 mag systematics.

## Practical workflow

### 1. Prepare and detect

```python
from photutils.detection import DAOStarFinder
from photutils.background import Background2D, MedianBackground
bkg = Background2D(data, box_size=64, filter_size=3,
                   bkg_estimator=MedianBackground())
finder = DAOStarFinder(fwhm=4.0, threshold=5.0 * bkg.background_rms)
sources = finder(data - bkg.background)
```

1. Work on calibrated (bias/dark/flat-corrected) images; estimate and subtract background with a mesh, checking for over-subtraction around bright sources.
2. Detect at ≥5σ; set FWHM from measured stars, not guesses.
3. Choose aperture radius ~1.5–2× FWHM for the measurement aperture, sky annulus starting ~3× FWHM — then derive aperture corrections from bright isolated stars.

### 2. Measure

1. **Sparse fields:** aperture photometry with local sky; apply curve-of-growth aperture corrections per frame.
2. **Crowded fields:** build an empirical PSF from isolated stars; fit with PSF photometry; iterate (subtract neighbors, refit).
3. Record per-source uncertainties: photon noise + sky noise + read noise — and check that the scatter of constant stars matches the error model (it should, within ~10–20%).

### 3. Calibrate

1. Match to a reference catalog (Pan-STARRS, SDSS, Gaia synthetic photometry, APASS) with proper cross-matching radius and quality cuts.
2. Fit ZP + color term: m_std = m_inst + ZP + c × color; fit per frame or per night; check residuals vs magnitude, color, and position (spatial trends mean flat-field or illumination problems).
3. Correct atmospheric extinction via airmass (m₀ = m − kX) when comparing across elevations; better yet, calibrate each frame independently.

### 4. Build light curves

1. Use differential photometry against an ensemble of comparison stars (weighted mean); reject variable comparisons by their own scatter.
2. Detrend systematics (airmass, seeing, position on chip) — but verify the "trend" isn't the astrophysical signal (compare detrended vs raw).
3. For transits/periodicity: normalize out-of-transit baseline, then run BLS/Lomb-Scargle; always phase-fold and inspect by eye — algorithms find periods in noise.

### 5. Run a transient-detection pipeline

1. Build a deep reference template from the best-seeing images; difference each new image with PSF-matched convolution.
2. Detect on the difference image (≥5σ), then vet: reject subtraction artifacts (dipoles from misregistration), asteroids (motion between exposures), and variable stars (catalog cross-match).
3. Force-photometer the candidate position on all epochs — including pre-discovery non-detections, which constrain the explosion/brightening time.

## Common pitfalls

- **Aperture photometry in crowded fields:** neighbor flux contaminates both aperture and sky annulus — switch to PSF fitting.
- **Global sky subtraction:** a single background value across a frame with gradients or nebulosity biases faint sources — go local.
- **Catalog mismatch:** calibrating against a catalog in a different filter system without color terms — systematic errors of 0.05–0.2 mag.
- **Underestimated errors:** photon-noise-only error bars ignore flat-fielding, sky estimation, and systematics — validate against constant-star scatter.
- **Detrending away the signal:** aggressive systematics removal can erase shallow transits or slow variables — detrend conservatively and compare.
- **Saturation blindness:** saturated stars have flat-topped profiles and garbage magnitudes — flag and exclude above the linearity limit.
- **Aperture corrections from the wrong stars:** deriving corrections from saturated or crowded stars corrupts every magnitude — use bright, isolated, unsaturated stars only.
- **Ignoring correlated noise:** resampled/stacked images have correlated pixels — naive sky-noise estimates understate uncertainties; measure noise empirically from blank regions.
