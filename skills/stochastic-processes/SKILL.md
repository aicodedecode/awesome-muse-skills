---
name: stochastic-processes
description: Modeling randomness over time — Markov chains, Poisson processes, Brownian motion, SDEs, and simulation.
category: scientific
---

## Overview

Stochastic processes model systems that evolve randomly: molecular
collisions, queueing, population dynamics, asset prices, neural spikes.
This skill covers the core process families (Markov chains, Poisson,
Brownian motion/Wiener process), stochastic differential equations
(SDEs), stationary distributions, and simulation methods — with the
theoretical grounding to know which process fits the phenomenon.

## When to use

- Modeling a system with intrinsic randomness: reactions, queues, epidemics, diffusion
- Choosing between discrete/continuous time and state representations
- Simulating SDEs (Euler–Maruyama, Milstein) and checking the simulation
- Finding stationary distributions, mean hitting times, or extinction probabilities
- Deciding whether randomness is essential or just noise on a deterministic skeleton

## Core concepts

- **Markov property:** the future depends only on the present, not the history — the defining simplification; check it empirically (does conditioning on more history change predictions?) before assuming it.
- **Discrete-time chains:** transition matrix P; n-step behavior from Pⁿ; stationary distribution π = πP; classification (recurrent/transient, periodic/aperiodic) determines long-run behavior.
- **Continuous-time chains:** generator matrix Q (rates, not probabilities); holding times exponential; the master equation d p/dt = pQ — chemical kinetics and queueing live here.
- **Poisson process:** events at constant rate λ — interarrival times exponential, counts Poisson(λt); the null model for "random events in time"; test against it (over/underdispersion signals mechanism).
- **Brownian motion / Wiener process:** continuous paths, independent Gaussian increments, variance ∝ t — the scaling limit of random walks; geometric Brownian motion for positive quantities (prices, populations).
- **SDEs:** dx = a(x,t)dt + b(x,t)dW — drift + diffusion; Itô vs Stratonovich interpretations differ when noise is multiplicative (Itô: non-anticipating, standard in finance/biology; the choice changes the drift).

- **Hawkes processes:** self-exciting point processes where events raise the future event rate — earthquakes (aftershocks), finance, social contagion; the branching structure gives cluster-size distributions analytically.
- **Mean-field limits:** many interacting particles converge to deterministic PDEs (McKean–Vlasov) as N→∞ — the bridge from agent-based stochastic models to continuum equations.
- **Large-deviation theory:** quantifies probabilities of rare paths exponentially (Freidlin–Wentzell) — the right tool for "how unlikely is this extreme excursion?" beyond Gaussian approximations.

## Practical workflow

### 1. Choose the process family

| Phenomenon | Natural model |
|---|---|
| Counts of events in time | Poisson / Hawkes (self-exciting) / Cox (random rate) |
| Discrete states, random jumps | CTMC (master equation) |
| Continuous noisy dynamics | SDE (Langevin form) |
| Diffusion in space | Brownian motion / Fokker–Planck PDE |
| Population with demographic noise | Birth–death process / diffusion approximation |

### 2. Simulate correctly

```python
import numpy as np
rng = np.random.default_rng(0)
# Euler-Maruyama for dx = a(x)dt + b(x)dW
x = x0
for _ in range(n_steps):
    x += a(x)*dt + b(x)*np.sqrt(dt)*rng.normal()
# Check: halve dt, confirm weak/strong convergence rates
```

1. Match the scheme to the need: Euler–Maruyama (weak order 1, simple), Milstein (strong order 1, needs derivative of diffusion) for pathwise accuracy.
2. Verify by convergence: refine dt and check the error shrinks at the theoretical rate — against an analytical solution or a very fine reference.
3. For CTMCs: Gillespie algorithm (exact event-driven simulation) beats fixed-timestep approximations for reaction/queueing systems.

### 3. Analyze: distributions and timescales

1. **Stationary distributions:** solve πQ = 0 (chains) or the stationary Fokker–Planck equation (SDEs) — compare simulation histograms against theory.
2. **First-passage/hitting times:** mean extinction time, mean time to absorption — often the actual quantity of interest (how long until the population dies out?).
3. **Parameter inference:** likelihoods from transition densities (exact when available, e.g., OU process) or via simulation-based methods (ABC, particle MCMC) otherwise.

### 4. Validate against data

1. Check the Markov assumption and the noise structure (are increments really independent? Gaussian? state-dependent variance suggests multiplicative noise).
2. Compare predicted vs observed: stationary distribution shape, autocorrelation timescale, extreme-event frequency.
3. Distinguish intrinsic stochasticity from parameter uncertainty and measurement noise — they need different data and different models.

### 5. Fit a stochastic model to data

1. Choose observables that identify the model: stationary distribution shape, autocorrelation time, event-count dispersion — different processes can share means but differ in fluctuations.
2. Estimate by likelihood when transition densities are known (OU process, CTMC); otherwise use simulation-based inference (ABC, synthetic likelihood, particle MCMC).
3. Validate by simulating from the fitted model and comparing fluctuation statistics — not just the mean trajectory — with the data.

## Common pitfalls

- **Itô vs Stratonovich confusion:** with multiplicative noise the two calculi give different SDEs — state the interpretation; converting adds a drift correction.
- **Euler–Maruyama with big dt:** stability and accuracy both degrade — convergence-test every SDE simulation.
- **Assuming Markov without checking:** history dependence (refractory periods, memory) breaks the whole apparatus — test first.
- **Poisson by default:** real event data are usually overdispersed (bursty) or underdispersed (refractory) — check dispersion before modeling.
- **Confusing ensemble and time averages:** ergodicity is an assumption — a single long trajectory need not explore the stationary distribution (metastability, absorbing states).
- **Noise as an afterthought:** adding Gaussian noise to a deterministic model is not stochastic modeling — derive the noise from the mechanism (demographic, thermal, measurement).
- **White-noise abuse:** real noise has finite correlation time — white-noise SDEs can misbehave (infinite variance velocities); check whether colored noise or explicit fast dynamics is needed.
- **Ergodicity assumed, not earned:** single-trajectory time averages equal ensemble averages only for ergodic systems — metastable and non-stationary systems violate this silently.
