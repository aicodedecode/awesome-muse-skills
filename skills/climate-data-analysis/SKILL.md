---
name: climate-data-analysis
description: Working with observational climate data — reanalyses, station records, anomalies, trends, and honest uncertainty.
category: scientific
---

## Overview

Climate data analysis turns raw observations (stations, satellites, ocean
buoys) into statements about how the climate is changing. This skill covers
the standard datasets (ERA5, HadCRUT, GISTEMP, Berkeley Earth), computing
anomalies and trends correctly, handling spatial/temporal inhomogeneities,
and presenting uncertainty the way the field expects.

## When to use

- Computing temperature or precipitation trends for a region or the globe
- Comparing observations with model output (after regridding to a common grid)
- Building a climate indicator: heatwave days, frost days, growing-season length
- Checking a claim about "record" warmth/rainfall against the data
- Preparing a figure or briefing with defensible numbers and uncertainties

## Core concepts

- **Anomalies, not absolutes:** temperature anomalies (relative to a 30-year baseline like 1991–2020) cancel station elevation and siting biases that corrupt absolute temperatures; always state the baseline period.
- **Reanalysis:** models constrained by observations (ERA5, JRA-55) giving gridded, physically consistent fields — excellent for dynamics, but trends can reflect observing-system changes, not climate.
- **Homogenization:** station records contain non-climatic jumps (relocations, instrument changes); homogenized datasets (GHCN, HadCRUT) adjust for these — raw station data should not be used for trends.
- **Autocorrelation:** climate time series are serially correlated; naive trend significance tests overstate confidence — use adjusted standard errors (e.g., accounting for AR(1)) or block bootstrapping.
- **Internal variability:** ENSO, PDO, AMO modulate trends on yearly-to-decadal scales; a 10-year "pause" or "surge" is usually variability aliasing, not a forcing change.
- **Area weighting:** global means need cosine-latitude weighting on regular grids; polar grid cells are not equal-area.

- **Fingerprints of change:** spatial patterns (tropospheric warming + stratospheric cooling, Arctic amplification, land–ocean contrast) discriminate forced change from internal variability — single global numbers can't.
- **Detection and attribution:** optimal fingerprinting regresses observed patterns onto model-simulated responses to forcings — the formal machinery behind "humans caused this much warming" statements.
- **Energy-budget constraints:** top-of-atmosphere imbalance (CERES) and ocean heat content (Argo) must reconcile with surface warming — inconsistent trends across these point to data problems, not new physics.

## Practical workflow

### 1. Get and inspect the data

```python
import xarray as xr
# ERA5 monthly means: open, select region, cosine-latitude weight
ds = xr.open_dataset("era5_monthly.nc")
t2m = ds["t2m"].sel(latitude=slice(60, -60))
weights = np.cos(np.deg2rad(t2m.latitude))
gm = t2m.weighted(weights).mean(dim=("latitude", "longitude"))
```

1. Choose the dataset for the variable: ERA5 for dynamics/winds, GPCC for precipitation gauges, HadCRUT/Berkeley for long temperature records.
2. Check coverage over your region and period — polar and pre-1950 data are sparse; missing-data patterns bias trends.
3. Read the documentation on known inhomogeneities (satellite transitions in reanalyses, e.g., 1979, 1998, 2006).

### 2. Compute anomalies and trends

1. Remove the seasonal cycle (monthly climatology over the baseline), then annual-average to suppress weather noise.
2. Fit trends with OLS but report autocorrelation-adjusted confidence intervals; test sensitivity to start/end years (endpoint sensitivity is real).
3. For regional trends, show the map — a single number hides dipole patterns and orographic effects.

### 3. Build indicators responsibly

1. Define thresholds physically (e.g., TX90p heatwave days relative to local climatology, not a fixed 35 °C everywhere).
2. Count-based indicators need complete records — infill or mask missing days explicitly.
3. Compare against a fixed baseline so "more heatwaves" means change, not a shifting definition.

### 4. Communicate uncertainty

1. Show ensemble spread or confidence bands, not just the central estimate.
2. Distinguish measurement uncertainty, structural uncertainty (dataset choice), and internal variability — they answer different questions.
3. State the baseline period on every anomaly figure; mismatched baselines are the most common source of fake disagreement.

### 5. Build a defensible regional climate summary

1. Define the region and season from the question (not from where the trend looks biggest) — pre-registration thinking applies to exploratory analysis too.
2. Show the trend map, the area-averaged series with uncertainty bands, and the seasonal breakdown — three views that prevent single-number storytelling.
3. Contextualize: compare with neighboring regions and with model-simulated internal variability — is this trend outside what variability alone produces?

## Common pitfalls

- **Raw station trends:** unhomogenized data with site moves and instrument changes — always use homogenized products for trends.
- **Cherry-picked endpoints:** starting at a strong El Niño (1998) or ending at a La Niña flattens/steepens trends artificially — show sensitivity.
- **Ignoring autocorrelation:** "significant at p<0.05" from naive OLS on annual temperature data is usually wrong.
- **Reanalysis trends as truth:** observing-system changes (new satellites) imprint spurious trends, especially in the upper atmosphere and hydrological cycle.
- **Area-weighting errors:** unweighted means on lat-lon grids overweight the poles.
- **Conflating weather and climate:** a cold winter somewhere says nothing about the global trend — and a hot one doesn't prove it either.
- **Gridded-product worship:** treating interpolated values in data-sparse regions (central Africa, Southern Ocean, pre-1950 Arctic) as observations — check station density maps before interpreting.
- **Baseline shopping:** switching anomaly baselines between datasets to manufacture agreement or disagreement — fix one baseline and note it everywhere.
