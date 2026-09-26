---
name: marketing-automation
description: Build marketing automation — nurture sequences, behavioral triggers, lead lifecycle workflows, and personalization at scale.
category: business-marketing
---

## Overview

Marketing automation delivers the right message to the right person at the right time, without manual effort: nurture sequences, behavioral triggers, onboarding flows, and re-engagement campaigns. This skill covers strategy, workflow design, content mapping, testing, and measurement — the practice, not any single platform.

Automation amplifies strategy. Automating a bad process just produces bad results faster.


Marketing automation turns one-to-many communication into one-to-one-at-scale: the right message, to the right person, at the right moment, triggered by behavior rather than batch schedules. Done well, it feels personal; done poorly, it feels like spam with better targeting. The difference is relevance and restraint.
## When to use

- Building nurture sequences
- Setting up behavioral trigger emails
- Designing lead lifecycle workflows
- Creating onboarding automation
- Building re-engagement campaigns
- Fixing underperforming automated programs

- Nurturing long B2B sales cycles with educational content
- Re-engaging dormant subscribers or trial users
- Scaling personalized onboarding without linear headcount growth
- Migrating marketing automation platforms
- Building account-based automation plays
- Implementing lead lifecycle automation
## Core concepts

**Nurture strategy.** Map content to buyer stage: early (educational, problem-aware), middle (solution comparisons, proof), late (demos, trials, pricing, ROI). Nurture builds trust over time — each touch should deliver value, not just "checking in."

**Behavioral triggers.** Actions that fire relevant messages: page visits (pricing page → sales alert + follow-up), content downloads (related content sequence), cart abandonment, trial signup (onboarding), inactivity (re-engagement), milestones (anniversary, usage thresholds). Timeliness beats perfection.

**Lead lifecycle automation.** Stage transitions trigger actions: new lead → welcome + scoring; MQL → sales alert + SLA timer; SAL → nurture pause; SQL → opportunity nurture; customer → onboarding + upsell tracks; churn → win-back. Document the full lifecycle map.

**Personalization.** Tokens (name, company), dynamic content blocks (by segment, industry, behavior), and send-time optimization. Personalize meaningfully — relevance of content matters more than first-name tokens.

**Frequency and fatigue.** Global communication limits (max touches per week), priority rules (transactional > behavioral > nurture > batch), preference centers, and engagement-based suppression (stop emailing the unengaged — it hurts deliverability).

**Testing.** A/B test subject lines, content, timing, and sequence length. Test one variable at a time. Let tests reach significance before declaring winners.


**Behavioral triggers vs. time-based drips.** The highest-performing automations react to what the recipient just did: pricing page visit → comparison content; trial signup → activation sequence; cart abandonment → reminder + social proof. Time-based drips (day 1, day 3, day 7) are the starting point; behavioral triggers are the multiplier.

**Frequency capping and global rules.** No contact should receive more than N touches per week across all programs. Build global suppression rules (unengaged, customers in onboarding, active sales conversations) that every program respects. Without caps, programs compete and collectively burn the list.

**Lead lifecycle automation.** Stage transitions trigger actions: new lead → welcome + scoring; MQL → sales alert + SLA timer; SAL → nurture pause; SQL → opportunity sync; closed-lost → recycle nurture.
Automate the transitions, not just the emails — lifecycle automation is the nervous system of demand gen.
Audit transitions quarterly; broken handoffs leak pipeline silently.
**Dynamic content.** Email and landing page content that adapts by segment (industry, persona, lifecycle stage) without separate campaigns.
Start with 2–3 high-impact swaps (hero image, case study, CTA) — full dynamic rebuilds are overkill initially.
Dynamic content multiplies relevance without multiplying workload.
**Deliverability management.** Dedicated IPs (warmed gradually), authentication (SPF/DKIM/DMARC), list hygiene (bounce/complaint handling), engagement-based sending (prioritize engaged segments).
Deliverability is infrastructure — neglect it and even perfect campaigns hit spam.
Monitor sender reputation weekly; investigate drops immediately.
## Practical workflow

