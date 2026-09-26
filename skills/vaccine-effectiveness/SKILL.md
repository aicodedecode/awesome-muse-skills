---
name: vaccine-effectiveness
description: Estimating vaccine effectiveness from observational data — test-negative designs, cohorts, and bias control.
category: scientific
---

## Overview

vaccine-effectiveness covers how to estimate how well vaccines work in the real world (as opposed
to efficacy in trials): the test-negative design, cohort and case-control approaches, and the
biases — confounding by health-seeking behavior, time-varying confounding, depletion of
susceptibles — that make naive estimates misleading.

VE = 1 − (risk in vaccinated / risk in unvaccinated), usually as 1 − odds ratio or 1 − hazard
ratio. Simple formula, treacherous estimation.

## When to use

- Test-negative design studies (the workhorse for influenza, COVID VE).
- Cohort VE studies from EHR/registry data.
- VE by time since vaccination (waning) and by variant.
- Effectiveness against severe outcomes vs infection.
- Bias assessment: health-seeking behavior, prior infection, misclassification.
- Communicating VE with appropriate uncertainty.

## Core concepts

- **Test-negative design (TND).** Cases: test-positive patients with the syndrome; controls:
  test-negative patients with the same syndrome, same setting, same time. VE = 1 − OR
  (vaccinated vs unvaccinated). The design controls for health-seeking behavior and test access
  because both groups sought care and got tested. Assumptions: vaccination doesn't affect the
  risk of non-target illness (test-negatives), and test sensitivity is high.
- **Why TND works.** The classic confounder in VE studies is that vaccinated people differ from
  unvaccinated people (healthier, more health-seeking, different exposures). By conditioning on
  care-seeking with similar symptoms, TND removes the biggest bias source. It's not perfect —
  residual confounding remains — but it's the best cheap design available.
- **Cohort designs.** Follow vaccinated and unvaccinated over time; VE = 1 − HR/RR. Needs
  careful confounding control (propensity scores, matching) and correct handling of
  time-varying vaccination status (person-time classified by current status; immortal-time bias
  if misclassified).
- **Outcome specificity matters.** VE against infection < VE against symptomatic disease < VE
  against hospitalization < VE against death — typically. Always specify the outcome; "VE is
  60%" is meaningless without it. Severe-outcome VE is more robust to testing biases.
- **Waning and variants.** VE changes with time since dose and with pathogen evolution.
  Stratify by both; model waning continuously (splines on time since vaccination) rather than in
  crude bins. Compare like-with-like calendar periods — variant circulation confounds naive
  waning analyses.
- **Depletion of susceptibles.** Unvaccinated people get infected and gain immunity, making the
  unvaccinated group progressively more immune over time — biasing VE downward in long studies.
  Adjust for prior infection or restrict to infection-naive cohorts where feasible.
- **Misclassification.** Vaccination status from registries (incomplete), infection history
  (untested infections), outcome ascertainment (incidental positives — "with" vs "for" the
  disease, especially for hospitalization). Each biases VE; quantify with sensitivity analyses.
- **Communicating VE.** Report absolute risk differences alongside relative VE; stratify by
  age and risk group (VE differs); present waning curves rather than single numbers; never
  present crude VE without the design and its assumptions.

## Practical workflow

1. **Define.** Vaccine, schedule, outcome (with severity hierarchy), population, time period.
2. **Choose design.** TND for symptomatic/tested outcomes; cohort for severe outcomes with good
   registries; case-control when neither fits.
3. **Control confounding.** TND: match/adjust for calendar time, age, site, comorbidities.
   Cohort: propensity scores + time-varying exposure; new-user designs.
4. **Stratify.** Time since vaccination, variant period, age group, prior infection status.
5. **Bias checks.** Negative-control outcomes (VE against non-target illness should be ~0);
   sensitivity analyses for misclassification and depletion of susceptibles.
6. **Report.** VE with 95% CIs by stratum, absolute risks, design assumptions, and limitations.
   Follow STROBE; preregister the analysis plan.

## Common pitfalls

- Crude VE without confounding control (health-seeking bias dominates).
- Immortal-time bias from misclassified vaccination person-time.
- Waning confounded with variant changes (calendar time not handled).
- Depletion of susceptibles biasing long-term VE downward.
- "With" vs "for" outcome misclassification (incidental positives).
- Single VE number hiding outcome-specific and time-varying reality.
- Comparing VE across studies with different designs, outcomes, and populations.
- Prior-infection status unmeasured, confounding VE in highly exposed populations.
- Healthy-vaccinee bias in observational cohorts without active comparators.
