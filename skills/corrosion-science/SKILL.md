---
name: corrosion-science
description: Corrosion mechanisms, electrochemical testing, and mitigation — from Pourbaix diagrams to coatings and cathodic protection.
category: scientific
---

## Overview

Corrosion is electrochemistry with economic consequences: metal returning to
its oxide. This skill covers the thermodynamics (Pourbaix diagrams) and
kinetics (polarization, Evans diagrams) of corrosion, the major damage modes
(uniform, pitting, crevice, galvanic, SCC), standard test methods, and the
mitigation toolbox: alloying, coatings, inhibitors, and cathodic protection.

## When to use

- Selecting materials for a corrosive environment (seawater, acidic process streams, concrete)
- Diagnosing a corrosion failure: identifying the mechanism from morphology and conditions
- Running electrochemical tests: OCP, potentiodynamic polarization, EIS
- Designing protection: coatings specs, cathodic protection criteria, inhibitor selection
- Estimating service life and inspection intervals for structures and equipment

## Core concepts

- **Thermodynamics vs kinetics:** Pourbaix (E–pH) diagrams show where corrosion is thermodynamically possible; passivity and measured rates come from kinetics — a "corroding" region on the diagram may still show negligible attack if passive.
- **Mixed potential theory:** the corrosion potential is where anodic (metal dissolution) and cathodic (oxygen/hydrogen reduction) currents balance; Tafel extrapolation of polarization curves gives i_corr, the corrosion current density.
- **Passivity:** Cr, Al, Ti form nanometer oxide films that drop corrosion rates by orders of magnitude — until chloride or damage breaks them locally (pitting).
- **Galvanic series:** coupling dissimilar metals drives the more active one to corrode faster; area ratio matters — a small anode with a large cathode fails fast.
- **Localized modes:** pitting (chloride + passive alloys), crevice (oxygen depletion under deposits/gaskets), intergranular (sensitized grain boundaries), SCC (tensile stress + specific environment + susceptible alloy — all three required).
- **Faraday's law:** mass loss = (i_corr · t · M)/(n · F) — converts electrochemical rates to penetration rates (mm/year) for life estimates.

- **Evans diagrams:** plotting anodic and cathodic polarization curves together shows the corrosion potential and current graphically — the visual foundation of mixed-potential theory.
- **Critical pitting temperature (CPT):** the temperature above which stable pits initiate for an alloy–environment pair — a practical ranking tool for stainless steels in chloride service.
- **Hydrogen embrittlement:** cathodic reactions produce atomic hydrogen that enters the metal lattice, embrittling high-strength steels — overprotection in cathodic protection systems causes the failure it was meant to prevent.

## Practical workflow

### 1. Diagnose the failure

1. Document morphology: uniform thinning, pits (undercut? clustered?), cracks (branched? intergranular?), attack at joints/crevices.
2. Record the environment: chemistry, pH, temperature, flow, deposits, wet–dry cycling — SCC and pitting need specific combinations.
3. Identify the alloy and its condition (sensitized? cold-worked? welded?) — heat-affected zones corrode preferentially.
4. Match morphology + environment + alloy to a mechanism before proposing fixes; treating pitting as uniform corrosion wastes money.

### 2. Electrochemical testing

1. **OCP monitoring:** let the potential stabilize (minutes to hours); drifting OCP means the surface is still evolving — don't polarize yet.
2. **Potentiodynamic polarization:** scan slowly (≤0.5 mV/s) from cathodic to anodic; extract E_corr and i_corr by Tafel extrapolation on well-defined linear regions.
3. **EIS:** charge-transfer resistance R_ct tracks the corrosion rate non-destructively over time; fit with a justified equivalent circuit.
4. **Pitting tests:** cyclic polarization — the repassivation potential (E_rp) below which pits can't grow is the practical design criterion, not the breakdown potential.

### 3. Choose mitigation

1. **Material upgrade:** match the alloy to the environment (PREN = Cr + 3.3·Mo + 16·N for stainless pitting resistance) — cheapest at the design stage.
2. **Coatings:** barrier (epoxy), sacrificial (zinc-rich), or inhibitive; performance is 90% surface preparation (abrasive blast to near-white metal, profile, cleanliness).
3. **Cathodic protection:** sacrificial anodes or impressed current; verify with potential criteria (−850 mV vs Cu/CuSO₄ for steel in soil) — under-protection corrodes, over-protection damages coatings.
4. **Inhibitors:** for closed systems (cooling water, acid pickling); confirm compatibility and dosage — under-dosing can accelerate localized attack.

### 4. Life estimation

1. Convert measured i_corr to mm/year via Faraday's law; apply a safety factor for localized modes (pitting rates exceed uniform rates by 10–100×).
2. Use corrosion coupons or ER probes for direct field rates when electrochemistry is impractical.
3. Set inspection intervals at a fraction of the predicted life — never at the full value.

### 5. Design a corrosion-monitoring program

1. Select monitoring to match the mechanism: coupons/ER probes for uniform rates, electrochemical noise or EIS for localized attack, hydrogen probes where embrittlement threatens.
2. Place monitoring at the worst-case locations (low points, dead legs, heat-affected zones) — not where access is convenient.
3. Trend the data against action thresholds defined before the program starts — monitoring without predetermined responses is just expensive data collection.

### 6. Quick-reference checklist

- [ ] Failure morphology documented before cleaning (pits, cracks, location)
- [ ] Environment fully characterized (chemistry, pH, T, flow, deposits)
- [ ] Alloy condition noted (sensitized, welded, cold-worked)
- [ ] OCP stabilized before any polarization measurement
- [ ] Polarization scans run slowly (≤0.5 mV/s) with Tafel regions verified
- [ ] Rates converted via Faraday's law with localized-attack safety factors
- [ ] Galvanic couples and area ratios checked in every assembly
- [ ] Mitigation matched to mechanism (not uniform-corrosion fixes for pitting)

## Common pitfalls

- **Pourbaix-only reasoning:** "immune" on the diagram but corroding in practice (complexing agents, non-equilibrium) — diagrams assume pure water chemistry.
- **Fast polarization scans:** capacitive currents inflate i_corr; scan slowly and verify with weight-loss or EIS.
- **Galvanic blindness:** stainless fasteners in a carbon-steel structure (or vice versa) — always check the couple and the area ratio.
- **Coating as magic:** painting over rust, mill scale, or salts guarantees premature failure — preparation is the coating system.
- **SCC misdiagnosis:** calling a fatigue or overload crack "stress corrosion" — SCC needs the specific environment; check for branching and confirm the chemistry.
- **Ignoring microbes:** MIC (microbiologically influenced corrosion) produces pitting under biofilms that standard chemistry doesn't predict — test for it in stagnant water systems.
- **Stray-current blindness:** DC transit systems and welding operations drive corrosion far from the source — when corrosion appears where chemistry says it shouldn't, look for stray currents.
- **Inhibitor under-dosing:** too little inhibitor can accelerate localized attack relative to no inhibitor — verify dosage by monitoring, never assume.
