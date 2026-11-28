#!/usr/bin/env python3
"""Payment band check — generic version.

A pre-payment gate for agent-executed payments. Before an agent pays, the
amount is compared against the payee's own payment history: wildly out of
line for that payee, or over an absolute cap, does not go through silently.

History source: a CSV export of past transactions with columns
    date,payee,amount
where amount is signed (negative = money out). Most budgeting and banking
tools export this shape; adapt the loader if yours differs.

Modes:
  Gate:  payment_band_check.py --history txns.csv --payee "Example Electric Co" --amount 412.50
  Scan:  payment_band_check.py --history txns.csv --scan [--days 90]

Verdicts (exit codes):
  PASS    (0) amount within band and under cap
  FLAG    (2) amount more than band_pct above the median of the payee's
              last comparable payments -> stop and surface to the human
  STOP    (3) amount over the absolute cap -> do not execute without the
              human's explicit approval for that amount
  NO_BAND (4) fewer than min_comparables comparable payments exist.
              NO_BAND is NOT a pass: missing history is not clearance.

Config (JSON, optional, --config PATH): band_pct (25), cap_dollars (2500 —
set your own), lookback_comparables (6), min_comparables (3).
"""
import argparse
import csv
import json
import statistics
import sys
from datetime import date, timedelta

DEFAULTS = {"cap_dollars": 2500, "band_pct": 25, "min_comparables": 3,
            "lookback_comparables": 6}
EXIT = {"PASS": 0, "FLAG": 2, "STOP": 3, "NO_BAND": 4}


def load_history(path):
    rows = []
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            try:
                amt = float(r["amount"])
                d = date.fromisoformat(r["date"].strip())
            except (KeyError, ValueError):
                continue
            if amt < 0:  # outflows only
                rows.append({"date": d, "payee": r["payee"].strip(),
                             "amount": -amt})
    rows.sort(key=lambda x: x["date"])
    return rows


def norm(name):
    return " ".join(name.lower().split())


def comparables(rows, payee, before=None, limit=6):
    p = norm(payee)
    out = [r for r in rows if norm(r["payee"]) == p
           and (before is None or r["date"] < before)]
    return out[-limit:]


def verdict(rows, payee, amount, cfg):
    if amount > cfg["cap_dollars"]:
        return "STOP", f"amount {amount:.2f} exceeds cap {cfg['cap_dollars']:.2f}"
    comps = comparables(rows, payee, limit=cfg["lookback_comparables"])
    if len(comps) < cfg["min_comparables"]:
        return "NO_BAND", (f"only {len(comps)} comparable payments for "
                           f"{payee!r}; minimum is {cfg['min_comparables']}")
    median = statistics.median(c["amount"] for c in comps)
    ceiling = median * (1 + cfg["band_pct"] / 100)
    if amount > ceiling:
        return "FLAG", (f"amount {amount:.2f} is above the band ceiling "
                        f"{ceiling:.2f} (median {median:.2f} of last "
                        f"{len(comps)} comparable payments)")
    return "PASS", (f"amount {amount:.2f} within band (median {median:.2f}, "
                    f"ceiling {ceiling:.2f}, cap {cfg['cap_dollars']:.2f})")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--history", required=True, help="CSV: date,payee,amount")
    ap.add_argument("--payee")
    ap.add_argument("--amount", type=float)
    ap.add_argument("--scan", action="store_true")
    ap.add_argument("--days", type=int, default=90)
    ap.add_argument("--config")
    args = ap.parse_args()

    cfg = dict(DEFAULTS)
    if args.config:
        cfg.update(json.load(open(args.config)))
    rows = load_history(args.history)

    if args.scan:
        cutoff = date.today() - timedelta(days=args.days)
        flagged = []
        for r in rows:
            if r["date"] < cutoff:
                continue
            prior = [x for x in rows if x["date"] < r["date"]]
            v, why = verdict(prior, r["payee"], r["amount"], cfg)
            if v in ("FLAG", "STOP"):
                flagged.append((r, v, why))
        for r, v, why in flagged:
            print(f"{v:4} {r['date']} {r['payee']} {r['amount']:.2f} — {why}")
        print(f"scan: {len(flagged)} of the outflows in the last "
              f"{args.days} days would have flagged")
        return 0

    if not args.payee or args.amount is None:
        ap.error("gate mode needs --payee and --amount (or use --scan)")
    v, why = verdict(rows, args.payee, args.amount, cfg)
    print(f"{v}: {why}")
    print(json.dumps({"verdict": v, "payee": args.payee,
                      "amount": args.amount, "detail": why}))
    return EXIT[v]


if __name__ == "__main__":
    sys.exit(main())
