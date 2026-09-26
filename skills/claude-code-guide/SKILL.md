---
name: claude-code-guide
description: Get productive with agentic coding assistants — task framing, iterative prompting, file-scoped workflows, review loops, and multi-file refactors. Use when pairing with an AI coding agent on real codebases.
category: ai-research
---

# Agentic Coding Assistant Guide

An agentic coding assistant can read your repo, edit files, run commands, and iterate. Your 
leverage comes from task framing, scoping, and verification — not from typing faster.

## Overview

The coding agent loop is: describe intent -> agent explores and plans -> agent edits -> you verify. 
You steer by writing precise task descriptions, constraining scope, and demanding evidence. The 
biggest wins come from using the agent for exploration ("map how auth works in this repo") and 
multi-file mechanical work (renames, migrations, adding consistent patterns), while keeping 
high-judgment decisions — architecture, public APIs, security boundaries — firmly human.

## When to use

- Onboarding to an unfamiliar codebase: ask the agent to map modules, trace data flow, summarize 
conventions.
- Mechanical multi-file changes: renaming, upgrading a library's API across call sites, adding 
logging consistently.
- Writing tests for existing code: generate the scaffold, then review the assertions yourself.
- Debugging: have the agent reproduce, instrument, and bisect while you guide hypotheses.
- Drafting boilerplate: new endpoints, components, migrations following existing repo patterns.

## Core concepts

- **Task framing**: describe the outcome and constraints, not the implementation. "Add retry with 
backoff to the fetcher; follow the pattern in `net/retry.py`" beats "write some retry code."
- **Repo context files**: durable instructions (conventions, commands, no-go zones) the agent reads 
automatically. Invest in these; they pay off every session.
- **Plan mode**: for risky or large changes, ask for a plan first, review it, then authorize 
execution. Cheap insurance against mis-scoped edits.
- **Verification loop**: the agent's work is a draft until tests pass and you read the diff. Ask it 
to run the relevant tests and report results.
- **Small commits**: have the agent work in reviewable chunks. A 2000-line unreviewed diff defeats 
the purpose.
- **Session continuity**: long tasks benefit from written summaries — ask the agent to record 
decisions and progress so a fresh session can resume.

## Practical workflow

1. Start each task with a one-paragraph brief: goal, scope boundaries, files in play, tests to 
satisfy.
2. For anything over ~5 files changed, request a plan first and approve it before edits begin.
3. Point the agent at existing examples in the repo ("match the style of `handlers/`") instead of 
describing style in prose.
4. After edits, ask for: the diff summary, test results, and any assumptions it made.
5. Review the diff yourself — especially error handling, auth checks, and anything touching data.
6. Commit in small steps with clear messages; note agent-assisted changes in the message for 
auditability.

```text
Good task brief template:
GOAL:     <what is done when this succeeds>
SCOPE:    <files/dirs in play; what NOT to touch>
PATTERN:  <existing file to imitate>
TESTS:    <command to run; expected result>
GUARDRAILS: <e.g. no schema changes, keep public API stable>
```

## Common pitfalls

- **Vague prompts, surprising diffs**: "improve this" invites scope creep. Say exactly what "done" 
means.
- **Skipping the diff review**: agent-generated code that compiles is not necessarily correct. Read 
every changed hunk.
- **No tests run**: always demand the agent run tests and show output, not just claim success.
- **Large unscoped refactors**: letting the agent roam the whole repo. Scope tightly; expand only 
after small wins.
- **Secrets in prompts**: never paste credentials into a task; use env files and let the agent read 
config, not secrets.
- **Treating the agent as infallible**: it will confidently misread intent. The plan-review-diff 
discipline exists because of this.
