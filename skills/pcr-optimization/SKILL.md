---
name: pcr-optimization
description: PCR assay optimization and troubleshooting — primer design, cycling conditions, and fixing failed reactions.
category: scientific
---

## Overview

pcr-optimization covers designing robust PCR assays and systematically troubleshooting failures:
primer design rules, reaction chemistry, cycling parameters, and the diagnostic logic that
distinguishes primer problems from template, enzyme, and contamination issues. Most PCR failures
are primer or template problems — this skill teaches you to determine which, quickly.

## When to use

- Designing primers: length, Tm, GC content, specificity checking.
- Setting up new assays: polymerase choice, buffer, Mg²⁺, cycling conditions.
- Troubleshooting: no product, wrong-size bands, smears, primer-dimers, non-specific
  amplification.
- qPCR: efficiency, standard curves, reference genes, MIQE basics.
- Contamination control: UNG, workflow separation, no-template controls.

## Core concepts

- **Primer design rules.** 18-25 nt; Tm 58-65°C with ≤2°C difference between primers; 40-60%
  GC; GC clamp (1-2 G/C at 3′ end, not >3); no stable secondary structures (hairpins,
  self-dimers, cross-dimers — check with design tools); 3′ end must match perfectly (mismatches
  here kill extension). Amplicon 100-1000 bp for standard PCR, 70-200 bp for qPCR.
- **Specificity checking.** BLAST primers against the target genome; check for SNPs under
  primers (especially 3′); for multiplex, check all cross-interactions. In silico PCR tools
  catch most off-target problems before you order.
- **Mg²⁺ titration.** The single most effective optimization: 1.5-4 mM typically. Too low: no
  product. Too high: non-specific bands. Titrate in 0.5 mM steps when an assay misbehaves.
- **Annealing temperature.** Start 3-5°C below the lower primer Tm; gradient PCR (spanning
  ±5°C) finds the optimum in one run. Touchdown PCR (starting high, decreasing) suppresses
  non-specific priming elegantly.
- **Polymerase choice.** Taq for routine (no proofreading); high-fidelity (Q5, Phusion,
  Pfu) for cloning/sequencing (error rate ~50x lower); hot-start for specificity (prevents
  room-temperature mispriming — the commonest fix for primer-dimers and smears).
- **Template quality.** Inhibitors (heparin, humic acids, excess EDTA), degraded DNA, and
  too much template (inhibits!) cause failures blamed on primers. Quantify (Qubit over
  NanoDrop for accuracy), check 260/280 and 260/230 ratios, and titrate template amount.
- **qPCR specifics.** Efficiency 90-110% from standard curves (slope −3.1 to −3.6); melt
  curves to confirm single products; no-template and no-RT controls mandatory; reference genes
  validated for stability in your conditions (not GAPDH by habit — test 3+ candidates with
  geNorm/NormFinder); follow MIQE reporting.
- **Contamination control.** Separate pre- and post-PCR areas; filter tips; UNG/dUTP systems
  for carryover prevention; no-template controls in every run. A positive NTC means stop and
  decontaminate — not "subtract background."

## Practical workflow

1. **Design.** Primers per rules above; in silico specificity check; order HPLC-purified for
   critical assays.
2. **Baseline reaction.** Standard conditions: hot-start polymerase, 1.5-3 mM Mg²⁺, 200 nM
   primers, annealing at Tm−3°C.
3. **Gradient optimization.** Annealing temperature gradient + Mg²⁺ titration in a matrix;
   pick the condition with strong specific band and clean NTC.
4. **Validate.** Sensitivity (limit of detection via dilution series), specificity (related
   targets, human DNA background), reproducibility (inter-run CV).
5. **Troubleshoot systematically.** No product → template/polymerase/primers (test with
   control template). Wrong bands → annealing temp/specificity. Smear → too much template,
   too many cycles, degraded DNA. Primer-dimer → hot-start, primer redesign, lower primer
   concentration.
6. **Document.** Full reaction recipe, cycling program, and validation data — the assay's
   birth certificate.

## Common pitfalls

- Blaming primers when the template is degraded or inhibited.
- Annealing temperature copied from a different primer pair.
- Too much template DNA (inhibition masquerading as failure).
- Primer-dimers "fixed" by ignoring them instead of hot-start/redesign.
- qPCR without efficiency validation or melt curves.
- Reference gene chosen by habit, not validated.
- Positive NTCs worked around instead of decontaminated.
- Excess cycles (>35) amplifying non-specific products and primer-dimers.
- Template added to master mix at the bench instead of on ice (undermining hot-start).
- Skipping gel verification of amplicon size before downstream use.
- dNTP/polymerase past expiry silently degrading reaction efficiency.
