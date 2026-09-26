---
name: spatial-epidemiology
description: Geographic disease analysis — cluster detection, disease mapping, spatial regression, and hotspot surveillance.
category: scientific
---

## Overview

spatial-epidemiology covers the analysis of disease in geographic space: mapping rates, detecting
clusters, modeling spatial risk factors, and building hotspot surveillance systems. It combines
epidemiologic thinking with GIS and spatial statistics — and it treats the modifiable areal unit
problem and edge effects as first-class concerns, not footnotes.

## When to use

- Mapping disease rates: choropleth maps, smoothed rate maps, uncertainty visualization.
- Cluster detection: SaTScan spatial scan statistics, local Moran's I (LISA).
- Spatial regression: accounting for spatial autocorrelation in risk-factor models.
- Hotspot surveillance: prospective space-time detection for outbreak response.
- Environmental epidemiology: exposure-disease associations with spatial data.
- Resource allocation: where to target interventions.

## Core concepts

- **Rates, not counts.** Map age-standardized rates (or SMRs), never raw case counts —
  counts map population density. Small areas produce wildly unstable rates; smooth with
  empirical Bayes or BYM models and map the uncertainty alongside the estimate.
- **MAUP (modifiable areal unit problem).** Results depend on how boundaries are drawn
  (zoning) and at what scale. A cluster at the district level may vanish at the village level
  and vice versa. Analyze at multiple scales; never treat one aggregation as "the" geography.
- **Spatial autocorrelation.** Nearby areas resemble each other (Tobler's law). Test with
  global Moran's I; ignoring it in regression underestimates standard errors and inflates
  significance. Model it: spatial lag/error models, CAR/BYM Bayesian models, or GAMs with
  spatial smooths.
- **Cluster detection.** Kulldorff's spatial scan statistic (SaTScan): scans windows of varying
  size, tests each against the null, corrects for multiple testing via Monte Carlo. Report the
  primary and secondary clusters with relative risks and p-values. Pre-specify max window size
  (commonly 50% of population) — larger windows find vaguer "clusters."
- **LISA maps.** Local Moran's I classifies areas as high-high, low-low, high-low, low-high —
  useful for exploratory hotspot/coldspot visualization. Correct for multiple testing; LISA is
  exploratory, not confirmatory.
- **Disease mapping models.** BYM (Besag-York-Mollié): Poisson counts with spatially structured
  + unstructured random effects, fit via INLA or MCMC. Produces smoothed risk maps with credible
  intervals — the right way to map rare diseases in small areas.
- **Prospective surveillance.** Space-time scan statistics run repeatedly on incoming data for
  early outbreak detection. Manage the alert burden: tune sensitivity, require minimum case
  counts, and build an investigation workflow — uninvestigated alerts are noise.
- **Ecological fallacy.** Area-level associations don't imply individual-level causation
  (areas with more X having more disease ≠ X causes disease in individuals). State the level of
  inference explicitly; individual-level data beats ecological analysis whenever available.

## Practical workflow

1. **Geocode and validate.** Addresses to coordinates; check match rates and positional
   accuracy; handle PO boxes and rural routes explicitly.
2. **Choose geography.** Appropriate scale(s) for the question; document boundary sources and
   vintages (boundaries change).
3. **Map descriptively.** Standardized rates with uncertainty; multiple scales; never counts
   alone.
4. **Test for clustering.** Global Moran's I first; then SaTScan or LISA for location.
5. **Model.** Spatial regression (CAR/BYM/INLA) for risk factors, with non-spatial comparison
   to show what spatial modeling changed.
6. **Surveillance (if operational).** Prospective space-time scans with alert protocols.
7. **Report.** Maps with uncertainty, methods for geocoding and aggregation, MAUP sensitivity,
   and ecologic-vs-individual inference limits.

Example (R sketch):
```r
library(spdep); library(INLA)
nb <- poly2nb(shp); lw <- nb2listw(nb)
moran.test(shp$rate, lw)                       # global autocorrelation
fit <- inla(cases ~ x + f(id, model="bym", graph=g),  # BYM disease mapping
            family="poisson", E=expected, data=d)
```

## Common pitfalls

- Mapping raw counts instead of rates.
- Unstable small-area rates presented without smoothing or uncertainty.
- MAUP ignored — one aggregation treated as truth.
- Spatial autocorrelation unmodeled (inflated significance).
- Scan-statistic fishing with unreported window-size tuning.
- Ecological fallacy in interpretation.
- Geocoding errors (low match rates, systematic rural misses) unreported.
