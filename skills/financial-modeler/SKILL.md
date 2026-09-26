---
name: financial-modeler
description: Build financial models — revenue forecasts, unit economics, scenario analysis, and investor-grade spreadsheets.
category: business-marketing
---

## Overview

Financial models translate business assumptions into numbers: how revenue grows, what it costs, when cash runs out, and what the business is worth. This skill covers building clean, auditable models — revenue build-ups, cost structures, cash flow, scenario analysis — whether in spreadsheets or code.

A model is a thinking tool first, a prediction second. Its value is in exposing which assumptions actually matter.

## When to use

- Forecasting revenue for a business plan or fundraise
- Modeling unit economics (CAC, LTV, payback)
- Running scenario analysis (best/base/worst cases)
- Building a hiring or expansion plan tied to revenue
- Valuing a business (DCF, comparables, multiples)
- Stress-testing whether the business works at scale

- Modeling M&A scenarios and synergies
- Building board-ready operating plans
- Stress-testing runway under downside cases
## Core concepts

**Drivers, not plugs.** Every line item should derive from an operational driver (users × conversion × price), not a hardcoded growth percentage. Driver-based models are explainable and testable.

**Unit economics.** Contribution margin per customer, CAC payback period, LTV:CAC ratio. If unit economics don't work, scale makes things worse. Model these before anything else.

**Three statements.** P&L (profitability), cash flow (survival — profit ≠ cash), balance sheet (position). Early-stage models can be P&L + cash flow; add the balance sheet as complexity grows.

**Scenarios and sensitivity.** Base, upside, downside cases. Sensitivity analysis (tornado charts or data tables) shows which assumptions swing the outcome most — focus diligence there.

**Model hygiene.** One input tab (all assumptions, blue font, sourced), separate calculation tabs, no hardcoded numbers in formulas, consistent time periods, error checks (balance sheet balances, subtotals foot), and version control.

**Valuation basics.** DCF (project cash flows, discount at WACC, terminal value), comparable companies (revenue/EBITDA multiples), precedent transactions. Triangulate — no single method is truth.


**Cohort-based revenue.** For subscription or repeat-purchase businesses, model revenue by cohort: new customers acquired per period × retention curve × ARPU expansion. Cohort models capture the compounding truth that simple growth-rate models miss — and they expose when growth is just churning through new logos.

**Hiring plan linkage.** Headcount is usually the largest cost and the hardest to cut. Tie every hire to a revenue milestone or capacity constraint, model fully-loaded costs (salary × 1.25–1.4 for benefits, taxes, equipment), and show the hiring curve against the revenue curve — investors check that the team scales with, not ahead of, the business.

**Driver-based modeling.** Every line item traces to operational drivers: revenue = customers × ARPU; support cost = tickets × cost per ticket.
Driver-based models answer "what if" questions; plug-number models just describe.
Document each driver's source (historical data, benchmark, assumption) and confidence level.
**Scenario framework.** Base (most likely), upside (things go well), downside (things go poorly) — with explicit trigger points for switching plans.
The value is not prediction accuracy but preparedness: pre-decided actions for each scenario.
Update scenarios quarterly; stale scenarios provide false comfort.
**SaaS metrics.** ARR, NRR (net revenue retention — the single best SaaS health metric), CAC payback, rule of 40 (growth rate + profit margin ≥ 40%), burn multiple (net burn / net new ARR).
Know benchmarks for your stage; investors will compare you against them regardless.
## Practical workflow

1. **Define the purpose.** Fundraising model? Operating plan? Valuation? Purpose determines horizon, granularity, and which scenarios matter.
2. **Map the revenue engine.** Start from the top of the funnel: leads → conversion → customers → ARPU → revenue. Add expansion, churn, and pricing changes for subscription models.
3. **Build the cost structure.** Fixed vs. variable costs. Headcount plan (the biggest cost for most startups) tied to revenue milestones. COGS tied to revenue drivers.
4. **Connect the statements.** P&L flows to cash flow (working capital changes, capex) and balance sheet. Verify: cash reconciles, balance sheet balances.
5. **Add scenarios.** Build a scenario switch (base/upside/downside) driven by 3–5 key assumptions. Run sensitivity on the top drivers.
6. **Document and review.** Every assumption gets a source or rationale. Add a "key assumptions" summary tab. Have someone else audit the formulas — model errors are embarrassingly common.

**Audit checklist:** no hardcoded values in formulas, all assumptions on the input tab, balance sheet balances, cash flow ties to cash balance, subtotals cross-foot, scenarios switch cleanly, charts match underlying data.


**Unit economics one-pager (build first, before the full model):** CAC by channel, gross margin %, LTV (ARPU × gross margin × average lifetime in months), LTV:CAC ratio, CAC payback months, and contribution margin per order/customer. If payback exceeds 12 months for SMB or 18 for enterprise without a clear reason, fix the business before modeling its future.

**Model audit checklist:** formulas consistent across periods → no hardcoded numbers in formula cells → balance sheet balances → cash flow ties to P&L and balance sheet → circular references resolved intentionally → sensitivity tested on top 5 drivers → version controlled with change log.
A model nobody audits is a model nobody should trust.
**Board package structure:** KPI dashboard (one page) → P&L vs. plan with variance commentary → cash and runway → key risks and mitigations → decisions needed.
Boards want insight and decisions, not spreadsheets — the model supports the narrative, not the reverse.
## Common pitfalls

- **Garbage assumptions, precise output.** Five-decimal precision on made-up inputs. Be honest about uncertainty; use ranges.
- **Hardcoded numbers in formulas.** Makes the model brittle and unauditable. All inputs live on the input sheet.
- **Ignoring cash flow.** Profitable on paper, bankrupt in reality. Model cash timing (receivables, payables, upfront costs).
- **Hockey sticks without engines.** Growth curves need drivers (proven CAC, expansion revenue). Otherwise they're drawings.
- **No scenarios.** A single-point forecast is a lie told with confidence. Always show the range.
- **Overcomplexity.** 40 tabs nobody understands. Model at the granularity decisions require — no finer.
- **Forgetting working capital.** Growth consumes cash (inventory, receivables). Fast-growing businesses die from this most.
- **Mixing cash and accrual.** Recognizing annual prepayments as immediate revenue inflates early months. Model cash timing separately from revenue recognition.
- **Forgetting the balance sheet.** Debt, deferred revenue, and working capital all affect cash. Even a simple balance sheet catches errors the P&L hides.
- **False precision.** 5-decimal forecasts of unknowable futures. Round aggressively; precision implies certainty you do not have.
- **Static models.** Building once, never updating. A model not updated monthly is decoration — assign ownership and a cadence.
