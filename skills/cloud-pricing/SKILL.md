---
name: cloud-pricing
description: Understanding and optimizing cloud/PaaS pricing — cost models, common traps, and FinOps habits — vendor-neutral.
category: railway
---

## Overview

Cloud pricing is designed to be easy to start and hard to predict: per-
second compute, metered egress, per-seat add-ons, and tier cliffs. This skill
covers reading pricing like an engineer — modeling costs before building,
spotting the expensive patterns, and building FinOps habits that keep bills
proportional to value.

## When to use

- Estimating costs before choosing architecture or providers
- Investigating a surprising cloud bill
- Comparing PaaS plans and managed-service tiers
- Setting up budgets, alerts, and cost attribution (tagging)
- Cutting spend without cutting reliability

## Core concepts

**Model before you build.** Every architecture choice has a price tag:
always-on instances vs scale-to-zero, managed DB tiers, egress per GB,
per-million-request pricing. A back-of-envelope model (traffic × unit costs
+ fixed tiers) before committing prevents the "it costs 10x what we
expected" conversation.

**The big three cost drivers.** Compute (instances, containers, functions —
usually the largest line), data transfer/egress (the sneakiest — pennies per
GB that compound), and managed services/storage (per-GB-month adds up with
retention). Everything else is rounding until these are understood.

**Egress is the classic trap.** Data leaving the cloud costs 5–10x more than
engineers expect. Patterns that bleed: serving media from app servers,
cross-region replication chatter, un-cached API responses to heavy clients.
Fixes: CDNs, regional placement, compression, and caching — in that order of
leverage.

**Scale-to-zero vs always-on.** Idle capacity is pure waste; cold starts are
latency cost. Match the model to the workload: spiky/internal tools →
scale-to-zero; user-facing latency-sensitive → small always-on base + burst.
Measure actual utilization before deciding — most services are over-
provisioned.

**FinOps habits.** Tag/attribute spend by team/service/environment; set
budget alerts at 50/80/100% of expected; review the bill monthly like a
code review (what changed? why?); give teams visibility into their own
spend — accountability follows measurement.

## Practical workflow

1. **Instrument cost attribution:** tags/labels per service and environment
   from day one; without attribution, optimization is guesswork.
2. **Set alerts early:** budget alerts and anomaly detection before the
   first surprise bill, not after.
3. **Audit the top 10 line items** monthly: for each, ask "is this
   proportional to the value it delivers?" — attack the largest
   disproportional items first.
4. **Right-size compute:** compare provisioned vs utilized (CPU/memory
   p95); downsize or autoscale the gap; use spot/preemptible or committed
   discounts where the workload allows.
5. **Attack egress deliberately:** CDN in front of static/heavy content,
   keep traffic in-region, compress responses, cache aggressively.
6. **Hunt waste quarterly:** unattached volumes, old snapshots, idle
   instances, forgotten preview environments, oversized dev databases —
   the "zombie inventory" review.

## Common pitfalls

- **No budget alerts** — discovering spend from the invoice instead of a
  warning at 80%.
- **Untagged resources** — a $5k bill with no idea which team spent it;
  attribution is prerequisite to accountability.
- **Preview environments left running** — each PR's ephemeral env costs
  money until destroyed; auto-cleanup is mandatory.
- **Over-provisioned databases** — production-sized DBs for staging, or
  tiers chosen for imagined scale; match tier to measured working set.
- **Log/metric retention without a policy** — observability bills grow
  silently; set retention deliberately and sample aggressively.
- **Optimizing prematurely** — spending a week to save $20/month;
  optimize where the money actually is (top line items first).
