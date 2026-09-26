---
name: system-design-interview
description: Master system design interviews with a repeatable framework, component deep-dives, and trade-off discussions.
category: career
---

## Overview

System design interviews evaluate how you reason about ambiguity, scale, and tradeoffs — not whether
you've memorized architectures. The interviewer wants a collaborative design session: requirements,
estimates, high-level design, deep dives, and honest tradeoff discussion. This skill teaches a
repeatable framework and the component knowledge to fill it convincingly.

## When to use

- Preparing for senior/staff engineering loops with a design round

- Practicing classic problems (URL shortener, chat, news feed, rate limiter)

- Learning distributed systems fundamentals for interviews

- Improving tradeoff articulation and estimation skills

- Doing mock design sessions with feedback

## Core concepts

- - **The 45-minute framework.** 5 min: clarify requirements (functional + non-functional, scale). 5
  min: back-of-envelope estimates (QPS, storage, bandwidth). 10 min: high-level design (core
  components, data flow). 15 min: deep dive (1-2 hard parts: the bottleneck, the interesting
  tradeoff). 5 min: wrap-up (monitoring, failure modes, what you'd improve).
- - **Requirements before architecture.** Never start drawing boxes. Ask: who are the users, what
  are the core operations, what's the scale (users, reads/writes, latency needs), what's out of
  scope? This is scored heavily.
- - **Estimates show judgment.** Powers of 10 are enough: 10M DAU → ~100 QPS average, 1K peak; 1KB
  per record → ~1TB/year. The point is demonstrating scale intuition, not arithmetic precision.
- - **Deep dive, don't spray.** After the high-level design, pick the genuinely hard part (the feed
  fan-out, the consistent hashing for the shortener) and go deep. Shallow coverage of everything
  scores worse than depth on the crux.
- - **Every choice is a tradeoff.** SQL vs NoSQL, cache-aside vs write-through, push vs pull — state
  what you chose, what you gave up, and under what conditions you'd choose differently. "It depends"
  with specifics is a senior answer.
- - **Drive the conversation.** Ask the interviewer where to focus: "I see two hard problems here —
  the write fan-out and the ranking. Which would you like to dig into?" Collaboration beats
  monologue.

## Practical workflow

1. 1. **Learn the building blocks.** Load balancers, CDNs, caches (Redis/Memcached), message queues
   (Kafka/SQS), databases (SQL vs NoSQL, sharding, replication), object storage, consistent hashing,
   rate limiting, API gateways. For each: what it does, when to use it, its failure modes.
2. 2. **Internalize the framework.** Practice the 5-phase timing until it's automatic. Time yourself
   — running out of time before the deep dive is the classic failure.
3. 3. **Work the classic problems.** URL shortener (encoding, scaling writes), chat system
   (websockets, message ordering, presence), news feed (fan-out strategies), rate limiter
   (algorithms: token bucket, sliding window), search autocomplete (tries, caching).
4. 4. **Practice estimation drills.** 10 minutes each: given a product, estimate QPS, storage,
   bandwidth. Build intuition for common numbers (a tweet ~1KB, a photo ~1MB, daily actives → peak
   QPS ×10).
5. 5. **Run mock sessions.** Present a design aloud to a partner or rubber-duck it. Get feedback on:
   structure, tradeoff discussion, time management, and whether you asked clarifying questions.
6. 6. **Prepare your stories.** Have 2-3 real systems you've built ready to discuss — interviewers
   probe depth on your actual experience, and real war stories beat textbook designs.
7. 7. **Review failure modes.** For every design: what breaks at 10x scale? Single points of
   failure? How do you monitor and alert? Ending with operational maturity signals seniority.

## Common pitfalls

- - **Drawing boxes immediately.** Skipping requirements and estimates to start architecting. The
  interviewer wanted a conversation; you gave them a diagram.
- - **Memorized architectures.** Reciting a blog post's design for "design Twitter" without adapting
  to the stated requirements. Interviewers change constraints to test thinking — adapt live.
- - **No tradeoff discussion.** Presenting choices as obviously correct. Senior engineers discuss
  what they sacrificed and why.
- - **Getting stuck in the weeds.** Spending 20 minutes on database schema details while the
  distributed hard problem goes unaddressed. Watch the clock; ask where to focus.
- - **Ignoring non-functional requirements.** Designing for functionality while forgetting latency,
  consistency, availability targets. These drive every architectural decision.
- - **Monologue mode.** Talking for 40 minutes straight. Pause, check in, invite the interviewer in
  — it's a collaborative exercise, and their hints are lifelines.
