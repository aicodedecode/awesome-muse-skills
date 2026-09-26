---
name: pharmacovigilance-signals
description: Drug safety signal detection — disproportionality analysis, case-series evaluation, and signal validation.
category: scientific
---

## Overview

pharmacovigilance-signals covers the detection and evaluation of adverse-drug-reaction signals
from spontaneous reporting systems (FAERS, EudraVigilance, VigiBase): disproportionality
statistics, case-series clinical review, and the validation workflow that separates real safety
issues from reporting artifacts. Signal detection is hypothesis generation — every signal needs
clinical and epidemiologic follow-up.

## When to use

- Screening spontaneous-report databases for drug-event associations.
- Disproportionality analysis: PRR, ROR, IC (BCPNN), EBGM.
- Evaluating a signal: case review, temporality, dechallenge/rechallenge.
- Distinguishing true signals from notoriety, Weber, and masking effects.
- Signal prioritization for regulatory or clinical action.
- Designing post-signal pharmacoepidemiology studies.

## Core concepts

- **Spontaneous reporting.** Voluntary reports of suspected adverse reactions — massive,
  global, but with no denominator, underreporting (typically >90% of events unreported),
  and reporting biases. Strength: detects rare, serious, unexpected events trials can't.
  Weakness: everything quantitative is fragile.
- **Disproportionality statistics.** PRR (proportional reporting ratio), ROR (reporting odds
  ratio), IC (information component, BCPNN), EBGM (empirical Bayes). They ask: is this
  drug-event pair reported more often than expected vs all other drugs/events? Thresholds
  (e.g. PRR ≥2, χ² ≥4, n ≥3) are screening filters, not proof. Shrinkage methods (IC, EBGM)
  handle small counts better.
- **Reporting biases.** Weber effect (reporting peaks after launch then declines); notoriety
  bias (media coverage spikes reports); stimulated reporting (regulatory actions prompt
  reports); confounding by indication (the disease, not the drug, causes the event);
  masking (a drug with many reports of one event suppresses disproportionality for others).
  Every signal must be examined for these before being believed.
- **Case-series evaluation.** The clinical core: review individual reports for temporality
  (plausible time-to-onset), dechallenge (event resolves on stopping), rechallenge (recurs on
  restarting — strong evidence, rarely available), dose relationship, alternative causes, and
  reporter quality. A handful of well-documented cases beats a thousand thin ones.
- **Causality assessment.** WHO-UMC or Naranjo scales structure individual-case judgment
  (certain/probable/possible/unlikely). They're guides, not algorithms — clinical judgment
  integrates the pattern.
- **Signal prioritization.** Seriousness, unexpectedness (not in label), strength of evidence,
  public-health impact, and preventability. Prioritize signals that are serious, unlabeled,
  and actionable — not just statistically striking.
- **Validation.** Disproportionality signals require confirmation: targeted
  pharmacoepidemiology (cohort/case-control in EHR/claims), literature review, mechanistic
  plausibility, and sometimes de novo studies. A signal is not a finding until validated.
- **Data quality.** Duplicate reports (same event reported by patient, doctor, manufacturer),
  missing data, coding variation (MedDRA granularity — group related preferred terms or miss
  the signal). Deduplicate and standardize before analysis.

## Practical workflow

1. **Define the question.** Drug(s), event(s) with MedDRA terms (group synonyms), time window,
   database.
2. **Clean.** Deduplicate, standardize coding, handle missing fields transparently.
3. **Screen.** Disproportionality statistics with shrinkage; stratify by age/sex/reporter
   where relevant; flag threshold-crossers.
4. **Triage for bias.** Check Weber/notoriety patterns, indication confounding, masking —
   discard or down-weight artifactual signals.
5. **Clinical review.** Case series: temporality, dechallenge/rechallenge, alternatives,
   WHO-UMC causality on key cases.
6. **Prioritize.** Seriousness × unexpectedness × evidence strength × actionability.
7. **Validate and act.** Pharmacoepi follow-up, literature, mechanistic review; communicate
   with appropriate uncertainty; monitor after action.

Example (R sketch):
```r
# 2x2: a=drug+event, b=drug+other, c=other+event, d=other+other
PRR <- (a/(a+b)) / (c/(c+d)); ROR <- (a*d)/(b*c)
# use shrinkage methods (e.g. PhViD::BCPNN) for routine screening
```

## Common pitfalls

- Treating disproportionality as incidence or risk (no denominator!).
- Ignoring notoriety/Weber effects (media-driven pseudo-signals).
- Confounding by indication mistaken for drug effect.
- MedDRA splitting hiding signals across synonymous terms.
- Duplicate reports inflating counts.
- Acting on unvalidated signals — or ignoring validated ones.
- Small-count signals without shrinkage (wild PRRs from n=2).
