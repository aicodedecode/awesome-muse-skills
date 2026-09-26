---
name: linear-pro-dev
description: Run Linear effectively: issue workflow, cycles, triage, integrations, and team habits. Use when configuring Linear or improving team process around it.
category: development
---

# Linear Pro (Dev)

## Overview

Linear's appeal — **speed, opinionated workflow, and GitHub-native integration** — works best when
teams embrace its opinions instead of rebuilding Jira inside it. Professional Linear usage means
lean issue hygiene, cycles for cadence, triage as a habit, and integrations (GitHub, Slack) doing
the status-syncing automatically.

The through-line: Linear rewards lightness — keep process minimal, issues current, and let the
integrations carry the coordination.

## When to use

- Setting up Linear for a software team.
- Establishing issue, cycle, and triage habits.
- Integrating Linear with GitHub and Slack.
- Improving backlog hygiene or planning cadence.
- Migrating from Jira (or heavier tools) to Linear.

## Core concepts

- **Issues, lightweight.** Title + description (with template: context, proposal/outcome,
  acceptance criteria), priority (Urgent/High/Medium/Low — use honestly), labels for areas,
  estimate (points or t-shirt — pick one, keep it rough). Creation friction near zero is the
  feature — don't add required-field ceremony.
- **Cycles for cadence.** Time-boxed iterations (1–2 weeks) with planned scope; Linear tracks
  progress automatically from issue states. Don't over-plan cycles — they're a heartbeat, not a
  contract. Carry-over is data, not failure.
- **Triage inbox.** New issues land in Triage; someone (rotating duty) routes daily: accept
  (prioritize + label), decline (with reason — decisions are progress), or ask for clarification.
  An untriaged inbox becomes a black hole; daily triage keeps it a queue.
- **Workflow states, minimal.** Backlog → Todo → In Progress → In Review → Done (+ Canceled).
  Resist adding statuses — Linear's power is the default workflow; customize only with real need.
- **GitHub integration.** Branch names (`feat/abc-123-short-desc`) auto-link; PRs closing issues
  (`Fixes ABC-123`) transition automatically; commit/PR activity appears on the issue. The issue
  becomes the source of truth without manual status updates.
- **Projects for initiatives.** Cross-cutting efforts (launches, migrations) as Linear Projects
  with milestones and documents — the layer above issues for stakeholder visibility without
  polluting the backlog.

## Practical workflow

1. **Set up the team simply.** Default workflow states, a few labels (area: frontend/backend,
   type: bug/feature/chore), one estimate scale, issue templates for bugs and features.
2. **Establish triage.** Daily 10-minute triage rotation: every new issue gets a decision within
   24h. Backlog stays a queue, not a graveyard.
3. **Wire integrations.** GitHub (auto-link branches/PRs, auto-close on merge), Slack (cycle
   updates, mentions), and CI status on issues. Manual status syncing should approach zero.
4. **Run cycles lightly.** Plan the cycle from a triaged backlog (capacity-aware, not
   wishful); daily async check-ins over meetings; end-of-cycle: demo what shipped, note
   carry-over honestly.
5. **Keep hygiene automatic.** Stale-issue nudges (automation or triage habit), done-issues
   linked to PRs, canceled-with-reason instead of silent deletion.
6. **Review the system monthly.** Are estimates roughly right? Is triage keeping up? Are cycles
   too full? Adjust the *process*, not just the issues — Linear's simplicity makes process
   problems visible fast.

Team habits checklist:

```text
[ ] Issue template used: context, acceptance criteria, priority set honestly
[ ] Triage inbox cleared daily (rotating duty)
[ ] Branches/PRs reference issue IDs — status flows automatically
[ ] Cycle scope fits capacity; carry-over reviewed, not hidden
[ ] Labels consistent; no label sprawl
[ ] Canceled issues have a reason (one line — future archaeology)
[ ] Monthly: review estimates, cycle health, and process friction
```

## Common pitfalls

- **Rebuilding Jira in Linear.** 20 custom statuses, 15 required fields, 6 issue types —
  defeats the entire point. Embrace the opinions; customize only with evidence of need.
- **No triage habit.** Issues pile in Triage for weeks; reporters stop filing. Daily triage is
  the cheapest high-value Linear habit.
- **Priority inflation.** Everything "Urgent" means nothing is. Urgent = drop everything;
  enforce the semantics or the scale is decorative.
- **Cycle over-planning.** Treating cycles as commitments with 100% allocation — no slack for
  bugs, reviews, or reality. Plan to ~70%; protect the buffer.
- **Manual status syncing.** Updating Linear by hand when the GitHub integration does it free.
  Wire the integration; trust the automation.
- **Dead backlog.** Hundreds of untouched backlog issues — close or icebox them. A backlog is a
  set of *options*, curated; a graveyard is just guilt.
- **Skipping retros.** Linear makes process friction visible (carry-over, stale issues) — but
  visibility without retros is just dashboard decoration. Review and adjust monthly.
