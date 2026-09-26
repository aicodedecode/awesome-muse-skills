---
name: git-pro-dev
description: Master Git: branching strategies, rebasing, history surgery, bisecting, and recovering from disasters. Use when working with Git beyond basic commit/push.
category: development
---

# Git Pro (Dev)

## Overview

Git rewards **deep understanding**: the developers who know the object model (commits as snapshots,
branches as pointers, the index as a staging area) can reshape history fearlessly, bisect regressions
in minutes, and recover from disasters that panic everyone else. This skill covers professional Git —
branching strategy, clean history, the rebase/merge decision, and the recovery toolkit.

The through-line: understand the model and Git becomes predictable; memorize commands and it stays magic.

## When to use

- Choosing or changing branching strategy.
- Cleaning up branch history (rebase, squash, fixup).
- Finding regressions (bisect) or understanding history (blame/log).
- Recovering from mistakes (bad rebase, deleted branch, bad merge).
- Reviewing Git practices for a team.

## Core concepts

- **The object model.** Commits are immutable snapshots with parents; branches are movable
  pointers; HEAD points at your current commit; the index is the proposed next commit. Every
  "scary" operation (rebase, reset) is just moving pointers — the objects remain until garbage
  collected, which is why recovery usually works.
- **Branching strategy, minimal.** Trunk-based (short-lived branches off main, merged fast) for
  most teams; long-lived release branches only when supporting multiple versions. Strategy follows
  release needs — ceremony without need is just friction.
- **Merge vs rebase.** Rebase private branches (clean, linear history — your mess, your cleanup);
  merge public/shared history (preserves true history, never rewrite what others based work on).
  Squash-merge for PRs when individual commits aren't meaningful; keep commits when they tell a
  story worth preserving.
- **The index as a tool.** `git add -p` stages hunks, not files — craft atomic commits from messy
  worktrees. `git stash` (with `-u`, `--keep-index`) for context switches; `git worktree` for
  parallel branches without stashing at all.
- **History as documentation.** `git log --oneline --graph`, `git blame -L` (blame line ranges),
  `git log -S "string"` (pickaxe: find when a string appeared/disappeared), `git bisect` for
  regressions. History answers "why is it like this?" — keep it answerable.
- **Reflog: the safety net.** `git reflog` records every pointer move for ~90 days — deleted
  branches, bad rebases, and reset --hard accidents are almost always recoverable from it. Panic
  less; reflog more.

## Practical workflow

1. **Branch small, merge fast.** Branch per task from current main; keep it focused; rebase onto
   main periodically (`git pull --rebase`); merge within days, not weeks — long branches rot.
2. **Craft the history before review.** `git rebase -i main`: squash fixups (`--autosquash` with
   `commit --fixup`), reword weak messages, drop noise. Each remaining commit: builds, passes
   tests, and is independently revertable.
3. **Find regressions with bisect.** `git bisect start; git bisect bad; git bisect good <sha>`;
   then `git bisect run ./test.sh` to automate. Binary search through history — logarithmic,
   not archaeological.
4. **Investigate with pickaxe and blame.** `git log -S "oldFunction(" --oneline` finds when code
   changed; `git blame -L 40,60 file` shows who/why per line; follow the commit message to the
   original reasoning.
5. **Recover calmly.** Bad rebase/reset → `git reflog`, find the pre-disaster SHA, `git reset
   --hard <sha>`. Deleted branch → reflog or `git fsck --lost-found`. Bad push to shared branch →
   communicate first, then revert (don't force-push shared history).
6. **Keep the repo healthy.** `.gitignore` right (no secrets, no build artifacts, no IDE noise);
   hooks for fast checks (lint/format — keep them fast or developers bypass them); prune stale
   branches (`git fetch --prune`); LFS for large binaries, not the object store.

Essential commands:

```bash
git add -p                    # stage hunks interactively — craft atomic commits
git rebase -i main            # tidy private branch before review
git commit --fixup=<sha> && git rebase -i --autosquash main
git bisect start; git bisect bad; git bisect good v1.2.0; git bisect run ./test.sh
git log -S "searchString" --oneline   # pickaxe: when did this appear/vanish?
git blame -L 40,60 -- path/to/file
git reflog                    # the universal undo
git worktree add ../hotfix main       # parallel branch, no stashing
```

## Common pitfalls

- **Rewriting public history.** Force-pushing shared branches breaks collaborators' clones.
  Rebase is for private branches; revert is for public mistakes.
- **Merge commits everywhere.** `git pull` default merges on every sync — noisy, meaningless
  history. `git pull --rebase` (or configure `pull.rebase = true`).
- **Giant PRs from stale branches.** Three-week-old branch, 80 commits, merge conflicts in 30
  files. Rebase frequently; merge fast; split work.
- **Committing secrets.** `.env`, keys, tokens — then "removing" them in the next commit (still
  in history). `.gitignore` + pre-commit secret scanning; if committed, rotate the secret and
  purge history properly (filter-repo), knowing clones may persist.
- **Bisecting without automation.** Manually testing 15 commits when `git bisect run` does it
  while you get coffee. Script the test; let bisect work.
- **Fear of rebase.** Avoiding history cleanup because it feels dangerous — resulting in
  permanent "wip" and "fix typo" noise. Learn the reflog; then rebase fearlessly (privately).
- **No branching discipline.** Everyone inventing branch names, merging main into feature branches
  repeatedly, deleting nothing. Agree on naming, merge direction (rebase feature onto main, never
  main into feature), and branch cleanup.
