---
name: groundwater-modeling
description: Groundwater flow and transport modeling — aquifer characterization, MODFLOW workflows, calibration, and capture-zone analysis.
category: scientific
---

## Overview

Groundwater is the world's largest accessible freshwater store and its
least visible — models make it legible. This skill covers aquifer
conceptualization, parameter estimation (pumping tests, slug tests),
building and calibrating flow models (MODFLOW 6), solute transport basics,
and the decision-support products (capture zones, drawdown forecasts,
sustainable yield) that models exist to produce.

## When to use

- Designing a water-supply wellfield: sustainable pumping rates and well interference
- Delineating wellhead protection areas and contaminant capture zones
- Predicting drawdown, dewatering, or impacts of new abstractions
- Modeling contaminant plume migration and remediation scenarios
- Reviewing a groundwater study for regulatory or legal purposes

## Core concepts

- **Darcy's law:** q = −K∇h — specific discharge proportional to hydraulic gradient; K (hydraulic conductivity) spans 10+ orders of magnitude across materials — the single most important and uncertain parameter.
- **Storage:** confined aquifers release water from compressibility (storativity S ~10⁻⁵–10⁻³); unconfined from draining pores (specific yield Sy ~0.05–0.3) — transient responses differ by orders of magnitude.
- **Theis and Cooper–Jacob:** pumping-test analysis giving T (transmissivity) and S from drawdown vs time; diagnostic plots (derivative) reveal boundaries, leakage, and dual-porosity before fitting.
- **Conceptual model first:** hydrostratigraphy, recharge, boundaries (no-flow, constant-head, rivers), stresses — the numerical model only computes what the conceptual model asserts; most bad models are bad conceptualizations.
- **Calibration:** history matching heads and fluxes; non-uniqueness is fundamental (different K fields, same heads) — regularize with pilot points or zones, and keep parameters within physically plausible ranges.
- **Transport:** advection–dispersion equation; retardation (sorption), decay, and matrix diffusion control plume fate — dispersivity is scale-dependent and the most abused parameter in transport modeling.

- **Capture vs safe yield:** pumping intercepts natural discharge and induces recharge — "safe yield" is about acceptable impacts on streams, wetlands, and neighbors, not a recharge number; Theis's capture principle is the correct framing.
- **Density-dependent flow:** seawater intrusion and deep brines need variable-density codes (SEAWAT) — constant-density models misplace the freshwater–saltwater interface, sometimes badly.
- **Fractured-rock duality:** matrix stores, fractures transmit — equivalent-porous-medium models fail where fracture networks dominate; discrete-fracture or dual-porosity approaches are needed, with field data to constrain them.

## Practical workflow

### 1. Build the conceptual model

1. Compile geology (borehole logs, geophysics), water levels (contour the potentiometric surface — flow is perpendicular to contours), recharge estimates (water-table fluctuation, chloride mass balance), and all abstractions.
2. Define model domain, layers, and boundary conditions from the hydrogeology — not from software convenience; boundaries far enough to not dictate the answer.
3. List the decisions the model must support (pumping rate? plume arrival time?) — this sets the required accuracy and complexity.

### 2. Parameterize from field data

1. Analyze pumping tests with diagnostic derivative plots before curve-fitting; report T, S with the method and its assumptions (Theis assumes confined, infinite, homogeneous).
2. Slug tests for K at individual wells (cheap, small support volume); grain-size estimates only as rough priors.
3. Recharge from multiple methods (they disagree — the spread is your uncertainty); river/aquifer exchange from streambed measurements or baseflow separation.

### 3. Build, calibrate, verify (MODFLOW 6)

1. Discretize: grid refined near wells/rivers/gradients; check water-balance error (<1%) — a model that doesn't conserve mass is broken.
2. Calibrate to heads AND fluxes (stream gains/losses, spring flows) — heads alone underconstrain K massively.
3. Validate on an independent period (different pumping regime); a model that only matches its calibration period is a fitted curve.
4. Sensitivity analysis: identify which parameters actually control the decision variable — refine those, fix the rest.

### 4. Deliver decision products

1. **Capture zones:** backward particle tracking (MODPATH) for wellhead protection — use probabilistic zones reflecting K uncertainty, not a single deterministic line.
2. **Drawdown forecasts:** scenario ensembles (pumping × recharge × parameter uncertainty), not one run.
3. **Sustainable yield:** frame as capture (reduced discharge + induced recharge), not "recharge equals safe pumping" — pumping always intercepts natural discharge eventually.
4. Document everything: conceptual model, parameters with sources, calibration metrics, limitations — a regulator should be able to reproduce it.

### 5. Model seawater intrusion for a coastal aquifer

1. Characterize the wedge: multi-level salinity monitoring perpendicular to the coast — one well screen gives one point, not a wedge.
2. Build a variable-density model (SEAWAT); calibrate to the salinity distribution and its movement over time, not just heads.
3. Test management scenarios: reduced pumping, relocation of wells inland, injection barriers — and show the timescale: wedges advance and retreat over decades, not months.

### 6. Quick-reference checklist

- [ ] Conceptual model built and documented before any numerics
- [ ] Water-balance error <1% (mass conservation verified)
- [ ] Calibrated to heads AND fluxes (streams, springs)
- [ ] Parameters kept within physically plausible ranges
- [ ] Validated on an independent period/regime
- [ ] Sensitivity analysis identifies decision-controlling parameters
- [ ] Capture zones presented probabilistically, not as single lines
- [ ] Sustainable yield framed as capture impacts, not "recharge = safe pumping"

## Common pitfalls

- **Conceptual errors:** wrong aquifer geometry or boundary conditions — no amount of calibration fixes a model of the wrong system.
- **Heads-only calibration:** matching water levels while missing streamflows by 10× — calibrate to fluxes too.
- **Overparameterization:** more K zones than data can support — regularize and keep parameters plausible.
- **Dispersivity abuse:** calibrating dispersivity to fit a plume, then using it predictively at a different scale — it's scale-dependent.
- **Steady-state complacency:** calibrating steady-state then predicting transients (or vice versa) without testing both.
- **Deterministic capture zones:** a single particle-track line ignores K uncertainty — protection areas need probabilistic treatment.
- **"Safe yield = recharge":** the classic fallacy — sustainable pumping is about acceptable capture impacts, not a recharge number.
- **Constant-density modeling of coastal aquifers:** the Ghyben–Herzberg sharp-interface guess inside a constant-density model — use variable-density physics or state the approximation's limits loudly.
- **Boundary conditions that manufacture water:** constant-head boundaries placed too close act as infinite sources, masking drawdown — extend the domain or use head-dependent boundaries.
