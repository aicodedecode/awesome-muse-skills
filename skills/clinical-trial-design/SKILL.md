---
name: clinical-trial-design
description: Designing clinical trials — phases, randomization, endpoints, sample size, and CONSORT-compliant reporting.
category: scientific
---

## Overview

clinical-trial-design covers the architecture of interventional clinical studies: choosing the
phase and design (parallel, crossover, factorial, adaptive), defining endpoints, randomizing and
blinding, sizing the sample, and planning analyses that regulators and journals accept. A trial's
credibility is fixed at the design stage — no analysis rescues a trial that measured the wrong
thing in the wrong population.

## When to use

- Choosing trial phase and design for a new intervention.
- Defining primary/secondary endpoints and estimands.
- Randomization schemes: simple, blocked, stratified, minimization.
- Blinding: who, how, and when it's impossible (surgical/behavioral trials).
- Sample-size calculation and interim analyses with alpha spending.
- Adaptive designs: group sequential, sample-size re-estimation, platform trials.
- Writing protocols and CONSORT-compliant reports.

## Core concepts

- **Phases.** Phase I: safety/tolerability (often healthy volunteers, dose escalation). Phase II:
  preliminary efficacy + dose finding. Phase III: confirmatory efficacy vs standard of care
  (large, randomized, the basis for approval). Phase IV: post-marketing surveillance. Skipping
  phases is occasionally justified, never casual.
- **Estimands (ICH E9 R1).** Define precisely what treatment effect you estimate: population,
  treatment conditions, endpoint, handling of intercurrent events (discontinuation, rescue
  medication), summary measure. "Intention-to-treat" is an estimand choice, not a default virtue —
  state it.
- **Endpoints.** Primary: one (or a co-primary pair), clinically meaningful, measured reliably.
  Surrogate endpoints (biomarkers) are acceptable only when validated — lowering a lab value is
  not the same as helping patients. Patient-reported outcomes belong in most modern trials.
- **Randomization.** Blocked randomization keeps arms balanced over time; stratification balances
  key prognostic factors (site, disease severity); minimization for many strata. Use a central,
  concealed system — envelope randomization is a known failure point.
- **Blinding.** Double-blind where possible; when impossible (surgery, psychotherapy), blind the
  outcome assessors and statisticians at minimum, and use objective endpoints. Assess blinding
  success — failed blinding with subjective endpoints is a major bias source.
- **Sample size.** Powered on the primary endpoint's minimum clinically important difference,
  with realistic variance and dropout inflation (10-20%). Underpowered trials are unethical —
  they expose patients to risk for uninterpretable results.
- **Interim analyses.** Group-sequential designs with alpha-spending functions (O'Brien-Fleming,
  Pocock) allow early stopping for efficacy or futility. Unplanned peeking at the data inflates
  Type I error — all interim looks must be prespecified with a data monitoring committee.
- **Design variants.** Crossover (each patient gets both treatments — efficient, but only for
  stable chronic conditions without carryover); factorial (two interventions at once, tests
  interaction); non-inferiority (margin must be clinically justified, not statistically
  convenient); platform/adaptive trials (shared infrastructure, dropping arms — efficient but
  operationally demanding).

## Practical workflow

1. **PICO.** Population, Intervention, Comparator, Outcome — one sentence that the whole trial
   hangs on. If the comparator isn't the real clinical alternative, the trial answers the wrong
   question.
2. **Estimand and endpoints.** Primary endpoint, intercurrent-event strategy, analysis
   population. Register on ClinicalTrials.gov before enrollment.
3. **Design choice.** Parallel-group default; crossover/factorial/adaptive only with justification.
4. **Size it.** Power 80-90% on the MCID; inflate for dropout; document assumptions.
5. **Randomize and blind.** Central system, stratified blocks; blinding plan with fallback for
   unblindable interventions.
6. **Monitor.** Independent DMC, prespecified interim analyses, safety stopping rules.
7. **Analyze as planned.** ITT primary; per-protocol as sensitivity; handle missing data with
   prespecified methods (not last-observation-carried-forward).
8. **Report CONSORT.** Flow diagram, baseline table, primary result with effect size + CI,
   harms by arm. Publish regardless of outcome — publication bias kills evidence synthesis.

## Common pitfalls

- Surrogate primary endpoints without validation (the drug works on the biomarker, not the patient).
- Underpowered trials ("exploratory" as an excuse for n=30 confirmatory claims).
- Unplanned interim looks inflating false positives.
- Per-protocol presented as primary (breaks randomization).
- Non-inferiority margins chosen to guarantee success.
- Comparator that's a straw man (placebo where an active standard exists).
- Selective outcome reporting — publishing a different primary endpoint than registered.
