---
name: workflow-automation
description: Design reliable workflow automations: triggers, idempotency, error handling, observability, and choosing the right tool. Use when automating repetitive processes or evaluating automation platforms.
category: workflow-automation
---

# Workflow Automation

## Overview

Workflow automation connects triggers to actions: when X happens, do Y — across apps, APIs, and systems.

Reliable automation is a design discipline: idempotent actions, explicit error handling, retries with backoff, and observability from day one.

This skill is platform-agnostic: the principles apply whether you use n8n, Zapier, Make, code, or cron jobs.

The question is never 'can I automate this?' but 'should I — and how will I know when it breaks?'

## When to use

- Repetitive multi-step processes done manually
- Connecting apps that don't integrate natively
- Evaluating automation platforms for a team
- Automations that keep breaking silently
- Deciding what to automate vs. leave manual

## Core concepts

- **Triggers.**
  Events that start the flow: webhooks (instant), polling (scheduled checks), schedules (cron), manual. Prefer webhooks over polling where available — faster and cheaper.
- **Actions and branching.**
  Steps that do things, with conditional branches and loops. Keep flows linear where possible; deep branching becomes untestable.
- **Idempotency.**
  Running the same flow twice shouldn't duplicate effects. Design actions to be safe on retry: check-before-create, upsert instead of insert, dedupe keys.
- **Error handling.**
  Every external call can fail. Retry with exponential backoff, dead-letter queues for poison messages, and alerts — not silent drops.
- **State and dedup.**
  Track processed items (IDs, timestamps) to avoid reprocessing. Polling triggers especially need high-water marks.
- **Observability.**
  Log runs, alert on failures, dashboard key metrics. An automation you can't monitor is a liability with a timer.
- **Secrets management.**
  API keys in vaults/secrets managers, never hardcoded. Rotate credentials; scope them to least privilege.
- **Manual escape hatches.**
  Every automation needs a pause button, a manual retry, and a way to run steps by hand. You'll need them at 2am.

## Practical workflow

1. **Map the process manually.**
   Document the current manual process step by step. Automate the stable version — automating a messy process cements the mess.
2. **Score candidates.**
   Frequency x time-cost x error-cost. Automate high-frequency, error-prone drudgery first. Leave rare, judgment-heavy work manual.
3. **Choose the platform.**
   No-code (fast, limited) vs. code (flexible, maintained) vs. hybrid. Match complexity: simple linear flows -> no-code; branching logic -> code.
4. **Design for failure.**
   For each step ask: what if the API is down? What if data is malformed? What if it runs twice? Build retries, validation, and dedup in.
5. **Build the happy path.**
   Get the core flow working end-to-end before edge cases. Test with real data in a sandbox.
6. **Add observability.**
   Logging, failure alerts (to a channel you actually watch), run dashboards. Test the alerting by breaking something deliberately.
7. **Document and hand off.**
   What it does, how to pause/retry, who owns it. Automations outlive their builders — document like you'll forget.
8. **Review periodically.**
   APIs change, processes evolve. Quarterly: still needed? Still working? Still the right tool? Prune dead automations.

## Common pitfalls

- **Automating a broken process.**
  Automating chaos produces faster chaos. Fix the process manually first, then automate the stable version.
- **No idempotency.**
  Double-running creates duplicate orders, emails, tickets. Design every action safe-on-retry from the start.
- **Silent failures.**
  Automation breaks, nobody notices for weeks. Alerts on failure are not optional — they're the product.
- **Polling everything.**
  5-minute polling across 20 integrations burns quota and lags. Webhooks where available; sensible intervals elsewhere.
- **Hardcoded secrets.**
  API keys in flow definitions, shared screenshots, repos. Vaults + rotation, always.
- **No pause button.**
  Runaway automation spamming customers with no kill switch. Every flow needs an off switch you can hit in seconds.
- **Over-automation.**
  Automating rare, judgment-heavy tasks because you can. Some work should stay human — automate the rote, not the judgment.
- **Orphaned automations.**
  Builder leaves, automation breaks, nobody knows it exists. Ownership + documentation + monitoring, or delete it.
