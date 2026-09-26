---
name: announcement-banners
description: Use announcement banners effectively — in-app and site banners for launches, alerts, and critical messages.
category: enterprise-communication
---

## Overview

Announcement banners (the strips at the top of apps and sites) deliver can't-miss messages: launches, maintenance windows, critical alerts, and promotions. This skill covers banner strategy — when banners are appropriate, design, copy, targeting, and the discipline to prevent banner blindness.


Announcement banners — the strips atop websites and apps proclaiming launches, maintenance, or urgent news — are the simplest broadcast surface and the easiest to abuse. Effective banner strategy treats them as scarce attention real estate: clear criteria for what qualifies, disciplined copy, and automatic expiry. Everything else is visual noise users learn to ignore.
## When to use

- Announcing product launches in-app
- Communicating maintenance or downtime
- Displaying critical alerts
- Promoting time-sensitive offers
- Designing banner systems
- Fixing banner blindness

- Product launches and major announcements
- Scheduled maintenance warnings
- Urgent service disruptions
- Cookie-consent-adjacent policy announcements
- Promoting limited-time beta programs
- Announcing pricing changes
## Core concepts

**Banner hierarchy.** Severity levels: critical (system-wide issues — persistent, high contrast), important (action required — dismissible after reading), informational (nice to know — subtle, auto-expiring). One banner at a time per level — stacking banners trains users to ignore all of them.

**When banners fit.** Time-sensitive + broadly relevant + actionable: maintenance windows, security notices, major launches, policy changes. Not for: minor updates (use changelog), personalized messages (use targeted messaging), or permanent content (banners are temporary by nature).

**Design.** High contrast for critical, brand-aligned for informational; concise copy (one line + CTA); clear dismiss (X) except for critical; responsive (mobile banners must not eat the screen); accessible (color contrast, screen-reader announcements for critical).

**Copy.** Under 100 characters: what + what to do. "Scheduled maintenance Sunday 2–4am UTC — [details]" beats "We're making improvements!" Every banner needs either a CTA or a dismiss — never a dead end.

**Targeting and timing.** Show to affected users only (by role, region, plan, or feature usage). Schedule: appear before the event (maintenance warnings 48h + 24h + 1h), expire automatically after. Stale banners are worse than none — they teach users that banners lie.

**Banner blindness.** The #1 enemy: overuse → invisibility. Rules: max one non-critical banner at a time, auto-expiry on all, performance tracking (dismiss rates, CTR), and quarterly audits. If everything is announced, nothing is.


**The qualification bar.** Banners should meet all three: important to most viewers (not just the marketing team), time-bound (expiry date set at creation), and actionable or informative (links somewhere useful). If it fails any criterion, use a less intrusive surface. Most banner abuse comes from treating the homepage strip as free advertising.

**Severity design language.** Informational (neutral color, dismissible) → warning (amber, persistent during the event) → critical (red, non-dismissible during active incidents). Consistent visual language trains users to gauge importance at a glance. Never use critical styling for marketing — it spends trust needed for real emergencies.

**Targeting and dismissal.** Target by audience (new vs. returning, plan tier, geography), page (relevant surfaces only), and frequency (show once per session, or until dismissed — then respect the dismissal). Dismissed banners must stay dismissed; re-showing them is a trust violation.

**Copy formulas that work.** Launch: "New: [benefit] — [CTA]." Maintenance: "Scheduled maintenance [date, time, duration] — [details]." Urgent: "[Service] disruption — we're on it. [Status link]."
Front-load the news; put the link last. Under 100 characters including CTA.
Test copy with five users: can they state what is happening and what to do? If not, rewrite.
## Practical workflow

1. **Define the banner system.** Severity levels, design specs per level, copy guidelines, targeting capabilities, and expiry rules. Document who can publish banners (governance prevents abuse).
2. **Set governance.** Approval for non-critical banners, automatic expiry mandatory, one-active-banner rule, and a calendar to avoid collisions (marketing vs. product vs. ops banners competing).
3. **Design templates.** Per severity: layout, colors, copy patterns, CTA styles, dismiss behavior. Build once, reuse consistently.
4. **Target precisely.** Audience rules per banner (affected users only), scheduling (start/end times), and frequency (don't re-show dismissed banners unless critical).
5. **Launch and monitor.** Track: view rate, CTR, dismiss rate, time-to-dismiss. Fast dismissal = irrelevant or annoying. Slow CTR on critical banners = copy/design failure.
6. **Audit quarterly.** Active banners (should be zero stale), performance by type, user complaints, and governance compliance. Prune ruthlessly.

**Banner decision tree:** Is it time-sensitive? → Is it relevant to most viewers? → Does it need action? → Yes to all: banner. Otherwise: changelog, email, or in-app message.


**Banner ops checklist:** request includes message, audience, start/end dates, link, and severity → review against qualification bar → write copy (under 100 characters, verb-led) → set targeting rules → QA on mobile and desktop → schedule with automatic expiry → measure CTR and dismissal rate → retrospective for major announcements. Expiry automation is non-negotiable — stale banners are the most common failure.

**Maintenance banner sequence:** T-7 days: informational banner on relevant surfaces → T-24h: warning banner → during: critical banner with status link → after: removal + confirmation message. Proactive communication during maintenance cuts support tickets dramatically.
## Common pitfalls

- **Permanent banners.** "New feature!" banners live for months. Every banner gets an expiry date at creation.
- **Stacking.** Three banners pushing content down. One at a time, prioritized by severity.
- **Untargeted blasts.** Showing irrelevant banners to everyone. Target to affected users.
- **Vague copy.** "Exciting updates ahead!" — no information, no action. Specific and actionable.
- **No dismiss.** Forcing users to stare at acknowledged messages. Dismissible (except truly critical).
- **No governance.** Every team publishing banners independently. Central approval and calendar.
- **Marketing overuse.** Promotional banners crowding out operational ones. Separate lanes or strict priority rules.
- **Permanent banners.** Announcements from three months ago still displayed. Automatic expiry prevents this entirely — no banner without an end date.
- **Marketing disguised as system messages.** Using urgent styling for promotions. Users cannot distinguish real alerts from ads, so they ignore both.
- **No mobile testing.** Banners that break layouts or cover CTAs on small screens. Mobile QA is mandatory — most traffic is mobile.
- **Banner stacking.** Three banners at once pushing content down. One banner at a time — queue the rest.
- **No analytics.** Flying blind on whether banners work. Track impressions, CTR, and dismissal rate per banner.
- **Vague copy.** "Exciting changes ahead!" Banners need specifics — what, when, and what to do.
- **No A/B testing.** Never optimizing banner copy. Test variants; small copy changes move CTR significantly.
