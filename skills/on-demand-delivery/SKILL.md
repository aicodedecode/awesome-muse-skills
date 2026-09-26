---
name: on-demand-delivery
description: Design on-demand delivery operations — dispatch, courier management, ETAs, batching, and last-mile economics.
category: doordash
---

## Overview

On-demand delivery promises speed: food, groceries, or parcels arriving in under an hour. This skill covers the operational system behind that promise — dispatch algorithms, courier supply management, batching, ETA prediction, and the unit economics that determine whether the model works. Written as general delivery-logistics guidance, not tied to any single platform.


On-demand delivery is a three-sided marketplace problem: consumers want speed and reliability, merchants want profitable incremental orders, and couriers want worthwhile earnings. Every design decision trades off between these sides. The skill is in building logistics systems — batching, dispatch, pricing, and ETAs — that keep all three sides healthy simultaneously.
## When to use

- Designing a delivery operation from scratch
- Improving on-time rates or ETAs
- Managing courier supply vs. demand
- Reducing per-delivery costs
- Expanding to new zones or cities
- Diagnosing unprofitable delivery economics

- Launching delivery for a restaurant, grocery, or retail operation
- Choosing between building in-house logistics and using a third-party fleet
- Diagnosing late deliveries or low courier acceptance rates
- Designing surge pricing for peak demand
- Expanding from food to grocery or retail delivery
- Building courier incentive programs
## Core concepts

**The marketplace balance.** Supply (couriers online) vs. demand (orders). Too few couriers → long waits, cancellations. Too many → low courier earnings, churn. Manage with: incentives (surge pay in hotspots), scheduling, and demand shaping (delivery fees, time slots).

**Dispatch.** Assigning orders to couriers: proximity, direction of travel, batching compatibility, courier rating/capacity. Good dispatch minimizes deadhead miles (empty travel) and maximizes deliveries per hour — the core efficiency metric.

**Batching.** Combining multiple orders into one trip (stacked orders). Increases courier earnings per hour and reduces cost per delivery, but risks late deliveries if overdone. Batch by: pickup proximity, drop-off route alignment, and prep-time compatibility.

**ETA prediction.** Inputs: prep time (merchant-reported + historical), travel time (traffic-aware), batching effects, courier behavior. Accurate ETAs reduce support contacts and cancellers; systematically optimistic ETAs do the opposite. Measure prediction error and calibrate.

**Delivery zones.** Geofenced areas balancing density (enough orders per courier hour) with coverage (customer expectations). Expand zones based on data: order density heatmaps, not gut feel.

**Unit economics.** Per-delivery: customer fee + merchant commission share − courier payout − support/overhead. Contribution margin per delivery × deliveries per hour = the equation. Know your numbers by zone and daypart.


**The delivery promise triangle.** Speed, reliability, and cost — pick the trade-off deliberately per order type. Hot food demands speed; scheduled grocery tolerates slower batching. Making one promise for all order types guarantees broken promises somewhere. Segment SLAs by what the customer actually values per category.

**Batching and stacking.** Combining multiple orders per courier trip is the core unit-economics lever: double-batching can cut per-order delivery cost 30–40%. But batching adds delay for the first order — model the trade-off explicitly and set max-batch rules per food type (never batch ice cream with a 20-minute detour).

**Dynamic pay and incentives.** Courier supply follows earnings: base pay + per-order + tips + surge/quest bonuses. Design pay so that undesirable deliveries (long distance, bad weather, low-tip areas) still get accepted — or those orders fail and customers churn. Transparency in pay breakdowns builds courier trust and retention.

**Surge pricing design.** Multipliers by zone and time based on supply-demand imbalance; transparent to customers ("busy area" indicators) and couriers (heat maps with earnings).
Surge balances the marketplace — without it, peak demand goes unfulfilled and everyone churns.
Cap surge to avoid gouging perceptions; communicate the why.
**Courier retention.** Earnings consistency matters more than peak earnings — predictable $20/hr beats volatile $25/hr average.
Retention levers: quest bonuses, tier programs, instant payouts, transparent pay breakdowns, and respectful support.
Courier churn is the hidden tax on growth — measure and manage it like customer churn.
**Demand shaping.** Promote off-peak ordering (discounts, loyalty bonuses), prep-time staggering for merchants, and delivery-window options.
Shifting 10% of peak demand to shoulders can eliminate surge entirely — cheaper than adding supply.
## Practical workflow

