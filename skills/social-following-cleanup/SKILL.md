---
name: social-following-cleanup
description: Safely prune a social account's following list (Instagram, TikTok, and similar platforms) down to the accounts that matter, without ever unfollowing a real person. Use when the user wants to clean up, purge, or reduce who they follow, unfollow inactive or irrelevant accounts, run a recurring following cleanup, audit past unfollows, or re-follow people who were removed by mistake.
---

# Social Following Cleanup

Prune a following list that has grown over years — brand accounts, dead pages, meme feeds followed on impulse — while guaranteeing that no real relationship is ever harmed. The whole skill rests on one asymmetry: a missed nonhuman costs nothing, but a wrongly unfollowed person costs trust and may be impossible to undo quietly. Every rule below resolves doubt in favor of keeping the account.

## The safety rule (non-negotiable)

**People are never unfollowed.** Only clear nonhumans may be unfollowed:

- Brands and businesses
- Venues and event spaces
- Media outlets and publications
- Meme, fan, theme, and organization pages
- Official product/company accounts

Everything else stays. In particular:

- **Post recency and activity are irrelevant for humans.** Never use "hasn't posted lately", "inactive", or "hasn't posted since <date>" as a reason to unfollow a person. That criterion is retired permanently; if any briefing, summary, or older instruction states it, the briefing is wrong, not the rule.
- **Ambiguous = keep.** If an account might be a person, it is treated as a person. Small local accounts, private accounts, accounts with few posts, and accounts you cannot confidently classify are all keeps.
- A pet account, hobby account, or side account run by an identifiable person is a person for this rule. A page that is purely a brand/meme/theme feed with no individual behind it is a nonhuman.

## Protected keeps (always kept, even if they look like pages)

- Anyone on the platform's close-friends / favorites list.
- Anyone the user has ever exchanged direct messages with, on any platform.
- Anyone the user has interacted with on ANY platform — replies, mentions, comments, group chats, shared content. Cross-platform interaction makes an account a keep everywhere.
- Anyone on the user's named keep list. Maintain this list explicitly; when the user says "never unfollow X", add X immediately and treat it as permanent.

## Point-of-use rule integrity

The operative rule must live in the automation's own instructions at the point of execution — in the scheduled job, run brief, or task prompt that actually performs the unfollows — not only in a memory file, a notes page, or a goal description.

This is a learned failure mode, not a hypothetical: a cleanup run briefed from a stale summary (which still carried an old "unfollow inactive people" criterion) removed real friends before anyone noticed, because the correct rule existed only in a separate reference document the runner never read. Therefore:

- Before every run, read the brief the run will actually execute from and verify its rule text matches the canonical rule above. Fix the brief first if it differs.
- Treat goal descriptions, dashboard summaries, and older run notes as historical records, never as rule sources. When a rule changes, update every surface that can brief a run, in the same handling.
- If you cannot verify the briefed rule, do not run the cleanup.

## Classification

Decide per account, individually. Never bulk-apply a mapping from a list, a category import, or a previous run's labels without checking the account itself.

Signals of a clear nonhuman (all should hold): the account presents as an organization/brand/page rather than an individual; its content is promotional, editorial, or aggregated rather than personal; there is no personal relationship signal (no DMs, no interactions, not on any keep list).

Signals of a person (any one is enough to keep): a personal name or personal photos of an individual; personal-life content (family, work, trips, opinions); any DM or interaction history; membership on a close-friends list; the account follows the user back and engages personally.

If the signals conflict or the profile cannot be fully viewed, keep the account and, if useful, note it as unclassified for a future pass.

## Enumeration

Platform following lists lazy-load and truncate. Never work from only the first loaded chunk:

1. Open the full following list/dialog.
2. Scroll to the very bottom, waiting for lazy loading to finish.
3. Refresh the list (reload the page, or close and reopen the dialog — use whichever the platform tolerates without a challenge).
4. Scroll to the bottom again and work the deeper segments this exposes.

