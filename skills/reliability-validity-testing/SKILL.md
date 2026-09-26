---
name: reliability-validity-testing
description: Evaluating measurement quality — test-retest, inter-rater agreement, and construct validity evidence.
category: scientific
---

## Overview

reliability-validity-testing is the applied companion to psychometrics: the concrete procedures for
demonstrating that a measure is consistent (reliability) and measures what it claims (validity).
It covers designing reliability studies, choosing agreement coefficients, gathering validity
evidence, and interpreting the numbers — including what to do when they're disappointing.

Use this when you need to evaluate or defend a measurement instrument; use psychometrics for
building scales and latent-variable modeling.

## When to use

- Planning a test-retest reliability study: interval, sample size, ICC model choice.
- Inter-rater agreement: training raters, choosing kappa vs ICC vs percent agreement.
- Internal consistency: when alpha/omega are appropriate and how to report them.
- Construct validity: convergent/discriminant correlation patterns, known-groups comparisons.
- Criterion validity: validating against a gold standard (sensitivity/specificity framing).
- Evaluating a published instrument's evidence before adopting it.
- Responding to reviewer requests for "reliability and validity" of your measures.

## Core concepts

- **Reliability is consistency, in specific forms.** Internal consistency (items hang together),
  test-retest (stable over time), inter-rater (consistent across judges), parallel forms. A
  measure can have one without the others — report the form relevant to your use. High internal
  consistency does not imply stability over time.
- **ICC, not Pearson, for agreement.** Test-retest and inter-rater reliability need intraclass
  correlation: ICC(2,1) or ICC(3,1) depending on whether raters are random or fixed, absolute
  agreement vs consistency. Pearson correlation ignores systematic bias (rater A always 2 points
  higher still gives r=1.0). Report the ICC model — "ICC = 0.85" without the model is incomplete.
- **Kappa for categorical judgments.** Cohen's kappa for two raters, Fleiss' for more; weighted
  kappa for ordinal categories. Interpret against prevalence — kappa paradoxes occur with very
  high or low base rates, so report raw agreement too.
- **Test-retest interval.** Long enough that memory doesn't inflate agreement, short enough that
  the construct hasn't truly changed. State the rationale; for state-like constructs, expect
  lower values and say so upfront.
- **Validity evidence types.** Content (expert/domain coverage), response processes (cognitive
  interviews — do respondents interpret items as intended?), internal structure (factor analysis,
  invariance), relations to other variables (convergent/discriminant, criterion), and
  consequences (does use of the scores lead to intended outcomes?). Modern standards treat these
  as five sources of evidence for one unified validity argument.
- **Multitrait-multimethod logic.** The classic discriminant-validity design: your measure should
  correlate more strongly with other measures of the same construct (even via different methods)
  than with measures of different constructs via the same method. Same-method correlations are
  inflated by shared method variance — discount them.
- **Attenuation.** Observed correlations are attenuated by unreliability in both measures:
  r_true = r_obs / sqrt(r_xx × r_yy). A "weak" r=0.30 with reliabilities of 0.70 is actually
  ~0.43. Disattenuate when comparing effect sizes across measures with different reliabilities.
- **Standard error of measurement.** SEM = SD × sqrt(1 − reliability). It puts confidence bands
  around individual scores — essential for clinical cutoffs. A screening cutoff is meaningless
  without the SEM around it.

## Practical workflow

1. **Match evidence to use.** Screening decision → criterion validity + SEM at the cutoff;
   research DV → internal consistency + test-retest; observational coding → inter-rater agreement.
2. **Design the study.** Sample size for precise reliability estimates (n≥50 for ICC with narrow
   CIs; more for kappa with rare categories). Train raters with a manual and practice coding.
3. **Collect.** Independent ratings (raters blind to each other and to hypotheses); test-retest
   with the planned interval; no feedback between ratings.
4. **Analyze.** ICC with the correct model + 95% CI; kappa with raw agreement; alpha/omega for
   internal consistency; correlation matrix for convergent/discriminant patterns.
5. **Interpret against standards.** ICC/kappa ≥0.75 good, 0.60-0.74 moderate (context-dependent);
   validity correlations judged against theory, not fixed cutoffs. Report CIs — a point estimate
   of 0.80 with CI [0.55, 0.92] is not "good reliability."
6. **Document.** Full evidence table in the manual/paper: coefficient, model, sample, interval,
   CI. State limits on generalizability (population, context).

## Common pitfalls

- Pearson r reported as "inter-rater reliability" (misses systematic bias).
- Wrong ICC model, or no model specified.
- Kappa interpreted without base rates (paradoxes with rare categories).
- Test-retest interval so short it measures memory, or so long it measures real change.
- Claiming validity from a single correlation ("validated" is not a one-study achievement).
- High alpha from redundant items mistaken for good measurement (bloated specifics).
- Using a measure in a new population without re-establishing reliability there.
