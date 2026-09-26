---
name: drug-interaction-screening
description: Screening for drug-drug interactions — mechanistic prediction, database checks, and clinical risk assessment.
category: scientific
---

## Overview

drug-interaction-screening covers the systematic identification and assessment of drug-drug
interactions (DDIs): pharmacokinetic mechanisms (CYPs, transporters), pharmacodynamic interactions
(additive effects, antagonism), database and literature checking, and translating interaction
data into clinical risk assessment. Polypharmacy makes this a daily necessity, not a specialty.

## When to use

- Medication review for polypharmacy patients: identifying clinically relevant DDIs.
- Mechanistic prediction: CYP/transporter-mediated PK interactions for new combinations.
- Checking resources: interaction databases, FDA labels, primary literature.
- Risk stratification: which interactions need action vs monitoring vs no concern.
- Designing DDI clinical studies (inhibitor/inducer trials).
- Building or evaluating interaction-checking tools.

## Core concepts

- **PK interaction mechanisms.** Absorption (chelation, pH, P-gp), distribution (protein-binding
  displacement — rarely clinically relevant alone), metabolism (CYP inhibition/induction),
  excretion (renal transporter inhibition). CYP-mediated interactions dominate clinical practice.
- **Key CYPs.** CYP3A4 (most drugs; inhibited by azoles, macrolides, grapefruit; induced by
  rifampin, carbamazepine, St. John's wort), CYP2D6 (polymorphic — poor vs ultrarapid
  metabolizers differ hugely), CYP2C9 (warfarin, phenytoin), CYP2C19 (clopidogrel activation —
  PPIs reduce it), CYP1A2 (induced by smoking). Know strong inhibitors/inducers of each.
- **Inhibition vs induction timing.** Inhibition starts/stops quickly (days); induction takes
  1-2 weeks to develop and to wash out (enzyme synthesis/degradation). Stopping an inducer
  causes drug levels to rise over weeks — a common missed interaction.
- **Transporters.** P-gp (digoxin, dabigatran — efflux inhibition raises levels), OATP1B1
  (statins), OCT2/MATE (metformin). Transporter interactions are underappreciated and
  increasingly in labels.
- **PD interactions.** Additive pharmacology: QT prolongation (multiple QT drugs), bleeding
  (anticoagulant + antiplatelet + NSAID), sedation (CNS depressants), serotonin syndrome
  (serotonergic combos), hypotension, hypoglycemia. These need no PK mechanism — combined
  effect is the interaction.
- **Clinical significance framework.** Severity (what happens: minor vs life-threatening) ×
  probability (how certain, how large the exposure change: AUC ratio ≥5 = strong) ×
  manageability (dose adjust? monitor? avoid?). Most database "interactions" are theoretical —
  triage ruthlessly.
- **Resources.** FDA labels (7. Drug Interactions sections), dedicated databases (check ≥2 —
  they disagree), primary literature for high-stakes decisions. Database severity ratings are
  inconsistent across tools — read the evidence, not just the red/yellow/green.
- **Patient factors.** Age, renal/hepatic function, pharmacogenomics (CYP2D6/2C19 status),
  and narrow-therapeutic-index drugs (warfarin, lithium, digoxin, immunosuppressants) amplify
  every interaction. The same DDI is trivial in one patient and dangerous in another.

## Practical workflow

1. **Reconcile.** Complete medication list including OTCs, herbals, supplements, PRNs, and
   recent changes — interactions hide in the unasked-about drugs.
2. **Screen.** Run through ≥1 interaction database; supplement with label checks for
   narrow-index drugs.
3. **Triage.** Severity × probability × manageability; focus on narrow-therapeutic-index drugs
   and high-risk combos (anticoagulants, QT drugs, CNS depressants, serotonergics).
4. **Assess mechanistically.** Is the mechanism plausible for this patient (dose, timing,
   inducer washout, genetics)? Check primary evidence for major decisions.
5. **Act.** Avoid/substitute, dose-adjust, separate administration times, or monitor
   (levels, ECG, symptoms) — with a documented plan and follow-up.
6. **Document and counsel.** Record the assessment and plan; tell the patient what to watch
   for.
7. **Reassess.** On every medication change — interactions are dynamic.

## Common pitfalls

- Alert fatigue: treating all database flags equally (most are noise).
- Missing inducer washout timing (weeks-long effects after stopping).
- Protein-binding displacement overcalled as clinically relevant.
- Herbal/OTC products omitted from screening (St. John's wort, grapefruit).
- PD interactions missed while hunting PK mechanisms.
- Single-database reliance (databases disagree substantially).
- No patient-specific risk stratification (same flag, different danger).
- Timing of interacting-drug initiation/stopping not factored into risk windows.
- Pharmacodynamic interactions in elderly patients underestimated (additive CNS effects).
- Renal/hepatic impairment amplifying a "moderate" interaction into a severe one.
