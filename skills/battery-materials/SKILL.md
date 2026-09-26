---
name: battery-materials
description: Battery science fundamentals — cell components, electrochemistry metrics, testing protocols, and degradation analysis.
category: scientific
---

## Overview

Batteries live at the intersection of materials chemistry, electrochemistry,
and engineering. This skill covers how cells work (anode/cathode/electrolyte/
separator), the metrics that matter (capacity, voltage, energy density, cycle
life, rate capability), standard testing protocols, and how to diagnose why a
cell degrades.

## When to use

- Evaluating a new electrode or electrolyte material: what to measure and how
- Setting up coin/pouch cell testing with proper controls and formation protocols
- Interpreting charge–discharge curves, CV, EIS, and dQ/dV plots
- Diagnosing capacity fade: distinguishing cathode, anode, and electrolyte failure modes
- Reading battery literature critically: spotting inflated claims and missing controls

## Core concepts

- **The cell as a system:** energy density is set by the electrode couple (capacity × voltage); power by kinetics and transport; lifetime by parasitic reactions. No single material fixes all three.
- **Key metrics:** specific capacity (mAh/g), Coulombic efficiency (CE = Q_discharge/Q_charge), energy density (Wh/kg or Wh/L), C-rate (1C = full charge/discharge in 1 h), cycle life, calendar life.
- **SEI/CEI:** the solid-electrolyte interphase on the anode (and cathode-electrolyte interphase) — passivating films whose formation consumes lithium inventory and whose instability drives fade.
- **dQ/dV analysis:** differential capacity plots turn sloping voltage curves into peaks that fingerprint phase transitions and degradation mechanisms.
- **EIS:** electrochemical impedance spectroscopy separates processes by timescale — charge transfer, diffusion, interfacial films — when fitted with a physically justified equivalent circuit.
- **Formation:** the first cycles build the SEI; formation protocol (slow cycles, voltage holds) strongly affects lifetime — report it always.

- **Voltage profiles as thermodynamics:** plateaus indicate two-phase coexistence (Gibbs phase rule); sloping regions indicate solid solutions — the curve shape diagnoses the storage mechanism.
- **Lithium-inventory accounting:** every electron of irreversible capacity is lithium permanently lost — track cumulative irreversible loss; it predicts full-cell fade quantitatively.
- **Thermal-runaway chain:** SEI breakdown → electrolyte reaction → cathode oxygen release → runaway — ARC and DSC measurements quantify onset temperatures; identify and address the weakest link.

## Practical workflow

### 1. Build and test cells properly

1. Use consistent electrode loadings, electrolyte amounts, and separator — vary one thing at a time.
2. Run half cells (vs Li metal) for material screening, full cells for realistic metrics; Li-metal half cells flatter CE and mask lithium-inventory loss.
3. Formation: 2–3 slow cycles (C/10–C/20) before rate or cycling tests; record the first-cycle CE (formation loss).
4. Always include a baseline/control cell from a known-good recipe in every batch.

### 2. Core test sequence

1. **Rate capability:** C/10 → C/5 → C/2 → 1C → 2C → back to C/10; recovery at low rate distinguishes kinetic limits from permanent damage.
2. **Long cycling:** at a practical rate (C/2–1C) with voltage windows matching the application; track capacity, CE (to 4+ decimal places — CE of 99.9% vs 99.5% is a huge lifetime difference), and voltage hysteresis.
3. **dQ/dV:** collect at low rate; watch peaks shrink/shift with cycling to identify which redox processes degrade.
4. **EIS:** at fixed SOC, before and after cycling; fit with a minimal equivalent circuit and report parameter uncertainties.

### 3. Diagnose fade

1. Low CE (<99.5% in graphite cells) → parasitic electrolyte reactions / SEI growth.
2. Rising impedance with stable capacity → interfacial films, not active-material loss.
3. Abrupt capacity drop → particle cracking, current-collector delamination, or lithium plating (check low-temperature/fast-charge conditions).
4. Post-mortem: disassemble in inert atmosphere; SEM (electrode cracking), XPS (surface films), ICP (transition-metal dissolution/crossover).

### 4. Read claims critically

1. Cycle life at C/10 with flooded electrolyte and 2 mg/cm² loading does not predict a real cell.
2. "mAh/g" without the voltage window and loading is meaningless; report areal capacity (mAh/cm²) too.
3. First-cycle CE below ~85% (anodes) signals a material that will eat lithium inventory in full cells.

### 5. Perform a failure-analysis autopsy

1. Stop the failed cell at the relevant state of charge; disassemble in argon — air exposure rewrites the evidence within minutes.
2. Photograph electrodes; note discoloration, metallic lithium plating on graphite, delamination, or dry spots.
3. Cross-section (FIB/SEM) for particle cracking; XPS for surface-film chemistry; ICP of electrolyte for dissolved transition metals — assemble the mechanism, not just the symptoms.

### 6. Quick-reference checklist

- [ ] Formation protocol fixed and recorded (rates, voltage windows, temperature)
- [ ] Baseline/control cells included in every test batch
- [ ] First-cycle Coulombic efficiency reported
- [ ] Rate capability tested with recovery step back to low rate
- [ ] Coulombic efficiency tracked to 4+ decimal places during cycling
- [ ] dQ/dV collected at low rate for mechanism diagnosis
- [ ] Loadings, electrolyte amount, and areal capacity reported
- [ ] Promising half-cell results validated in full cells

## Common pitfalls

- **Half-cell-only testing:** Li metal's excess inventory hides the CE losses that kill full cells — validate promising materials in full cells early.
- **Ignoring temperature:** kinetics, SEI stability, and plating risk are all strongly T-dependent; room-temperature data doesn't extrapolate.
- **Overfitting EIS:** equivalent circuits with more parameters than features in the spectrum; always show the fit quality and justify each element physically.
- **Chasing capacity while ignoring CE:** a 300 mAh/g anode at 98% CE is worse than a 200 mAh/g anode at 99.9% CE for any practical cell.
- **Formation amnesia:** changing the formation protocol between batches invalidates comparisons — it's part of the recipe.
- **Plating blindness:** charging graphite below 0 °C or above ~1C risks lithium plating; confirm with voltage-plateau or post-mortem analysis.
- **Formation-protocol drift:** a changed formation step means a changed SEI, which makes cycling data incomparable across batches — lock the protocol and log it with the data.
- **Gravimetric capacity without loading:** 300 mAh/g at 1 mg/cm² is a materials result, not a battery result — always report areal capacity (mAh/cm²) and electrode density alongside.
