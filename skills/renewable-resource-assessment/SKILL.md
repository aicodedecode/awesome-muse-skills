---
name: renewable-resource-assessment
description: Assessing wind, solar, and hydro resources — measurement, modeling, uncertainty, and bankable energy-yield estimates.
category: scientific
---

## Overview

A renewable energy project lives or dies on the resource assessment: how
much wind, sun, or water the site actually gets. This skill covers
measurement campaigns (met masts, lidar, pyranometers), long-term
correction with reanalysis (MCP), energy-yield modeling, and the
uncertainty accounting that makes a yield estimate bankable.

## When to use

- Siting a wind or solar farm: screening sites and designing the measurement campaign
- Converting a year of site data into a long-term (P50/P90) energy-yield estimate
- Reviewing a resource assessment report for financing or acquisition
- Estimating rooftop or distributed solar potential for a region
- Assessing hydro resource variability and climate-change exposure

## Core concepts

- **Wind:** power ∝ v³ — small wind-speed errors become large energy errors; the Weibull distribution describes the speed frequency; shear (power law or log law) extrapolates mast height to hub height; turbulence intensity affects loads and production.
- **Solar:** GHI (global horizontal), DNI (direct normal), DHI (diffuse); plane-of-array irradiance via transposition models; temperature derates PV output (~−0.35%/°C for silicon); soiling and shading are site-specific losses.
- **MCP (measure–correlate–predict):** correlate short site measurements with long-term reference data (ERA5, MERRA-2) to estimate the long-term climate — the standard fix for interannual variability.
- **P50/P90:** P50 is the median expected yield; P90 the conservative value exceeded 90% of the time — lenders size debt on P90; the P50–P90 gap measures total uncertainty.
- **Loss stack:** availability, wake effects, electrical losses, soiling, curtailment, degradation — each small, together 10–20%; itemize rather than applying a single fudge factor.
- **Hydro:** flow-duration curves from gauged records; firm vs secondary energy; sedimentation reduces storage; climate shifts alter both means and extremes.

- **Shear extrapolation risk:** the power-law/log-law extrapolation from measurement height to hub height is a leading uncertainty source — measure as close to hub height as possible; lidar makes this cheap now.
- **Interannual variability vs climate change:** 10–20 years of reference data captures variability; the climate-change signal in wind/solar resources is smaller but non-zero — check trends in the reference period before assuming stationarity.
- **Curtailment and grid constraints:** the resource at the site is not the energy delivered — grid capacity, curtailment risk, and offtake terms belong in the yield assessment, not just the financial model.

## Practical workflow

### 1. Measure the resource

1. **Wind:** met mast or lidar at/near hub height, ≥12 months; calibrate anemometers; measure shear with multiple heights and direction with vanes.
2. **Solar:** secondary-standard pyranometers (GHI + DHI) or reference cells, cleaned and calibrated; ≥12 months; log soiling with a paired clean/dirty sensor if dust is suspected.
3. Document everything: sensor models, calibration certificates, heights, boom orientation, data recovery rate (>90% target).

### 2. Build the long-term estimate

1. Select reference data (ERA5/MERRA-2 nodes, nearby long-term stations); validate correlation with concurrent site data (R², bias by direction/season).
2. Apply MCP to synthesize a long-term (10–30 year) site time series; check that the reference period is climatologically representative.
3. For wind, fit the long-term speed distribution and compute gross energy from the turbine power curve; for solar, transpose to plane-of-array and apply the temperature model.

### 3. Model energy yield and losses

1. **Wind:** wake modeling (analytical or CFD-lite), availability (typically 97–98%), electrical losses, curtailment, icing if relevant.
2. **Solar:** shading analysis, inverter clipping, mismatch, soiling, degradation (~0.5%/yr), availability.
3. Present gross → net with each loss itemized; never bury losses in a single "derate."

### 4. Quantify uncertainty (the bankable part)

1. List uncertainty components: measurement, MCP/reference, interannual variability, model/wake, losses — combine in quadrature (root-sum-square) with stated distributions.
2. Report P50, P75, P90 (and P99 for stress tests); show which components dominate — that tells you what extra measurement would buy.
3. Sensitivity-test key assumptions (shear exponent, soiling rate, degradation) — lenders will ask.

### 5. Audit a resource assessment report

1. Check the measurement: duration (≥12 months?), heights, calibration certificates, data recovery rate — no measurement, no bankability.
2. Check the MCP: reference dataset choice, correlation quality (R², directional/seasonal bias), reference-period representativeness.
3. Check the uncertainty: itemized components combined properly, P90 derived not guessed, and loss stack itemized rather than lumped — then verify the P50 against independent data if any exists.

### 6. Quick-reference checklist

- [ ] ≥12 months of site measurement at/near hub height (wind) or with calibrated pyranometers (solar)
- [ ] Sensor calibrations current with certificates on file
- [ ] Data recovery rate >90% with gaps documented
- [ ] MCP performed against a validated long-term reference
- [ ] Shear extrapolation minimized (measure high; lidar preferred)
- [ ] Loss stack itemized (wakes, availability, electrical, soiling, curtailment, degradation)
- [ ] Uncertainty components combined properly; P50/P90/P99 reported
- [ ] Key assumptions sensitivity-tested (shear, soiling, degradation)

## Common pitfalls

- **One windy year extrapolated forever:** interannual variability is ±10% or more — MCP correction is mandatory, not optional.
- **v³ amplification:** a 5% wind-speed bias is a ~15% energy bias — calibrate anemometers and scrutinize shear extrapolation.
- **Ignoring wakes and blockage:** gross turbine yield ≠ farm yield; array effects cost 5–15%.
- **Soiling and shading hand-waving:** in dusty or built environments these dominate uncertainty — measure, don't assume.
- **Degradation optimism:** PV warranties promise ≤0.5%/yr; actuals vary — use measured fleet data where available.
- **Climate non-stationarity:** 30-year historical normals may misstate the next 30 years for hydro and, increasingly, wind/solar regimes — check trends.
- **Vendor power curves as truth:** manufacturer power curves are measured under ideal conditions — apply realistic turbulence, shear, and availability derates; validate against operational fleet data.
- **Soiling assumed zero:** in arid and agricultural regions soiling losses of 5–20% are normal — a zero-soiling assumption needs site-specific justification, not optimism.
