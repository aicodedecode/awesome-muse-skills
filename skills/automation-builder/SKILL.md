---
name: automation-builder
description: Build workflow automations — triggers, actions, conditional logic, error handling, and maintainable automation design.
category: curviate
---

## Overview

Workflow automation connects triggers to actions: when X happens, do Y (with conditions, branching, and error handling). This skill covers designing automations well — whether in no-code builders or code — including trigger selection, action design, conditional logic, testing, monitoring, and the maintenance discipline that keeps automations reliable. Platform-neutral.


Automation builders turn repetitive operational work into reliable systems: lead routing, data syncing, notifications, report generation, and multi-step workflows across SaaS tools.
The discipline combines process mapping, tool selection, error handling, and monitoring.
Done well, automation gives teams leverage — work that scaled linearly with headcount now scales with software.
## When to use

- Designing workflow automations
- Choosing triggers and actions
- Adding conditional logic and branching
- Debugging failing automations
- Reducing manual operational work
- Governing automation sprawl

- Eliminating manual data entry between tools
- Building lead routing and assignment flows
- Creating scheduled reports and digest notifications
- Syncing customer data across platforms
- Triggering follow-ups from product or CRM events
## Core concepts

**Trigger design.** Event-based (record created, status changed, webhook received), scheduled (daily digest, weekly cleanup), and manual (button-triggered). Choose the trigger matching the actual need — polling when events exist wastes resources; scheduled batches beat per-event processing for digest-style outputs.

**Action design.** Atomic actions (one thing each — easier to debug and reuse), idempotent where possible (safe to re-run), with clear success/failure signals. Chain actions with data passing (outputs → inputs); validate data between steps.

**Conditional logic.** If/then branches, filters (only proceed when...), and switch statements for multi-path flows. Keep branches shallow — deeply nested logic becomes unmaintainable. Complex decisions belong in code or decision tables, not 15 nested conditions.

**Error handling.** Per-action: retry transient failures, route permanent failures to alerts, define fallbacks (what happens when the CRM is down?), and set up dead-letter handling. Every automation needs a failure story — "it just stops" is not one.

**Testing.** Test with realistic data (not just happy paths), test edge cases (empty results, duplicates, rate limits), dry-run modes before going live, and staged rollouts (one team before all teams). Automations fail at scale in ways tests miss — monitor early.

**Documentation.** Every automation: purpose, trigger, steps, owner, and what to do when it breaks. Undocumented automations become haunted infrastructure nobody dares touch.


**Trigger-action logic.** Every automation starts with a trigger (an event: form submitted, deal stage changed, row added) and proceeds through actions (create record, send message, update field).
Good triggers are specific — "deal moved to Closed-Won" beats "deal updated" — because vague triggers fire on noise and create side effects.
Map the trigger's data payload before building: what fields are available? What is missing? Most automation failures trace to assuming data that is not in the payload.
**Branching and conditions.** Real workflows branch: if deal value > $10k, route to enterprise team; if source = partner, notify partnerships.
Keep branching shallow (2–3 levels); deep conditional trees become unmaintainable. When logic gets complex, split into multiple focused automations rather than one mega-flow.
**Error handling.** Every automation needs a failure path: what happens when the API call fails, the field is empty, or the recipient is missing?
At minimum: retry transient failures (exponential backoff), alert a human on persistent failure, and log every run with inputs and outcomes.
Silent failures are the nightmare scenario — the automation stops working and nobody notices for weeks.
## Practical workflow

1. **Define the job.** What manual work disappears? What's the trigger, what's the outcome, who owns it? If you can't describe it in one sentence, it's not ready to automate.
2. **Map the flow.** Trigger → steps → branches → error paths. Whiteboard first; identify: data needed at each step, decision points, and failure modes.
3. **Build simply.** Start with the happy path + basic error handling. Atomic actions, shallow branching, idempotent writes. Resist cleverness.
4. **Test thoroughly.** Happy path, edge cases (empty, duplicate, malformed), failure injection (what if step 3 fails?), and load (what if 1,000 events fire at once?).
5. **Deploy carefully.** Dry-run or shadow mode first, then limited rollout, then full. Notify affected humans ("this is now automated; here's what changed").
6. **Monitor and maintain.** Run history review, failure alerts, performance tracking, and quarterly audits (is this automation still needed? still correct?). Assign owners — orphaned automations rot.

**Automation spec template:** name → owner → purpose (one line) → trigger → steps → conditions → error handling → monitoring → review date.


**Build process:** 1) document the manual process as-is (steps, actors, time spent), 2) identify the trigger and required data, 3) design the happy path, 4) design failure paths, 5) build in a sandbox, 6) test with real data (10+ cases including edge cases), 7) soft-launch with monitoring, 8) document and hand over.
**Monitoring dashboard:** runs per day, success rate, average duration, failure alerts, and data-quality flags.
Review weekly for the first month, monthly after. Automations rot as tools change — monitoring catches the rot.
**Documentation template:** purpose → trigger → steps → expected outcomes → failure handling → owner → last reviewed date.
If the owner leaves and nobody can understand the automation, it is a liability, not an asset.
## Common pitfalls

- **Automating broken processes.** Speeding up a bad workflow. Fix the process first, then automate.
- **No error handling.** Happy-path-only automations that silently fail. Every step needs a failure plan.
- **Over-complexity.** 50-step mega-flows. Break into smaller, composable automations.
- **No ownership.** Automations nobody maintains. Every automation has a named owner and review date.
- **Trigger spam.** Per-event processing for digest needs. Match trigger type to the actual requirement.
- **Untested edge cases.** Works for 10 records, breaks at 10,000. Test scale and weirdness.
- **Shadow IT sprawl.** Dozens of personal automations with no visibility. Central inventory and governance for shared systems.
- **Automating broken processes.** Speeding up a bad workflow just produces bad outcomes faster. Fix the process first, then automate.
- **No ownership.** Automations with no named owner break silently. Every automation has an owner and a review date.
- **Over-automation.** Automating judgment calls that need humans (complex negotiations, sensitive communications). Automate the routine; keep humans on the exceptions.
- **Circular triggers.** Automation A updates a record, triggering automation B, which triggers A again. Map trigger chains before building; add guards against loops.