1. **Define the promise.** Delivery time target, coverage area, fee structure. The promise shapes every operational decision — be realistic.
2. **Model the economics.** Courier payout structure (base + distance + incentives), expected deliveries per hour by zone, customer fees, commission rates. Find the contribution margin; identify which zones/dayparts lose money.
3. **Build dispatch logic.** Start simple: nearest-available with batching rules. Add sophistication as volume grows: predictive positioning (stage couriers where demand will be), batch optimization, priority handling for delayed orders.
4. **Manage supply.** Onboarding pipeline, activation incentives, scheduling tools, surge/heatmaps to redistribute supply, retention (earnings transparency, fair dispatch, support quality).
5. **Instrument everything.** Real-time dashboards: orders, courier supply, ETAs vs. actuals, on-time rate, cancellations, courier earnings/hour, contribution margin. Alert on imbalances.
6. **Optimize continuously.** Weekly reviews: zone performance, batching efficiency, ETA accuracy, courier churn drivers. Test: payout structures, batching rules, fee changes — one variable at a time.

**Key metrics:** on-time delivery rate, average delivery time, courier deliveries/hour, courier earnings/hour, cost per delivery, contribution margin per delivery, cancellation rate, customer reorder rate.


**Launch playbook (new zone):** 1) define the delivery polygon (start small, expand with density), 2) recruit courier supply ahead of demand (guaranteed hourly minimums initially), 3) seed merchant supply in high-demand categories, 4) set conservative ETAs at launch (under-promise, over-deliver), 5) monitor acceptance rate, on-time rate, and courier earnings hourly in week one, 6) expand polygon only when unit economics hold.

**Late-delivery triage:** identify the stage (merchant prep, dispatch wait, courier en route) via timestamps → merchant prep issues need prep-time calibration and tablet alerts; dispatch issues need supply rebalancing or batching rule changes; en-route issues need better routing or realistic ETAs. Fix the stage, not the symptom.

**Peak readiness playbook:** forecast demand (historical + events + weather) → pre-position courier incentives → alert merchants to staff up → extend ETAs proactively → monitor in real-time → post-peak retrospective.
Start planning 2 weeks before known peaks; the playbook runs itself after 2–3 cycles.
**Quality monitoring:** on-time rate → order accuracy → food condition (packaging audits) → customer ratings → courier ratings.
Sample orders monthly for quality audits — metrics tell you what, audits tell you why.
## Common pitfalls

- **Overpromising speed.** 30-minute guarantees that fail 20% of the time destroy trust. Promise what you deliver 95%+ of the time.
- **Ignoring courier economics.** Underpaid couriers churn; churn collapses supply. Sustainable courier earnings are existential.
- **Over-batching.** Stacking too many orders tanks on-time rates. Cap batches by time-window math, not hope.
- **Static zones.** Never adjusting zones as demand patterns shift. Review zone performance monthly.
- **Optimistic ETAs.** Systematic underestimation reduces cancellations short-term, destroys trust long-term. Calibrate to reality.
- **Neglecting prep time.** Merchant prep variance is often the biggest ETA driver. Measure it, share data with merchants, build it into predictions.
- **Scaling before unit economics work.** Expanding zones while losing money per delivery. Fix the equation first.
- **Over-promising ETAs.** Aggressive estimates win the order and lose the customer. Accuracy beats speed — customers forgive 35 minutes quoted honestly, not 25 quoted and 40 delivered.
- **Ignoring courier economics.** If couriers cannot earn target hourly rates, supply evaporates at peak. Model courier earnings as carefully as customer pricing.
- **One-size batching rules.** Same stacking logic for pizza and groceries. Per-category rules protect food quality and customer satisfaction.
- **Growth without density.** Expanding zones before achieving density. Thin zones mean long drives, low courier earnings, and bad unit economics — density first, then expansion.
- **Ignoring merchant capacity.** Driving demand merchants cannot fulfill. Throttled ordering during peaks protects everyone — an unavailable merchant is better than a failed order.
