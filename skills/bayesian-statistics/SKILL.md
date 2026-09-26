---
name: bayesian-statistics
description: Bayesian data analysis — priors, likelihoods, posterior computation, model comparison, and honest reporting.
category: scientific
---

## Overview

Bayesian statistics treats parameters as random variables and updates
beliefs with data: posterior ∝ likelihood × prior. This skill covers
choosing priors that regularize without dictating, building likelihoods
that respect the data-generating process, computing posteriors (MCMC,
variational), checking models (posterior predictive checks), and
comparing models without fooling yourself.

## When to use

- Estimating parameters with proper uncertainty quantification
- Incorporating prior knowledge or handling small datasets where priors matter
- Hierarchical/multilevel modeling: partial pooling across groups
- Comparing models: Bayes factors, LOO-CV, WAIC
- Reporting Bayesian results so others can interpret and reproduce them

## Core concepts

- **Bayes' theorem:** p(θ|y) ∝ p(y|θ)·p(θ) — the posterior balances what the data say (likelihood) against what was plausible before (prior); with enough data the likelihood dominates.
- **Priors:** weakly informative (regularize, keep computation stable — the modern default), informative (real prior knowledge — justify and sensitivity-test), and "noninformative" (often informative in disguise — check what they imply on the observable scale).
- **Hierarchical models:** parameters drawn from group-level distributions — partial pooling: groups borrow strength, extreme small-sample estimates shrink toward the mean. The single most useful Bayesian modeling pattern.
- **Posterior predictive checks:** simulate data from the fitted model and compare with observed data — systematic misfit means the model is wrong, however well it converged.
- **Model comparison:** LOO-CV/WAIC estimate out-of-sample predictive accuracy; Bayes factors quantify relative evidence but are exquisitely prior-sensitive — report with the priors that produced them.
- **Decision framing:** point estimates (posterior mean/median), intervals (credible intervals — and HDI vs equal-tailed), and loss functions — match the summary to the decision.

- **Prior predictive checks:** simulate data from the prior alone — if the prior generates absurd data, it's an absurd prior regardless of its mathematical convenience; tune until prior predictions are plausible-but-broad.
- **The folk theorem of statistical computing:** computational problems often signal model problems — persistent divergences or poor mixing usually mean the model needs reparameterization or better priors, not more iterations.
- **Bayesian workflow (Gelman):** build → fit → check (posterior predictive) → compare → expand — iteration is the method, not a sign of failure; document the iterations.

## Practical workflow

### 1. Build the model generatively

1. Write the data-generating story first: how would you simulate this data? That story is the model.
2. Choose the likelihood for the measurement process: counts → Poisson/negative-binomial (overdispersion is the norm), proportions → binomial/beta-binomial, positive continuous → lognormal/Gamma, not Normal-by-default.
3. Set weakly informative priors on a standardized scale; prior predictive checks (simulate from priors alone) should produce plausible-but-broad data — absurd prior predictions mean absurd priors.

### 2. Fit with MCMC

```python
# PyMC sketch: hierarchical model with non-centered parameterization
# mu_j = mu + tau * z_j ; z_j ~ Normal(0,1)   # non-centered: kills funnels
```

1. Use non-centered parameterizations for hierarchical models — the centered form creates funnels that HMC can't explore.
2. Run 4+ chains; require R̂ < 1.01, good ESS, zero divergences (see monte-carlo-methods).
3. If divergences persist: reparameterize first, strengthen priors second, raise adapt_delta last.

### 3. Check the fit

1. **Posterior predictive checks:** overlay replicated datasets on the observed — check means, variances, extremes, and any statistic the science cares about.
2. **Residual structure:** patterns in residuals vs predictors or time mean missing structure — add it or acknowledge it.
3. **Sensitivity:** refit with wider/narrower priors on key parameters — conclusions that flip are prior-driven, say so.

### 4. Compare and report

1. Compare models with LOO-CV (arviz.compare) — report elpd differences with standard errors, not just rankings.
2. Report posteriors as distributions (plots + quantiles), not just point estimates; state priors explicitly — a Bayesian result without priors is irreproducible.
3. Distinguish credible intervals ("95% probability the parameter is here, given model+prior") from confidence intervals — and from prediction intervals for new data.

### 5. Build a hierarchical model correctly

1. Write the generative story: population distribution → group parameters → observations — partial pooling is the payoff: noisy small groups borrow strength from the population.
2. Use the non-centered parameterization (parameters as population mean + scale × standard normal offsets) — the centered form creates funnels that defeat HMC.
3. Check shrinkage: group estimates should pull toward the population mean proportionally to their uncertainty — no shrinkage means the hierarchy isn't working (or the groups are truly distinct).

### 6. Quick-reference checklist

- [ ] Generative story written before the model
- [ ] Likelihood matched to the data type (counts, proportions, positive continuous)
- [ ] Priors weakly informative with prior predictive checks done
- [ ] Non-centered parameterization for hierarchical models
- [ ] ≥4 chains, R̂ < 1.01, good ESS, zero divergences
- [ ] Posterior predictive checks performed and reported
- [ ] Prior sensitivity tested on key conclusions
- [ ] Priors stated explicitly in every report

## Common pitfalls

- **Priors chosen by convenience:** default flat priors on transformed scales can be strongly informative — always inspect prior implications.
- **Likelihood misspecification:** Normal likelihood on skewed/count data — the posterior is precisely wrong; match the likelihood to the data type.
- **Ignoring hierarchical structure:** complete pooling (ignores group differences) vs no pooling (noisy group estimates) — partial pooling dominates both.
- **Bayes factors without prior sensitivity:** a BF of 100 that becomes 2 under a reasonable prior change is not evidence — it's prior artifact.
- **Convergence theater:** R̂ < 1.01 on a misspecified model — diagnostics check computation, not correctness; predictive checks check correctness.
- **Posterior hacking:** trying models until the credible interval excludes zero — preregister the model or report the multiverse.
- **Centered parameterization of hierarchical models:** the funnel geometry stalls HMC and produces divergences — non-center by default, center only with strong group-level data.
- **Posterior predictive checks skipped:** a well-converged chain on a misspecified model is precisely wrong — predictive checks are part of fitting, not optional extras.
