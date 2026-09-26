---
name: pkpd-modeling
description: Pharmacokinetic/pharmacodynamic modeling — compartmental models, nonlinear mixed effects, and dose selection.
category: scientific
---

## Overview

pkpd-modeling covers quantitative models linking drug dose to concentration (pharmacokinetics)
and concentration to effect (pharmacodynamics): compartmental models, nonlinear mixed-effects
(population) modeling, and model-informed dose selection. It is the quantitative backbone of
drug development — from first-in-human dose to label dosing recommendations.

## When to use

- Characterizing PK: absorption, distribution, metabolism, excretion from concentration-time
  data.
- Population PK (nonlinear mixed effects): separating inter-individual variability from residual
  error, identifying covariates (weight, renal function, genetics).
- PK/PD linkage: Emax models relating exposure to efficacy or safety endpoints.
- Dose selection: simulating untested regimens, pediatric extrapolation, renal/hepatic
  impairment dosing.
- Bioequivalence and biosimilarity assessments.
- Model qualification: visual predictive checks, bootstrap, external validation.

## Core concepts

- **Compartmental PK.** One-compartment (IV bolus: C = C0·e^(−kt)), two-compartment
  (distribution + elimination phases), absorption models (first-order ka, transit compartments
  for delayed absorption). Start simple; add compartments only when diagnostics demand it.
- **Key parameters.** Clearance (CL), volume of distribution (Vd), half-life (t½ = 0.693·Vd/CL),
  bioavailability (F), AUC, Cmax, Tmax. These are the vocabulary — every dosing decision
  translates into these terms.
- **Nonlinear mixed-effects (population) modeling.** Fixed effects (typical values + covariate
  relationships) + random effects (inter-individual and inter-occasion variability) + residual
  error. Tools: NONMEM, Monolix, nlmixr2, Pumas. This is how sparse clinical data (few samples
  per patient) still yields a usable model.
- **Covariate modeling.** Pre-specify plausible covariates (body weight via allometry, renal
  function for renally cleared drugs, age, pharmacogenomic variants); test with
  likelihood-ratio or information criteria; keep only clinically meaningful effects. Data-dredged
  covariates don't replicate.
- **PD models.** Direct Emax (E = Emax·C/(EC50+C)), indirect response (turnover models for
  delayed effects), effect-compartment (hysteresis between plasma and site of action).
  Match the model to the biology — an indirect-response model for a biomarker with slow
  turnover, not a direct Emax forced onto delayed data.
- **Exposure-response.** The regulatory workhorse: relating AUC/Cmax/Cmin to efficacy and
  safety endpoints to justify the dose. A flat exposure-efficacy curve with rising
  exposure-toxicity argues for lower doses; characterize both.
- **Model evaluation.** Goodness-of-fit plots (observed vs predicted, residuals vs time),
  visual predictive checks (does the model simulate data like the observed?), bootstrap
  parameter CIs, and external validation when data exist. A model that can't simulate its own
  training data is not a model.
- **Simulation for decisions.** The payoff: simulate untested doses, special populations, and
  drug-interaction scenarios. Document simulation assumptions — simulated evidence inherits all
  model limitations.

## Practical workflow

1. **Explore.** Plot concentration-time profiles (linear and log scale); identify absorption
   delays, multi-phasic decline, outliers, BLQ patterns.
2. **Base model.** Fit 1- vs 2-compartment with candidate absorption/error models; select by
   diagnostics + information criteria, not by p-values alone.
3. **Covariates.** Pre-specified testing; allometric weight scaling as default for
   cross-population work.
4. **PD linkage.** Choose direct/indirect/effect-compartment by the temporal relationship;
   fit exposure-response for key endpoints.
5. **Evaluate.** GOF plots, VPCs, bootstrap; external data if available.
6. **Simulate.** Dose selection, special populations, label recommendations — with uncertainty
   propagated.
7. **Report.** Model code, parameter tables with CIs, diagnostics, and simulation assumptions.
   Follow regulatory expectations (FDA/EMA popPK guidance) when filing.

Example (nlmixr2 sketch):
```r
library(nlmixr2)
mod <- function() {
  ini({ tka <- 0.5; tcl <- 5; tv <- 50; eta.cl ~ 0.1; prop.err <- 0.2 })
  model({
    ka <- exp(tka); cl <- exp(tcl + eta.cl); v <- exp(tv)
    d/dt(depot) <- -ka * depot; d/dt(centr) <- ka * depot - cl/v * centr
    cp <- centr / v; cp ~ prop(prop.err)
  })
}
fit <- nlmixr(mod, pkdata, est = "saem")
```

## Common pitfalls

- Overcompartmentalized models on sparse data (unidentifiable parameters).
- Covariate dredging without prespecification.
- BLQ data mishandled (dropping vs proper likelihood methods — M3/M4).
- Forcing direct Emax onto delayed PD responses.
- VPCs that look fine because they're too coarse to detect misfit.
- Simulating far outside the studied dose/population range.
- Confusing model fit with truth — models are decision aids with stated assumptions.
