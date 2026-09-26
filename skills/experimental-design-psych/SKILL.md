---
name: experimental-design-psych
description: Designing psychology experiments — variables, controls, randomization, counterbalancing, and preregistration.
category: scientific
---

## Overview

experimental-design-psych covers how to design behavioral experiments that can actually answer the
question asked: defining constructs operationally, choosing between- vs within-subjects designs,
controlling confounds, counterbalancing order effects, and preregistering the plan before data
collection. Good design is cheaper than any statistical rescue — no analysis fixes a confounded
experiment.

## When to use

- Turning a research question into a testable design: IVs, DVs, operational definitions.
- Choosing between-subjects, within-subjects, or mixed designs.
- Counterbalancing: Latin squares, ABBA, randomization for order/fatigue/practice effects.
- Controls: placebo, active control, yoked control, sham conditions.
- Power analysis and sample-size planning for behavioral studies.
- Preregistration: hypotheses, exclusion criteria, analysis plan.
- Piloting: what to check before running the full sample.

## Core concepts

- **Operational definitions.** A construct ("attention," "anxiety") must become a measurable
  procedure (reaction time on incongruent Stroop trials; STAI score). Vague constructs produce
  uninterpretable results — define the measure before defending the claim.
- **Between vs within.** Between-subjects avoids carryover and demand effects but needs larger
  samples and risks group nonequivalence; within-subjects is powerful (each participant is their
  own control) but vulnerable to order, practice, fatigue, and asymmetric carryover (a treatment
  that permanently changes participants cannot be within-subjects).
- **Counterbalancing.** Full counterbalancing (all orders) for small designs; Latin squares when
  orders multiply; ABBA for simple two-condition orders. Random order per participant is often
  sufficient with enough trials — but verify balance afterward.
- **Controls that actually control.** A proper control differs from the experimental condition in
  exactly one thing. Active controls (alternative intervention) beat passive/waitlist controls,
  which confound treatment with attention, expectancy, and contact. Demand characteristics —
  participants guessing the hypothesis — are controlled by cover stories and manipulation checks,
  not by hoping.
- **Randomization.** Random assignment (not haphazard, not alternation) is what justifies causal
  claims in experiments. Randomize with a documented procedure (computer-generated sequence),
  and conceal allocation where feasible.
- **Blinding.** Participants blind to condition where possible; experimenters blind to hypotheses
  during data collection and to condition during coding/scoring. Unblinded experimenters leak
  expectations into behavior — the experimenter-expectancy effect is real and large.
- **Power.** Base sample size on the smallest effect size of interest, not on optimistic pilot
  estimates (pilots overestimate). Within-subjects designs need fewer participants; account for
  planned exclusions by oversampling 10-20%.
- **Preregistration.** Hypotheses, primary DV, exclusion rules, sample size, and analysis plan
  registered before data collection (OSF, AsPredicted). This separates confirmatory from
  exploratory work — the single highest-ROI practice in the field.

## Practical workflow

1. **Question → hypothesis → operational definitions.** Write the exact statistical test that
   would support each hypothesis. If you can't, the design isn't ready.
2. **Choose the design.** Within-subjects unless carryover forbids it; mixed when both
   between- and within-factors matter.
3. **Build controls.** List every alternative explanation; design each condition to rule out one.
   Include manipulation checks.
4. **Power analysis.** Smallest effect of interest, alpha 0.05, power 0.80; add exclusion buffer.
5. **Preregister.** Hypotheses, DVs, exclusions, stopping rule, full analysis plan.
6. **Pilot.** n=5-10: check timing, comprehension, ceiling/floor effects, equipment, and that the
   manipulation actually manipulates (manipulation check data).
7. **Run blind.** Experimenter scripts, automated stimulus delivery, blinded scoring. Log
   protocol deviations as they happen.
8. **Analyze as preregistered.** Report deviations transparently; label unplanned analyses
   exploratory.

## Common pitfalls

- Confounded conditions differing in more than the intended manipulation.
- Within-subjects designs with asymmetric carryover (e.g. learning that can't be unlearned).
- Underpowered studies built on inflated pilot effect sizes.
- No manipulation check — not knowing whether the IV actually varied.
- Experimenter unblinded, leaking expectations (especially in clinical/developmental work).
- Exclusion criteria invented after seeing the data.
- HARKing: presenting exploratory findings as a priori hypotheses.
