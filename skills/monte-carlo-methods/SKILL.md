---
name: monte-carlo-methods
description: Monte Carlo simulation done well — sampling, variance reduction, MCMC diagnostics, and honest uncertainty quantification.
category: scientific
---

## Overview

Monte Carlo methods solve integration, optimization, and inference
problems by random sampling — converging as 1/√N regardless of
dimension, which makes them the tool of last resort that usually works.
This skill covers direct sampling, variance-reduction techniques,
Markov chain Monte Carlo (Metropolis–Hastings, HMC/NUTS), and the
convergence diagnostics that separate real posteriors from random walks.

## When to use

- Estimating high-dimensional integrals or expectations
- Propagating uncertainty through a nonlinear model
- Bayesian inference: sampling posteriors with MCMC
- Simulating stochastic processes (particle transport, queuing, finance)
- Deciding whether MC is even the right tool (vs quadrature, analytic approximations)

## Core concepts

- **The 1/√N law:** MC error shrinks as σ/√N — dimension-independent, but slow; halving error costs 4× samples. Always report the MC standard error, not just the estimate.
- **Variance reduction:** importance sampling (sample where the integrand matters), control variates, antithetic variates, stratification — a good importance distribution beats 100× more naive samples.
- **MCMC:** construct a Markov chain with the target as its stationary distribution (Metropolis–Hastings, Gibbs, Hamiltonian Monte Carlo). Samples are correlated — effective sample size (ESS), not raw count, measures information.
- **HMC/NUTS:** uses gradients to propose distant, high-acceptance moves — the state of the art for continuous posteriors (Stan, PyMC) — but needs gradients and good parameterization.
- **Convergence diagnostics:** R̂ (potential scale reduction, want <1.01), ESS (>400 per chain for stable estimates), trace plots, divergences (in HMC, divergences = biased sampling, fix the model).
- **Burn-in/warmup:** discard the transient before the chain finds the typical set — with NUTS, warmup also tunes the sampler; never skip it.

- **Quasi-Monte Carlo:** low-discrepancy sequences (Sobol, Halton) fill space more evenly than random — ~1/N convergence for smooth integrands instead of 1/√N; randomize (scrambled Sobol) to keep error estimates.
- **Sequential Monte Carlo (particle filters):** for state estimation in dynamical systems — propagate weighted particles through the dynamics, resample on observations; the nonlinear/non-Gaussian Kalman filter.
- **Multilevel Monte Carlo:** telescoping sums across discretization levels — most samples on cheap coarse levels, few on expensive fine ones; optimal complexity for SDE-driven expectations.

## Practical workflow

### 1. Direct Monte Carlo

```python
import numpy as np
rng = np.random.default_rng(42)  # seed everything, always
x = rng.normal(size=1_000_000)
est = np.mean(f(x))              # E[f]
mc_se = np.std(f(x)) / np.sqrt(len(x))
print(f"{est:.6f} ± {mc_se:.6f}")  # the ± is part of the answer
```

1. Seed the RNG and record the seed — MC results must be reproducible.
2. Vectorize (NumPy/JAX) — Python loops make MC 100× slower than necessary.
3. Report estimate ± MC standard error; increase N until the MC error is small vs the scientific question (not vs zero).

### 2. Reduce variance before increasing N

1. **Importance sampling:** choose q(x) ∝ |f(x)|p(x); weight by p/q; check the weight distribution — a few huge weights mean q is bad.
2. **Control variates:** subtract a correlated, known-expectation function.
3. **Quasi-MC:** low-discrepancy sequences (Sobol) for smooth integrands — converges ~1/N instead of 1/√N.

### 3. MCMC for posteriors

1. Parameterize well: non-centered parameterizations for hierarchical models (the funnel killer); standardize predictors.
2. Run ≥4 chains from dispersed initializations; check R̂ < 1.01, ESS, and zero divergences.
3. Examine trace plots and pair plots — multimodality, funnels, and ridges show up visually before they show up in R̂.
4. Validate with simulation-based calibration or posterior predictive checks — a converged chain sampling the wrong model is still wrong.

### 4. Know when not to MC

1. Low-dimensional smooth integrals: quadrature (scipy.integrate) is far more efficient.
2. Approximately Gaussian posteriors: Laplace approximation or variational inference.
3. Optimization disguised as sampling: if you want the mode, optimize — don't MCMC and take the max.

### 5. Sample a difficult posterior with MCMC

1. Start with short runs to find the typical set — initialize near the MAP estimate or prior draws; diagnose funnels and ridges from pair plots.
2. Reparameterize: non-centered forms for hierarchies, log-transforms for positive parameters, standardization for correlated predictors — most "MCMC failures" are parameterization failures.
3. Validate with simulation-based calibration: simulate data from known parameters, recover them — if the machinery can't recover truth on synthetic data, real-data results are suspect.

## Common pitfalls

- **Unseeded RNGs:** irreproducible results — seed everything, record seeds.
- **Raw sample count as ESS:** 10,000 correlated MCMC draws might be 200 effective samples — report ESS.
- **Ignoring divergences:** HMC divergences indicate biased exploration — reparameterize, don't increase adapt_delta forever.
- **Single chain:** one chain can't diagnose non-convergence — always multiple chains, dispersed starts.
- **Bad importance distributions:** importance sampling with q missing the integrand's mass gives infinite-variance estimates that look converged.
- **MC error omitted:** quoting 6 digits from 10⁴ samples — the MC standard error is part of every MC answer.
- **Thinning as a cure:** thinning reduces storage, not autocorrelation — it never increases effective sample size; fix the parameterization instead.
- **Unnormalized-target mistakes:** Metropolis–Hastings needs only ratios, but the ratio must use the full unnormalized density — dropping "constants" that depend on parameters biases everything.
