---
name: changelog-pro
description: Maintain changelogs users actually read: Keep-a-Changelog format, automation, and release-note craft. Use when writing changelogs or automating release notes.
category: development
---

# Changelog Pro

## Overview

A changelog is **the human-readable story of what changed and why it matters** — distinct from git
history (for developers) and marketing (for prospects). Done well, it builds trust: users can see
what's new, what's fixed, and what might break them. This skill covers the Keep-a-Changelog
discipline, writing entries users care about, and automating generation without producing robotic
noise.

The through-line: changelogs are for humans — write what changed from the *user's* perspective, in
language they'll understand.

## When to use

- Writing changelog entries for a release.
- Setting up changelog conventions (Keep-a-Changelog, changesets).
- Automating release notes from commits or PRs.
- Reviewing changelogs for clarity and completeness.
- Deciding what belongs in a changelog vs git history.

## Core concepts

- **Keep-a-Changelog format.** `CHANGELOG.md` with `## [Unreleased]` at top, version sections with
  dates, and categorized entries: Added / Changed / Deprecated / Removed / Fixed / Security.
  Reverse-chronological, one file, human-written summaries — the de facto standard for a reason.
- **User perspective, always.** "Fixed: checkout no longer double-charges on retry" — not
  "refactored payment idempotency layer." Users care about behavior change, not implementation.
  Write the *impact*, link the detail (PR/issue) for the curious.
- **Breaking changes, loudly.** A dedicated, unmissable section at the top of the release:
  what breaks, who it affects, and exactly how to migrate (before/after code). Breaking changes
  buried in "Changed" erode trust permanently.
- **The Unreleased section.** Every PR that changes behavior adds an entry under `## [Unreleased]`
  *in the same PR*. Release time = rename the section + date. No archaeology, no forgotten entries.
- **Automation with judgment.** Generate drafts from conventional commits or PR titles, but
  *curate* before publishing — raw commit logs are noise ("fix typo", "wip"). Changesets
  (per-PR change descriptions) produce the best automated changelogs because humans write the
  entries at change time.
- **Version links and dates.** `[1.2.0] - 2026-09-26` with link definitions to diffs/tags at the
  bottom. Dates matter (users correlate with their issues); diff links serve the deeply curious.

## Practical workflow

1. **Adopt the format.** `CHANGELOG.md` at repo root, Keep-a-Changelog structure, `## [Unreleased]`
   section live from day one. Add "changelog entry" to the PR template checklist.
2. **Write entries per PR.** In the same PR as the change: one bullet under Unreleased, categorized,
   user-perspective language, PR/issue link. Small habit, huge payoff.
3. **Curate at release.** Read the Unreleased section as a user: reorder by importance, merge
   related bullets, elevate breaking changes to the top with migration guides, cut internal noise.
4. **Publish consistently.** Changelog updated in the release commit; release notes (GitHub
   releases) mirror or link it; announce breaking changes through every channel users watch.
5. **Automate the draft.** Conventional commits → generated draft, or changesets → compiled notes;
   human curates. Never ship raw generated logs as the changelog.
6. **Maintain the discipline.** Review changelog entries in PR review like code; reject "various
   fixes" entries; keep the format consistent across releases.

Example entries:

```markdown
## [Unreleased]

## [2.4.0] - 2026-09-26

### ⚠️ Breaking changes
- **API:** `POST /orders` now requires `idempotency_key` (was optional).
  Migration: generate a UUID per order attempt client-side; see #1234.
  Affects: all API consumers creating orders.

### Added
- Checkout now supports saved payment methods (#1230)
- Webhook event `refund.processed` for refund status tracking (#1228)

### Fixed
- Double charges when "Place order" was tapped twice quickly (#1224)
- Order list pagination skipping items when new orders arrived (#1219)

### Security
- Rate limiting added to password-reset endpoint (abuse prevention) (#1221)
```

## Common pitfalls

- **Git log as changelog.** Dumping commit messages ("fix stuff", "wip", "address review
  feedback") — noise that teaches users to never read it. Curate for humans.
- **Developer perspective.** "Refactored auth middleware" means nothing to users. Translate to
  impact: "Sign-in is now 40% faster" or omit if truly internal.
- **Missing breaking changes.** Or burying them. Breaking changes are the highest-value changelog
  content — prominent, with migration paths. Users plan upgrades around them.
- **Stale or missing Unreleased.** Entries written at release time from memory — incomplete and
  wrong. Per-PR entries under Unreleased, enforced by checklist/review.
- **"Various bug fixes."** The entry that says nothing. Each fix gets its specific bullet, or the
  changelog isn't doing its job.
- **No dates or versions.** Undated sections, missing version links — users can't correlate
  releases with their experience. Date every release; link every version.
- **Changelog vs release notes confusion.** The changelog is the durable record (in the repo);
  release notes are the announcement (can link it). Keep the changelog canonical; don't maintain
  two divergent sources.
