---
name: crm-specialist
description: Manage CRM systems — data architecture, pipeline design, automation, user adoption, and reporting.
category: business-marketing
---

## Overview

The CRM is the system of record for customer relationships — but only if it's designed well, kept clean, and actually used. This skill covers CRM administration and strategy: data architecture, pipeline/stage design, automation, integrations, user adoption, and reporting. Vendor-neutral principles applicable to any CRM platform.


A CRM is only as valuable as the discipline around it. The specialist's job is making the CRM the single source of truth: clean data in, trusted insights out. This requires equal parts technical skill (workflows, integrations, deduplication) and change management (getting humans to actually use it properly).
## When to use

- Implementing or migrating a CRM
- Redesigning pipelines and stages
- Fixing low user adoption
- Cleaning CRM data
- Building CRM automation and integrations
- Creating sales/marketing reports

- Migrating from spreadsheets or a legacy CRM
- Designing lead routing and assignment rules
- Building executive dashboards on pipeline and forecast
- Implementing lead scoring in the CRM
- Setting up territory management
- Integrating marketing automation with CRM
## Core concepts

**Data architecture.** Objects (contacts, companies, deals, tickets), required fields per stage, picklist discipline (free text fields destroy reporting), and relationships between objects. Design for the reports you'll need — reporting requirements drive field requirements.

**Pipeline design.** Stages reflecting the actual sales process with clear exit criteria per stage (not "proposal sent" vibes — "proposal sent AND economic buyer confirmed"). Fewer, meaningful stages beat granular fantasy. Win/loss reasons mandatory on close.

**Automation.** Lead assignment (round-robin, territory, specialty), task creation, follow-up reminders, stage-change notifications, data enrichment, and stale-deal alerts. Automate the repetitive; never automate the relationship.

**Integrations.** Email, calendar, marketing automation, support, billing, product usage — the CRM should reflect the full customer picture. Bidirectional sync where it matters; define the system of record per data type to avoid conflicts.

**Adoption.** The #1 CRM failure mode. Drivers: leadership using it (forecasts from CRM, not spreadsheets), minimal required fields, mobile usability, clear WIIFM for reps (it helps them sell), and training tied to their workflow — not feature tours.

**Reporting.** Pipeline reports, activity reports, conversion by stage, forecast accuracy, win/loss analysis, cohort views. One source of truth; define metric definitions once and enforce them.


**Data hygiene program.** Duplicates, incomplete records, and stale data destroy trust in the CRM. Run monthly: duplicate detection and merging, required-field enforcement on key objects, data validation rules (email formats, phone formats), and ownership audits (every record has an active owner). Measure data quality with a scorecard — what gets measured gets maintained.

**Adoption mechanics.** CRM adoption fails when the system serves management reporting but not the rep's daily work. Design for the rep first: one-click logging, mobile-friendly activity capture, views that answer "what should I do today?" — then layer reporting on top. If reps see personal value, adoption follows.

**Pipeline stage design.** Stages reflect buyer actions, not seller hopes: each stage needs exit criteria (what the buyer did), not just entry vibes.
Too many stages (12) create noise; too few (3) hide problems. Five to seven stages fits most B2B motions.
Audit stage conversion monthly — stages where deals stall need criteria or enablement fixes.
**Forecasting discipline.** Commit / best-case / pipeline categories with clear definitions; forecast calls that inspect deals, not just numbers.
Sandbagging and happy-ears both destroy forecast accuracy — inspect the underlying evidence per deal.
Track forecast accuracy by rep and manager; coach the pattern, not the number.
**Integration architecture.** Map data flows: which system is the source of truth for each object? (CRM owns accounts; marketing automation owns engagement; billing owns invoices.)
Bidirectional syncs need conflict rules (newest wins? source system wins?).
Document the architecture — mystery integrations break mysteriously.
## Practical workflow

1. **Define requirements.** Interview sales, marketing, CS: what do they need to do, track, and report? Map the actual sales process before configuring anything.
2. **Design the data model.** Objects, fields (required vs. optional per stage), picklists, validation rules, deduplication rules. Document the schema.
3. **Build pipelines and automation.** Stage definitions with exit criteria, assignment rules, task automation, notifications, and integrations. Test with real scenarios before rollout.
4. **Migrate and clean.** Data mapping, cleansing (dedupe, standardize, fill gaps), test migration, validation. Never migrate dirty data — clean first.
5. **Train and launch.** Role-based training (reps learn their workflow, managers learn reporting), quick-reference guides, office hours. Leadership commits to managing from the CRM.
6. **Govern and optimize.** Data quality monitoring, quarterly field audits (remove unused fields), automation reviews, user feedback loops, release management for changes. CRM is a living system.

**Adoption checklist:** leadership forecasts from CRM, <5 required fields per stage, mobile works, reps trained on their workflow, clear personal benefit, ongoing support channel, regular data quality feedback.


**Lead routing design:** define routing rules (territory, segment, round-robin, account ownership) → set speed-to-lead SLAs (under 5 minutes for inbound) → build reassignment rules for non-responsive owners → create alerts for SLA breaches → audit monthly for misroutes. Test routing with sample records before going live — misrouted leads are lost revenue.

**Dashboard hierarchy:** rep dashboards (my pipeline, my tasks, my performance vs. quota) → manager dashboards (team pipeline coverage, stage conversion, forecast) → executive dashboards (pipeline generation, win rates, forecast accuracy). Each level answers different questions; do not force one view on everyone.

**CRM implementation phases:** requirements and process mapping → data model design → migration planning (cleanse before, not after) → build and configuration → UAT with real users → training by role → go-live with hypercare → 30/60/90-day optimization.
Rushing UAT and training is the classic failure — budget 30% of the timeline for them.
**Admin runbook:** user provisioning → permission changes → field additions (with justification) → workflow changes (with testing) → backup and audit log reviews.
Every admin action logged; every config change tested in sandbox first.
## Common pitfalls

- **Over-customization.** 200 custom fields nobody fills. Minimal required data, enforced well.
- **No exit criteria.** Deals sit in stages for months because advancement criteria are vague. Define and enforce.
- **Dirty data migration.** Moving the mess into the new system. Clean before migrating.
- **Leadership bypass.** Executives asking for spreadsheet forecasts while preaching CRM usage. Lead by example.
- **Automation overload.** 50 workflows firing confusing notifications. Audit automations; less is more.
- **Free-text fields.** "Industry: tech, Tech, technology, SaaS" — unreportable. Picklists with governance.
- **No governance.** Anyone can add fields, change stages, or delete records. Admin controls and change processes are essential.
- **Over-customization.** 200 custom fields nobody fills in. Every field must justify its existence: who uses it, for what decision? Audit annually and delete ruthlessly.
- **No change management.** Launching new processes without training or communication. Adoption is a campaign, not an announcement.
- **Dirty imports.** Bulk-loading purchased lists without validation. One bad import can corrupt years of clean data — quarantine and verify first.
- **Vanity customization.** Building what executives want to see instead of what reps need to do. Rep workflow first, reporting second.
- **Stale pipeline.** Deals rotting in stages for months. Automated aging alerts + weekly pipeline scrubs keep it honest.
