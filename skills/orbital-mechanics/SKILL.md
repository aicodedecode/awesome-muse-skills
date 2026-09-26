---
name: orbital-mechanics
description: Orbits from Kepler to perturbations — elements, transfers, propagation, and rendezvous math that actually works.
category: scientific
---

## Overview

Orbital mechanics is Newtonian gravity applied to trajectories: six
numbers (the Keplerian elements) describe any bound orbit, and everything
else — transfers, rendezvous, perturbations — is built on them. This
skill covers the element set, the vis-viva equation, Hohmann transfers,
propagation with perturbations (J2, drag, third body), and the numerical
habits that keep simulations honest.

## When to use

- Designing a transfer: LEO to GEO, interplanetary porkchop plots, lunar trajectories
- Propagating a satellite orbit with realistic perturbations
- Interpreting TLEs and conjunction/rendezvous geometry
- Estimating delta-v budgets for a mission concept
- Debugging an orbit propagator: energy drift, wrong frames, unit errors

## Core concepts

- **Keplerian elements:** a (semi-major axis), e (eccentricity), i (inclination), Ω (RAAN), ω (argument of periapsis), ν or M (anomaly) — size, shape, and orientation; the anomaly locates the body along the orbit.
- **Vis-viva:** v² = μ(2/r − 1/a) — the workhorse equation linking speed, position, and orbit size; escape velocity falls out at a → ∞.
- **Conservation:** energy and angular momentum are conserved in the two-body problem — use them as invariants to validate every numerical propagation.
- **Hohmann transfer:** the minimum-energy two-impulse transfer between coplanar circular orbits; Δv split between departure and arrival burns — optimal only for the coplanar circular case.
- **Perturbations:** J2 (Earth's oblateness — nodal precession, the dominant LEO perturbation), atmospheric drag (altitude- and solar-cycle-dependent), third-body (Moon/Sun), solar radiation pressure — each dominant in a different regime.
- **Frames:** ECI (inertial, for propagation) vs ECEF (rotating, for ground tracks) — mixing them is the classic propagator bug; be explicit at every interface.

- **Patched conics:** interplanetary trajectories as linked two-body arcs (departure hyperbola, heliocentric ellipse, arrival hyperbola) — the screening tool behind porkchop plots; good to ~1% for preliminary design.
- **Lagrange points:** equilibrium points of the circular restricted three-body problem — halos around Sun–Earth L1/L2 (SOHO, JWST) and Earth–Moon gateways; station-keeping costs are small but non-zero.
- **Gravity assists:** stealing momentum from a planet's orbital motion — the trajectory design trick behind Voyager, Cassini, and Parker Solar Probe; v∞ in = v∞ out in the planet frame, direction changed.

## Practical workflow

### 1. Set up the two-body baseline

```python
import numpy as np
mu_earth = 398600.4418  # km^3/s^2
# Vis-viva: circular LEO at 400 km
r = 6378.0 + 400.0
v_circ = np.sqrt(mu_earth / r)          # ~7.67 km/s
v_esc = np.sqrt(2 * mu_earth / r)       # ~10.85 km/s
```

1. Work in consistent units (km, s, km³/s² for Earth); convert TLE-era data carefully.
2. Compute the baseline orbit (period from Kepler's third law: T = 2π√(a³/μ)) before adding perturbations.

### 2. Design maneuvers

1. **Hohmann:** Δv₁ at departure (raise apoapsis), Δv₂ at arrival (circularize) — compute both, sum for the budget, add margin (3–10%) and plane-change costs (expensive: Δv = 2v sin(Δi/2)).
2. **Plane changes:** do them at the lowest velocity (highest altitude) or combine with the arrival burn — never in LEO if avoidable.
3. **Interplanetary:** patched conics for screening (departure v∞ from porkchop plots), then high-fidelity n-body for the real trajectory.

### 3. Propagate with perturbations

1. Start with two-body + J2 (analytic secular rates for Ω, ω give quick lifetime/node-drift estimates).
2. Add drag below ~600 km with an atmospheric model (NRLMSISE-00/JB2008) and realistic area-to-mass and solar-cycle assumptions — drag is the lifetime limiter.
3. Use a proper integrator (DOP853 or IAS15-class) with tight tolerance; verify energy/angular-momentum conservation in the unperturbed case to machine precision before trusting perturbed runs.

### 4. Validate relentlessly

1. Check invariants: two-body energy and angular momentum must be conserved to integrator tolerance.
2. Test against known cases: GEO period = sidereal day, ISS-like decay rates, GPS semi-synchronous period.
3. Propagate backward as well as forward — asymmetric errors reveal bugs.

### 5. Design a rendezvous

1. Match planes first (or accept the plane-change cost), then phase: the chaser's orbit period sets the catch-up rate — phasing orbits trade time for delta-v.
2. Compute the Lambert solution for the transfer arc between the two positions at the chosen times of flight.
3. Budget station-keeping and proximity-operations fuel separately — rendezvous is not over at intercept; docking/berthing has its own delta-v and plume-impingement constraints.

## Common pitfalls

- **Frame confusion:** ECI vs ECEF mixups produce ground tracks off by Earth's rotation — label every vector's frame.
- **TLE misuse:** TLEs are mean elements for SGP4 only — don't osculate them into a custom propagator without conversion.
- **Ignoring drag uncertainty:** atmospheric density varies 10× over the solar cycle — lifetime estimates need solar-activity scenarios, not a single number.
- **Impulsive-burn fantasy:** real burns are finite; long low-thrust spirals need entirely different math (Edelbaum, or direct optimization).
- **J2 blindness:** nodal precession (~5°/day at ISS altitude/inclination) dominates LEO geometry over weeks — sun-synchronous orbits exploit it deliberately.
- **Unit errors:** km vs m in μ is the oldest bug in astrodynamics — assert units at function boundaries.
- **Two-body thinking in three-body regimes:** near the Moon or at Lagrange points, the third body's gravity is not a perturbation — use CR3BP dynamics from the start.
- **Impulsive-burn fantasy for low thrust:** ion/electric propulsion spirals need months and continuous-thrust optimization (Edelbaum or direct methods) — Hohmann math does not apply.
