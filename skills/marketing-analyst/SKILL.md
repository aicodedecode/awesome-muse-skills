---
name: marketing-analyst
description: Analyze marketing performance — attribution, funnel analysis, cohort reports, dashboards, and data-driven recommendations.
category: business-marketing
---

## Overview

Marketing analysts turn raw data into decisions: which channels deserve budget, where the funnel leaks, which campaigns actually drove revenue. This skill covers measurement fundamentals (UTMs, attribution models), core analyses (funnel, cohort, CAC/LTV), dashboard design, and presenting findings so stakeholders act on them.

## When to use

- Deciding where to allocate marketing budget
- Diagnosing a drop in leads or conversions
- Building a marketing dashboard or report
- Evaluating campaign ROI
- Choosing or challenging an attribution model
- Preparing a quarterly marketing performance review

- Building marketing mix models for budget allocation
- Setting up multi-touch attribution
- Investigating sudden performance changes
- Building executive marketing dashboards
- Evaluating incrementality of campaigns
- Forecasting pipeline from marketing activities
## Core concepts

**Attribution models.** First-touch (credits discovery), last-touch (credits conversion), linear/multi-touch (spreads credit), data-driven (algorithmic). No model is "true" — each answers a different question. Use first-touch for channel discovery, multi-touch for budget allocation, and always sanity-check against incrementality.

**UTM discipline.** Consistent utm_source, utm_medium, utm_campaign tagging is the foundation. One naming convention, documented, enforced. Bad UTMs make analysis impossible.

**Funnel analysis.** Track conversion between stages (visitor → lead → MQL → SQL → customer). Find the biggest relative drop — that's the leverage point. Segment by channel, campaign, and persona.

**Cohort analysis.** Group users by acquisition period or behavior, then track retention/revenue over time. Cohorts reveal whether changes actually improved things or just coincided with growth.

**CAC and LTV.** Customer Acquisition Cost = marketing+sales spend ÷ new customers. Lifetime Value = average revenue per customer × gross margin × lifespan. Healthy businesses keep LTV:CAC above 3:1. Track both by channel — blended averages hide disasters.

**Incrementality.** The gold standard: would these conversions have happened anyway? Geo-tests, holdout groups, and pre/post analyses separate real lift from correlation.


**Marketing mix modeling (MMM).** Statistical analysis of how spend across channels drives revenue, using historical data. Strengths: captures offline and brand effects, works without user-level tracking. Weaknesses: needs 2+ years of data, slow to reflect changes. Use MMM for strategic budget splits, multi-touch attribution for tactical optimization.

**Self-reported attribution.** Adding how-did-you-hear-about-us to signup or demo forms. Crude but captures the dark funnel (podcasts, word-of-mouth, communities) that tracking misses. Treat as directional; triangulate with other data.

**Incrementality testing.** Geo-holdouts, PSA-based control groups, and pre/post with synthetic controls measure true causal lift.
Last-click attribution over-credits bottom-funnel and starves top-funnel — incrementality tests reveal what actually drives new revenue.
Run 2–4 incrementality tests yearly on your biggest spend areas; the results reshape budgets.
**Cohort analysis.** Group by acquisition period, channel, or campaign — then track retention, revenue, and payback over time.
Cohorts reveal quality differences that aggregate metrics hide: channel A drives volume, channel B drives value.
Always cohort before concluding; aggregates lie.
**Data infrastructure.** Tracking plan (events, properties, naming conventions) → warehouse (single source of truth) → transformation (dbt-style models) → BI layer (dashboards) → governance (definitions, access, quality checks).
Analysts without infrastructure spend 80% of time cleaning data — invest in plumbing.
## Practical workflow

1. **Define the question.** "Which channels should get more budget?" beats "analyze marketing data." Write the decision the analysis must inform.
2. **Audit the data.** Check tracking: UTMs consistent? Events firing? CRM stages defined the same way by everyone? Fix instrumentation before analyzing.
3. **Build the funnel view.** Stage-to-stage conversion rates, overall and by channel/campaign. Identify the biggest leaks.
4. **Run the core analyses.** Channel CAC vs. LTV, cohort retention curves, campaign ROI with appropriate attribution, trend analysis (is performance improving or degrading?).
5. **Find the story.** Data doesn't speak; analysts do. Lead with the insight ("Paid search CAC rose 40% while lead quality fell — driven by broad-match expansion"), then evidence, then recommendation.
6. **Recommend and follow up.** Every analysis ends with: what to do, expected impact, how we'll know it worked. Revisit after the change ships.

**Dashboard essentials:** KPI tiles (leads, CAC, LTV:CAC, pipeline, revenue), trend lines (not just snapshots), funnel visualization, channel comparison table, cohort retention heatmap. One screen, updated automatically, reviewed weekly.


**Anomaly investigation protocol:** 1) verify data (tracking broken?), 2) check external factors (seasonality, holidays, competitor moves), 3) segment (which channel, campaign, or audience changed?), 4) form hypothesis, 5) validate with a second data source before recommending action.

**Dashboard design:** audience first (execs need 5 numbers; managers need diagnostics) → hierarchy (KPI → trends → breakdowns) → annotations (mark campaigns, launches, anomalies) → alerts (not just dashboards — push the insights).
Dashboards nobody opens are decoration. Distribute insights; do not just publish dashboards.
**Analysis communication:** headline finding → supporting evidence (2–3 charts max) → limitations → recommendation → next steps.
Analysts who recommend get invited back; analysts who only describe get automated.
## Common pitfalls

- **Analysis without a question.** Exploring data aimlessly produces interesting-but-useless findings. Start from a decision.
- **Last-touch worship.** Crediting only the final click undervalues awareness channels and misallocates budget.
- **Vanity metrics.** Impressions and clicks without cost and conversion context mislead. Always pair with efficiency metrics.
- **Ignoring data quality.** Garbage in, garbage out. Broken tracking invalidates every conclusion — verify first.
- **Correlation as causation.** "Leads rose after the rebrand" isn't proof. Use holdouts and controls where stakes are high.
- **Reporting without recommendations.** A dashboard nobody acts on is decoration. Every report should drive a decision.
- **Blended averages.** Overall CAC looks fine while one channel burns money. Always segment.
- **Reporting without context.** Leads up 20% without noting the campaign that caused it or whether quality held. Every metric needs its story.
- **Ignoring lag.** B2B conversions lag spend by weeks or months. Judging recent spend on incomplete conversion windows misleads.
- **Correlation as causation.** "Email openers buy more" — or buyers open more email? Design tests for causality before recommending spend shifts.
- **Analysis paralysis.** Perfecting models while decisions wait. Timebox analysis; deliver directional answers fast, refine later.
