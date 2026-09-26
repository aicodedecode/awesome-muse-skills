---
name: carbon-accounting
description: Greenhouse gas inventories and carbon footprints — scopes, emission factors, boundaries, and credible net-zero claims.
category: scientific
---

## Overview

Carbon accounting quantifies greenhouse gas emissions so they can be
managed, reported, and reduced. This skill covers the GHG Protocol
framework (Scope 1/2/3), emission-factor methods, organizational and
product boundaries, and how to distinguish a credible net-zero plan from
creative arithmetic.

## When to use

- Building an organization's first GHG inventory or carbon footprint
- Choosing emission factors and activity data for a sector (energy, transport, agriculture, waste)
- Setting science-based targets and a net-zero roadmap
- Evaluating offsets, insets, and "carbon neutral" claims
- Reporting under CDP, CSRD, or national inventory guidelines

## Core concepts

- **Scopes:** Scope 1 (direct: owned combustion, fugitives), Scope 2 (purchased electricity/heat — location-based vs market-based), Scope 3 (value chain: purchased goods, transport, product use, end-of-life) — Scope 3 is usually the largest and hardest.
- **Emission = activity × factor:** fuel burned × EF, kWh × grid factor, tonnes of material × embodied factor. Uncertainty lives in both terms; EFs vary by region, year, and technology.
- **CO₂-equivalents:** gases weighted by Global Warming Potential (GWP100 standard; GWP* or GWP20 sometimes for methane) — state the metric and AR version (AR5 vs AR6 values differ).
- **Boundaries:** organizational (equity share vs operational control) and operational (which Scope 3 categories are material) — the boundary choice changes the answer more than most data refinements.
- **Additionality (offsets):** a credit must represent reductions that wouldn't have happened otherwise, with permanence and no leakage — most controversies trace to failures here.
- **Mitigation hierarchy:** avoid → reduce → substitute → compensate. Offsets are the last step, not the strategy.

- **Scope 3 categories that dominate:** purchased goods/services (Category 1) and use of sold products (Category 11) are usually the largest — screening with spend-based factors first directs primary-data effort where it counts.
- **Biogenic CO₂ accounting:** combustion of biomass is reported separately (memo item), not as zero — the "carbon neutral biomass" assumption requires sustainable regrowth accounting, not faith.
- **Avoided emissions (Scope 4):** claimed reductions from product use vs a baseline — reported separately, never netted against the inventory; baselines are where avoided-emissions claims go to die.

## Practical workflow

### 1. Set boundaries first

1. Choose the consolidation approach (operational control is most common) and document it.
2. Screen all 15 Scope 3 categories for relevance; include the material ones (often purchased goods/services, use of sold products, transport).
3. Define the base year and recalculation policy (structural changes trigger base-year restatement — decide the threshold now).

### 2. Collect activity data and factors

1. Start with what exists: fuel bills, electricity meters, travel records, procurement spend.
2. Prefer supplier-specific EFs where available, then regional/national factors (DEFRA, EPA, IEA), then spend-based EEIO factors (coarse — use only for screening).
3. Match factor vintage and geography to the activity; a 2015 US grid factor misstates 2026 Indian electricity badly.
4. Track data quality per line item (measured > calculated > estimated) — it guides next year's improvements.

### 3. Calculate and quality-check

```python
# Core pattern: emissions_kgCO2e = activity * emission_factor * gwp
# Keep units explicit at every step; convert at the end
```

1. Compute by category; check that the ranking of sources is plausible (energy and materials usually dominate).
2. Benchmark intensity metrics (tCO₂e/revenue, /employee, /unit product) against sector peers — outliers signal errors, not excellence.
3. Document every factor source with version and year — an inventory without traceable factors is unauditable.

### 4. Targets, reductions, and claims

1. Set near-term absolute reduction targets (science-based: ~4.2%/yr linear for 1.5 °C alignment) before any net-zero date.
2. Publish the reduction pathway: which levers, what timing, what capex — a target without a plan is a wish.
3. For residual emissions, use high-integrity removals (durable CDR), disclose the share of compensation vs reduction, and never claim "carbon neutral" on Scope 1+2 while ignoring Scope 3.

### 5. Run a year-two improvement cycle

1. Rank line items by (emissions × uncertainty) — improve data quality where the product is largest, not where measurement is easiest.
2. Replace spend-based factors with supplier-specific data for the top 3–5 categories; install metering where estimates dominate energy use.
3. Document methodology changes and restate the base year if boundaries or methods changed materially — comparability is the inventory's whole value.

### 6. Quick-reference checklist

- [ ] Organizational boundary and consolidation approach documented
- [ ] All 15 Scope 3 categories screened; material ones included
- [ ] Emission factors matched to geography, vintage, and technology
- [ ] Every factor sourced with version and year (auditable trail)
- [ ] Data quality tier recorded per line item (measured > calculated > estimated)
- [ ] Base year set with a recalculation policy
- [ ] Both location- and market-based Scope 2 disclosed
- [ ] Reduction plan published before any net-zero date is claimed

## Common pitfalls

- **Scope 3 omission:** reporting Scopes 1+2 only and declaring victory — the value chain is where most emissions live.
- **Market-based Scope 2 gaming:** buying cheap unbundled RECs while consuming coal-heavy grid power — disclose both methods.
- **Double counting:** the same reduction claimed by the company, the supplier, and the offset buyer — check registries and contracts.
- **GWP cherry-picking:** switching between GWP100/GWP20 or AR versions to flatter methane-heavy footprints — be consistent and transparent.
- **Offset-first strategies:** compensating before reducing, or using avoided-emissions credits as "removals."
- **Boundary creep:** changing consolidation or categories year-to-year to manufacture reductions — restate the base year instead.
- **Renewable-energy-attribute double selling:** the same MWh claimed by the generator's grid mix and your market-based Scope 2 — verify exclusivity and retirement in a registry.
- **Intensity-metric gaming:** falling tCO₂e/revenue from revenue growth while absolute emissions rise — report absolute emissions alongside any intensity metric, always.
