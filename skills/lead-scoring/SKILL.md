---
name: lead-scoring
description: Build lead scoring models — fit and behavior criteria, thresholds, decay, and sales-ready handoff processes.
category: business-marketing
---

## Overview

Lead scoring ranks prospects by likelihood to buy, so sales focuses on the best opportunities and marketing nurtures the rest. This skill covers designing scoring models (demographic/fit + behavioral/engagement), setting thresholds with sales, implementing score decay, and maintaining the model as you learn.

Scoring is a hypothesis about buying intent — validate it against actual closed deals, and keep refining.


Lead scoring translates "this feels like a good lead" into a number everyone trusts. It aligns marketing and sales on what qualifies, routes the right leads fast, and keeps sales focused on conversations most likely to close. A good model is simple, transparent, and continuously refined — complexity is the enemy of adoption.
## When to use

- Building a lead scoring model from scratch
- Fixing scoring that sales ignores
- Reducing unqualified handoffs to sales
- Prioritizing follow-up across large lead volumes
- Aligning marketing and sales on "qualified"
- Auditing an existing model's accuracy

- Sales complaining about lead quality
- Deciding which leads get immediate follow-up vs. nurture
- Prioritizing target accounts for outbound
- Implementing predictive scoring with ML
- Scoring for partner-sourced leads
- Aligning scoring across multiple business units
## Core concepts

**Fit vs. behavior.** Fit (who they are: title, company size, industry, geography — demographic/firmographic) measures can-they-buy; behavior (what they do: pages visited, content downloaded, emails engaged, trial activity) measures will-they-buy. Score both; a perfect-fit lead with zero engagement isn't ready, and a highly engaged student isn't a buyer.

**Explicit vs. implicit.** Explicit data (form fills: title, company size, budget) is stated; implicit (behavioral tracking) is observed. Combine both, and validate explicit data quality — people lie on forms.

**Thresholds.** MQL threshold (score triggering sales handoff), SQL criteria, and recycling rules (when sales returns unready leads to nurture). Set thresholds from historical data: what scores did closed-won deals have? Start there, adjust quarterly.

**Score decay.** Engagement fades — decay scores over inactivity (e.g., -10 points after 30 days dormant). Without decay, every old lead eventually looks hot. Also cap scores so one action can't single-handedly trigger MQL.

**Negative scoring.** Subtract for disqualifiers: competitor domains, students, unsubscribed, job seekers, bad-fit industries. Negative scoring is as important as positive.

**Model validation.** The only test that matters: do high-scored leads close at higher rates? Track MQL→SQL→opportunity→won conversion by score band. If top-scored leads don't outperform, the model is wrong.


**Explicit vs. implicit signals.** Explicit = who they are (title, company size, industry, budget authority) — fit. Implicit = what they do (pricing page visits, trial activation, content downloads, email engagement) — intent. Both matter: perfect fit with no intent is a nurture candidate; high intent with poor fit wastes sales time. Score them separately before combining.

**Score decay.** Engagement scores rot: a pricing-page visit from 6 months ago means nothing today. Apply time decay (e.g., behavioral points halve every 30–90 days) so scores reflect current intent. Without decay, scores inflate and sales stops trusting them.

**Negative scoring.** Subtract points for disqualifiers: competitor email domains, student addresses, unsubscribes, job seekers, existing customers in the wrong funnel.
Negative scoring keeps sales focused — a lead that looks hot but is a student wastes everyone's time.
Review negative criteria quarterly; markets and ICPs evolve.
**Fit + intent matrix.** High fit + high intent = route to sales immediately. High fit + low intent = nurture. Low fit + high intent = verify (maybe new persona). Low fit + low intent = suppress.
The matrix beats single-number scores for routing decisions — it tells you what to do, not just how hot.
**Predictive vs. rules-based.** Rules-based: transparent, fast to build, good enough for most. Predictive (ML): finds non-obvious patterns, needs 1,000+ historical conversions, opaque to sales.
Start rules-based; graduate to predictive when you have the data volume and the rules plateau.
## Practical workflow