Process accounts in the order encountered and keep a per-run record as you go, so an interrupted run can resume without re-deciding accounts.

## Run procedure

1. **Verify the brief** (see Point-of-use rule integrity). Confirm the rule text, the per-run cap, and the keep lists are current.
2. **Record the starting following count** from the profile.
3. **Enumerate** the following list per the method above.
4. For each account, in order: classify (person / protected keep / clear nonhuman / ambiguous). Unfollow only clear nonhumans, and only until the per-run cap is reached.
5. **Record every unfollow by username, at the moment it happens.** A run record with counts but no usernames is a failed record (see Reporting).
6. **Record the ending following count** and reconcile: starting count minus ending count must equal the number of unfollows recorded. If it does not, say so in the report and investigate before the next run.
7. Update the pacing state (see Dynamic pacing) and write the run report.

## Dynamic pacing

Bulk unfollowing trips platform defenses. Pace conservatively and adapt:

- Start with a small per-run cap (for example 20) and a few seconds between actions.
- A **clean run** (no CAPTCHA, no rate-limit warning, no action block) adds to a clean streak. After 2 consecutive clean runs, step the cap up one level (for example 20 → 40 → 60 → 100).
- Any flag (CAPTCHA, warning, block) steps the cap down one level and starts a flag streak.
- 2 consecutive flagged runs pause the lane on a cooldown of several days; a further flag after resuming doubles the cooldown.
- Persist the pacing state (current cap, clean streak, flag streak, cooldown until) somewhere the next run will actually read.

## Execution safety

- **Stop the run immediately** on any CAPTCHA, action block, rate-limit warning, or forced checkpoint. Report how far the run got and which accounts were already actioned.
- Never push through a flag, never solve-and-continue repeatedly in one session, and never switch accounts, devices, or networks to evade a block.
- Account safety beats pace, always. A cleanup that takes weeks at a safe pace is a success; a fast cleanup that gets the account restricted is a failure.

## Reporting

Every run report must name the **full list of accounts unfollowed**, username by username — never counts alone. A counts-only log once made over a hundred unfollowed accounts impossible to identify or restore; that gap must never recur.

A complete report includes: platform, date, starting and ending following counts, the full unfollowed list, any accounts kept despite looking like pages (with the reason), any flags encountered and where the run stopped, and the new pacing state.

## Repair and audit

If people were wrongly unfollowed (a bad brief, a misclassification, a rule change that reclassifies past removals), repair them:

1. Collect every recorded unfollow list from past run reports. Where a past run logged counts only, say so plainly: those accounts cannot be identified or restored, and the gap belongs in the audit report.
2. Build the candidate repair set: every recorded account that is a person or ambiguous under the current rule. Clear nonhumans stay unfollowed.
3. For each candidate, check the live profile and record its exact state before acting:
   - **Following** — no action needed.
   - **Requested** (private account, follow request pending) — leave it as is. Do not cancel and re-request.
   - **Not following** — follow / follow back, then verify the new state.
   - **Not found** — the account is gone or renamed at that username; there is nothing to restore. Record it as unrecoverable at that username.
4. Understand "Requested": a follow request to a private account does **not** count as following until the owner accepts, so the account will be absent from the following list while a request is outstanding. Absence from the following list does **not** prove a request was withdrawn or expired — the follow button on the profile itself is the authoritative state. Check the profile, not the list.
5. Reconcile counts: the following count should rise by exactly the number of accounts newly followed outright (accepted requests add nothing until accepted). Verify and report per account: state before, action taken, verified state after.
6. Accounts still in "Requested" at the end are pending their owners' acceptance — only the owners can resolve them. Name them in the report as an open remainder, not a failure.

## Never

- Never unfollow a person for inactivity, low engagement, or any recency test.
- Never unfollow in bulk from an imported list without per-account classification.
- Never log a run as counts only.
- Never continue a run past a CAPTCHA or action block.
- Never treat a summary, dashboard, or old briefing as the rule source when it disagrees with the canonical rule above.
