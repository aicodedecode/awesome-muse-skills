---
name: exoplanet-detection
description: Finding exoplanets — transit and radial-velocity methods, light-curve vetting, and false-positive rejection.
category: scientific
---

## Overview

Exoplanets reveal themselves indirectly: tiny dips in starlight (transits)
or tiny stellar wobbles (radial velocity). This skill covers both
detection methods end to end — from light curves and spectra to planet
parameters — plus the false-positive vetting (eclipsing binaries,
blends, stellar activity) that separates discoveries from retractions.

## When to use

- Searching light curves (TESS, Kepler, ground-based) for transit signals
- Planning or interpreting radial-velocity follow-up of a candidate
- Vetting a transit candidate: ruling out eclipsing binaries and blends
- Deriving planet radius, mass, and orbital parameters from the data
- Assessing a habitability claim critically

## Core concepts

- **Transit depth:** δ = (R_p/R_★)² — a Jupiter around a Sun-like star gives ~1%; an Earth gives ~0.008% (80 ppm) — the signal scale sets the required photometric precision.
- **Transit shape:** duration, ingress/egress slope, and flat bottom encode impact parameter and eccentricity; V-shaped transits scream grazing eclipsing binary.
- **Radial velocity semi-amplitude:** K ∝ M_p sin i / √(a M_★) — Jupiter at 1 AU around the Sun: ~12 m/s; Earth: ~9 cm/s — the instrumental frontier.
- **The sin i degeneracy:** RV alone gives minimum mass (M sin i); only transits (or astrometry) break it to true mass.
- **False positives:** background/foreground eclipsing binaries diluted in the aperture, hierarchical triples, stellar variability — each mimics transits; each has a diagnostic test.
- **Validation vs confirmation:** statistical validation (vespa/TRICERATOPS: planet hypothesis more likely than all false positives) vs dynamical confirmation (RV mass measurement) — know which a claim rests on.

- **Transit-timing variations (TTVs):** gravitational tugs from unseen companions shift transit times — TTVs discover non-transiting planets and measure masses without radial velocity.
- **Phase curves and secondary eclipses:** the planet's own light (reflected + thermal) varies with orbital phase; secondary-eclipse depth gives dayside temperature — atmospheric characterization without resolving the planet.
- **Astrometric detection:** Gaia measures stellar wobbles on the sky — sensitive to long-period massive planets that transits and RV miss; the coming Gaia exoplanet catalog fills the outer-orbit gap.

## Practical workflow

### 1. Find transit signals

1. Detrend the light curve (biweight filters, Gaussian processes) — preserving transit shapes; over-detrending erases shallow signals.
2. Run Box Least Squares (BLS) over a period grid; inspect the top candidates phase-folded — by eye, always.
3. Check the basics: odd/even transit depth consistency (eclipsing binaries often differ), secondary eclipse (stellar companion), transit duration vs stellar density (the photoeccentric check).

### 2. Vet ruthlessly

1. **Centroid test:** does the transit source coincide with the target star? Offset centroids = background blend.
2. **Aperture test:** does depth change with aperture size? Dilution-dependent depth = contaminating eclipsing binary.
3. **Color/odd-even:** depth varying with filter or between odd/even transits = binary.
4. **High-resolution imaging:** adaptive optics/speckle to find close companions diluting the light curve.
5. **Spectroscopy:** single- vs double-lined spectra; bisector spans correlating with RV = stellar activity or blend, not a planet.

### 3. Measure the planet

1. Fit the transit (Mandel–Agol model) with MCMC: R_p/R_★, impact parameter, limb darkening (constrain from stellar models, don't leave fully free), ephemeris.
2. Get stellar parameters right first — planet radius inherits stellar radius uncertainty directly (spectroscopy + Gaia parallax + isochrones).
3. RV follow-up: sample the orbit phase coverage fully; model stellar activity (GPs) jointly with the Keplerian — activity can fake or hide planets.

### 4. Interpret habitability honestly

1. Compute insolation and equilibrium temperature; the habitable zone is a necessary, not sufficient, condition.
2. Radius alone doesn't give composition — the mass–radius diagram needs a measured mass; "Earth-like" from radius only is marketing.
3. State what's actually measured (radius, minimum mass, insolation) vs inferred (composition, atmosphere, habitability).

### 5. Plan a follow-up campaign for a new candidate

1. Prioritize: ephemeris precision first (schedule transit observations before the window goes stale), then reconnaissance spectroscopy (is it a binary? what's the star?).
2. Order observations by cost: photometric vetting (cheap) → high-resolution imaging (moderate) → precision RV (expensive) — kill false positives early.
3. Set a decision point: define in advance what evidence promotes the candidate to "planet" vs demotes it — ad-hoc thresholds invite confirmation bias.

### 6. Quick-reference checklist

- [ ] Light curve detrended without erasing transit shapes
- [ ] BLS candidates inspected phase-folded by eye
- [ ] Odd/even depth consistency and secondary eclipse checked
- [ ] Centroid and aperture tests run (blend diagnostics)
- [ ] High-resolution imaging obtained for close companions
- [ ] Stellar parameters (radius!) nailed before planet parameters
- [ ] RV phase coverage complete; activity modeled jointly
- [ ] "Habitable" claims restricted to what's actually measured

## Common pitfalls

- **BLS without eyeballs:** algorithms return the strongest periodic dip, which is often systematics or a binary — inspect phase folds.
- **Ignoring dilution:** unresolved companions make transits shallower and planets smaller than reported — high-res imaging is part of the measurement.
- **Activity blindness:** stellar spots and pulsations mimic both transits and RV signals — check activity indicators (Ca H&K, Hα, bisectors).
- **Single-transit overclaiming:** one dip gives a period lower limit, not a period — don't publish orbits from single events.
- **Eccentricity from under-sampled RV:** sparse RV fits inflate eccentricity — require good phase coverage or report upper limits.
- **"Habitable" hype:** equilibrium temperature in the HZ ≠ habitable — atmosphere, water, magnetic field, and stellar activity are all unknown for most candidates.
- **Ephemeris decay:** transit windows go stale as period uncertainty accumulates — a candidate unobserved for two years may need re-detection, not just scheduling.
- **Stellar-radius errors propagating silently:** a 20% stellar-radius error is a 20% planet-radius error and a misclassified "Earth-like" — nail the star first, always.
