---
name: git-commit-helper
description: Write clear, conventional commits: atomic changesets, imperative subjects, useful bodies, and history hygiene. Use when committing code, writing PR descriptions, or cleaning up branch history.
category: development
---

# Git Commit Helper

## Overview

Commits are **communication with future maintainers** — including yourself in six months. A good
commit answers three questions at a glance: what changed, why it changed, and what to know before
touching it. This skill covers the craft: atomic changesets, conventional message format, bodies
that explain reasoning, and history hygiene (rebasing, squashing, fixups) that keeps `git log`
readable instead of archaeological.

Well-kept history turns `git blame` from a blame tool into a documentation tool.

## When to use

- Writing commit messages for everyday work.
- Splitting a messy working tree into logical commits.
- Cleaning up a branch before opening a PR (rebase, squash, reorder).
- Writing PR descriptions that reviewers can act on.
- Establishing commit conventions for a team (conventional commits, changelogs).

## Core concepts

- **Atomic commits.** One commit = one logical change: it builds, it passes tests, and reverting
  it removes exactly one thing. "Fix login bug and refactor utils and update docs" is three commits
  wearing a trench coat.
- **Conventional Commits.** `type(scope): subject` — e.g. `feat(auth): add TOTP two-factor setup`.
  Types (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`) make history greppable
  and changelogs generatable. Adopt it repo-wide or not at all — half-adopted conventions are noise.
- **Imperative subject.** "Add retry logic" not "Added retry logic" — the subject completes "this
  commit will…". Keep it under ~50–72 chars; the body carries the detail.
- **Body explains why.** The diff shows *what*; the message explains *why this approach*,
  what alternatives were rejected, and any non-obvious consequences. Link the issue/ticket.
- **History hygiene.** Rebase private branches onto main before PR; squash fixup commits; drop
  "wip" and "fix typo" noise. Never rewrite public/shared history — the convenience isn't worth
  the chaos for collaborators.
- **PR description = commit message at scale.** What, why, how to test, screenshots for UI,
  breaking changes flagged loudly. Reviewers triage from the description; make it earn the click.

## Practical workflow

1. **Stage deliberately.** Use `git add -p` to stage hunks, not files — split unrelated changes
   into separate commits even when they're in the same file.
2. **Write the message:**
   ```text
   feat(checkout): make order placement idempotent

   Double-taps on "Place order" created duplicate charges (INC-2214).
   Adds an idempotency key generated client-side and stored server-side
   for 24h; duplicate submissions return the original order.

   Considered disabling the button only, but network retries would still
   duplicate — key-based dedup covers both paths.
   ```
3. **Self-review the diff** (`git show`, or the PR diff view) before pushing: stray files, debug
   code, and accidental secrets get caught here.
4. **Clean the branch.** `git rebase -i main`: squash fixups, reword weak messages, drop noise.
   Aim for a branch where each commit could be reviewed and reverted independently.
5. **Push and open the PR** with a description covering: what/why, test plan, risk areas, and
   anything reviewers should look at first.
6. **After merge**, delete the branch. Stale branches are where "which one is current?" confusion breeds.

Everyday commands:

```bash
git add -p                    # stage hunks interactively
git commit -v                 # show diff in editor while writing message
git rebase -i main            # tidy private branch history
git commit --fixup=<sha>      # mark a fix for autosquash later
git rebase -i --autosquash main
git log --oneline -15         # sanity-check the story your branch tells
```

## Common pitfalls

- **"wip" commits on shared branches.** Fine locally; never in a PR. Squash before review.
- **Mixing refactors with behavior changes.** Reviewers can't tell what's safe. Refactor commit
  first (no behavior change), behavior commit second.
- **Empty or misleading messages.** "fix stuff", "updates", or a message describing what the code
  *used* to do. If the message doesn't help future-you, rewrite it.
- **Committing secrets or junk.** `.env`, credentials, `node_modules`, IDE files — `.gitignore`
  early, and use `git-secrets`-style hooks to catch accidents before push.
- **Rewriting public history.** Force-pushing shared branches or amending merged commits breaks
  collaborators' clones. Rebase is for private branches only.
- **Mega-commits.** A 3,000-line "implement feature X" commit is unreviewable and unrevertable.
  If you can't split it, at least split the message into a real summary + body.
- **No link to the why.** A fix with no issue reference and no rationale becomes a mystery the
  next time someone touches that code. Two extra lines now save an hour later.
