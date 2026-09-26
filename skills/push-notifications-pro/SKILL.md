---
name: push-notifications-pro
description: Engineer push notification systems — architecture, delivery, personalization, and cross-platform best practices.
category: enterprise-communication
---

## Overview

This skill covers push notifications from the builder's perspective: system architecture, reliable delivery across iOS/Android/web, token management, personalization at scale, and the operational practices that keep pushes fast and trustworthy. (For marketing strategy, see push-notification-strategist.)


Push notifications — mobile, web, and desktop — are the highest-leverage retention channel when done well and the fastest path to uninstalls when done poorly. Professional push strategy balances frequency, personalization, and timing across platforms, treating each notification as a withdrawal from a limited attention budget.
## When to use

- Designing push notification infrastructure
- Improving delivery rates
- Managing device tokens
- Implementing personalized pushes at scale
- Debugging push delivery issues
- Setting up push for a new app

- Designing a mobile app engagement strategy
- Reducing churn with lifecycle messaging
- Coordinating push with email and SMS
- Implementing web push for e-commerce
- Building notification infrastructure at scale
- Debugging delivery issues
## Core concepts

**Platform services.** iOS: APNs; Android: FCM; web: Web Push (VAPID). Each has its own token format, payload limits, priority levels, and feedback mechanisms. Abstract them behind a provider layer — don't scatter platform code through your app.

**Token lifecycle.** Tokens change: app reinstalls, OS updates, user logout/login. Register on every app start, associate tokens with user IDs (not just devices), handle invalid-token feedback (remove dead tokens promptly — sending to them wastes resources and hurts reputation), and support multiple devices per user.

**Delivery architecture.** Queue-based sending (never synchronous), priority queues (transactional before marketing), batching, rate limiting per platform quotas, and retry logic for transient failures. At scale, a dedicated push service beats ad-hoc sends from app servers.

**Payload design.** Title, body, deep link, badge count, sound, image (rich push), action buttons, and custom data for app handling. Keep payloads small (platform limits: ~4KB). iOS: mutable-content for rich handling; Android: data vs. notification payloads behave differently — know the distinction.

**Personalization at scale.** Template + user attributes, event-triggered sends, timezone-aware scheduling, language localization, and A/B testing infrastructure. Personalized pushes require fresh user data — stale attributes produce embarrassing messages.

**Quiet hours and frequency caps.** Enforced server-side: per-user caps by category, timezone-aware quiet hours, critical-override channels for truly urgent alerts. Client-side settings alone are insufficient — the server must enforce.


**Platform mechanics.** iOS (APNs) vs. Android (FCM): permission models differ (iOS requires explicit opt-in, Android 13+ also prompts), delivery reliability varies, and rich formats (images, action buttons) have platform-specific implementations. Web push (service workers) reaches desktop without app installs but faces browser-level permission friction. Design per platform; never assume parity.

**Lifecycle messaging map.** Onboarding (activation nudges) → habitual use (value reminders, streaks) → milestones (achievements, anniversaries) → win-back (dormant user triggers) → transactional (always separate). Map messages to lifecycle stages — a new user and a dormant user need opposite treatments.

**Cross-channel orchestration.** Push + email + SMS + in-app must coordinate: frequency caps across channels (not per channel), priority rules (transactional beats promotional), and fallback logic (unopened push → email digest). Uncoordinated channels bombard users; orchestrated ones feel thoughtful.

**Delivery architecture.** Provider selection (OneSignal, Braze, Airship, custom) → token management (registration, refresh, invalidation) → queueing (priority tiers, rate limiting) → delivery tracking → failure handling.
Token churn is constant (app reinstalls, device changes) — handle gracefully or delivery rates decay silently.
Monitor delivery rates by platform, OS version, and provider — regressions hide in segments.
**Rich notifications.** Images, action buttons, carousels, and custom UI expand what notifications can do.
Rich formats lift engagement 25–40% but add complexity — implement progressively.
Test rendering across OS versions; rich features degrade unpredictably on old devices.
**Quiet hours and time zones.** Respect local time (not server time), honor user-set quiet hours, and batch non-urgent notifications for morning delivery.
One 3am notification can undo months of goodwill — get time zones right.
## Practical workflow

