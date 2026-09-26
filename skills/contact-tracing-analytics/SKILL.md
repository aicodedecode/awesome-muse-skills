---
name: contact-tracing-analytics
description: Analyzing contact tracing data — network reconstruction, transmission chains, and evaluating tracing performance.
category: scientific
---

## Overview

contact-tracing-analytics covers the quantitative side of contact tracing: reconstructing
transmission networks from case-contact data, estimating key parameters (secondary attack rates,
serial intervals), identifying superspreading, and evaluating whether tracing programs actually
work. It bridges field epidemiology and network science.

## When to use

- Analyzing case-contact datasets: completeness, timeliness, yield.
- Estimating secondary attack rates by setting and contact type.
- Reconstructing transmission chains and networks.
- Identifying superspreading events and high-risk settings.
- Evaluating tracing performance: speed, coverage, forward vs backward tracing.
- Digital tracing data: app-based proximity, privacy-preserving analytics.

## Core concepts

- **The tracing cascade.** Exposed → identified as contact → reached → tested/quarantined →
  positive → their contacts traced. Measure yield and delay at each step — programs usually fail
  at reach and speed, not at epidemiology. Report the full cascade, not just cases found.
- **Timeliness is effectiveness.** Tracing that reaches contacts after their infectious period
  prevents nothing. Key metrics: time from index case symptom onset to contact quarantine;
  proportion of contacts reached within 48 hours. Model the relationship explicitly — each day of
  delay costs a quantifiable fraction of prevented transmissions.
- **Secondary attack rate (SAR).** Proportion of contacts who become cases, stratified by setting
  (household, workplace, social), contact type, and index-case characteristics. SAR by setting is
  the evidence base for targeted interventions — household SARs are typically an order of
  magnitude above casual-contact SARs.
- **Forward vs backward tracing.** Forward tracing finds who the case may have infected
  (prevents onward transmission); backward tracing finds who infected the case (finds clusters
  and superspreading events). Backward tracing is disproportionately valuable for overdispersed
  pathogens — finding one superspreading event beats finding ten isolated transmissions.
- **Overdispersion and superspreading.** The dispersion parameter k quantifies transmission
  heterogeneity; small k means most transmission comes from few individuals/events. Tracing data
  can estimate k from the offspring distribution — and it argues for cluster-focused (backward)
  strategies when k is small.
- **Network reconstruction.** Cases as nodes, transmission links as edges (inferred from
  contact + timing + genomics). Analyze: chain lengths, cluster sizes, setting-specific
  subnetworks. Genomic data resolves ambiguous links — integrate where available.
- **Serial interval.** Time between symptom onsets in infector-infectee pairs, estimated from
  traced pairs with known links. Needed for Rt estimation; watch for truncation bias (recent
  pairs incomplete) and recall bias in onset dates.
- **Digital tracing.** Bluetooth proximity apps generate exposure notifications at scale but
  with noisy distance/duration proxies. Evaluate: adoption rates (network effects dominate —
  low adoption ≈ no effect), positive predictive value of notifications, and equity (smartphone
  access). Privacy-preserving designs (decentralized) trade analytic visibility for trust.

## Practical workflow

1. **Assemble data.** Case-contact line lists with dates (onset, test, interview, quarantine),
   contact types, settings, outcomes. Link records deterministically where possible.
2. **Cascade analysis.** Compute yield and delay at each step; stratify by demographics and
   geography to find inequities.
3. **Parameter estimation.** SAR by setting/type; serial interval from linked pairs (adjust for
   truncation); offspring distribution and k.
4. **Network analysis.** Reconstruct chains; identify clusters and superspreading events;
   characterize high-risk settings.
5. **Performance evaluation.** Timeliness metrics, coverage (contacts identified per case vs
   expected), prevented-transmission estimates via modeling.
6. **Report.** Cascade figures, SAR tables, timeliness distributions, equity stratifications,
   and concrete operational recommendations (the point is improving the program).

## Common pitfalls

- Counting traced cases without measuring delay (slow tracing = theater).
- Forward-only tracing for overdispersed pathogens (missing the cluster-finding value).
- SARs without setting stratification (meaningless averages).
- Serial intervals from unlinked pairs or with truncation bias.
- Ignoring the denominator: contacts never identified.
- Digital-tracing evaluations without adoption-rate context.
- Equity-blind analysis (tracing works worst where it's needed most).
- Overdispersion ignored — forward-only tracing designed as if spread were homogeneous.
- Contacts' contacts never followed, missing second-generation transmission chains.
