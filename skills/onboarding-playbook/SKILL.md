---
name: onboarding-playbook
description: Design SaaS user onboarding — activation flows, checklists, empty states, and time-to-value optimization.
category: curviate
---

## Overview

Onboarding turns signups into active users: the journey from "just registered" to first meaningful value. This skill covers designing onboarding for SaaS products — signup flows, activation milestones, progressive disclosure, empty states, and the metrics (activation rate, time-to-value) that measure success. General SaaS product guidance, platform-neutral.


User onboarding turns signups into activated, retained users: guiding them to first value quickly while teaching the mental model of the product.
Great onboarding feels like a helpful guide, not a tutorial — it adapts to user goals and gets out of the way.
This skill covers SaaS onboarding design from signup to habit formation.
## When to use

- Designing a new user onboarding flow
- Improving trial-to-paid conversion
- Reducing early churn
- Defining activation milestones
- Fixing confusing empty states
- Personalizing onboarding by segment

- Improving trial-to-paid conversion
- Reducing time-to-value for new users
- Designing onboarding for complex B2B products
- Building self-serve signup flows
- Onboarding enterprise customers with custom needs
## Core concepts

**Time-to-value (TTV).** The core metric: how fast a new user reaches their first meaningful outcome. Every unnecessary step, field, or decision delays value and increases drop-off. Ruthlessly shorten the path: what can be pre-filled, defaulted, skipped, or deferred?

**Activation milestones.** Define the "aha moment" (when users grasp value) and the setup milestones leading there. Instrument each step's completion rate — the biggest drop identifies the fix. Activation is a funnel; optimize the leakiest step first.

**Progressive disclosure.** Reveal complexity gradually: essential setup now, advanced features later (in-context, when relevant). Front-loading every option overwhelms; hiding everything confuses. Teach in the moment of need.

**Empty states.** First-run screens are teaching moments, not blank canvases: show what goes here, why it matters, and the one action to fill it (with sample data where possible). Good empty states convert confusion into action.

**Segmented onboarding.** Different users need different paths: by role (admin vs. end user), by use case (selected during signup), by plan (trial vs. enterprise). Ask 1–3 questions at signup to route users — then personalize ruthlessly.

**Human touch.** High-touch for high-value: onboarding emails, in-app guidance, sales/CS-assisted setup for enterprise, and concierge onboarding for strategic accounts. Match touch to customer value — automate the long tail, humanize the top.


**Activation metrics.** Define the activation event precisely: the action correlating with long-term retention (not signup, not login — the first meaningful value moment).
Examples: Slack (2,000 messages sent), Dropbox (file in folder), Twitter (30 follows).
Find yours through retention analysis, then optimize everything toward it.
**Onboarding patterns.** Checklists (progress + clear tasks) → empty-state guidance (teach in context) → progressive disclosure (reveal complexity gradually) → templates (start from success, not blank) → concierge (high-touch for enterprise).
Match pattern to complexity: simple products need checklists; complex platforms need templates + human help.
**Friction audit.** Count every step, field, and decision from signup to activation.
Each unnecessary step costs 10–20% of users — ruthlessly eliminate, defer (progressive profiling), or explain (why we need this).
Test signup on mobile with poor connectivity — that is the real-world experience.
## Practical workflow

1. **Define activation.** What does an "activated" user look like? (e.g., "created 1 project + invited 1 teammate + completed 1 workflow"). Get cross-functional agreement — this is the north star.
2. **Map the current flow.** Signup → setup steps → first value. Instrument completion at each step. Identify the biggest drops.
3. **Shorten the path.** Cut steps (every field costs conversions), pre-fill from integrations/imports, offer templates instead of blank slates, and defer non-essential setup.
4. **Design guidance.** Welcome sequence (in-app + email), interactive checklists with progress, contextual tooltips (not upfront tours), empty-state designs, and celebration of first value ("You did it!").
5. **Segment.** Signup questions → tailored paths per segment. Different checklists, templates, and examples per use case.
6. **Measure and iterate.** Activation rate by cohort and segment, TTV distribution, step completion rates, trial conversion, and early churn (first 30 days). A/B test relentlessly — onboarding is the highest-leverage optimization surface.

**Onboarding email sequence:** immediate welcome (set expectations) → day 1 (complete setup nudge) → day 3 (feature highlight tied to their use case) → day 7 (social proof + tips) → day 14 (trial ending: convert or extend with reason).


**Onboarding redesign process:** instrument current funnel (signup → activation rate and time) → identify biggest drop-offs → user-test the flow (5 users) → redesign top 3 friction points → A/B test → measure activation lift → iterate.
One focused improvement per cycle; onboarding optimization compounds.
**Welcome email sequence:** immediate (confirm + first step) → day 1 (key feature highlight) → day 3 (social proof + tips) → day 7 (advanced use case) → day 14 (trial ending / upgrade nudge).
Each email drives one action — multi-CTA emails convert nothing.
## Common pitfalls

- **Too many signup fields.** Every field reduces conversion. Ask only what's needed to deliver value now.
- **Feature tours.** 10-step overlays nobody reads. Contextual, progressive guidance instead.
- **Blank slates.** Empty dashboards with no guidance. Templates, samples, and clear next actions.
- **One-size-fits-all.** Same flow for admins and viewers, startups and enterprises. Segment by role and use case.
- **No activation definition.** Optimizing "onboarding" without agreeing what success looks like. Define it first.
- **Ignoring email.** Relying only on in-app guidance. Email re-engages users who left mid-setup.
- **Set and forget.** Shipping onboarding once. It's a living system — review metrics monthly, test continuously.
- **Feature tours.** Forced walkthroughs users skip. Nobody remembers tour content — guide in context or do not guide at all.
- **One-size onboarding.** Same flow for all personas. Segment by use case and role; a developer and a marketer need different first experiences.
- **Premature paywalls.** Asking for credit cards before value. Let users experience the aha moment first — then ask for commitment.
- **No re-onboarding.** Major redesigns or new features without guidance for existing users. Treat big changes as onboarding events.
- **Success theater.** Celebrating logins instead of value. Measure activation events, not vanity actions.
- **Ignoring struggling users.** No intervention for stalled onboarding. Detect stuck users and proactively help — silently churning is the default.
