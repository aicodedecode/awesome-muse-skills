---
name: remote-sensing
description: Satellite and airborne remote sensing — multispectral indices, SAR basics, classification, and change detection.
category: scientific
---

## Overview

Remote sensing measures the Earth without touching it: reflected sunlight,
emitted thermal radiation, and radar backscatter from orbit or aircraft.
This skill covers the main sensor families (multispectral, hyperspectral,
SAR, lidar, thermal), core products (indices, classifications, change
maps), and the preprocessing chain that turns raw scenes into trustworthy
analysis.

## When to use

- Mapping land cover, crops, forests, water, or urban change over time
- Monitoring deforestation, floods, fires, or glacier retreat
- Choosing imagery for a project: resolution, revisit, cost, and licensing trade-offs
- Building a classification or change-detection pipeline
- Interpreting SAR data for deformation (InSAR) or all-weather imaging

## Core concepts

- **Resolution trade-offs:** spatial (pixel size), spectral (band count/width), temporal (revisit), radiometric — no sensor maximizes all four; Landsat/Sentinel-2 balance them for free, commercial constellations sell the extremes.
- **Spectral signatures:** vegetation (high NIR, red absorption), water (NIR absorption), bare soil/minerals (SWIR features) — indices like NDVI = (NIR−Red)/(NIR+Red) compress these into interpretable products.
- **SAR:** active microwave sensing — sees through clouds and at night; backscatter depends on roughness, moisture, and geometry; interferometry (InSAR) measures ground deformation to millimeters from phase differences.
- **Preprocessing chain:** radiometric calibration → atmospheric correction (TOA to surface reflectance) → cloud/shadow masking → topographic normalization in mountains. Analysis on uncorrected data inherits atmospheric noise.
- **Classification:** supervised (training polygons → random forest/SVM) vs unsupervised (clustering); accuracy assessed with an independent validation set via confusion matrix — never validate on training data.
- **Change detection:** post-classification comparison, spectral differencing, or time-series break detection (BFAST, CCDC) — each with different sensitivity to phenology vs real change.

- **BRDF effects:** reflectance depends on sun–sensor geometry — cross-track brightness gradients in wide-swath sensors are viewing geometry, not land change; normalize or compare like-with-like geometries.
- **Phenology vs change:** seasonal vegetation cycles dominate most time series — harmonic models or same-season comparisons separate the annual cycle from real trends; two-date differencing across seasons is meaningless.
- **Data fusion:** optical + SAR + lidar combine complementary strengths (chemistry, structure, all-weather) — fusion beats any single sensor for biomass, flooding, and urban mapping.

## Practical workflow

### 1. Choose data for the question

1. **Free workhorses:** Sentinel-2 (10 m, 5-day), Landsat 8/9 (30 m, 16-day, deep archive to 1984), Sentinel-1 SAR (all-weather), MODIS/VIIRS (daily, coarse).
2. Match resolution to the target: field-scale agriculture needs ≤10 m; regional deforestation works at 30 m; continental trends at 250 m+.
3. Check the archive depth and cloud climatology for your region — persistent cloud cover may force SAR instead of optical.

### 2. Preprocess

```bash
# Typical Sentinel-2 chain: download L2A (already atmospherically corrected)
# or run Sen2Cor on L1C; mask clouds with the SCL band before any analysis
```

1. Use analysis-ready data (Landsat Collection 2 L2, Sentinel-2 L2A) when available — skip reimplementing atmospheric correction.
2. Mask clouds, shadows, and snow rigorously; a single unmasked cloud corrupts composites and classifications.
3. Build cloud-free composites (median over a season) for stable classification inputs.

### 3. Analyze

1. **Indices:** NDVI/EVI (vegetation), NDWI (water), NBR (burn severity) — quick, interpretable, and comparable across studies.
2. **Classification:** collect training data from field knowledge or very-high-resolution imagery; train a random forest; report the confusion matrix and per-class F1, not just overall accuracy.
3. **Change:** for deforestation or urban expansion, time-series methods beat two-date comparison — they separate seasonal cycles from real breaks.
4. **InSAR:** for subsidence or volcano/earthquake deformation — mind coherence loss in vegetated areas and atmospheric phase screens.

### 4. Validate and report

1. Accuracy assessment with independent reference data (field plots, photo-interpretation); report user's and producer's accuracy per class.
2. State sensor, dates, processing level, and software versions — reproducibility requires all of them.
3. Caveat known limits: mixed pixels at class boundaries, phenology confusion, SAR layover/shadow in steep terrain.

### 5. Build an operational monitoring system

1. Define the alert: what change, what minimum area, what latency — "deforestation alerts" need all three specified or they drown in noise.
2. Automate the chain: ingestion → preprocessing → detection → alerting, with QA flags at each step and a human review loop for high-stakes alerts.
3. Track accuracy over time: concept drift (new sensors, land-use regimes) degrades fixed models — revalidate annually against fresh reference data.

### 6. Quick-reference checklist

- [ ] Sensor, dates, and processing level documented
- [ ] Atmospheric correction applied (or analysis-ready product used)
- [ ] Clouds AND shadows masked before analysis
- [ ] Training and validation data strictly separated
- [ ] Per-class accuracy reported (confusion matrix), not just overall
- [ ] Phenology controlled (same-season comparisons or time-series methods)
- [ ] Mixed-pixel effects considered at class boundaries
- [ ] Results validated against independent reference data

## Common pitfalls

- **Skipping atmospheric correction:** comparing TOA reflectance across dates confounds haze with land change.
- **Training-data leakage:** validating on the training polygons inflates accuracy to meaninglessness — keep a held-out set.
- **Overall accuracy only:** 95% overall accuracy can hide a completely missed rare class — report per-class metrics.
- **Two-date change detection:** phenology and registration differences masquerade as change — use time series or careful date matching.
- **Ignoring the mixed-pixel problem:** a 30 m pixel at a forest edge is neither forest nor field — sub-pixel fractions (spectral unmixing) handle this honestly.
- **SAR geometry blindness:** foreshortening, layover, and shadow in mountains make backscatter uninterpretable without a DEM and orbit knowledge.
- **Cloud-shadow omission:** shadows get classified as water or burned area — mask shadows as aggressively as clouds, or the "new lakes" are just shade.
- **Sensor-change artifacts:** Landsat 7 SLC failure, Sentinel-2A vs 2B calibration, MODIS degradation — time series spanning sensor changes need inter-calibration, not blind concatenation.
