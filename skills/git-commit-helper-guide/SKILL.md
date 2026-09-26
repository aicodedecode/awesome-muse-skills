---
name: git-commit-helper-guide
description: A practical guide to crafting atomic commits and clear Conventional-Commit messages — use when committing or standardizing team history.
category: git
---

## Overview

Good commits are small, self-explanatory units of change with messages that tell
future readers why the change exists. This guide covers the full craft:
splitting work into atomic commits, writing messages in the Conventional
Commits style, and keeping branch history reviewable — whether you write
messages by hand or draft them with AI assistance.

## When to use

- Turning a messy working tree into clean, logical commits
- Writing commit messages that explain rationale, not just content
- Adopting Conventional Commits (`feat:`, `fix:`) on a team
- Tidying a branch before opening a pull request
- Reviewing commit quality in code review

## Core concepts

**Atomicity.** Each commit should contain one logical change, build cleanly,
and be independently revertable. A commit that "fixes the login bug" shouldn't
also reformat unrelated files. Use `git add -p` to stage hunks selectively
and split work that grew together.

**Conventional Commits format.** `type(scope): subject` — e.g.
`fix(auth): handle expired refresh tokens`. Common types: `feat`, `fix`,
`docs`, `refactor`, `test`, `chore`, `perf`. Scopes name the affected area.
A `BREAKING CHANGE:` footer flags incompatible changes. The format makes
history searchable and changelogs automatable.

**Subject line discipline.** Imperative mood ("Add", not "Added"), under ~72
characters, no trailing period. It should complete the sentence "This commit
will…". Everything else goes in the body.

**The body carries the why.** Diffs show what changed; bodies explain the
reasoning: the bug or requirement, alternatives considered, risks, and links
to issues or discussions. A body written today saves an hour of archaeology
in six months.

**Private history is malleable; public history is not.** Rebase, squash, and
reword freely on branches only you use. Once pushed and shared, prefer
`git revert` over rewriting — your teammates' clones depend on stable history.

## Practical workflow

1. **Inspect before committing:** `git status` and `git diff` — confirm the
   staged changes are exactly one logical unit; split with `git add -p` if not.
2. **Draft the message:** type + scope + imperative subject; body with
   context, rationale, and issue references; breaking changes in the footer.
3. **Example:**
   ```text
   feat(payments): retry failed webhooks with exponential backoff

   Webhook delivery failures during the provider outage (INC-118) were
   dropped silently. Adds a retry queue: 3 attempts, backoff 1m/5m/30m,
   then dead-letter with an alert.

   Chose backoff over immediate retry to avoid hammering the provider
   during partial outages. Fixes #482.
   ```
4. **Tidy before sharing:** `git rebase -i main` to squash "wip"/"fix typo"
   commits, reorder logically, and strengthen weak messages.
5. **Verify:** `git log --oneline -8` should read as a coherent story; each
   commit message should make sense without opening the diff.
6. **If using AI to draft messages:** always review the generated "why" —
   models write plausible rationale that may not match your actual reasoning;
   correct it before committing.

## Common pitfalls

- **Vague subjects** ("update", "fix bug", "changes") — permanent noise in
  `git log` and `git blame`.
- **Mega-commits** bundling unrelated changes — unreviewable and dangerous to
  revert; split them.
- **Body that restates the diff** — "changed X to Y" adds nothing; explain the
  decision instead.
- **Forgetting the issue link** — without a reference, the business context
  behind a fix evaporates.
- **Amending or rebasing shared branches** — rewrites history others depend
  on; restrict rewriting to private branches.
- **Inconsistent types/scopes** across the team — half the history using
  `feat:` and half using freeform defeats the purpose; agree once, lint in CI.
