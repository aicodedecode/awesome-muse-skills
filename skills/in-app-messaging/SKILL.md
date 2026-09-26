---
name: in-app-messaging
description: Design in-app messages — tooltips, modals, banners, and onboarding flows that guide without annoying.
category: enterprise-communication
---

## Overview

In-app messages (tooltips, modals, banners, slideouts, checklists) guide users inside your product: onboarding, feature announcements, and contextual help. This skill covers designing in-app messaging that helps without harassing — targeting, timing, copy, and measurement.


In-app messages — modals, banners, tooltips, and guides shown inside your product — reach users when they are most engaged: while using the app. Unlike push or email, they require no opt-in and cannot be missed by active users. The skill is using this captive attention for onboarding, feature discovery, and critical announcements without disrupting the core experience.
## When to use

- Designing product onboarding flows
- Announcing features in-app
- Reducing support tickets with contextual help
- Improving feature adoption
- Writing tooltip and modal copy
- Fixing "users don't discover our features" problems

- Onboarding new users to key features
- Announcing features or pricing changes
- Driving adoption of underused capabilities
- Reducing churn with targeted interventions
- Promoting new pricing or plans
- Collecting in-context user feedback
## Core concepts

**Message types.** Tooltips (contextual, anchored to UI — best for first-run guidance), modals (interruptive — reserve for critical actions), banners (persistent but dismissible — good for announcements), slideouts (attention without full interruption), checklists (onboarding progress), and empty states (teaching moments disguised as design).

**Targeting.** Show to the right users: new vs. returning, by role, by plan, by behavior (hasn't used feature X), by lifecycle stage. Untargeted messages annoy everyone; targeted messages feel helpful.

**Timing and triggers.** Event-based (after completing action Y, show tip for Z), time-based (day 3 of trial), and frequency caps (max X messages per session/week). Never show more than one interruptive message per session. Respect "don't show again."

**Copy.** Short (under 140 characters for tooltips), action-oriented ("Try bulk edit →"), benefit-led (what's in it for them), and skippable. Every message needs a clear dismiss — trapped users resent the product.

**Onboarding flows.** Progressive disclosure: teach in context as users encounter features, not in a 10-step tour upfront. Checklists with progress motivate completion. Celebrate first value moments ("You sent your first campaign!").

**Announcement strategy.** In-app for feature launches: banner for awareness → tooltip for the how → modal only for major changes requiring action. Pair with changelog/email for users who missed it.


**Message types and intrusiveness ladder.** Tooltips (least intrusive — contextual hints) → banners (persistent but dismissible) → slideouts → modals (most intrusive — block interaction). Match intrusiveness to importance: tooltips for tips, modals only for critical actions (required migrations, major announcements). Overusing modals trains users to dismiss everything unread.

**Targeting and timing.** Show messages based on behavior (used feature X 3 times but never tried Y), lifecycle stage, and session context — never show onboarding to power users or feature promos to users mid-critical-task. Frequency caps per user per week; dismissal should suppress repeats intelligently (dismissed ≠ never show again, but wait and vary).

**Onboarding design.** Checklists beat tours: 3–5 concrete tasks with progress indicators outperform passive walkthroughs. Trigger guidance at the moment of need (empty states, first feature use) rather than upfront. Measure activation lift per message — onboarding theater without metrics is just interruption.

**Behavioral triggers.** Session count, feature usage depth, milestone achievements, inactivity windows, and error encounters.
Trigger messages on behavior, not on schedules — "used exports 5 times, never tried scheduled exports" beats "day 14 drip email."
Build a trigger library; reuse across campaigns instead of reinventing.
**Survey and feedback patterns.** NPS/CSAT prompts (timed after value moments, not at login), feature-request capture, and micro-surveys (one question, contextual).
Response rates for in-context micro-surveys run 10–30x email surveys.
Always close the loop: "you asked, we built" messages turn feedback into loyalty.
## Practical workflow

1. **Audit current messages.** Inventory every in-app message: trigger, audience, copy, dismiss rate. Kill the ignored and the annoying — they're training users to dismiss everything.
2. **Define the messaging system.** Message types and when each is appropriate, targeting rules, frequency caps, visual standards, and copy guidelines. Document it — consistency matters.
3. **Design key flows.** Onboarding (first-run → first value), feature announcements (launch calendar tied to releases), and contextual help (top support drivers → in-context tips). Wireframe each flow's sequence.
4. **Write tight copy.** Every message: one idea, benefit-led, clear CTA or dismiss. Test with 5 users — confusion here is cheap to fix now, expensive later.
5. **Implement targeting and caps.** Audience rules, trigger events, frequency caps (global + per-message), and "don't show again" persistence. QA every trigger path.
6. **Measure.** View rate, CTA click rate, dismiss rate, feature adoption lift (exposed vs. control), support ticket impact, and NPS correlation. High dismiss rates = wrong targeting or bad copy.

**Message quality checklist:** targeted to relevant users? → triggered at the right moment? → under 140 chars? → benefit clear? → easy dismiss? → doesn't stack with other messages? → accessible (keyboard, screen reader)?


**Feature announcement playbook:** segment (who benefits?) → message (what changed, why it matters, one CTA) → format (tooltip for minor, modal for major) → timing (next relevant session, not immediately at login) → measure (feature adoption in exposed vs. control cohort) → iterate. Announce benefits, not features — "find anything instantly" beats "we added global search."

**QA checklist:** test on target devices and screen sizes → verify targeting logic with test users → check dark mode and accessibility (contrast, screen readers, keyboard dismissal) → confirm analytics fire → review copy for tone and clarity. In-app messages are product UI — hold them to product quality bars.

**Churn intervention playbook:** detect risk signals (usage drop, support tickets, failed payments) → segment by value and reason → deploy targeted messages (education for confusion, offers for price sensitivity, human outreach for enterprise) → measure save rate → refine triggers.
Intervene early — once users decide to leave, messages rarely reverse it.
## Common pitfalls

- **Tour overload.** 12-step product tours on first login. Progressive, contextual guidance beats upfront dumps.
- **Modal abuse.** Interrupting for non-critical news. Modals are for actions users must take, not announcements.
- **No frequency caps.** Five popups per session. Users learn to dismiss blindly — then miss the important one.
- **Untargeted blasts.** Showing admin features to end users. Target or annoy.
- **No dismiss option.** Trapping users. Always escapable, always remembers the choice.
- **Stale messages.** Launch announcements from 6 months ago still showing. Expire messages; review quarterly.
- **Measuring views, not outcomes.** Celebrating impressions while feature adoption flatlines. Measure behavior change.
- **Modal abuse.** Every announcement as a blocking modal. Users develop banner blindness for your most important messages.
- **No targeting.** Showing the same messages to new and veteran users. Irrelevant messages erode trust in all future messages.
- **Skipping measurement.** Shipping messages without control groups. Without measurement, you cannot distinguish helpful guidance from annoying interruption.
- **Interrupting critical workflows.** Popups during checkout or data entry. Suppress all non-critical messages during high-stakes flows — timing is respect.
- **No frequency governance.** Five teams each sending "just one message." Centralize governance with per-user weekly caps.