1. **Design the architecture.** Provider abstraction layer, queue infrastructure, token store (user → devices), template service, scheduling service, and analytics pipeline. Plan for scale from the start — push volume grows fast.
2. **Implement registration.** Token registration on app start, user association, permission priming UX (see push-notification-strategist), and handling of denials (offer in-app alternatives).
3. **Build sending pipelines.** Separate pipelines for transactional (immediate, high priority) and marketing (scheduled, batched). Implement retries, dead-letter handling, and per-platform rate limiting.
4. **Add intelligence.** Event triggers, personalization templates, timezone scheduling, A/B testing, frequency caps, and quiet hours — all server-side enforced.
5. **Instrument.** Delivery rates, open rates, time-to-open, opt-out rates, token invalidation rates, and latency (event → push received). Alert on delivery drops — they indicate platform or token issues.
6. **Operate.** Monitor provider feedback (invalid tokens), rotate credentials (APNs keys, FCM), test on real devices per OS version, and review message performance to feed the strategy side.

**Debugging checklist:** token valid and current? → user opted in? → payload within size limits? → correct priority? → provider credentials valid? → device reachable (not in DND/offline)? → app handling the payload correctly?


**Opt-in optimization:** delay the system prompt until a value moment → pre-prompt explaining benefits ("Get price-drop alerts for your wishlist") → A/B test pre-prompt copy → track opt-in rate by entry point. Apps that earn the ask see 60–80% opt-in; apps that ask on launch see 30–40%.

**Campaign QA:** test on iOS and Android physical devices → verify deep links land correctly → check rendering with long/short text → confirm personalization tokens → validate quiet hours and frequency caps → seed-list test before broadcast. One broken broadcast can trigger mass opt-outs.

**Implementation checklist:** provider integrated → tokens captured and stored → permission priming built → categories defined → deep links mapped → analytics instrumented → quiet hours configured → frequency caps set → test devices verified → soft launch → monitor → scale.
Skip steps and pay later — notification infrastructure mistakes are user-facing.
**Debugging delivery:** check token validity → verify provider status → inspect payload formatting → confirm device settings (battery optimization kills background delivery on Android) → test on physical devices.
Most "not working" reports trace to device settings, not code — build diagnostics accordingly.
## Common pitfalls

- **Token rot.** Never cleaning invalid tokens. Delivery rates decay; costs rise. Process feedback promptly.
- **Synchronous sending.** Blocking request threads on push delivery. Queue everything.
- **No user-device mapping.** Sending to devices instead of users — logged-out users get others' notifications. Associate tokens with user sessions.
- **Ignoring platform differences.** Same payload for iOS and Android. Handle each platform's semantics (data vs. notification, badge handling, channels).
- **Stale personalization.** "Hi {name}, your order..." with wrong data. Freshness checks before sending.
- **No frequency enforcement.** Multiple teams sending independently = user bombardment. Central caps, server-side.
- **Untested on real devices.** Simulators don't replicate push behavior faithfully. Test on physical devices, multiple OS versions.
- **Broadcast-first strategy.** Same message to all users. Behavioral triggers outperform broadcasts 3–5x — invest there first.
- **No deep linking.** Notifications opening the app home screen. Every push should land on the relevant content — broken context kills the habit loop.
- **Ignoring opt-out analytics.** Tracking sends but not opt-outs per campaign. Opt-out rate is the ultimate quality metric — alert on spikes.
- **Treating delivery as binary.** "Sent" does not mean "delivered" does not mean "seen." Track the full funnel and optimize each stage.
- **No fallback strategy.** Push-only critical messages. Layer channels for critical communications — push fails silently too often to trust alone.
