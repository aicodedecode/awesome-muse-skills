---
name: compartmental-models
description: Infectious disease modeling with SIR/SEIR models — R0, fitting, forecasting, and intervention scenarios.
category: scientific
---

## Overview

compartmental-models covers the workhorse models of infectious-disease dynamics: SIR, SEIR, and
their extensions. It focuses on building models that inform decisions — estimating R0, projecting
under interventions, and communicating uncertainty — rather than on mathematical novelty. A model
is a decision tool; its value is measured in better decisions, not in fit statistics.

## When to use

- Estimating R0/Rt from early outbreak data.
- Projecting epidemic trajectories under different intervention scenarios.
- Evaluating interventions: vaccination coverage, NPIs, test-and-trace.
- Understanding herd-immunity thresholds and final-size relations.
- Fitting models to case/hospitalization data with proper uncertainty.
- Communicating model results and limits to decision-makers.

## Core concepts

- **SIR structure.** Susceptible → Infectious → Recovered, with transmission rate β and recovery
  rate γ. dS/dt = −βSI/N, dI/dt = βSI/N − γI, dR/dt = γI. Simple, interpretable, and the
  foundation everything else extends.
- **SEIR and extensions.** Add Exposed (latent period) for SEIR; add compartments for
  asymptomatic (A), hospitalized (H), quarantined (Q), vaccinated (V), or waning immunity
  (SIRS) as the question demands. Every compartment needs a justification — complexity must
  earn its keep in better decisions.
- **R0, Re, Rt.** R0 = β/γ: expected secondary cases in a fully susceptible population. Re/Rt:
  effective reproduction number given immunity and interventions. Rt > 1 means growing. Estimate
  from the early exponential growth rate (r) via the generation-interval distribution — R0 ≈
  1 + r×Tg for simple models, but use the proper estimator (EpiEstim/cori for Rt).
- **Herd immunity threshold.** 1 − 1/R0 — the immune fraction at which Re < 1 without
  interventions. It's a threshold for decline, not eradication, and it assumes homogeneous
  mixing — heterogeneity (superspreading, structured contacts) changes it substantially.
- **Homogeneous mixing is the big lie.** Real populations have age structure, households,
  networks, and superspreading. Age-structured contact matrices (POLYMOD-style) are the minimum
  realism for policy models; overdispersion (k parameter) matters for outbreak probability and
  control strategy.
- **Fitting.** Fit to the most reliable data stream (hospitalizations/deaths over cases, which
  depend on testing). Use Bayesian inference (MCMC) or likelihood-based methods with proper
  observation models (negative binomial for overdispersed counts, reporting delays modeled
  explicitly). Fit to multiple streams jointly when possible.
- **Forecasting discipline.** Short-term forecasts (1-4 weeks) with quantified uncertainty
  (prediction intervals, ensemble approaches); scenario projections (not predictions) for
  policy — "if X, then Y" with X explicit. Evaluate past forecasts honestly (coverage of
  prediction intervals).
- **Intervention modeling.** Vaccination (reduce susceptibility/infectiousness by coverage ×
  efficacy), NPIs (reduce β or contacts), test-trace-isolate (reduce infectious period or
  remove infecteds). Model the intervention as actually implementable — 100% compliance
  scenarios are fantasies.

## Practical workflow

1. **Question.** What decision does this model inform? (Not "model the epidemic" — a specific
   choice with options.)
2. **Structure.** Simplest model that captures the decision-relevant mechanism; justify each
   compartment.
3. **Parameters.** Literature values with sources and ranges; estimate the rest from data;
   document every number.
4. **Fit.** Bayesian/MCMC with observation model; check convergence, posterior predictive fits,
   and sensitivity to priors.
5. **Scenarios.** Baseline + intervention options with explicit assumptions; present as ranges
   across parameter uncertainty, not point trajectories.
6. **Validate.** Backtest on held-out periods; compare against simple baselines (a naive model
   that beats your SIR is telling you something).
7. **Communicate.** Assumptions up front, uncertainty as intervals, scenarios labeled as
   scenarios. Never present a single trajectory as "the prediction."

Example (Python sketch):
```python
from scipy.integrate import odeint
def seir(y, t, N, beta, sigma, gamma):
    S, E, I, R = y
    return [-beta*S*I/N, beta*S*I/N - sigma*E, sigma*E - gamma*I, gamma*I]
```

## Common pitfalls

- Fitting to case counts without modeling testing/reporting changes.
- Ignoring reporting delays (recent data are always incomplete — nowcasting needed).
- Homogeneous-mixing models for policy without age/behavior structure.
- Presenting scenarios as predictions.
- Overconfident narrow intervals (models are usually overconfident — widen honestly).
- Parameters from a different pathogen/population without adjustment.
- No validation against held-out data or simple baselines.
