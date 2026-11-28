#!/usr/bin/env python3
"""pmrecord: structured project records for the Personal Project Manager skill.

The record is a charter.yaml inside each project folder. Dashboards and
briefings compile from records like these; this tool validates them and
rolls a portfolio up.

Usage:
  pmrecord.py [--root DIR] init <slug>
  pmrecord.py [--root DIR] validate [slug | --all]
  pmrecord.py [--root DIR] rollup

The root defaults to the PROJECTS_DIR environment variable, or ./projects.
Requires: pyyaml (pip install pyyaml).
"""
import json
import os
import sys

REQUIRED = ["level", "outcome", "benefit", "benefit_owner", "done_evidence",
            "deadline_or_constraints", "stakeholders", "status"]
LEVELS = {"portfolio", "program", "project", "operations"}
STATUSES = {"active", "blocked", "closing", "closed", "sustaining"}

TEMPLATE = """\
# Charter record for this project. Keep current; dashboards compile from records.
level: project            # portfolio | program | project | operations
outcome: ""
benefit: ""
benefit_owner: ""
done_evidence: ""
deadline_or_constraints: ""
stakeholders: []
status: active            # active | blocked | closing | closed | sustaining
budget_category: ""
risks: []                 # each: {risk, trigger, owner, response}
sustain: {}               # {days: 30 or 90, due: YYYY-MM-DD} once closed with a persisting benefit
estimates: []             # each: {item, low, likely, high, actual, unit}
"""


def charter_path(root, slug):
    return os.path.join(root, slug, "charter.yaml")


def validate(root, slug):
    p = charter_path(root, slug)
    if not os.path.exists(p):
        return {"slug": slug, "ok": False, "errors": ["no charter.yaml"]}
    try:
        import yaml
        with open(p) as f:
            c = yaml.safe_load(f) or {}
    except Exception as e:
        return {"slug": slug, "ok": False, "errors": [f"yaml parse: {e}"]}
    errors = [f"missing field: {f}" for f in REQUIRED
              if c.get(f) in (None, "", [])]
    if c.get("level") and c["level"] not in LEVELS:
        errors.append(f"level must be one of {sorted(LEVELS)}")
    if c.get("status") and c["status"] not in STATUSES:
        errors.append(f"status must be one of {sorted(STATUSES)}")
    if c.get("status") == "closed" and c.get("benefit") and not c.get("sustain"):
        errors.append("closed with a benefit but no sustain check recorded")
    return {"slug": slug, "ok": not errors, "errors": errors,
            "level": c.get("level"), "status": c.get("status")}


def main(argv):
    root = os.environ.get("PROJECTS_DIR", "./projects")
    args = []
    i = 0
    while i < len(argv):
        if argv[i] == "--root" and i + 1 < len(argv):
            root = argv[i + 1]
            i += 2
        else:
            args.append(argv[i])
            i += 1
    cmd = args[0] if args else "rollup"
    if cmd == "init":
        slug = args[1]
        p = charter_path(root, slug)
        if os.path.exists(p):
            print(json.dumps({"slug": slug, "written": False,
                              "note": "charter.yaml already exists"}))
            return 0
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w") as f:
            f.write(TEMPLATE)
        print(json.dumps({"slug": slug, "written": True, "path": p}))
        return 0
    if cmd == "validate":
        if len(args) > 1 and args[1] == "--all":
            slugs = sorted(d for d in os.listdir(root)
                           if os.path.exists(charter_path(root, d)))
            results = [validate(root, s) for s in slugs]
            print(json.dumps({"charters": len(results),
                              "ok": sum(1 for r in results if r["ok"]),
                              "results": results}, indent=1))
            return 0 if all(r["ok"] for r in results) else 1
        r = validate(root, args[1])
        print(json.dumps(r, indent=1))
        return 0 if r["ok"] else 1
    if cmd == "rollup":
        import yaml
        rows = []
        for d in sorted(os.listdir(root)):
            p = charter_path(root, d)
            if not os.path.exists(p):
                continue
            try:
                with open(p) as f:
                    c = yaml.safe_load(f) or {}
            except Exception:
                continue
            rows.append({"slug": d, "level": c.get("level"),
                         "status": c.get("status"),
                         "benefit_owner": c.get("benefit_owner"),
                         "sustain_due": (c.get("sustain") or {}).get("due"),
                         "risks": len(c.get("risks") or [])})
        total = len([d for d in os.listdir(root)
                     if os.path.isdir(os.path.join(root, d))])
        print(json.dumps({"project_folders": total,
                          "with_charter": len(rows), "rows": rows}, indent=1))
        return 0
    print(json.dumps({"error": f"unknown subcommand {cmd}"}))
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
