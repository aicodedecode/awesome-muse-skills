#!/usr/bin/env python3
"""pmcalc: project math for the Personal Project Manager skill.

A thin wrapper over the open source pmcontrols library. Reads a JSON spec
on stdin or from a file argument, prints JSON results.

Subcommands:
  cpm   {"activities":[{"id":..., "duration":..., "predecessors":[...]}]}
  pert  {"activities":[{"id":..., "a":..., "m":..., "b":..., "predecessors":[...]}], "n_sim":5000, "seed":42}
  evm   {"periods":[...], "pv":[...], "ev":..., "ac":..., "at":...}

Requires: pmcontrols (pip install pmcontrols), which pulls numpy and pandas.
"""
import json
import sys

try:
    import pmcontrols as pm
except ImportError:
    print(json.dumps({"error": "pmcontrols is not installed; run: pip install pmcontrols"}))
    sys.exit(1)


def result_json(r):
    out = {"stats": {k: (float(v) if isinstance(v, (int, float)) else v)
                     for k, v in r.stats.items()},
           "alerts": [{"indicator": a.indicator, "value": a.value,
                       "threshold": a.threshold, "note": a.note}
                      for a in (r.alerts or ())],
           "meta": {k: v for k, v in r.meta.items()
                    if k in ("critical_activities", "mc_finish_quantiles",
                             "computed_at", "version", "input_hash")}}
    try:
        out["table"] = json.loads(r.table.to_json(orient="records"))
    except Exception:
        pass
    return out


def main():
    cmd = sys.argv[1]
    raw = open(sys.argv[2]).read() if len(sys.argv) > 2 else sys.stdin.read()
    spec = json.loads(raw)
    if cmd == "cpm":
        r = pm.cpm(spec["activities"])
    elif cmd == "pert":
        r = pm.pert(spec["activities"], n_sim=spec.get("n_sim", 5000),
                    seed=spec.get("seed", 42))
    elif cmd == "evm":
        pmb = pm.plan(periods=spec["periods"], pv=spec["pv"])
        r = pm.evm(pmb, ev=spec["ev"], ac=spec["ac"], at=spec["at"])
    else:
        print(json.dumps({"error": f"unknown subcommand {cmd}"}))
        return 1
    print(json.dumps(result_json(r), indent=1, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
