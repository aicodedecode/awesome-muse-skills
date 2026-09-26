---
name: product-analytics-guide
description: Implement product analytics — event tracking, funnels, retention, experimentation, and data-informed decisions.
category: curviate
---

## Overview

Product analytics measures what users actually do: which features they use, where they drop off, what retains them, and which changes move metrics. This skill covers the practice — event taxonomy, instrumentation, funnel and retention analysis, experimentation, and building a data-informed product culture. Tool-neutral.


Product analytics turns user behavior data into decisions: what to build, what to fix, and what to kill.
This skill covers event tracking design, funnel and retention analysis, experimentation, and the cultural practices that make data actually influence roadmaps.
## When to use

- Designing event tracking taxonomies
- Analyzing funnels and drop-offs
- Measuring feature adoption
- Running product experiments
- Building product dashboards
- Creating a metrics framework

- Designing event tracking taxonomies
- Analyzing feature adoption and retention
- Running A/B tests on product changes
- Building product dashboards for teams
## Core concepts

**Event taxonomy.** Consistent naming (object_action: signup_completed, project_created), properties (who, what, context), and identity (anonymous → identified user stitching). Design the taxonomy upfront — retrofitting consistency is brutal. Document in a tracking plan; review every new event against it.

**North Star Metric.** One metric capturing core value delivered (tasks completed, messages sent, reports generated). Everything ladders up: input metrics (activation, engagement, retention) drive the North Star. Get executive agreement — misalignment wastes quarters.

**Funnels.** Step-by-step conversion (signup → setup → first value → habitual use). Analyze: overall conversion, step-to-step drops, time between steps, and segment differences (by source, plan, cohort). The biggest relative drop is the priority.

**Retention.** Cohort retention curves (day 1/7/30), retention by action (which behaviors predict staying?), and power-user analysis. Healthy products flatten; decaying curves signal missing value. Segment ruthlessly — averages hide everything.

**Experimentation.** Hypothesis → variant → randomization → primary metric + guardrails → sufficient runtime → honest analysis. Product experiments need the same discipline as marketing tests: no peeking, adequate sample, pre-registered success criteria.

**Qualitative + quantitative.** Analytics shows what; user research shows why. Pair funnel drops with session replays/surveys, and validate metric movements with user interviews. Data-informed, not data-blinded.


**Event taxonomy.** Consistent naming (object_action: signup_completed), properties (who, what, context), and lifecycle coverage (acquisition → activation → engagement → monetization → referral).
Design taxonomy before instrumenting — retrofitting consistency is painful.
Document in a tracking plan; review quarterly as the product evolves.
**Funnel analysis.** Step-by-step conversion with drop-off quantification and segment comparison.
Funnels answer "where do users drop?" — pair with qualitative research for "why."
Build funnels for every critical flow; review weekly.
**Retention curves.** Cohort retention over time (day 1, 7, 30) segmented by acquisition source, behavior, and plan.
Flattening curves indicate product-market fit; declining curves indicate leaks.
Retention is the ultimate product metric — optimize everything toward it.
**North star metrics.** One metric capturing core value delivery (e.g., messages sent, projects completed).
Inputs (leading indicators) feed the north star; teams own inputs, not the star itself.
Revisit annually — north stars should evolve with strategy.
## Practical workflow

1. **Define metrics.** North Star + input metrics + per-team KPIs. Document definitions (what exactly counts as "active"?) — metric ambiguity causes endless debates.
2. **Design taxonomy.** Events for: acquisition, activation, engagement (core actions), retention signals, monetization, and referral. Properties for segmentation. Write the tracking plan.
3. **Instrument.** Implement per the plan, validate with debug tools (every event fires correctly with right properties), and backfill identities where possible. QA is non-negotiable — bad data poisons every analysis.
4. **Build dashboards.** Team dashboards (their KPIs, updated automatically), funnel views, retention curves, and experiment results. One source of truth; self-serve for product teams.
5. **Analyze routinely.** Weekly metrics review (what moved, why?), monthly deep dives (funnels, cohorts, segments), and quarterly metric health checks (are we measuring the right things?).
6. **Experiment.** Backlog of hypotheses, prioritized by expected impact, run with discipline, and bank learnings win or lose. Feed results into the roadmap.

**Tracking plan template:** event name → trigger (when it fires) → properties → identity → owner → status (planned/live/verified). Review before any release adds events.


**Analysis workflow:** define the question → form hypotheses → pull data (funnels, cohorts, segments) → validate with qualitative (session replays, user interviews) → recommend action → measure impact.
Data without decisions is trivia — every analysis ends with a recommendation.
**Experimentation program:** hypothesis → design (variant, audience, duration) → pre-register success criteria → run → analyze (including segments) → document learning → ship or kill.
Velocity matters: 10+ experiments per quarter for growth-stage products.
Build a learning repository — failed experiments teach as much as winners.
**Dashboard hierarchy:** company (north star + key inputs) → team (their metrics) → deep-dive (ad hoc analysis).
Dashboards answer recurring questions; analysis answers novel ones.
Review dashboard usage — unused dashboards get archived.
## Common pitfalls

- **Tracking everything.** 500 events, no taxonomy. Track what maps to decisions; prune the rest.
- **No definitions.** "Active user" means 5 different things. Define once, enforce everywhere.
- **Vanity metrics.** Celebrating signups while activation flatlines. Metrics must tie to value.
- **Averages.** Blended retention hiding that one segment churns entirely. Segment always.
- **Peeking at experiments.** Calling tests early. Discipline: pre-registered criteria, full runtime.
- **Data without why.** Shipping metric-driven changes without understanding users. Pair with qualitative research.
- **Instrumentation debt.** Events firing wrong for months. Validate continuously; audit quarterly.
- **Vanity metrics.** Tracking signups while retention collapses. Measure value delivery, not activity theater.
- **Analysis without action.** Insights that never change roadmaps. Tie every analysis to a decision owner and deadline.
- **Dirty data.** Inconsistent events, missing properties, bot traffic. Data quality is infrastructure — invest before scaling analysis.
- **HiPPO overrides.** Ignoring data for executive opinions. Build a culture where data informs and debates are evidence-based.
