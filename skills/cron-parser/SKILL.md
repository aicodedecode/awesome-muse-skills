---
name: cron-parser
description: Read, write, and debug cron expressions with field reference, scheduling logic, and common patterns.
category: utilities
---

## Overview

Cron expressions are write-only for most people — everyone copies them, few can read them. But
misreading a schedule means backups that never run or jobs that fire 60x too often. This skill makes
cron legible: the five fields, special strings, the day-of-month/day-of-week gotcha, and debugging
techniques for "why didn't it run?"

## When to use

- Writing cron schedules for jobs and automation

- Reading and understanding existing cron expressions

- Debugging jobs that run at wrong times (or not at all)

- Choosing between cron and modern schedulers

- Documenting schedules for teams

## Core concepts

- - **The five fields.** `minute hour day-of-month month day-of-week` — in that order. `30 2 * * *`
  = 2:30 AM daily. Memorize the order with: "my happy dog makes dinner" (minute, hour, dom, month,
  dow) or just drill it until it's reflex.
- - **Field syntax.** `*` (every), `*/15` (every 15), `1,15` (list), `1-5` (range, Mon-Fri for dow),
  `9-17/2` (every 2 hours 9-5). Ranges and steps compose; lists don't take steps in classic cron.
- - **The DOM/DOW trap.** When both day-of-month and day-of-week are restricted (not `*`), cron runs
  when EITHER matches — not both. `0 0 1 * 1` runs on the 1st of the month AND every Monday. This
  surprises everyone once.
- - **Special strings.** `@reboot`, `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly` — readable
  shorthands. Note: `@reboot` behavior varies (and doesn't exist in all cron implementations).
- - **Environment minimalism.** Cron runs with a sparse environment: minimal PATH, no shell profile.
  The #1 "works manually, fails in cron" cause is PATH — use absolute paths for everything or set
  PATH explicitly in the crontab.
- - **Cron flavors differ.** Vixie cron (classic Linux), cronie, systemd timers (the modern Linux
  alternative — more features, logging built in), and cloud schedulers (CloudWatch Events, Cloud
  Scheduler) all have quirks. `@reboot`, seconds fields, and timezone handling vary — check your
  implementation.

## Practical workflow

1. 1. **Write it plainly first.** "Every weekday at 9:30 AM" → then translate: `30 9 * * 1-5`.
   Describe in words before encoding — the words are the spec you'll verify against.
2. **Use the field table.** Build expressions field by field:

   - minute (0-59), hour (0-23), dom (1-31), month (1-12), dow (0-7, both 0 and 7 = Sunday)

   - Verify each field independently before combining.

3. **Common patterns (verify against your cron flavor):**

   - `*/5 * * * *` — every 5 minutes

   - `0 * * * *` — hourly

   - `0 2 * * *` — daily 2 AM

   - `0 9 * * 1` — Mondays 9 AM

   - `0 0 1 * *` — first of month midnight

   - `30 9 * * 1-5` — weekdays 9:30 AM

   - `0 0 * * 0` — Sundays midnight

4. 4. **Debug non-running jobs.** Checklist: is the cron daemon running? Is the crontab installed
   for the right user (`crontab -l`)? Absolute paths everywhere? Environment variables set?
   Permissions on the script (executable)? Output captured (redirect stdout/stderr to a log — silent
   failures are cron's default)? Timezone correct (system vs expected)?
5. 5. **Log everything.** `30 2 * * * /opt/job.sh >> /var/log/job.log 2>&1` — without output
   capture, failures vanish. Better: have the job log itself with timestamps.
6. 6. **Consider alternatives.** Need seconds precision, dependencies, retries, or observability?
   Cron is the wrong tool — use systemd timers, or a proper scheduler (Airflow/Temporal for
   workflows, cloud schedulers for cloud). Cron is for simple, independent, minute-granularity jobs.

## Common pitfalls

- - **The DOM/DOW OR trap.** `0 0 1 * 1` doesn't mean "first Monday" — it means "1st AND Mondays."
  For "first Monday," you need wrapper logic in the script.
- - **Timezone confusion.** Cron uses system local time (usually). DST transitions cause skipped or
  doubled runs. For UTC-critical jobs, set `CRON_TZ` (where supported) or run the system in UTC.
- - **Environment assumptions.** `python` resolving via PATH, `~` expansion, locale settings — all
  differ under cron. Absolute paths, explicit env vars, tested in a clean shell.
- - **Overlapping runs.** A job that takes 70 minutes on an hourly schedule stacks up. Use file
  locks (`flock`) to prevent concurrent runs.
- - **Silent failures.** No output redirection = no evidence. Every cron job should log somewhere
  you'll actually check — or alert on failure.
- - **Editing the wrong crontab.** User crontab vs system `/etc/crontab` (which has an extra user
  field) vs `/etc/cron.d/`. The 6-field system format in a 5-field user crontab breaks mysteriously.
