---
name: jira-pro
description: Run Jira effectively: project setup, workflows, JQL, automation, and reporting for software teams. Use when configuring Jira or improving team process around it.
category: development
---

# Jira Pro

## Overview

Jira is **a workflow engine wearing a ticket-tracker costume** — its value comes from workflows,
automation, and reporting that match how your team actually works, not from default configurations.
Professional Jira usage means designing issue types and workflows deliberately, writing JQL fluently,
automating the toil (transitions, notifications, hygiene), and using boards/reports as honest
mirrors of progress.

The through-line: Jira should reduce coordination overhead — if maintaining Jira feels like a
second job, the configuration (not the team) is wrong.

## When to use

- Setting up or restructuring Jira projects for software teams.
- Designing workflows, issue types, and custom fields.
- Writing JQL queries, filters, and dashboards.
- Building Jira automation rules.
- Improving sprint planning, backlog hygiene, or reporting.

## Core concepts

- **Issue types with purpose.** Epic (outcome) → Story/Task (deliverable) → Sub-task (optional
  breakdown). Bug as a first-class type with severity. Don't proliferate types — every new type
  is process complexity; most teams need 4–5.
- **Workflows model reality.** Statuses (To Do → In Progress → In Review → Done) with transitions
  guarded by conditions/validators (can't resolve without a fix version, can't start without an
  assignee). Keep workflows *simple* — every extra status is a place work goes to stall.
- **JQL fluency.** `project = X AND status != Done AND assignee = currentUser() ORDER BY priority
  DESC` — filters, boards, dashboards, and automation all run on JQL. Learn functions
  (`currentUser()`, `startOfWeek()`, `membersOf()`), and save shared filters instead of
  re-typing queries.
- **Boards as mirrors.** Kanban (continuous flow, WIP limits) or Scrum (sprints, velocity) —
  configured from JQL filters; swimlanes by assignee/priority; WIP limits that actually limit.
  A board nobody looks at is decoration; a board that mirrors reality drives standups.
- **Automation rules.** "When PR merged → transition issue to Done," "when bug created without
  severity → assign to triage and notify," "stale issues pinged after 14 days." Automation handles
  the transitions humans forget — start with the 3–5 highest-toil rules.
- **Fields: minimal viable.** Summary, description (with a template!), priority, labels/components
  for routing, fix versions for releases. Every required custom field is friction on creation —
  require little, enrich later via workflow.

## Practical workflow

1. **Design before configuring.** Map the team's actual flow on paper first (statuses, handoffs,
   who's involved) — then build the workflow to match. Configuring first produces Jira-shaped
  process instead of team-shaped tooling.
2. **Set up the project.** Issue types (Epic/Story/Task/Bug), a simple workflow, components for
   ownership areas, versions for releases, and a backlog grooming cadence.
3. **Write the JQL library.** Saved filters: my open work, team's sprint, bugs by severity,
   blocked issues, recently resolved (for standups/changelogs). Dashboards compose these into
   the team's status page.
4. **Automate the toil.** Start with: PR-linked transitions (via Bitbucket/GitHub integration),
   auto-assignment on creation by component, stale-issue nudges, and release-version assignment.
   Audit automation quarterly — dead rules confuse.
5. **Run the rituals lightly.** Backlog grooming (keep the top of the backlog *ready*: clear,
   estimated, small), sprint planning from a groomed backlog, and retros that actually change
   something (one improvement per retro, tracked as an issue).
6. **Report honestly.** Burndown/burnup, cycle time, and throughput from Jira data — used for
   *planning and improvement*, not performance surveillance. Metrics that punish get gamed.

Hygiene checklist:

```text
[ ] Every issue has: clear summary, description with acceptance criteria, priority
[ ] No issue sits "In Progress" untouched for > 3 days (stale detection)
[ ] Backlog top 2 sprints: groomed, estimated, small enough to finish
[ ] Done means: merged, deployed (or releasable), docs updated — definition written down
[ ] Labels/components consistent (no 47 overlapping labels)
[ ] Closed issues link the fix (commit/PR) — traceability for future debugging
```

## Common pitfalls

- **Workflow bloat.** 14 statuses with names like "Awaiting Product Owner Clarification (Blocked)".
  Work stalls in hand-off queues. Fewer statuses; blockers as flags/labels, not statuses.
- **Required-field hell.** 12 mandatory custom fields on creation — reporters write "asdf" to get
  through. Require the minimum; enrich in workflow.
- **No definition of done.** "Done" meaning different things per person — QA surprises, missing
  docs, undeployed merges. Write it down, enforce via workflow validators.
- **Stale backlog.** 800 ungroomed issues — the backlog is a wishlist, not a plan. Groom
  regularly; close what won't happen (closing is a decision, and decisions are progress).
- **Metrics as surveillance.** Velocity used to compare developers — instantly gamed, trust
  destroyed. Metrics for planning and process improvement, never individual judgment.
- **Automation without ownership.** 60 automation rules, nobody knows what half do, some fight
  each other. Document rules; audit regularly; delete the dead.
- **Jira as a substitute for conversation.** 40-comment threads instead of a 5-minute call.
  Jira records decisions; humans make them — talk first, document after.
