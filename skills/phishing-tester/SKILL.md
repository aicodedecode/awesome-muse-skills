---
name: phishing-tester
description: Run authorized phishing simulations to measure susceptibility, train staff, and strengthen reporting culture — safely and ethically.
category: security
---

## Overview

Phishing simulations send benign, clearly-controlled mock lures to employees to measure how many click, how many report, and how fast. Done well, they are a training tool that builds the reporting habit. Done badly, they are a trust-destroying gotcha exercise. The difference is entirely in program design: transparency, proportionality, and blameless follow-up.

This skill covers running an ethical simulation program: authorization, safe lure design, measurement, and coaching. It contains no real phishing tradecraft.

A simulation program lives or dies on trust: employees must believe it exists to protect them, not to trap them. Announce the program, explain the no-punishment policy in plain language, and make every touchpoint educational. The day employees forward real phish to security without being asked, the program has worked — regardless of what the click-rate dashboard says.

## When to use

- Establishing a baseline of phishing susceptibility for awareness planning.
- Validating that training and technical controls (email filtering, reporting button) work.
- Meeting compliance or cyber-insurance expectations for testing human controls.
- After a real phishing incident, to check whether the lesson stuck.

## Core concepts

- **Authorization and scope:** written approval from leadership and HR/legal; simulations target employees as part of an announced security program — never secret tests of individuals, never targeting personal accounts.
- **Benign by design:** lures must be obviously fake on close inspection, contain no malware, harvest no real credentials (use clearly-labeled training landing pages), and cause no data loss.
- **Proportionality:** lures should resemble realistic threats, not exploit personal trauma, financial fear, or HR consequences (fake layoffs, fake bonus cuts, fake disciplinary notices are off-limits).
- **The metric that matters is reporting:** click rate tells you exposure; report rate and report speed tell you resilience. Optimize for reporting.
- **Immediate micro-training:** a clicker lands on a 60-second "here is what gave it away" page — education at the teachable moment, not a walk of shame.
- **Aggregate, don't single out:** report by department/role for coaching; individual data stays with security and managers for supportive follow-up only.

- **Difficulty calibration.** Start with obvious lures and progress to sophisticated ones. A baseline that crushes morale with a nation-state-grade lure teaches nothing.
- **Channel expansion with care.** Email first; SMS and voice simulations only with explicit additional approval, as they feel more invasive and carry higher trust risk.
- **Control effectiveness signal.** Simulation results also test your email filtering — high click rates on lures that should have been filtered are a tooling problem, not a people problem.

## Practical workflow

1. **Get authorization:** leadership + HR + legal sign-off on the program charter: purpose, scope, lure boundaries, data handling, and no-punishment policy. Announce the program's existence (not the schedule).
2. **Baseline:** run a neutral-difficulty simulation to establish click/report rates by department. This is your before picture.
3. **Design lures responsibly:** model on current real-world themes (fake shared doc, password expiry, delivery notice); keep difficulty progressive; never use the prohibited themes above.
4. **Execute safely:** send in waves during business hours; landing pages clearly branded as training; no credential storage — if a form is used, discard input and say so.
5. **Measure:** click rate, credential-submit rate (if applicable), report rate, median time-to-report, and repeat-clicker rate. Compare against baseline.
6. **Coach and improve:** immediate micro-training for clickers; targeted coaching for repeat clickers and high-risk roles; share anonymized trends org-wide ("reporting up 40% — great work"); feed results into the awareness program.

### Program charter essentials

- Purpose: measure and improve phishing resilience, not punish
- Scope: which populations, which channels (email; SMS/voice only with extra approval)
- Prohibited lure themes (HR actions, layoffs, personal emergencies, financial threats)
- Data handling: who sees individual results, retention period
- No-punishment commitment and coaching approach
- Success metrics: report rate and time-to-report trending up

### Sustaining the practice

- Vary themes each round; retire lures after a single use
- Publish anonymized trends org-wide to normalize reporting as a shared win
- Align simulation difficulty progression with training curriculum
- Review the program charter annually with HR and legal

### Metrics that prove it works

- Click, submit, and report rates by department, trended per round
- Median time-to-report (the resilience metric)
- Repeat-clicker rate after coaching intervention
- Coaching completion rate for clickers

## Common pitfalls

- **Gotcha culture.** Surprise tests with punishment destroy the trust that reporting culture needs. Announce the program; coach, don't punish.
- **Cruel or manipulative lures.** Fake layoffs or bonus threats cause real distress and HR crises. Keep lures professional and proportional.
- **Harvesting real credentials.** Never collect or store actual passwords, even "for training." Use obviously-fake forms and discard input.
- **Measuring only clicks.** A program that drives clicks down but never measures reporting is optimizing the wrong thing.
- **Targeting personal accounts or non-employees.** Simulations stay inside the employment relationship and the announced program.
- **No follow-through.** Simulations without coaching and control improvements are just surveillance. Every round should change training or tooling.
- **Testing too frequently.** Monthly gotcha emails breed fatigue and resentment. Quarterly themed rounds with fresh lures beat constant low-grade testing.
- **Reusing the same lure.** Teams learn the template, not the skepticism. Retire lures after one use and model new ones on current real-world campaigns.
- **Naming and shaming departments.** Public leaderboards of 'worst clickers' destroy trust. Share trends, coach privately, celebrate reporting.
- **Simulations during layoffs or crises.** Testing stressed employees facing real uncertainty is cruel and produces meaningless data. Pause the program when the org is under strain.
