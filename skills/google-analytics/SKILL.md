---
name: google-analytics
description: Use Google Analytics 4 effectively: setup, events, conversions, reports, and privacy-compliant tracking. Use when measuring website or app performance with GA4.
category: analytics
---

# Google Analytics

## Overview

Google Analytics 4 (GA4) is the standard web analytics platform: event-based data model, built-in reports, and explorations for custom analysis.

GA4 measures everything as events (page views, clicks, purchases) with parameters — a shift from UA's session/pageview model.

Effective use: clean implementation, meaningful events and conversions, regular report review, and privacy compliance.

## When to use

- Setting up GA4 on a new website or app
- Tracking conversions and key user actions
- Understanding traffic sources and user behavior
- Building custom reports and explorations
- Ensuring analytics privacy compliance

## Core concepts

- **Event-based model.**
  Everything is an event with parameters. Design your event taxonomy deliberately: consistent names, useful parameters, minimal cardinality.
- **Implementation.**
  gtag.js or Google Tag Manager. GTM preferred for marketers (no code deploys); verify with Tag Assistant and DebugView before trusting data.
- **Conversions (key events).**
  Mark the events that matter (purchase, signup, lead) as conversions. Optimize and report around these — everything else is context.
- **Traffic attribution.**
  UTM parameters on every campaign link, consistent naming. Without UTMs, 'direct' becomes a meaningless bucket.
- **Explorations.**
  Custom funnel, path, and cohort analyses beyond standard reports. Where real insight lives — learn the exploration interface.
- **Data retention and settings.**
  Retention periods, data filters (exclude internal traffic), timezone/currency. Configure once, correctly.
- **Privacy compliance.**
  Consent mode, IP anonymization (default in GA4), data deletion, and regional requirements (GDPR etc.). Analytics must be lawful.
- **BigQuery export.**
  Raw event export for serious analysis: SQL over unsampled data, joined with other sources. The power-user path.

## Practical workflow

1. **Install correctly.**
   GA4 property + data stream, GTM or gtag, internal traffic filter, timezone/currency set. Verify in DebugView + Realtime.
2. **Design event taxonomy.**
   List key user actions; name events consistently (snake_case); define parameters. Document the taxonomy.
3. **Mark conversions.**
   Key events -> conversions. Verify they fire correctly with test transactions before reporting on them.
4. **UTM everything.**
   Campaign URL builder with consistent source/medium/campaign naming. Document the convention for the team.
5. **Build core reports.**
   Acquisition, engagement, conversions — standard reports configured and bookmarked. Weekly review cadence.
6. **Learn explorations.**
   Build one funnel exploration (signup -> activation) and one path exploration. Save and share with stakeholders.
7. **Ensure compliance.**
   Consent mode implemented, privacy policy updated, data retention set, deletion processes documented.
8. **Consider BigQuery.**
   Link BigQuery export for unsampled analysis. Even if unused today, historical data accumulates.

## Common pitfalls

- **No implementation audit.**
  Trusting data from an unverified setup. DebugView + test events before any reporting.
- **Vanity metrics.**
  Reporting pageviews without conversions. Measure outcomes (signups, revenue), not activity.
- **UTM chaos.**
  Inconsistent UTM naming making campaign analysis impossible. Convention documented and enforced.
- **Ignoring internal traffic.**
  Team visits skewing conversion rates. Filter internal IPs/ranges from day one.
- **Event sprawl.**
  200 custom events, 180 unused. Taxonomy discipline: every event needs a consumer (report/decision).
- **Privacy afterthought.**
  No consent mode, indefinite retention, no deletion process. Regulatory risk and user-trust risk.
- **Sampling confusion.**
  Standard reports sample under load; explorations too. BigQuery export for definitive numbers.
- **Set-and-forget.**
  Implemented once, never reviewed. Quarterly: taxonomy audit, conversion verification, report relevance check.
