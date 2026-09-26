---
name: psychometrics
description: Psychological measurement — scale construction, factor analysis, IRT, and evaluating reliability and validity.
category: scientific
---

## Overview

psychometrics is the science of measuring psychological constructs: building questionnaires and
tests, and proving they measure what they claim. It covers classical test theory, factor analysis
(exploratory and confirmatory), item response theory, and the reliability/validity evidence that
separates a real instrument from a pile of Likert items.

Anyone using a scale — for research, clinical screening, or hiring — needs the psychometric
evidence behind it. A scale without published reliability and validity is an opinion with numbers.

## When to use

- Evaluating whether an existing scale is fit for your purpose and population.
- Developing a new scale: item writing, piloting, item analysis.
- Factor analysis: EFA for structure discovery, CFA for testing hypothesized structure.
- Item response theory: item difficulty/discrimination, test information, computerized adaptive
  testing.
- Reliability: Cronbach's alpha, omega, test-retest, inter-rater agreement.
- Validity: content, criterion, convergent/discriminant, and the modern unified view.
- Measurement invariance: does the scale mean the same thing across groups?

## Core concepts

- **Classical test theory.** Observed score = true score + error. Reliability is the proportion
  of observed variance that is true-score variance. Everything — attenuation of correlations,
  standard error of measurement — flows from this decomposition.
- **Reliability coefficients.** Cronbach's alpha (assumes tau-equivalence; often violated —
  report McDonald's omega instead, which doesn't). Test-retest for stability over time
  (appropriate interval depends on construct stability). Inter-rater: ICC for continuous ratings,
  kappa for categorical judgments. Report CIs for reliability, not point estimates.
- **Validity is not a property of the test.** It's the degree to which evidence supports the
  *interpretation* of scores for a *purpose*. Content (expert review, coverage of the domain),
  criterion (correlation with a gold standard), convergent/discriminant (MTMM logic: correlate
  with similar constructs, not with dissimilar ones).
- **EFA.** Discovers latent structure: extract factors (parallel analysis for the number — not
  the Kaiser >1 rule, which overextracts), rotate (oblique, since psychological factors
  correlate), interpret loadings >0.40 as salient. EFA is exploratory — don't "confirm" with it.
- **CFA/SEM.** Tests a hypothesized structure: fit indices (CFI/TLI ≥0.95, RMSEA ≤0.06, SRMR
  ≤0.08 as rough guides, not commandments), modification indices used sparingly and
  substantively. A CFA on the same sample as the EFA proves nothing — split samples or collect
  new data.
- **IRT.** Models the probability of each response as a function of latent trait level: item
  difficulty, discrimination, and guessing parameters. Gives test information functions (where
  along the trait the test measures precisely) and enables adaptive testing and equating across
  forms. Needs large samples (n≥500 for 2PL/3PL).
- **Measurement invariance.** Configural → metric → scalar invariance across groups (gender,
  culture, time). Without scalar invariance, mean comparisons across groups are uninterpretable —
  the scale may simply function differently. Test it before any group comparison.
- **Item writing.** One idea per item, simple language, no double negatives, balanced keying
  (watch for acquiescence bias), 5-7 response options for Likert scales, more items initially
  than the final scale needs (write 2-3x, prune by item analysis).

## Practical workflow

1. **Define the construct and purpose.** What decision will scores inform? This determines the
   validity evidence needed.
2. **Write items.** 2-3x the target length; expert review for content coverage; cognitive
   interviews with target respondents.
3. **Pilot.** n≥200 for EFA; item analysis (item-total correlations, difficulty, discrimination);
   drop poor items.
4. **EFA.** Parallel analysis → extraction → oblique rotation → interpretable structure.
5. **CFA on new data.** Test the EFA-derived model; check fit; test measurement invariance for
   key groups.
6. **Reliability.** Omega (and alpha), test-retest at a sensible interval, SEM for score bands.
7. **Validity program.** Convergent/discriminant correlations, criterion validation, known-groups
   comparisons. Validity is an ongoing program, not a single study.
8. **Document.** Manual with norms, scoring, reliability/validity evidence, and appropriate-use
   limits.

Example (R sketch):
```r
psych::fa(items, nfactors = 3, rotate = "oblimin", fm = "ml")  # EFA
psych::omega(items)                                            # omega reliability
lavaan::cfa(model, data = d, estimator = "WLSMV")             # CFA, ordinal items
mirt::mirt(items, model = 1, itemtype = "graded")              # IRT graded response
```

## Common pitfalls

- Reporting alpha as the only psychometric evidence (and alpha assumes what it shouldn't).
- "Confirming" EFA structure with CFA on the same sample.
- Kaiser >1 rule for factor retention (use parallel analysis).
- Comparing group means without testing measurement invariance.
- Treating ordinal Likert sums as interval without checking (use WLSMV/polychoric for ordinal CFA).
- Single-study validity claims; validity needs a program of evidence.
- Using a scale in a new population/language without revalidation.
