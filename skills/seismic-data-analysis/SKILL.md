---
name: seismic-data-analysis
description: Earthquake seismology workflows — phase picking, location, magnitude, focal mechanisms, and seismic hazard basics.
category: scientific
---

## Overview

Seismology extracts Earth's interior and earthquake physics from ground-
motion recordings. This skill covers the observational pipeline: reading
seismograms (phase identification), locating earthquakes, measuring
magnitude, determining focal mechanisms, and the basics of seismic hazard
assessment — with ObsPy as the working tool.

## When to use

- Locating earthquakes from station arrival times and building a local catalog
- Measuring magnitudes consistently and understanding their saturation limits
- Determining fault-plane solutions (focal mechanisms) from first motions or waveforms
- Processing active-source or ambient-noise data for subsurface imaging
- Assessing seismic hazard: Gutenberg–Richter, ground-motion prediction, site response

## Core concepts

- **Body waves:** P (compressional, fastest, first arrival) and S (shear, slower, larger amplitude); their differential time (S−P) gives distance — the oldest and most robust location constraint.
- **Location as inverse problem:** minimize travel-time residuals over a velocity model; depth trades off with origin time and is the worst-constrained parameter, especially outside the network.
- **Magnitude scales:** M_L (local, saturates ~M7), m_b/M_s (teleseismic body/surface wave), M_w (moment magnitude — physical, non-saturating, the standard). Never mix scales in one analysis.
- **Seismic moment and focal mechanisms:** M₀ = μAD (rigidity × area × slip); the moment tensor's double-couple part gives the beach-ball fault-plane solution — two nodal planes, one the real fault.
- **Gutenberg–Richter:** log₁₀N = a − bM; b ≈ 1 globally — the statistical backbone of hazard; catalog completeness magnitude M_c must be established before fitting.
- **Site response:** soft soils amplify shaking (and liquefy); bedrock motion ≠ surface motion — hazard without site terms misleads.

- **Array methods:** beamforming and FK analysis use wavefront coherence across stations — slowness and back-azimuth from arrays locate events with few stations and characterize wavefields single stations can't.
- **Receiver functions:** P-to-S conversions at interfaces image crustal and mantle discontinuities — a passive, cheap alternative to active-source profiling for Moho depth and crustal structure.
- **Ambient-noise tomography:** cross-correlating background noise between station pairs extracts surface-wave Green's functions — velocity models without earthquakes, from whatever stations exist.

## Practical workflow

### 1. From waveforms to picks

```python
from obspy import read
from obspy.signal.trigger import classic_sta_lta
st = read("station.mseed")
# Filter, then STA/LTA or AIC pickers for P; verify S by polarization/rotation
```

1. Preprocess: detrend, taper, bandpass appropriate to the distance (local: 1–20 Hz; teleseismic: 0.01–1 Hz).
2. Pick P with STA/LTA or kurtosis/AIC pickers; pick S on rotated horizontal components — verify every automatic pick visually for events that matter.
3. Assign pick weights by quality; a few good picks beat many bad ones.

### 2. Locate

1. Use a calibrated 1D velocity model for the region (or 3D if available); start locations from S−P distances.
2. Invert with a standard locator; inspect residuals — systematic residuals at one station mean a bad pick or a wrong model, not a bad event.
3. Report uncertainties honestly: formal errors understate true uncertainty when the velocity model is wrong — bootstrap or perturb the model for realistic bounds.

### 3. Measure magnitude and mechanism

1. Compute M_L from Wood-Anderson amplitudes with distance corrections; compute M_w from moment-tensor inversion or spectral fitting for significant events.
2. For focal mechanisms: first-motion polarities (needs good azimuthal coverage) or full-waveform inversion; report both nodal planes and the preferred plane with justification.
3. Check mechanism consistency with regional tectonics — a thrust mechanism in a strike-slip regime demands scrutiny, not celebration.

### 4. Hazard basics

1. Build a declustered catalog; determine M_c (maximum-curvature or goodness-of-fit); fit a- and b-values with uncertainties.
2. Apply ground-motion prediction equations (GMPEs) appropriate to the tectonic regime; include site terms (Vs30).
3. Distinguish probabilistic (PSHA: rates over time) from deterministic (scenario earthquake) hazard — they answer different engineering questions.

### 5. Build a local earthquake catalog

1. Run continuous detection (STA/LTA or template matching / ML pickers like PhaseNet) with association (REAL, GaMMA) — modern ML pickers find 5–10× more events than STA/LTA.
2. Locate with a regional 1D model first; upgrade significant events to 3D or double-difference relocation for fault-structure imaging.
3. Compute completeness (M_c) in space and time before any rate or b-value analysis — detection capability varies with network evolution.

### 6. Quick-reference checklist

- [ ] Preprocessing appropriate to epicentral distance (filter bands)
- [ ] Automatic picks visually verified for events that matter
- [ ] Velocity model appropriate to the region; residuals inspected
- [ ] Depth uncertainty assessed honestly (especially outside the network)
- [ ] Magnitude scale stated and consistent (no mixed scales)
- [ ] Catalog completeness (M_c) established before b-value fitting
- [ ] Catalog declustered before PSHA rate calculations
- [ ] Focal-mechanism preferred plane justified (aftershocks/geodesy)

## Common pitfalls

- **Mixing magnitude scales:** M_L 6.0 ≠ M_w 6.0 — catalogs mixing scales produce fake b-value kinks.
- **Trusting depth outside the network:** events outside or at the edge of the station network have essentially unconstrained depths — flag, don't publish.
- **Automatic picks without review:** a misidentified phase (e.g., depth phase as direct P) corrupts location and depth systematically.
- **Ignoring M_c:** fitting Gutenberg–Richter below completeness invents b-value variations from detection thresholds.
- **Beach-ball overinterpretation:** the auxiliary plane is not the fault — use aftershock distributions, geodesy, or directivity to choose.
- **Hazard without declustering:** aftershock sequences violate the Poisson assumption of PSHA — decluster first.
- **ML picker worship:** neural pickers are excellent but inherit training-data biases — validate against analyst picks for your region's event types before trusting the catalog.
- **Clock errors:** GPS timing failures produce systematic mislocations blamed on structure — check timing quality flags, especially for temporary deployments.
