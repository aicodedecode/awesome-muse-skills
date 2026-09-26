---
name: notion-pro-dev
description: Use Notion as a developer knowledge system: docs, runbooks, specs, wikis, and API-driven automation. Use when organizing engineering knowledge in Notion.
category: development
---

# Notion Pro (Dev)

## Overview

Notion as a **developer knowledge system** — specs, runbooks, ADRs, team wikis, project trackers —
works when it's structured deliberately and maintained like code. This skill covers organizing
engineering knowledge in Notion: information architecture, templates, databases for engineering
workflows, and API automation that keeps docs alive.

The through-line: Notion is a tool, not a strategy — structure it around how the team finds and
maintains knowledge, or it becomes a beautiful junk drawer.

## When to use

- Setting up team wikis, runbooks, or engineering docs in Notion.
- Designing Notion databases for specs, incidents, or project tracking.
- Creating templates for RFCs, postmortems, and onboarding.
- Automating Notion via its API (syncing docs, reports, trackers).
- Fixing a Notion workspace that's become unnavigable.

## Core concepts

- **Information architecture first.** Top-level: team home (orientation), docs by domain
  (engineering areas), runbooks (operations), decisions (ADRs/RFCs), people/process (onboarding,
  rituals). Shallow, predictable hierarchy — if finding a doc takes more than 3 clicks, the
  structure failed.
- **Databases for structured knowledge.** Specs tracker (status, owner, links), incident log
  (date, severity, postmortem link), ADR database (status: proposed/accepted/superseded),
  onboarding checklist. Databases with views (by status, by owner, by team) beat folders of pages.
- **Templates as process.** RFC template (context, proposal, alternatives, rollout), postmortem
  template (timeline, root cause, action items with owners), bug report, onboarding checklist.
  Templates encode "how we do things" — new joiners learn the process by using the template.
- **Docs have owners and freshness.** Every important page: an owner and a "last verified" date.
  Quarterly doc reviews (stale docs flagged, updated or deleted). Ownerless docs rot; dateless
  docs can't be trusted.
- **Link, don't duplicate.** One canonical page per topic, linked everywhere it's relevant.
  Duplicated content diverges — the sync callout or synced block exists for a reason.
- **API for automation.** Notion's API: sync release notes from GitHub, generate status reports
  from databases, auto-create incident pages from alerts, back up critical docs. Automation keeps
  the human-written parts human and the mechanical parts mechanical.

## Practical workflow

1. **Design the IA.** Sketch the top-level structure with the team; agree on where things live
   (and where they *don't*). Write the "where does X go?" guide — it prevents 90% of sprawl.
2. **Build the core databases.** Specs/RFCs, ADRs, incidents, onboarding — with the views each
   audience needs (engineers: by status; managers: by timeline; on-call: runbooks by symptom).
3. **Create the templates.** RFC, ADR, postmortem, runbook, onboarding checklist — each with
   guidance *in the template* (what goes in each section, with an example).
4. **Seed with the essentials.** Team home, onboarding guide, architecture overview, runbooks for
   top alerts, coding conventions. Better a small, accurate wiki than a large, rotting one.
5. **Establish maintenance rituals.** Doc owners review quarterly; "last verified" dates visible;
   stale-page reports; delete-or-update decisions. Docs are maintained or they're misleading.
6. **Automate the mechanical.** API syncs for release notes/changelogs, incident page creation,
   weekly digest of doc changes. Keep humans writing judgment; machines moving data.

Workspace structure sketch:

```text
🏠 Team Home (orientation, links, what's new)
📚 Engineering
   ├── Architecture (overview, ADRs database, diagrams)
   ├── Runbooks (by service/symptom, linked from alerts)
   ├── Conventions (coding standards, review guide, Git workflow)
   └── Onboarding (checklist, environment setup, first-week guide)
📋 Projects (specs database: status views, owners, timelines)
🚨 Incidents (log database + postmortem template)
👥 People & Process (rituals, on-call rotation, team norms)
```

## Common pitfalls

- **The junk drawer.** Pages everywhere, no structure, search as the only navigation. IA first;
  the "where does X go?" guide prevents sprawl.
- **Docs without owners.** Nobody maintains them; they rot; people stop trusting Notion. Every
  important page gets an owner and a freshness date.
- **Duplication.** The same architecture described in 4 pages, all slightly different. Canonical
  pages + links/synced blocks; delete the copies.
- **Template neglect.** Templates exist but nobody uses them (or they're outdated). Templates
  are process — review them like process, and make them the path of least resistance.
- **Over-structuring.** Database properties for everything, 40 views, relation webs nobody
  understands. Start simple; add structure when the pain is real.
- **Notion as the system of record for code-adjacent docs.** ADRs and runbooks that belong next
  to code living only in Notion — drifting from the code they describe. Code-adjacent docs live
  with code (linked from Notion); Notion holds the human/process layer.
- **No maintenance ritual.** The wiki was great in month one and a museum by month twelve.
  Quarterly reviews, freshness dates, and delete permission — maintenance is the feature.
