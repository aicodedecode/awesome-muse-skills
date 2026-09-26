---
name: therapeutic-drug-monitoring
description: Therapeutic drug monitoring — when to measure levels, sampling timing, and dose adjustment.
category: scientific
---

## Overview

therapeutic-drug-monitoring (TDM) covers the clinical use of drug concentration measurements to
guide dosing: which drugs justify monitoring, when to draw levels (troughs, peaks, AUC), how to
interpret results in context, and how to adjust doses. TDM is worthwhile only when the drug has
a narrow therapeutic window, large PK variability, and a measurable concentration-effect
relationship — most drugs fail at least one criterion.

## When to use

- Deciding whether TDM is indicated for a drug/patient.
- Sampling strategy: trough vs peak vs AUC-guided (vancomycin, aminoglycosides).
- Interpreting levels: timing relative to dose, steady state, assay issues.
- Dose adjustment: proportional, Bayesian forecasting.
- Special situations: renal dysfunction, dialysis, pregnancy, pediatrics, toxicity workup.
- Setting up a TDM service: protocols, interpretation support.

## Core concepts

- **When TDM is justified.** Narrow therapeutic index + large inter-individual PK variability +
  defined concentration-response + available assay. Classic drugs: vancomycin, aminoglycosides,
  digoxin, lithium, phenytoin, carbamazepine, valproate, immunosuppressants (tacrolimus,
  cyclosporine), theophylline. Don't monitor drugs without these properties — the level won't
  change management.
- **Steady state.** ~4-5 half-lives to steady state. Levels drawn before steady state (after
  dose changes) mislead unless interpreted with the kinetics in mind. Loading doses complicate
  early interpretation — document dose history.
- **Timing is the result.** A "trough" drawn 4 hours early is not a trough. Vancomycin troughs:
  within 30 min before the 4th dose (traditional) — though AUC-guided dosing via Bayesian
  software is now preferred (target AUC/MIC 400-600). Aminoglycoside peaks: 30 min after
  infusion end; troughs before next dose. Digoxin: ≥6-8 hours post-dose (distribution phase
  confounds earlier samples). Record exact draw and dose times — interpretation without them is
  guesswork.
- **AUC-guided vancomycin.** Two levels (or one + Bayesian prior) fed to Bayesian software
  estimates individual AUC; superior nephrotoxicity profile vs trough-only targeting. This is
  the current standard — trough-only monitoring is legacy practice.
- **Free vs total.** Phenytoin (and valproate) are highly protein-bound; hypoalbuminemia and
  uremia raise free fraction — total levels look "therapeutic" while free (active) levels are
  toxic. Correct (Sheiner-Tozer, with its limits) or measure free levels directly in
  hypoalbuminemia, pregnancy, and critical illness.
- **Dose adjustment.** Linear PK: new dose = old dose × (target/measured) at steady state.
  Nonlinear (phenytoin — saturable metabolism): small dose changes cause large level swings;
  use Michaelis-Menten-based adjustments or Bayesian forecasting, never proportional math.
- **Bayesian forecasting.** Combine population PK priors with the patient's measured levels to
  estimate individual parameters and optimize dosing (software: DoseMeRx, InsightRx, MwPharm).
  Especially valuable with sparse or mistimed samples — the model handles what rules of thumb
  can't.
- **Toxicity workup.** Levels in suspected toxicity must be drawn promptly and interpreted
  against time-since-dose; a "normal" level drawn 24 hours after the last dose doesn't exclude
  toxicity at peak. Correlate with clinical picture — treat the patient, not the number.

## Practical workflow

1. **Indication.** Confirm the drug justifies TDM and the clinical question needs a level
   (toxicity? non-response? compliance? renal change?).
2. **History.** Full dose history, exact timing of last doses, renal/hepatic status, interacting
   drugs, albumin/pregnancy/critical illness for protein-bound drugs.
3. **Sample correctly.** Right level type (trough/peak/AUC pair) at the right time; steady
   state (or note if not); exact times recorded.
4. **Interpret in context.** Compare to target range for the indication (ranges differ by use);
   consider free fraction, timing errors, assay limitations.
5. **Adjust.** Proportional for linear PK; Bayesian/model-based for nonlinear or complex cases;
   document the new regimen and re-check timing.
6. **Follow up.** Re-measure after changes at steady state; monitor clinical response alongside
   levels.

## Common pitfalls

- Levels drawn at the wrong time (non-trough "troughs," pre-distribution digoxin).
- Interpreting pre-steady-state levels as maintenance-dose guides.
- Total phenytoin in hypoalbuminemia masking toxic free levels.
- Proportional dose adjustment for phenytoin (nonlinear — dangerous).
- Trough-only vancomycin monitoring (use AUC-guided).
- Treating the number instead of the patient (toxicity with "therapeutic" levels happens).
- Missing dose/timing documentation making levels uninterpretable.
