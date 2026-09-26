---
name: extreme-weather-stats
description: Statistical analysis of extreme weather — EVT, return periods, thresholds, and detection/attribution of rare events.
category: scientific
---

## Overview

Extremes (heatwaves, heavy rainfall, droughts, windstorms) cause most
weather-related damage, but they're rare by definition — standard
statistics understate them. This skill covers extreme value theory (GEV,
GPD), return-period estimation, threshold selection, non-stationary
methods for a changing climate, and the basics of event attribution.

## When to use

- Estimating the 100-year rainfall or wind speed for infrastructure design
- Defining heatwave/cold-wave indices for health early-warning systems
- Testing whether extremes are intensifying in observations or models
- Attributing a specific event (flood, heatwave) to climate change
- Reviewing a "1-in-1000-year event" claim in the media or a report

## Core concepts

- **Block maxima (GEV):** fit the Generalized Extreme Value distribution to annual maxima — the classical route to return levels. Needs long records; wastes data (one value/year).
- **Peaks over threshold (GPD):** fit the Generalized Pareto Distribution to exceedances of a high threshold — uses data more efficiently; threshold choice is the critical judgment (stability plots guide it).
- **Return period:** the average waiting time between exceedances (a "100-year event" has a 1% annual chance — and a ~63% chance of occurring at least once in 100 years). Return periods extrapolate beyond the record — uncertainty explodes past ~2–3× the record length.
- **Non-stationarity:** in a warming climate, distribution parameters drift with time or global temperature; fit μ(t) or σ(t) as functions of a covariate rather than assuming stationarity.
- **Attribution framing:** probabilistic (how did climate change alter the event's probability/intensity? — the FAR/RR approach) vs storyline (how did known dynamics produce this event?). Both are legitimate; they answer different questions.
- **Compound events:** damaging extremes often combine (heat + drought, rain + storm surge); univariate return periods understate joint risk.

- **Block-maxima vs POT efficiency:** POT uses data more efficiently but introduces threshold selection and declustering judgments — for short records the efficiency gain usually wins; for long clean records, GEV on annual maxima is simpler and robust.
- **Covariate choice in non-stationary models:** global mean temperature (physical, smooth) vs time (a proxy for everything) — temperature covariates generalize better and connect to attribution; time covariates are easier but less interpretable.
- **Spatial pooling:** regional frequency analysis (index-flood style) borrows strength across sites — essential when single-site records are short; requires homogeneity testing of the pooled region.

## Practical workflow

### 1. Prepare the series

1. Use homogenized, complete records; extremes are sensitive to instrument changes and missing data.
2. Declutter (for POT): ensure exceedances are independent events (e.g., separate rainfall by dry intervals, heatwaves by cool breaks).
3. Check for obvious non-stationarity first (plot annual maxima vs time) — it decides the modeling approach.

### 2. Fit the distribution

```python
# Pseudocode: GEV fit to annual maxima with a time-varying location
# mu(t) = mu0 + mu1 * t ; maximize likelihood; compare AIC vs stationary fit
```

1. GEV on annual maxima for a first estimate; GPD on threshold exceedances when the record is short or you need efficiency.
2. Choose thresholds via parameter-stability and mean-residual-life plots — not by round numbers.
3. Fit non-stationary models with covariates (time, global mean temperature); compare against stationary fits with AIC/BIC.
4. Validate with Q–Q plots and return-level plots — a good fit hugs the diagonal; deviations at the tail are warnings.

### 3. Estimate and communicate return levels

1. Report the estimate with confidence intervals (profile likelihood or bootstrap) — the interval, not the point value, is the honest answer.
2. Don't extrapolate beyond ~3× the record length; say "beyond the observable range" instead of quoting a 10,000-year level from 40 years of data.
3. Translate for non-specialists: "1% annual chance" beats "100-year event" (which people misread as "once per century").

### 4. Attribute an event (probabilistic)

1. Define the event class (magnitude, duration, region) before looking at model results.
2. Fit the same statistical model to observations and to model ensembles with/without anthropogenic forcing (factual vs counterfactual).
3. Report the probability ratio (RR) and the change in intensity, each with uncertainty — and the model-evaluation step that justifies trusting the models for this event type.

### 5. Stress-test the return-level estimate

1. Vary the threshold (POT), block definition, and covariate choice — the return level should be stable across reasonable choices; instability is the real uncertainty.
2. Compare stationary vs non-stationary fits with AIC/BIC and likelihood-ratio tests — let the data adjudicate, but prefer the physically motivated covariate.
3. Bootstrap the full pipeline (resampling years/blocks) to get confidence intervals that include the methodological choices, not just the sampling noise.

### 6. Quick-reference checklist

- [ ] Records homogenized and complete; missing data handled explicitly
- [ ] Exceedances decluttered into independent events (POT)
- [ ] Threshold chosen via stability plots, not round numbers
- [ ] Stationarity tested; non-stationary model fit with physical covariate if needed
- [ ] Fit validated with Q–Q and return-level plots
- [ ] Confidence intervals computed (profile likelihood or bootstrap)
- [ ] No extrapolation beyond ~3× the record length
- [ ] Results communicated as annual probabilities, not just "N-year events"

## Common pitfalls

- **Stationarity by default:** fitting a stationary GEV to a warming-era record biases return levels low for heat, high for cold.
- **Extrapolation hubris:** 50 years of data cannot pin down a 1000-year return level — the confidence interval will tell you if you compute it.
- **Threshold hacking:** tuning the POT threshold until the trend looks significant — pre-register or show stability across thresholds.
- **Confusing return period with schedule:** clustering happens; three "100-year" floods in a decade is unlikely but not impossible, especially under non-stationarity.
- **Attribution without model evaluation:** if models can't reproduce the observed statistics of the event type, the attribution numbers are decorative.
- **Single-station generalization:** an extreme at one gauge is not a regional trend — check spatial coherence before generalizing.
- **Declustering by calendar:** splitting exceedances by fixed time windows instead of physical event separation — merges distinct storms or splits single ones; use meteorologically meaningful separation criteria.
- **Presenting the upper confidence bound as "the" estimate:** the precautionary principle doesn't license quoting the 95th percentile as the best estimate — report the central estimate with its interval.
