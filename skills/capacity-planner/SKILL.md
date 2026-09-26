---
name: capacity-planner
description: Capacity planning — forecasting demand, sizing infrastructure, and avoiding both outages and waste — use when scaling systems.
category: operations
---

## Overview

Capacity planning answers "how much infrastructure do we need, and when?"
with data instead of vibes. Done well, it prevents both the outage (too
little) and the cloud bill shock (too much). This skill covers forecasting
demand, modeling headroom, and building a planning cadence that keeps up
with growth.

## When to use

- Forecasting traffic growth and infrastructure needs
- Sizing databases, caches, queues, and compute for peak load
- Planning for seasonal events (sales, launches, holidays)
- Right-sizing cloud spend without risking reliability
- Building a quarterly capacity review process

## Core concepts

**Plan for peaks, pay for averages.** Size for realistic peak (p95–p99 of
demand, plus event spikes), not the average — averages don't page you at
midnight. But don't provision peak statically year-round: autoscaling,
scheduled scaling, and tiered capacity (base + burst) bridge the gap.

**Headroom is a policy, not a feeling.** Define target utilization per
resource (e.g. "keep peak CPU under 60%, disk under 70%") — the buffer that
absorbs spikes, deploy surges, and failover (one zone down means the rest
take its load). When utilization crosses the threshold, that's a trigger to
act, not a debate topic.

**Know your scaling unit and bottleneck.** Every system has a limiting
resource that saturates first (often connections, disk IOPS, or memory —
rarely raw CPU). Load-test to find it, express capacity in business terms
("one DB primary handles ~8k orders/min"), and scale the bottleneck, not
everything.

**Forecast with history + events.** Extrapolate from growth trends (with
seasonality), then layer known events: launches, marketing campaigns,
migrations. Keep the forecast model simple and versioned — a spreadsheet
with assumptions beats a black box.

**Lead times are real.** Provisioning isn't instant: hardware procurement,
quota increases, data migration, and DNS propagation all take time. Plan
backwards from the need date with the true lead time, including approvals.

## Practical workflow

1. **Instrument utilization** per critical resource (CPU, memory, disk,
   connections, queue depth, IOPS) with history — you can't plan what you
   don't measure.
2. **Find the bottleneck** via load testing: ramp traffic until something
   saturates; record the max sustainable throughput per scaling unit.
3. **Build the forecast:** historical trend + seasonality + known events =
   projected peak demand per quarter; translate into scaling units needed.
4. **Set headroom policies** per resource and automate alerts at the
   thresholds (warn at 70% of headroom policy, act at 90%).
5. **Plan events explicitly:** for big launches/sales, do a dedicated
   capacity review — projected load vs current headroom, pre-scaling actions,
   rollback plan, and game-day load test.
6. **Review quarterly:** forecast vs actual (improve the model), utilization
   trends (right-size waste), and upcoming demand changes; keep it a short,
   data-driven meeting, not a ritual.

## Common pitfalls

- **Planning for average load** — the p99 evening spike is what takes you
  down, not the 3am average.
- **Forgetting failover math** — N+1 redundancy means each unit runs at
  N/(N+1) utilization normally; losing one must not saturate the rest.
- **Scaling everything equally** — doubling all resources when only the
  database is the bottleneck wastes money; find and fix the constraint.
- **Ignoring stateful scaling** — stateless app servers scale in minutes;
  databases, caches (warm-up), and sharded stores scale in hours to days;
  plan accordingly.
- **No decommissioning** — capacity only grows; old instances, unused
  volumes, and forgotten replicas accumulate silently. Review for waste as
  seriously as for shortage.
- **Surprise events** — marketing launches a campaign without telling
  engineering; build the habit of a shared launch calendar with lead time.