1. **Map the lifecycle.** Define stages, entry/exit criteria, and what should happen at each transition. Get sales agreement — automation touches their prospects.
2. **Prioritize programs.** Start with highest-ROI: welcome series, trial/purchase onboarding, abandoned cart, MQL nurture, re-engagement. Build one program well before adding five.
3. **Design each workflow.** Visual flowchart: trigger → wait steps → decision branches (engaged? converted?) → actions → goals/exit criteria. Define the goal that pulls people out (conversion should end nurture).
4. **Write the content.** Each email: one job, clear CTA, value-first. Sequence arc: welcome + set expectations → deliver value (3–4 touches) → social proof → soft offer → urgency/last chance. Vary formats (plain-text personal vs. designed).
5. **Build, QA, launch.** Implement carefully: test every branch with seed contacts, verify triggers fire correctly, check personalization tokens, confirm suppression and unsubscribe handling. QA is non-negotiable — automation errors scale.
6. **Measure and optimize.** Per program: enrollment, open/click rates, conversion to goal, unsubscribe rate, revenue influenced. Review quarterly; refresh content every 6–12 months. Sunset programs that don't perform.

**Workflow QA checklist:** trigger fires correctly, all branches tested, wait times appropriate, personalization tokens render, links tracked, unsubscribe works, suppression lists applied, goal/exit criteria set, seed contacts walked the full path.


**Program QA protocol:** test every path with seed contacts → verify triggers fire correctly → check personalization tokens with edge cases (missing first name!) → confirm suppression lists apply → review on mobile → get stakeholder sign-off → soft-launch to 10% before full rollout. Automation errors scale instantly — a broken program can email your entire database before anyone notices.

**Nurture program blueprint:** entry trigger (behavioral) → 4–6 touches over 2–4 weeks → each touch delivers standalone value (not just "checking in") → progressive profiling (ask one new question per touch) → exit paths (convert → sales handoff; engage → continue; ignore → suppress). Measure progression rate, not just open rate.

**Platform migration checklist:** audit existing programs (keep/kill/rebuild) → map data fields → rebuild scoring → recreate key programs in sandbox → parallel-run critical flows → migrate in waves (not big-bang) → validate tracking and integrations → decommission old platform.
Migrations fail on data mapping and untested edge cases — budget 50% of timeline for testing.
**Program naming conventions:** [Funnel stage]_[Program type]_[Audience]_[Date] (e.g., MOFU_Nurture_Enterprise_2026Q3).
Consistent naming makes reporting, auditing, and handoffs possible at scale.
## Common pitfalls

- **Automating without strategy.** Random drips that annoy. Every program needs a goal and a content arc.
- **No exit criteria.** Continuing to nurture people who already converted. Always define the goal that ends the flow.
- **Over-emailing.** Too many programs firing simultaneously. Global frequency caps and priority rules.
- **Set and forget.** Launching workflows and never reviewing. Content decays; performance drifts. Quarterly reviews.
- **Skipping QA.** Broken triggers and wrong segments at scale. Test everything with seed contacts.
- **Token-only personalization.** "Hi {FirstName}" with generic content. Personalize the message relevance, not just the greeting.
- **Ignoring deliverability.** Automated volume to unengaged contacts tanks sender reputation. Suppress the dormant.
- **Set and forget.** Programs launched and never reviewed. Audit quarterly: are triggers still relevant? Is content current? Are conversion rates holding?
- **Over-automation.** Automating messages that should be human (enterprise outreach, sensitive topics). Automation handles scale; humans handle moments that matter.
- **No sunset for non-responders.** Continuing to nurture contacts who never engage. Suppress chronic non-responders to protect deliverability.
- **Program sprawl.** Hundreds of overlapping automations. Annual audits: kill or consolidate anything without clear ownership and metrics.
- **No global opt-down.** All-or-nothing unsubscribe only. Preference centers with opt-down options save 20–40% of would-be unsubscribers.
