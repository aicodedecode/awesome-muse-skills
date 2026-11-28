---
name: payment-band-and-canary-guards
description: "Two guards against an agent's quiet failures: (1) a payment band check — before executing any payment, compare the amount to that payee's own history (flag above +25% of the median of the last 6 comparable payments, stop over an absolute cap, and treat 'not enough history' as no clearance, never a pass); (2) a canary registry — every job or feed that normally reports 'nothing changed' registers a canary it must always be able to show, and a checker fails the run when the canary is stale. Use when setting up agent-executed payments, audits of recurring charges, or any scheduled job whose normal output is zero."
---

# Payment Band and Canary Guards

Two failure modes of a long-running personal agent are quiet, not loud:
a payment that goes out at the wrong amount, and a job that reports
"nothing changed" for weeks because it is pointed at the wrong source.
These two guards make both prove themselves.

## Guard 1: the payment band

Before the agent executes any payment or purchase, run the band check
alongside whatever affordability test you already use (a funded budget
category, an account balance rule). The two tests answer different
questions: affordability asks "is this budgeted?", the band asks "is
this amount normal for this payee, and is it under the hard cap?"

```bash
python3 scripts/payment_band_check.py --history transactions.csv \
    --payee "Example Electric Co" --amount 412.50
```

The history is a CSV with `date,payee,amount` columns (negative = money
out), the shape most budgeting and banking tools export.

Verdicts, and what the agent must do with each:

| Verdict | Exit | Action |
|---|---|---|
| PASS | 0 | Proceed (subject to the affordability check) |
| FLAG | 2 | Amount is more than `band_pct` (default 25%) above the median of the payee's last `lookback_comparables` (default 6) payments. Stop and surface to the human before executing |
| STOP | 3 | Amount exceeds `cap_dollars` (default 2500 — set your own). Do not execute without the human's explicit approval for that amount |
| NO_BAND | 4 | Fewer than `min_comparables` (default 3) comparable payments exist. This is NOT a pass: say so plainly instead of treating missing history as clearance |

Audit mode judges recent outflows against their payees' prior bands:
`--scan [--days 90]`. Expect legitimate flags: variable payees (marketplaces,
wholesale clubs, food delivery) have wide natural variance, so a FLAG is a
prompt to check, not proof of an error. The cap binds agent-executed
payments only; autopay the human set up outside the agent (rent, utilities)
will appear as STOP in a scan but is not the agent's to gate.

## Guard 2: the canary registry

A job pointed at the wrong source can report "no changes" forever. So
every zero-reporting job or feed registers a canary before it ships: the
known item or freshness proof that makes its zero honest. An unregistered
zero is unproven.

Registry entries (`canary-registry.sample.json` has the full shape):

- `id`, `what_reports_zero`, `canary`, `owner`
- `check_type`: `file_freshness` (a file's mtime must advance),
  `state_timestamp` (a timestamp inside a JSON state file must be fresh),
  `probe` (a live lookup for a known item, performed by the owner), or
  `class_rule` (a standing rule covering a whole class)
- `target`, and `sla_hours`: set the deadline just above the producer's
  real cadence (a daily job gets 26h). Never widen an SLA to make a stale
  entry pass; a stale entry is a finding, not a tuning problem.

```bash
python3 scripts/canary_check.py canary-registry.json
```

The checker prints PASS / STALE / FAIL for mechanical entries and lists
probe and class_rule entries as MANUAL — listed, never silently passed;
their owners check them. Exit code is 1 when any mechanical entry is
STALE or FAIL. Run it on a daily watchdog cadence and report only the
stale or failed entries; a clean run should be silent.

Registering a new job is part of shipping it:

1. Decide what proves its zero is honest: a file only a completed run
   writes, a timestamp only fresh data advances, a known item a live
   probe must always find, or an existing class rule.
2. Add the entry to the registry.
3. For mechanical types, run the checker and confirm the new entry
   reports PASS with a sane age. For probe/class types, name the owner
   who actually performs the check; an ownerless manual canary is an
   unproven zero.

## Origin

Distilled from two rules in a community playbook for running a personal
agent long-term: "put money behind a ledger, a band, and a cap" and
"make every honest zero prove itself." The scripts here are a generic
implementation; wire the history source and the registry paths to your
own system.
