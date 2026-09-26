---
name: cell-culture-basics
description: Mammalian cell culture fundamentals — aseptic technique, passaging, cryopreservation, and contamination control.
category: scientific
---

## Overview

cell-culture-basics covers the essential practices of mammalian cell culture: aseptic technique,
media and supplements, passaging, counting, cryopreservation, and contamination detection and
response. Cell culture is a craft — most failures come from technique drift and unvalidated
assumptions, not from bad luck.

## When to use

- Setting up culture: hood technique, media selection, serum considerations.
- Routine maintenance: feeding schedules, confluency, passaging, splitting ratios.
- Cryopreservation and thawing: DMSO protocols, viability, cell banking.
- Contamination: detection (bacterial, fungal, mycoplasma), response, prevention.
- Cell line authentication: STR profiling, when and how often.
- Counting and viability: hemocytometer, automated counters, trypan blue discipline.
- Scaling: from dishes to flasks to bioreactors.

## Core concepts

- **Aseptic technique.** Work in the biosafety cabinet with organized workflow (clean → dirty),
  70% ethanol on everything entering, minimal talking, no clutter blocking airflow. Technique
  is the contamination control — antibiotics are not (they mask low-level contamination and
  select resistance; use antibiotic-free culture when possible).
- **Media.** Basal media (DMEM, RPMI, MEM) matched to cell type; serum (FBS 5-10%) provides
  growth factors but introduces variability — batch-test serum lots, consider serum-free
  defined media for sensitive work. L-glutamine degrades (use GlutaMAX or fresh aliquots);
  check pH (phenol red) and osmolarity when troubleshooting growth issues.
- **Passaging.** Split at 70-80% confluency (not 100% — contact inhibition and differentiation
  change phenotypes); use appropriate detachment (trypsin-EDTA with timed exposure,
  non-enzymatic for sensitive cells); consistent split ratios for reproducible growth curves.
  Record passage number — high-passage cells drift genetically and phenotypically.
- **Counting.** Hemocytometer with trypan blue (count ≥100 cells per count for statistics);
  automated counters need validation against manual counts. Viability <90% at thaw or <95% in
  routine culture warrants investigation.
- **Cryopreservation.** Freeze slowly (1°C/min, isopropanol containers or controlled-rate
  freezers) in 5-10% DMSO + serum/media; thaw rapidly (37°C water bath, <2 min) and dilute out
  DMSO promptly. Bank early-passage master stocks + working stocks — never let the lab's only
  stock reach passage 50.
- **Mycoplasma.** The invisible contaminant: no turbidity, just slow growth and altered
  responses. Test regularly (PCR or luminescence kits, monthly for active lines); positive =
  discard and thaw clean stock (treatment rarely fully clears and selects weirdness).
  Quarantine new lines until tested.
- **Authentication.** STR profiling for human lines (HeLa contamination is the classic
  catastrophe — an estimated significant fraction of lines are misidentified). Authenticate on
  receipt, after banking, and periodically. A paper built on the wrong cell line is worthless.
- **Documentation.** Passage number, split ratios, media lots, freeze/thaw dates, test
  results — per flask, in the ELN. "The cells looked fine" is not a record.

## Practical workflow

1. **Setup.** Validated hood technique; appropriate media/serum lot; antibiotic-free unless
   justified.
2. **Thaw.** Rapid thaw, prompt DMSO removal, plate at recommended density; expect 24-48h lag.
3. **Maintain.** Feed per schedule; passage at 70-80% confluency; consistent ratios; log
   everything.
4. **Bank.** Master stock at low passage (≥10 vials), working stocks from it; test banked
   vials for viability and mycoplasma.
5. **Monitor.** Monthly mycoplasma testing; STR on receipt and periodically; growth-rate
   tracking (sudden changes = investigate).
6. **Respond.** Contamination: identify, discard affected cultures, decontaminate incubators/
   hoods, thaw clean stock. Never "rescue" with antibiotics and carry on silently.

## Common pitfalls

- Passaging at 100% confluency (phenotype drift).
- Antibiotic-masked contamination carried for months.
- No mycoplasma testing (the most common undetected problem in cell culture).
- Misidentified cell lines (no STR authentication).
- Single stock at high passage (no clean backup).
- Serum lot changes without testing (growth characteristics shift).
- Poor records making troubleshooting impossible.
- CO₂ levels unchecked (pH drift when CO₂ doesn't match the medium's buffer system).
- Cells left in trypsin too long (surface-protein damage, viability loss).
- Incubator water baths and humidity neglected (evaporation concentrating media).
