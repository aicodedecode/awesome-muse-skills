---
name: astrometry-basics
description: Precision position measurement — proper motions, parallaxes, reference frames, and working with Gaia data.
category: scientific
---

## Overview

Astrometry measures where things are and how they move: positions,
proper motions, and parallaxes. The Gaia mission revolutionized the
field with microarcsecond precision for billions of stars. This skill
covers the astrometric observables, reference frames (ICRS), working
with Gaia catalog data correctly, and deriving distances and kinematics.

## When to use

- Querying Gaia for parallaxes, proper motions, and photometry of a sample
- Converting parallax to distance (correctly — it's not 1/π for noisy data)
- Computing space velocities (U, V, W) and Galactic orbits
- Cross-matching catalogs with proper-motion propagation to a common epoch
- Assessing astrometric quality: RUWE, excess noise, and binary contamination

## Core concepts

- **The five parameters:** position (α, δ), proper motion (μ_α, μ_δ), parallax (ϖ) — plus radial velocity for full 6D phase space. Gaia solves these jointly from years of scanning.
- **Parallax → distance:** d = 1/ϖ only for high-S/N parallaxes; for noisy or negative parallaxes use Bayesian inference with a sensible prior (Bailer-Jones) — naive inversion is biased (Lutz–Kelker).
- **ICRS:** the International Celestial Reference System, realized by distant quasars (effectively inertial) — Gaia's frame; always state the reference frame and epoch (J2016.0 for Gaia DR3).
- **Proper motion:** angular motion across the sky (mas/yr); transverse velocity v_t = 4.74·μ·d (km/s, with μ in mas/yr, d in pc) — needs the distance, inheriting its uncertainty.
- **Quality flags:** RUWE (renormalized unit weight error) — RUWE > 1.4 suggests the single-star model failed (often unresolved binarity); astrometric_excess_noise, and parallax_over_error for S/N.
- **Epoch propagation:** positions at other epochs need proper-motion correction: α(t) = α₀ + μ_α(t − t₀) — cross-matching catalogs from different epochs without this misses high-proper-motion stars.

- **Astrometric binaries:** wobble in the proper motion or parallax solution reveals unseen companions — Gaia's non-single-star catalog turns "bad RUWE" into binary orbits for hundreds of thousands of systems.
- **Secular aberration:** the solar system's acceleration toward the Galactic center induces a tiny proper-motion pattern in quasars (~5 µas/yr) — detected by Gaia, a new fundamental-astronomy observable.
- **Gravitational-wave astrometry:** passing gravitational waves deflect starlight coherently — future microarcsecond astrometry could detect nanohertz gravitational waves independently of pulsar timing.

## Practical workflow

### 1. Query Gaia well

```sql
-- Gaia DR3 via TAP/ADQL: quality-cut sample with distances
SELECT source_id, ra, dec, parallax, parallax_error,
       pmra, pmdec, ruwe, phot_g_mean_mag
FROM gaiadr3.gaia_source
WHERE parallax_over_error > 5
  AND ruwe < 1.4
  AND 1 = CONTAINS(POINT('ICRS', ra, dec),
                   CIRCLE('ICRS', 83.8, -5.4, 1.0))
```

1. Always apply quality cuts (parallax_over_error, RUWE) appropriate to the science — raw catalog queries include garbage.
2. Use the documented parallax zero-point correction (Lindegren et al.) — it varies with magnitude, color, and sky position.
3. Retrieve the full covariance information when propagating uncertainties into derived quantities.

### 2. Distances done right

1. For parallax_over_error > 5–10, 1/ϖ with propagated asymmetric errors is acceptable; otherwise use Bayesian distances (Bailer-Jones catalog or your own inference with a Galactic prior).
2. Never silently drop negative parallaxes — they're informative about the noise; handle them in the Bayesian framework.
3. Propagate distance uncertainty into every derived quantity (luminosity, transverse velocity, orbital energy) — Monte Carlo sampling through the transformations.

### 3. Kinematics

1. Combine proper motions + distance + radial velocity → (U, V, W) in the Galactic frame; correct for the solar motion (state which solar values you used).
2. Integrate orbits in a Galactic potential (galpy) for actions, eccentricity, z_max — classify thin/thick disk, halo membership probabilistically.
3. For clusters/associations: convergent-point or 6D clustering (HDBSCAN on phase space) beats sky-position clustering.

### 4. Cross-matching

1. Propagate all catalogs to a common epoch before matching — high-proper-motion stars move arcseconds between surveys.
2. Use probabilistic cross-matching (accounting for positional uncertainties and epoch differences), not fixed-radius cone searches, in crowded fields.
3. Verify matches with photometry/colors — astrometric coincidence plus consistent SED is convincing.

### 5. Find co-moving groups and clusters

1. Work in 5D/6D phase space (positions, proper motions, parallax, RV where available) — projection effects create false groups in sky position alone.
2. Use density-based clustering (HDBSCAN) on scaled phase-space coordinates; validate candidates with color–magnitude diagrams (members share an isochrone).
3. Estimate contamination: field-star interlopers share kinematics by chance — quantify with background-density models, especially for sparse groups.

## Common pitfalls

- **Naive 1/π:** inverting noisy parallaxes biases distances high — the Lutz–Kelker bias is real and must be handled, not ignored.
- **Ignoring the zero-point:** Gaia parallaxes carry a systematic offset (tens of microarcseconds) — significant for distant samples.
- **RUWE blindness:** treating RUWE > 1.4 sources as clean single stars — many are binaries with corrupted parallaxes and proper motions.
- **Epoch mismatch:** cross-matching J2000 catalogs with Gaia J2016 positions without proper-motion correction loses fast movers.
- **Covariance neglect:** RA/Dec/parallax/proper-motion errors are correlated — propagate the full covariance matrix for precise work.
- **Overinterpreting single-epoch positions:** one position is not a proper motion — and a proper motion is not an orbit without radial velocity.
- **Parallax inversion for distant samples:** beyond ~2–3 kpc, Gaia parallaxes need full Bayesian treatment with Galactic priors — naive distances bias kinematic studies.
- **Correlated astrometric errors in clusters:** members share scanning-law systematics — mean cluster parallaxes need the spatial covariance accounted for, or uncertainties are understated.
