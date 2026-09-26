---
name: catalysis-basics
description: Heterogeneous and homogeneous catalysis — mechanisms, kinetics, catalyst characterization, and deactivation analysis.
category: scientific
---

## Overview

Catalysts accelerate reactions without being consumed, enabling most of the
chemical industry. This skill covers the essential framework: catalytic
cycles and mechanisms, rate laws and turnover metrics, the Sabatier
principle, standard characterization (chemisorption, TPR/TPD, operando
spectroscopy), and diagnosing deactivation (poisoning, sintering, coking,
leaching).

## When to use

- Screening catalysts: choosing metrics (conversion, selectivity, TOF) and fair test conditions
- Measuring kinetics: determining rate laws, activation energies, and reaction orders
- Characterizing a catalyst: dispersion, oxidation state, acidity, active sites
- Troubleshooting deactivation: distinguishing poisoning from sintering from coking
- Comparing homogeneous vs heterogeneous options for a transformation

## Core concepts

- **Catalytic cycle:** the sequence of elementary steps returning the catalyst to its initial state; the turnover frequency (TOF, s⁻¹) normalizes rate per active site — the only fair activity comparison.
- **Sabatier principle:** optimal catalysts bind intermediates neither too weakly (no activation) nor too strongly (surface poisoned) — the origin of volcano plots across metals and reactions.
- **Rate-determining step:** the highest-barrier step controls the rate; degree-of-rate-control analysis identifies it rigorously — intuition about "the slow step" is often wrong in networks.
- **Selectivity vs conversion:** more forcing conditions raise conversion but usually cost selectivity; report both, plus carbon/mass balance — missing mass means unidentified products.
- **Structure sensitivity:** some reactions need specific ensembles (facets, particle size); others are insensitive — this determines whether nanoparticle engineering matters.
- **Homogeneous vs heterogeneous:** molecular catalysts offer tunability and defined sites (ligand design, mechanistic study by NMR); heterogeneous offer separation and stability — the choice hinges on product value and process constraints.

- **Degree of rate control (DRC):** quantifies how much each elementary step (and intermediate) controls the overall rate — the rigorous replacement for "rate-determining step" intuition in complex networks.
- **Scaling relations:** adsorption energies of related intermediates scale linearly (e.g., *OH vs *OOH) — these relations create the volcano plot and fundamentally limit single-site catalysts, motivating bifunctional designs.
- **Catalyst–support interactions:** supports are not inert — strong metal–support interaction (SMSI), spillover, and acid–base sites on the support participate in the chemistry; changing the support changes the catalyst.

## Practical workflow

### 1. Test catalysts fairly

1. Fix the conditions that matter: temperature, pressure, feed composition, space velocity (WHSV/GHSV) — vary the catalyst, not the reactor.
2. Report conversion, selectivity, yield, and carbon balance at matched conversion levels (compare selectivity at the same conversion, not at arbitrary conditions).
3. Measure TOF using counted active sites (chemisorption, not total metal loading) — a 1% dispersed catalyst and a 50% dispersed one differ by 50× in site count.
4. Include a blank (no catalyst) and a reference catalyst in every campaign.

### 2. Measure kinetics properly

1. Work in the kinetic regime: verify absence of mass/heat transfer limits (vary particle size, flow rate, dilution — rate must not change).
2. Determine orders by varying one reactant partial pressure at a time; measure E_a from Arrhenius plots over a modest T range (avoid mechanism changes).
3. Check for deactivation during the measurement — a drifting rate corrupts every derived parameter; use initial rates or extrapolate to t=0.

### 3. Characterize the working catalyst

1. **Dispersion/particle size:** CO/H₂ chemisorption, TEM, XRD line broadening — cross-check at least two.
2. **Oxidation state and coordination:** XPS (surface), XAS (bulk-average, operando-capable), TPR (reducibility).
3. **Acidity:** NH₃-TPD and pyridine-IR (Brønsted vs Lewis) for acid-catalyzed reactions.
4. **Operando when it matters:** ex situ characterization of a spent catalyst may show a spectator, not the active site — measure under reaction conditions where feasible.

### 4. Diagnose deactivation

1. **Poisoning:** activity drops, selectivity often shifts; check feed impurities (S, Cl, CO); sometimes reversible by treatment.
2. **Sintering:** particle growth (TEM/XRD) — irreversible; driven by temperature and atmosphere.
3. **Coking:** carbon deposits (TGA/Raman); burn off regenerates activity unless sintering co-occurred.
4. **Leaching:** metal in the product stream (ICP) — fatal for homogeneous-immobilized and some oxide catalysts.
5. Distinguish by regeneration tests: activity recovery after oxidation ⇒ coking/poisoning; no recovery ⇒ sintering/leaching.

### 5. Benchmark against the literature fairly

1. Normalize literature rates to the same basis (per active site, per surface area, or per reactor volume) before comparing — published "record activities" often differ only in normalization.
2. Match conditions: temperature, pressure, feed composition, and conversion level — selectivity compared at different conversions is meaningless.
3. Reproduce one literature benchmark in your own setup before claiming improvements — it validates your reactor, analytics, and methods simultaneously.

### 6. Quick-reference checklist

- [ ] Active sites counted (chemisorption), not assumed from metal loading
- [ ] Mass/heat transfer limitations tested (particle size, flow variation)
- [ ] Selectivity compared at matched conversion levels
- [ ] Carbon/mass balance closed (missing mass = unidentified products)
- [ ] Blank and reference catalyst included in every campaign
- [ ] Deactivation monitored during kinetic measurements
- [ ] Spent catalyst characterized (sintering vs coking vs poisoning vs leaching)
- [ ] Literature benchmarks reproduced in your setup before claiming improvements

## Common pitfalls

- **Normalizing by mass instead of sites:** grams of catalyst is not a kinetic quantity — TOF per active site is.
- **Ignoring transport limitations:** a "structure-insensitive" conclusion from a diffusion-limited test is an artifact; always test for it.
- **Single-point comparisons:** one temperature, one conversion — selectivity–conversion curves tell the real story.
- **Ex situ overinterpretation:** the catalyst you characterize after cooling and air exposure is not the catalyst that was working.
- **Missing mass balance:** 100% conversion with 60% identified products means 40% unknown — find it before publishing.
- **Accelerated aging fallacy:** deactivation mechanisms change with temperature; high-T aging tests can misrank catalysts for low-T service.
- **Hotspot blindness:** exothermic reactions create temperature gradients in the bed — the measured "isothermal" rate at the thermocouple temperature misrepresents the hot zone; dilute the bed and check.
- **Attributing homogeneous catalysis to a solid:** leached metal can catalyze the reaction while the solid takes the credit — hot-filtration tests and ICP of the filtrate are mandatory for "heterogeneous" claims with soluble metals.
