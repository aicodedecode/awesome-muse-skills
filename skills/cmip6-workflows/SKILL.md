---
name: cmip6-workflows
description: Using CMIP6 climate model output — finding data, multi-model means, scenario logic, and bias-aware analysis.
category: scientific
---

## Overview

CMIP6 is the coordinated archive of global climate model runs under shared
scenarios — the basis of IPCC assessments. This skill covers finding the
right simulations (models, experiments, ensemble members), downloading
efficiently, computing multi-model statistics correctly, and the caveats
(model genealogy, bias, scenario interpretation) that keep analyses honest.

## When to use

- Projecting future temperature, precipitation, or extremes for a region
- Comparing model simulations with observations over the historical period
- Selecting a subset of models for downscaling or impact studies
- Understanding what SSP scenarios assume (and what they don't)
- Building a "model agreement" map or time series for a report

## Core concepts

- **MIPs and experiments:** DECK (baseline: piControl, historical, abrupt-4xCO₂, 1pctCO₂) plus ScenarioMIP (SSP1-2.6 through SSP5-8.5), DAMIP (attribution), and others. Know which experiment answers your question.
- **SSP scenarios:** Shared Socioeconomic Pathways × forcing levels (e.g., SSP2-4.5 ≈ middle-of-the-road, 4.5 W/m² by 2100). They are not predictions or likelihood-ranked — they're "what-if" storylines.
- **Ensemble members (r1i1p1f1):** realization/initialization/physics/forcing indices; multiple realizations sample internal variability — one run per model conflates variability with model differences.
- **Model genealogy:** many "different" models share components or code ancestry; the multi-model mean is not 40 independent estimates — weight or subset with this in mind.
- **Bias:** all models have regional biases (double-ITCZ, too-weak monsoons); raw model output should be bias-corrected or interpreted as change (delta) rather than absolute values for impacts.
- **Equilibrium climate sensitivity (ECS):** several CMIP6 models run hot (ECS > 5 °C); the IPCC AR6 assessed best estimate is ~3 °C — flag high-ECS models in your ensemble.

- **Pattern scaling:** regional change often scales quasi-linearly with global mean warming — pattern scaling emulates many scenarios from a few runs, useful for rapid impact screening (with caveats for precipitation).
- **Emergent constraints:** observable present-day quantities that correlate with future projections across models (e.g., tropical low-cloud feedback) — narrows uncertainty but each constraint needs physical justification, not just correlation.
- **Initialized predictions (DCPP):** decadal predictions initialized from observed ocean states — distinct from scenario projections; skill comes from initialized internal variability, mainly in the North Atlantic.

## Practical workflow

### 1. Find and fetch data

```bash
# Search ESGF; then download with wget scripts or intake-esm catalogs
# Prefer a curated cloud copy (e.g., Pangeo/Google CMIP6 bucket) over scraping ESGF nodes
```

1. Query by variable, experiment, model, and frequency (monthly `Amon` suffices for most means; daily needed for extremes).
2. Download only the region/variables you need — full CMIP6 is petabytes; use server-side subsetting (OPeNDAP) or cloud buckets with intake-esm.
3. Record the exact variant IDs (rXiYp1f1) and model versions — "CMIP6 average" is not reproducible without them.

### 2. Preprocess consistently

1. Regrid all models to a common grid (conservative remapping for fluxes/precipitation, bilinear for smooth fields) with xESMF.
2. Align calendars (360-day vs Gregorian) and time axes before any multi-model math.
3. Compute anomalies relative to each model's own historical baseline to remove mean bias — or apply formal bias correction for impact use.

### 3. Analyze the ensemble

1. Multi-model mean for the forced signal; spread (interquartile or ±1σ) and model agreement (fraction agreeing on sign of change) for uncertainty.
2. Weight or subset models transparently if you do — document the criterion (independence, performance) and show sensitivity to the choice.
3. Separate scenarios: never average across SSPs — show them as distinct futures.

### 4. Interpret and caveat

1. Check the historical period against observations first — if the ensemble can't reproduce the past in your region, distrust its future there.
2. Note known limitations: coarse resolution misses orographic precipitation, tropical cyclones, and convective extremes — downscale or use high-res MIPs (HighResMIP) where it matters.
3. State that scenarios are conditional projections, not forecasts.

### 5. Select a model subset transparently

1. Define selection criteria before looking at results: independence (one per model family), performance on relevant historical metrics, or spanning the ECS range.
2. Document who was excluded and why — "we used the models that were available" is honest if true; silent cherry-picking is not.
3. Show sensitivity: does the conclusion survive with the full ensemble, with only low-ECS models, with one-per-center subsets?

### 6. Quick-reference checklist

- [ ] Experiment, model, and variant IDs (rXiYp1f1) recorded for reproducibility
- [ ] Scenarios kept separate (never averaged across SSPs)
- [ ] All models regridded to a common grid with appropriate remapping
- [ ] Calendars and time axes aligned before multi-model math
- [ ] Multiple realizations used where available (internal variability)
- [ ] Model genealogy considered (not 40 independent estimates)
- [ ] High-ECS models flagged in unweighted means
- [ ] Historical period validated against observations for your region

## Common pitfalls

- **Averaging across scenarios:** mixing SSP1-2.6 with SSP5-8.5 produces a meaningless middle.
- **One run per model:** internal variability then masquerades as model uncertainty — use multiple realizations where available.
- **Treating models as independent:** shared ancestry means the ensemble spread understates true uncertainty; say so.
- **Raw absolute values for impacts:** feed bias-corrected data (or delta-change) to impact models, not raw GCM output.
- **Ignoring the hot-model problem:** high-ECS CMIP6 models skew unweighted means warm — consider constrained ensembles.
- **Daily extremes from monthly data:** you cannot derive heatwave statistics from monthly means — fetch the daily fields.
- **Regridding precipitation with bilinear interpolation:** non-conservative remapping creates/destroys water — use conservative remapping for fluxes and precipitation.
- **Native-grid statistics:** computing area means on native grids without area weighting, or comparing native-resolution fields across models — regrid to a common grid first, always.
