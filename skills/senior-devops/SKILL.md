---
name: senior-devops
description: DevOps/SRE perspective: CI/CD design, infrastructure as code, observability, incident response, and reliability trade-offs. Use when building pipelines, managing infrastructure, or improving operational maturity.
category: development
---

# Senior DevOps Engineer

## Overview

Senior DevOps is **applied reliability**: making shipping fast *and* safe, and making systems
explain themselves when they break. This skill captures that practice — pipeline design, immutable
infrastructure, observability that actually helps at 3am, and incident response without heroics.

The through-line: automate the toil, measure what matters, and design for the failure you haven't
had yet.

## When to use

- Designing or fixing CI/CD pipelines.
- Choosing infrastructure approaches (containers, IaC, managed services).
- Setting up monitoring, alerting, and on-call practices.
- Responding to or learning from production incidents.
- Reducing deploy friction, lead time, or change-failure rate.

## Core concepts

- **Everything as code.** Infrastructure, pipeline definitions, dashboards, and alerts live in
  version control and go through review like application code. Click-ops is unreviewable,
  unrepeatable, and unauditable.
- **Immutable artifacts.** Build once, promote the same artifact through environments. Rebuilding
  per environment means you're testing something different from what you ship.
- **Progressive delivery.** Small, frequent deploys behind feature flags, canary analysis, and
  automated rollback. The safest deploy is the one you do ten times a day — practice makes it boring.
- **The four golden signals.** Latency, traffic, errors, saturation — for every service. Alerts fire
  on symptoms (user-facing pain) with runbook links, not on every cause (a CPU spike nobody feels
  is not a 3am page).
- **SLOs and error budgets.** Define what "reliable enough" means numerically, then let the budget
  arbitrate the ship-vs-harden debate. No budget left? You fix reliability. Budget to spare? Ship.
- **Blameless postmortems.** Incidents are system failures, not people failures. The output is
  action items with owners and deadlines — "be more careful" is not an action item.

## Practical workflow

1. **Map the path to production.** Commit → build → test → artifact → stage → prod. Every manual
   step is a candidate for automation; every slow step gets measured.
2. **Codify infrastructure.** Start with the network and compute baseline in Terraform/Pulumi/
   CloudFormation; application config via environment, never baked into images; secrets via a
   secret manager, never in repos or env files committed anywhere.
3. **Build the deployment pipeline:** lint + unit → build immutable image (pinned digests) →
   integration tests → deploy to staging (production-like data shape) → smoke tests → progressive
   prod rollout (canary 1% → 25% → 100% with automatic rollback on SLO breach).
4. **Instrument before you need it.** Structured logs with correlation IDs, RED/USE metrics per
   service, distributed traces across boundaries, and dashboards for each service's golden signals.
5. **Define alerting tiers.** Page (user impact now, actionable, runbook attached) vs ticket
   (degraded, investigate soon) vs log (informational). Every page must be actionable — if the
   response is "wait and see," it's not a page.
6. **Practice incidents.** Game days / fire drills for the scary scenarios; postmortems within 48h
   of any significant incident; track action items to completion like product work.

Pipeline stage checklist:

```text
[ ] Build is hermetic and reproducible (pinned base images, locked deps)
[ ] Same artifact promoted across environments (no rebuilds)
[ ] Secrets injected at runtime from secret manager
[ ] Rollback is one command / automatic on health-check failure
[ ] Deploy is progressive (canary or blue/green), not big-bang
[ ] Post-deploy smoke tests verify user-critical paths
[ ] Dashboard + alerts exist before first prod traffic
```

## Common pitfalls

- **Snowflake environments.** "Works in staging" means nothing if staging differs from prod.
  Production-like data volume, config parity, and the same artifact — or your tests are theater.
- **Alert fatigue.** Paging on CPU thresholds and disk warnings trains on-call to ignore pages.
  Alert on user-impacting symptoms; tune ruthlessly; every false page is a bug in the alert.
- **Manual deploys with extra steps.** A wiki page titled "release process" with 30 manual steps is
  not a pipeline. If a human must remember the order, it will eventually go wrong at 2am.
- **Secrets in repos.** Even private repos leak (contractors, forks, history). Assume any committed
  secret is compromised: rotate and move to a manager.
- **No rollback plan.** "We'll roll forward" during an outage is optimism, not a plan. Fast,
  tested rollback beats heroic forward-fixing under pressure.
- **Monitoring everything, observing nothing.** 500 dashboards nobody opens. Start from questions
  ("is checkout healthy?") and build the minimum telemetry that answers them.
- **Treating toil as inevitable.** If on-call spends hours on repetitive tasks (log diving,
  manual scaling, cert renewals), that's engineering work waiting to be automated — budget for it.
