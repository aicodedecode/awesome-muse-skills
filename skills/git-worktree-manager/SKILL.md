---
name: git-worktree-manager
description: Managing multiple Git worktrees for parallel work — setup, workflows, and cleanup.
category: git
---

## Overview

`git worktree` lets one repository have multiple checked-out working trees —
work on a hotfix, a feature, and a review simultaneously without stashing or
cloning. Each worktree has its own branch, working directory, and (mostly)
independent state, all sharing one object database. This skill covers the
workflows and hygiene that make worktrees a superpower instead of a mess.

## When to use

- Working on two branches in parallel (feature + urgent hotfix)
- Running long tests/builds in one worktree while coding in another
- Reviewing a colleague's branch without disturbing your work
- Setting up a clean worktree for bisecting or experimenting
- Cleaning up stale worktrees safely

## Core concepts

**One repo, many checkouts.** `git worktree add ../hotfix hotfix-branch`
creates a new directory with that branch checked out. All worktrees share the
same `.git` object store — no duplicate history, no extra fetch. A branch can
only be checked out in one worktree at a time (Git enforces this).

**Worktrees are disposable by design.** The power move: create a worktree for
a task, delete it when done (`git worktree remove`). Unlike clones, there's
no separate remote config to maintain and no duplicated objects. Treat them
as cheap and temporary.

**State is per-worktree (mostly).** Each worktree has its own index, HEAD, and
working tree — but refs, stash, and config are shared repo-wide. Uncommitted
changes can't move between worktrees directly (commit or stash first);
bisect state and some operations lock the main worktree.

**Naming and location conventions.** Keep worktrees in a predictable place —
siblings of the main checkout (`../project-hotfix`) or a dedicated directory
(`~/worktrees/project-feature`). Descriptive directory names beat remembering
which path holds which branch; `git worktree list` shows the mapping anytime.

## Practical workflow

1. **Create deliberately:** `git worktree add -b new-branch ../project-feat`
   (new branch) or `git worktree add ../project-review origin/pr-branch`
   (existing remote branch, detached or tracked).
2. **Set up per-worktree environment:** install dependencies / env files if
   the project needs them per directory (some tools key off the path —
   configure accordingly), and open the worktree in a separate editor window.
3. **Work normally** — commit, push, rebase within the worktree; fetches in
   any worktree update the shared refs for all.
4. **For reviews:** add a worktree at the PR's branch, run tests, read code —
   your main work stays untouched; remove the worktree after.
5. **For emergencies:** hotfix worktree from `main`, fix, test, push, PR —
   while your feature work sits undisturbed in the main checkout.
6. **Clean up:** `git worktree remove ../project-feat` (fails if dirty —
   protecting uncommitted work); `git worktree prune` clears metadata for
   manually deleted directories; `git worktree list` audits what's live.

## Common pitfalls

- **Forgetting worktrees exist** — stale worktrees accumulate; audit with
  `git worktree list` regularly and remove finished ones.
- **Manually deleting the directory** without `git worktree remove` — leaves
  stale metadata; follow with `git worktree prune`.
- **Trying to check out the same branch twice** — Git refuses; use a
  differently-named branch or detach HEAD for read-only inspection.
- **Assuming stash moves between worktrees** — stash is repo-global and
  applies to whichever worktree you pop in; label stashes clearly.
- **IDE/tool confusion** — some tools cache by directory and handle
  worktrees fine; others (certain Git GUIs, hooks assuming `$PWD`) need
  per-worktree configuration — verify yours.
- **Running repo-wide operations carelessly** — `git gc` or filter operations
  affect all worktrees; coordinate when teammates share the repo (rare, but
  possible on shared machines).
