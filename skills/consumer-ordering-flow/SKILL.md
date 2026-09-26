---
name: consumer-ordering-flow
description: Design consumer ordering experiences — discovery, cart, checkout, tracking, and reorder flows that convert.
category: doordash
---

## Overview

The consumer ordering flow is the revenue engine of any delivery platform: how customers discover merchants, build carts, check out, track orders, and come back. This skill covers UX design for each stage, conversion optimization, and the retention mechanics that turn one-time orderers into regulars. General e-commerce UX guidance, platform-neutral.


The consumer ordering flow — browse, customize, pay, track, receive — is the product for most delivery customers. Conversion hinges on hundreds of micro-decisions: how menus render, how ETAs display, how tracking feels. The skill is instrumenting every step and optimizing the funnel relentlessly, because small gains at each step compound into large order growth.
## When to use

- Designing or redesigning an ordering app/website
- Improving checkout conversion
- Reducing cart abandonment
- Building order tracking experiences
- Increasing reorder rates
- Personalizing discovery

- Redesigning a food delivery or e-commerce checkout
- Diagnosing drop-off between browse and purchase
- Improving order tracking and post-order experience
- Adding new verticals (grocery, alcohol) to a food app
- Localizing checkout for new markets
- Building scheduled or subscription ordering
## Core concepts

**Discovery.** Search (fast, typo-tolerant, with filters: cuisine, price, rating, delivery time), browse (categories, curated collections, "near you"), and personalization (past orders, favorites, recommendations). The goal: the right merchant in under 30 seconds.

**Menu/product UX.** Scannable categories, appealing item presentation, clear customization (modifiers, sizes, special instructions), dietary info, and honest availability. Decision fatigue kills — curate, don't dump.

**Cart and checkout.** Persistent cart, easy editing, clear fee breakdown (subtotal, fees, tax, tip — no surprises), saved addresses and payments, guest checkout, order scheduling, and promo code handling. Every extra step costs conversions.

**Order tracking.** The anxiety reducer: confirmation → preparation → pickup → on-the-way (live map) → delivered. Proactive updates at each stage, accurate ETAs, courier contact options, and issue reporting built in. Great tracking is a retention feature.

**Reorder and favorites.** One-tap reorder of past orders, favorites lists, scheduled recurring orders, and "order again" prompts. Repeat orders should take seconds, not minutes.

**Trust signals.** Ratings and reviews, hygiene/safety info, accurate photos, responsive support access, and clear refund/reorder policies. Trust is the moat in food delivery.


**The ETA as conversion lever.** Delivery time estimates are the single most scrutinized element: show them early (on listing cards, not just checkout), make them accurate (under-promise slightly), and update proactively when they slip. A/B tests consistently show ETA presentation changes moving conversion 2–5%.

**Menu psychology.** Photos lift conversion 20–30% but slow loading — lazy-load aggressively. Popular-item badges guide choice; too many choices paralyze (cap visible options, paginate the rest). Modifier design (required vs. optional, priced add-ons) directly affects average order value — test default selections carefully.

**Tracking as theater.** The order-tracking screen gets enormous engagement — treat it as a product surface, not a status page: courier location, stage updates, accurate countdowns, and delightful touches (preparing your food animations). Great tracking reduces "where is my order" contacts measurably.

**Search and discovery.** Most orders start with search or browse: autocomplete that handles typos and synonyms, filters that actually filter (cuisine, dietary, price, delivery time), and personalization (past orders surfaced first).
Search failure is silent churn — users who cannot find food leave without complaining. Monitor null-result rates and top failed queries weekly.
**Scheduled ordering.** Advance scheduling (order now, deliver at 7pm) serves planners and smooths demand peaks.
Design: clear scheduling UI (not hidden in checkout), reminder notifications, and merchant confirmation for scheduled slots.
Scheduled orders have higher average values — promote the option, do not bury it.
**Substitution logic.** For grocery/retail: define substitution preferences upfront (best match, specific brand only, refund if unavailable).
Surprise substitutions are a top complaint category. Get preferences at checkout, confirm substitutions in tracking, and make refunds one-tap.
## Practical workflow

