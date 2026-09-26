---
name: fits-workflows
description: Working with FITS astronomical data — headers, WCS, image calibration, and stacking with astropy.
category: scientific
---

## Overview

FITS is astronomy's universal container: n-dimensional arrays plus rich
headers carrying coordinates, instrument state, and provenance. This skill
covers reading and manipulating FITS files with astropy, understanding
WCS (world coordinate systems), the CCD calibration chain (bias, dark,
flat), and stacking — the unglamorous pipeline every pretty picture
stands on.

## When to use

- Opening and inspecting any astronomical image, spectrum, or data cube
- Calibrating raw CCD/CMOS frames: bias subtraction, dark correction, flat-fielding
- Aligning and stacking exposures to go deeper
- Converting pixel coordinates to RA/Dec (and back) with WCS
- Writing FITS files with proper headers for archiving or publication

## Core concepts

- **HDUList structure:** Primary HDU + extensions (image, binary table, compressed); headers are keyword = value / comment cards — always inspect before assuming (BITPIX, BUNIT, BSCALE/BZERO).
- **WCS:** the mapping from pixel (x, y) to sky (RA, Dec) via reference pixel (CRPIX), reference value (CRVAL), and transformation matrix (CD/PC + CDELT); distortions need SIP or TPV extensions — linear WCS is approximate at field edges.
- **Calibration chain:** raw − bias (zero-point) − scaled dark (thermal current) → ÷ normalized flat (pixel response) — in that order; each step needs master frames built from many exposures with sigma-clipping.
- **Noise model:** read noise (per read), photon/Poisson noise (√N), dark current — propagate into weight/error maps; don't stack without tracking noise.
- **Units and scaling:** BSCALE/BZERO pseudo-floats, BUNIT strings (check them — "counts" vs "electrons" vs "ADU" changes every downstream calculation), exposure time and gain in headers for flux calibration.
- **Provenance:** DATE-OBS, INSTRUME, TELESCOP, FILTER, EXPTIME, GAIN, RDNOISE — a FITS file without these is barely science-ready; preserve and extend headers through the pipeline.

- **Data cubes:** 3D FITS (RA, Dec, wavelength/velocity) from integral-field spectrographs and radio interferometers — slice, collapse (moment maps), and visualize with spectral-cube; mind the beam/PSF varying with frequency.
- **Table extensions:** binary tables carry catalogs, spectra, and light curves in the same container — learn fits.getdata on extensions, not just images; column units live in TUNITn keywords.
- **Checksums:** DATASUM and CHECKSUM keywords verify file integrity through archives and transfers — verify before long pipelines, not after mysterious failures.

## Practical workflow

### 1. Inspect before you touch

```python
from astropy.io import fits
hdul = fits.open("frame.fits")
hdul.info()                    # HDU layout
hdr = hdul[0].header
print(repr(hdr))               # read every keyword that matters
data = hdul[0].data.astype(float)
```

1. Verify dimensions, BITPIX, BUNIT, and that the WCS is present and sane (plot a coordinate grid).
2. Check for BSCALE/BZERO — astropy applies them by default; know whether your array is in raw ADU or scaled units.
3. Look at the data: statistics, a quick display with sensible scaling (zscale), and a histogram — saturated, blank, or gradient-dominated frames announce themselves.

### 2. Build masters and calibrate

```python
from astropy.io.fits import getdata
import numpy as np
# Sigma-clipped master bias from N frames; same pattern for darks and flats
bias = np.median([getdata(f).astype(float) for f in bias_files], axis=0)
```

1. Combine ≥15 biases (median), darks matched to science exposure time and temperature, flats per filter (dome + sky, or twilight).
2. Normalize flats by their mode/median — never divide by a flat containing zeros or cosmic rays (clip and smooth appropriately).
3. Apply: (raw − master_bias − scaled_master_dark) / normalized_master_flat; propagate or at least record the noise terms.
4. Fix cosmic rays (LACosmic / astroscrappy) after calibration, before stacking — and keep a mask.

### 3. Align, stack, and solve astrometry

1. Register frames via WCS reprojection (reproject package) or star matching; verify alignment by blinking subtracted pairs.
2. Stack with sigma-clipped mean/median; generate exposure/weight maps alongside — the stack is only half the product.
3. If WCS is missing or wrong, solve with astrometry.net (local solve-field) and verify against a catalog (Gaia) — residuals should be sub-pixel.

### 4. Write it back properly

1. Update headers: processing steps in HISTORY, calibration files used, software versions.
2. Keep BUNIT honest through every operation; stacking changes "counts" to "counts/s" only if you divided by exposure — say which.
3. Compress wisely (Rice for integers, float quantization only if you understand the precision cost); never lossy-compress science data silently.

### 5. Build a reproducible reduction pipeline

1. Script every step (no interactive GUI-only operations) with logged parameters — the pipeline script plus raw data plus calibration files reproduces the product.
2. Version-control the pipeline; tag the version used for each data release — "reduced with v2.3.1" belongs in every paper's methods.
3. Validate end-to-end on a standard field: photometric zero points against catalogs, astrometry against Gaia — pipeline outputs get the same QA as the science.

## Common pitfalls

- **Calibrating in the wrong order:** dividing by the flat before subtracting bias bakes the bias structure into every frame.
- **Single master frames:** one bias frame adds its noise to every science frame — always combine many.
- **Ignoring BUNIT/BSCALE:** mixing ADU and electron units between frames corrupts flat-fielding and photometry.
- **Blind WCS trust:** linear WCS at wide-field edges can be arcseconds off — check residuals against Gaia.
- **Stacking misaligned frames:** sub-pixel shifts smear PSFs and fake extended structure — verify registration first.
- **Header amnesia:** processing without recording it makes the product irreproducible — HISTORY cards are cheap.
- **Lossy compression of science frames:** quantizing float images to save space is irreversible — keep lossless masters; compress only distribution copies, and say so.
- **Header keyword collisions:** non-standard keywords overwritten by software defaults (BUNIT, OBJECT) — audit headers after each pipeline stage, not just at the end.
