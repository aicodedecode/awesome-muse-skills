---
name: yeet
description: Ship fast with throwaway automation: quick scripts and one-off automations built in minutes, used, then discarded. Use when a small annoying task needs doing now, not a system designed.
category: workflow-automation
---

# Yeet

## Overview

Yeet is the discipline of fast, disposable automation: a 20-line script written in 15 minutes that saves hours this week — then gets deleted without ceremony.

Not every automation deserves architecture. Some tasks need doing once, urgently, and perfectly is the enemy of done.

The yeet mindset: bias to action, timeboxed effort, good-enough correctness, and zero guilt about deleting it after.

## When to use

- A one-off data cleanup or migration needed today
- Repetitive task you'll do 50 times this week then never again
- Prototyping an automation before building it properly
- Quick personal productivity hacks
- When 'proper solution' estimates say 2 weeks and you need it now

## Core concepts

- **Timebox the build.**
  15-60 minutes max. If it takes longer, it's not a yeet — it's a project. Set a timer; ship or stop.
- **Good-enough correctness.**
  Handle the 95% case visibly; log or skip the edge cases. A yeet that handles everything is just slow engineering.
- **Read-only first.**
  Prefer scripts that read and report over scripts that write. When writing: dry-run mode, backups, and a revert plan.
- **Disposable by design.**
  One file, inline config, minimal dependencies. If it needs a README and tests, it's graduated beyond yeet.
- **The 3x rule.**
  Yeet when: time to build < (time saved / 3). Rough math keeps you from gold-plating throwaways.
- **Know when to graduate.**
  Used three times? Promoted to a real script with error handling. Used by others? Now it's a tool with docs. Yeets have lifecycles.
- **Delete without ceremony.**
  Task done, yeet served its purpose: delete it. A graveyard of one-off scripts becomes unmaintainable clutter.
- **Log what it did.**
  Even throwaways should print what they changed. Future debugging (including 'what did that script do?') needs the trail.

## Practical workflow

1. **Identify the annoyance.**
   What's the concrete, painful, repetitive thing? Name it in one sentence. Vague annoyances make vague scripts.
2. **Timebox it.**
   Decide upfront: 20 minutes? An hour? The box is the discipline — it forces the simple solution.
3. **Write the smallest script.**
   One file, standard library preferred, hardcoded values fine. Read the data, do the thing, print results.
4. **Dry-run first.**
   If it writes/deletes: preview mode showing what would happen. Review the preview. Then run for real.
5. **Run and verify.**
   Check the output actually fixed the problem. Spot-check results; yeets earn trust through verification, not ceremony.
6. **Decide: keep or delete.**
   One-off done? Delete. Recurring? Graduate it (error handling, config, docs) or schedule the next yeet.
7. **Note the pattern.**
   Yeeted the same class of task twice? That's a signal — the third time, build it properly.
8. **Share the trick.**
   A yeet that helped you might help the team. Share the snippet; let usefulness decide if it graduates.

## Common pitfalls

- **Yeeting the irreversible.**
  Throwaway scripts doing bulk deletes without dry-run or backup. Speed doesn't excuse recklessness with destructive ops.
- **No timebox.**
  'Quick script' becoming a 3-day project. The timebox is what makes it a yeet; without it, it's just sloppy engineering.
- **Keeping every yeet.**
  200 throwaway scripts in ~/scripts, none documented. Delete on completion or graduate deliberately.
- **Yeeting the recurring.**
  Manually re-running a 'one-off' script weekly for a year. Third use = graduate it properly.
- **No verification.**
  Assuming the script worked. Spot-check output — yeets are fast, not infallible.
- **Secrets in throwaways.**
  API keys pasted into quick scripts, then the script gets shared or committed. Even yeets use env vars.
- **Yeeting what should be a product.**
  Customer-facing or team-critical workflows built as throwaways. Yeets are for internal, reversible, timeboxed needs.
- **Analysis paralysis.**
  Spending an hour deciding whether to yeet. The whole point is speed — if the 3x rule says yes, start typing.
