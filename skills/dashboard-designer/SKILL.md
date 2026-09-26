---
name: dashboard-designer
description: Design clear, actionable dashboards with KPI hierarchy, data visualization best practices, and layout patterns.
category: creative-design
---

## Overview

Dashboards fail in two directions: data vomit (everything, understood by no one)
or data decoration
(pretty charts, zero decisions). A great dashboard answers specific questions
for specific people
and drives action. This skill covers dashboard UX: defining the questions,
structuring KPI
hierarchy, choosing visualizations, and designing for scanability and action.

## When to use

- Designing analytics dashboards, admin panels, or reporting interfaces

- Improving an existing dashboard nobody uses

- Choosing KPIs and metrics for a product or business view

- Designing data-dense interfaces for operators or executives

- Planning dashboard personalization or alerting

## Core concepts

- - - **Question-first design.** Every dashboard starts with: who uses it, what
  decisions do they
  make, what questions must it answer in under 30 seconds? A dashboard without
defined questions is
  a junk drawer.
- - - **KPI hierarchy.** 3-5 headline KPIs (the numbers that matter most),
  supporting trends, then
  diagnostic detail. The inverted pyramid: summary first, drill-down on demand.
Nobody should scroll
  to find the headline.
- - - **Actionability test.** For every widget ask: "if this number moves, does
  the user know what to
  do?" If not, it's decoration — cut it or add the context that makes it
actionable (targets,
  thresholds, comparisons).
- - - **Comparison is comprehension.** Numbers need context: vs last period, vs
  target, vs benchmark.
  A lone number ("4,203") means nothing; "4,203 (↑12% vs target 3,800)" means
something.
- - - **Right visualization, minimal ink.** Line for trends, bar for
  comparisons, sparklines for
  compact trends, tables for precise values. Remove gridlines, 3D, and
decoration — maximize
  data-ink ratio.
- - - **Progressive detail.** Overview → filtered view → row-level detail. Don't
  cram the atomic data
  into the overview; provide drill paths. Dashboards are maps, not territories.

## Practical workflow

1. 1. 1. **Interview the users.** What decisions do they make weekly? What do
   they check first? What
   surprises them? What do they export to spreadsheets (that's the dashboard
failing)?
2. 2. 2. **Define the question set.** 5-10 specific questions the dashboard must
   answer. Prioritize:
   the 3 that get asked daily go above the fold.
3. 3. 3. **Select KPIs ruthlessly.** For each candidate metric: is it
   actionable, is it trusted (data
   quality!), does someone own it? Aim for 3-5 headline KPIs; everything else is
supporting.
4. 4. 4. **Sketch the layout.** KPI band on top (big numbers with deltas), trend
   visualizations middle,
   detailed tables/breakdowns below. Group by question, not by data source.
5. 5. 5. **Design visualizations.** Choose chart types by message, apply
   consistent scales (never
   truncate axes to exaggerate), use color sparingly (highlight the signal, gray
the context), add
   targets and thresholds.
6. 6. 6. **Add interactivity deliberately.** Filters (date range, segment),
   drill-downs, and hover
   details — but keep the default view answering the top questions with zero
interaction. Most users
   never touch filters.
7. 7. 7. **Validate with real data.** Test with production-scale data (not 5
   perfect rows): long
   labels, missing values, outliers, timezone issues. Then usability-test: can
users answer the 5
   questions in under a minute?

## Common pitfalls

- - - **The executive Christmas tree.** 40 widgets because every stakeholder
  wanted "their number."
  Dashboards serve decisions, not egos — curate or create separate views.
- - - **Vanity metrics.** Totals that only go up (total users ever) instead of
  actionable rates
  (weekly active, conversion). If it can't go down, it can't inform.
- - - **No targets or context.** Numbers floating without comparison. Always
  show: vs previous period,
  vs target, or vs benchmark — preferably all three where relevant.
- - - **Chart junk.** 3D pies, gauge charts, excessive color. Every non-data
  pixel is a tax on
  comprehension.
- - - **Stale or untrusted data.** A dashboard with wrong data is worse than
  none — it destroys trust
  permanently. Show data freshness timestamps; fix quality before adding
widgets.
- - - **One dashboard for everyone.** Executives, operators, and analysts need
  different views. A
  single dashboard serving all three serves none. Build role-specific views on
shared components.