1. **Map the flow.** Discovery → merchant → menu → cart → checkout → tracking → post-delivery. Instrument every step: conversion rates, drop-offs, time spent.
2. **Optimize discovery.** Search quality (relevance, speed, filters), personalization (recommend based on history), and merchandising (collections for occasions: "late night", "healthy", "group orders").
3. **Streamline checkout.** Audit the steps: can anything be removed or pre-filled? Test fee presentation (all-in vs. itemized), wallet payments, and address autocomplete. Target: checkout completion above 70%.
4. **Build tracking.** Real-time status pipeline, live courier map, proactive delay notifications (with revised ETAs — honesty beats optimism), and in-flow issue resolution (missing item? wrong order? — resolve without phone calls).
5. **Drive repeats.** Post-delivery: rate the experience, save favorites, reorder prompts, personalized offers, and loyalty/points. Email/push win-back for lapsed users with their favorite merchants featured.
6. **Measure.** Conversion funnel rates, cart abandonment, average order value, order frequency, 30-day retention, NPS, support contacts per order. Segment by new vs. returning.

**Checkout UX checklist:** guest option, saved payment/address, fee transparency pre-payment, tip selection clarity, schedule-ahead option, order confirmation with tracking link, receipt.


**Funnel instrumentation:** define stages (app open → store view → menu view → item added → checkout started → payment → confirmed) → measure conversion between each → set alerts on week-over-week drops >5% at any stage → weekly review with hypotheses. Most drop-off concentrates at 1–2 stages — find yours before optimizing broadly.

**Checkout friction audit:** count taps from menu to confirmation (target: under 10) → test guest checkout → verify address/zone validation happens before menu browsing (not at payment) → confirm payment options include wallets → check error recovery (failed payment → one-tap retry). Run the audit quarterly and after every redesign.

**Personalization roadmap:** phase 1: reorder surfaces (past orders, favorites) → phase 2: contextual suggestions (time-of-day, day-of-week patterns) → phase 3: ML recommendations (collaborative filtering on dish level) → phase 4: predictive (pre-filled carts for routine orders).
Each phase must prove incremental order lift before the next is funded.
**Localization checklist:** language and currency → address formats → payment methods (local wallets, cash on delivery) → dietary and cultural filters → holiday schedules → right-to-left layouts where needed.
Partial localization (translated UI, foreign payment norms) converts worse than honest English — commit fully or do not launch.
## Common pitfalls

- **Fee surprises.** Totals jumping at the last step. Show all-in pricing early — trust converts.
- **Weak search.** Poor results for "sushi near me open now". Search quality is a core competency, not a feature.
- **Tracking opacity.** "Preparing your order" for 45 minutes with no updates. Proactive, honest status at every stage.
- **No reorder path.** Forcing repeat customers through full discovery. One-tap reorder is a must.
- **Ignoring issues in-flow.** Making customers call support for missing items. Build resolution into tracking.
- **Over-personalization.** Recommendations so narrow users never discover. Balance familiarity with discovery.
- **Desktop-first design.** Ordering happens on phones, often one-handed, often hungry. Mobile-first, thumb-friendly, fast.
- **Hiding fees until checkout.** Drip pricing destroys trust and spikes abandonment. Show the full price (including fees and tip expectations) as early as possible.
- **Generic ETAs.** One static estimate for all conditions. ETAs must reflect real-time load, weather, and merchant prep — stale estimates are worse than conservative ones.
- **Neglecting the reorder flow.** Repeat customers are the majority of orders; burying reorder behind full menu browsing wastes their loyalty. One-tap reorder is a retention feature.
- **Ignoring low-end devices.** Designing on flagships while customers order on $100 Androids. Test on real low-end hardware — performance is a conversion feature.
- **Over-personalization.** Hiding discovery behind "for you" rails. Balance personalization with serendipity — users want both routine and novelty.
