---
name: cron-monitoring
description: Monitoring scheduled jobs — heartbeat checks, missed runs, and duration anomalies — platform-agnostic patterns.
category: sentry
---

## Overview

Cron jobs fail silently: the scheduler dies, credentials expire, a deploy
breaks the script — and nobody notices until the missing report, stale data,
or lapsed certificate causes real damage. Cron monitoring (heartbeat/dead-
man's-switch checks) closes this gap by verifying jobs actually run and
succeed on schedule. This skill covers the patterns.

## When to use

- Adding monitoring to existing cron jobs or scheduled tasks
- Choosing heartbeat vs exit-code vs log-based monitoring
- Detecting missed runs, late runs, and duration anomalies
- Monitoring jobs across servers, containers, and serverless
- Building the "did the nightly job run?" dashboard

## Core concepts

**Heartbeat (dead man's switch) monitoring.** The job pings a monitoring
endpoint at start and on successful completion; the monitor alerts if the
expected ping doesn't arrive within the schedule window + grace period.
This catches the worst failure mode — the job never running — which
exit-code monitoring alone misses entirely.

**Three signals per job.** Started on time (schedule adherence), completed
successfully (exit status / success ping), and duration within norms
(sudden 10x slowdowns signal trouble even when the job "succeeds"). Monitor
all three; each catches a different failure class.

**Grace periods and expected variance.** Jobs don't run at exactly 02:00:00
— schedulers queue, machines are busy. Set the expected window generously
(schedule interval + reasonable grace), and wider for jobs with variable
duration. Too tight = false alarms; too loose = late detection. Tune from
observed history.

**Distinguish "didn't run" from "ran and failed".** Start ping vs success
ping separation tells you whether the scheduler/job never started (infra
problem) or started and errored (job problem) — different responders,
different runbooks.

**Monitor the monitor's coverage.** Keep a registry of all scheduled jobs
with their expected schedules; alert on jobs with no monitoring configured.
The unmonitored job is the one that will fail silently.

## Practical workflow

1. **Inventory every scheduled job:** what, where it runs, schedule,
   owner, and what breaks if it silently stops — this registry is the
   foundation.
2. **Add heartbeat instrumentation:** ping start/success (or use the
   platform's cron-monitoring feature) with the job's identity and run
   metadata; keep the ping mechanism simple and dependency-free (a failing
   job should still be able to report failure).
3. **Configure expectations:** schedule + grace period per job, based on
   observed run times; alert routing to the job's owner.
4. **Track duration:** record run times, alert on significant deviation
   from baseline (2–3x p99), which often precedes outright failure.
5. **Build the overview:** a single dashboard showing all jobs, last run,
   status, and next expected run — the "morning check" view for on-call.
6. **Test the alerts:** deliberately break a non-critical job's schedule
   (or simulate a missed ping) and verify the alert fires and routes
   correctly — untested monitoring is decoration.

## Common pitfalls

- **Monitoring only failures, not absence** — exit-code alerts catch
  failures; only heartbeats catch "never ran". You need both.
- **Grace periods too tight** — normal scheduler jitter pages on-call
  weekly; base windows on measured history.
- **No job registry** — jobs added without monitoring, discovered only
  when they fail silently; make monitoring part of the job-creation
  checklist.
- **Heartbeat endpoint as a dependency** — if the monitoring endpoint is
  down, every job "fails"; keep pings fire-and-forget and monitor the
  monitor separately.
- **Ignoring duration drift** — a job creeping from 5 to 50 minutes is
  heading for timeout/overlap failure; trend it.
- **Alerting to nobody** — cron alerts to an unmonitored email alias;
  route to the owner with an escalation path like any other alert.