1. **Analyze history.** Pull closed-won and closed-lost deals: what fit attributes and behaviors distinguished winners? This grounds the model in reality, not opinion.
2. **Define criteria with sales.** Workshop: ideal customer profile attributes, buying signals they've observed, disqualifiers. Sales must co-own the model or they'll ignore it.
3. **Build the model.** Assign points: fit attributes (title +15, target industry +10...), behaviors (pricing page +15, demo request +25 — auto-MQL, email click +3...), negatives (competitor -50, unsubscribe -100). Set MQL threshold from historical analysis.
4. **Implement routing.** Score changes trigger: MQL alert to owner + SLA timer, task creation, nurture enrollment for sub-threshold, recycling workflow for sales-rejected leads with reasons captured.
5. **Launch and monitor.** Weekly for the first month: MQL volume, sales acceptance rate, feedback themes. Target: 70%+ sales acceptance. Below that, the threshold or criteria are wrong.
6. **Refine quarterly.** Re-run the closed-won analysis. Adjust points, add new signals (product usage for PLG), remove dead signals. Scoring models decay as markets and products change.

**Starter point values (calibrate to your data):** target title +15, target industry +10, target company size +10, pricing page visit +15, case study download +10, webinar attendance +10, email click +3, demo/trial request = auto-MQL, competitor email -50, unsubscribe = auto-disqualify.


**Model building (start simple):** 1) interview sales on what closed-won leads had in common (3–5 fit attributes), 2) analyze behavioral differences between converted and non-converted leads, 3) assign points (fit: 0–50, behavior: 0–50), 4) set MQL threshold where conversion probability justifies sales effort, 5) pilot for 30 days, 6) review weekly with sales and recalibrate. Complexity comes later — start with a model sales understands.

**Threshold calibration:** too low → sales drowns in weak leads and stops following up; too high → good leads rot in nurture. Find the threshold where sales accepts 70%+ of MQLs and converts them at target rates, then hold it.

**Sales feedback loop:** weekly review of 10 MQLs with sales (good? bad? why?) → monthly scoring committee (marketing + sales ops + sales leaders) → quarterly model recalibration against closed-won data.
The loop matters more than the model — scoring without feedback rots within quarters.
**Implementation checklist:** define MQL in writing → build scoring fields → set up decay → configure routing and SLAs → train sales on what scores mean → pilot 30 days → review and adjust → document everything.
Skipping sales training is the classic failure — scores nobody understands get ignored.
## Common pitfalls

- **Sales doesn't trust it.** Built without sales input, handed over as a surprise. Co-design or fail.
- **Behavior-only scoring.** Highly engaged bad-fit leads flooding sales. Fit gates behavior.
- **No decay.** Ancient leads looking hot. Decay inactivity aggressively.
- **Threshold guesswork.** Setting MQL at "100" because it's round. Derive from actual won-deal scores.
- **Ignoring negatives.** Scoring students and competitors as MQLs. Negative scoring first, positive second.
- **Set and forget.** Markets shift, products change, models rot. Quarterly recalibration.
- **Over-engineering.** 200 criteria nobody understands. Start simple (10–15 signals), add complexity only when validated.
- **Black-box models.** Scores nobody understands or trusts. Transparency beats sophistication — sales must believe the number.
- **Never recalibrating.** Markets shift, products change, buyer behavior evolves. Review the model quarterly against actual outcomes.
- **Scoring without capacity planning.** Generating more MQLs than sales can follow up. Score volume must match sales capacity or speed-to-lead collapses.
- **Score inflation.** Points accumulating forever without decay. Old engagement is not intent — decay aggressively.
- **Marketing-owned in isolation.** Scoring built without sales input. Sales must co-own the model or they will route around it.
