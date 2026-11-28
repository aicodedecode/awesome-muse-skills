#!/usr/bin/env python3
"""Canary checker — generic version.

Reads a canary registry (JSON) and mechanically verifies every entry it
can: a job that reports "nothing changed" is only believable if it can
also show its canary — a known item or freshness proof it must always
be able to produce.

Registry shape: {"version": 1, "entries": [ {entry}, ... ]}
Entry fields:
  id               stable kebab-case identifier
  what_reports_zero  the job/feed and why its zero is suspect
  canary           the known item or freshness proof that makes zero honest
  check_type       file_freshness | state_timestamp | probe | class_rule
  target           file path (mechanical types) or probe/rule reference
  timestamp_field  (state_timestamp only, optional) JSON field to read;
                   falls back to common field names
  sla_hours        freshness deadline in hours
  owner            who watches this entry

Mechanical entries print PASS / STALE / FAIL with their age. probe and
class_rule entries print MANUAL: the checker lists them but never passes
them silently; their owners check them. Exit code is 1 if any mechanical
entry is STALE or FAIL, else 0.

Set an SLA just above the producer's real cadence (a daily job gets 26h).
Never widen an SLA to make a stale entry pass; a stale entry is a finding.
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

TS_FIELDS = ("timestamp_utc", "updated_at", "updated_at_utc", "synced_at",
             "generated_at", "last_updated", "timestamp")


def parse_ts(value):
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, tz=timezone.utc)
    if isinstance(value, str):
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def check_entry(entry, now):
    ct = entry.get("check_type")
    if ct in ("probe", "class_rule"):
        return "MANUAL", None
    target = Path(entry.get("target", "")).expanduser()
    sla_h = entry.get("sla_hours")
    if ct == "file_freshness":
        if not target.exists():
            return "FAIL", None
        age = (now - datetime.fromtimestamp(
            target.stat().st_mtime, tz=timezone.utc)).total_seconds() / 3600
    elif ct == "state_timestamp":
        if not target.exists():
            return "FAIL", None
        try:
            data = json.loads(target.read_text())
        except (ValueError, OSError):
            return "FAIL", None
        fields = [entry["timestamp_field"]] if entry.get("timestamp_field") \
            else list(TS_FIELDS)
        dt = None
        for f in fields:
            if f in data:
                dt = parse_ts(data[f])
                if dt:
                    break
        if dt is None:
            return "FAIL", None
        age = (now - dt).total_seconds() / 3600
    else:
        return "FAIL", None
    if sla_h is not None and age > sla_h:
        return "STALE", age
    return "PASS", age


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "canary-registry.json"
    registry = json.loads(Path(path).read_text())
    now = datetime.now(timezone.utc)
    counts = {"PASS": 0, "STALE": 0, "FAIL": 0, "MANUAL": 0}
    print(f"CANARY CHECK {now.isoformat()}  registry v{registry.get('version')} "
          f"({len(registry['entries'])} entries)")
    for entry in registry["entries"]:
        status, age = check_entry(entry, now)
        counts[status] += 1
        age_s = f"age={age:.1f}h" if age is not None else "age=?"
        sla = entry.get("sla_hours")
        sla_s = f"sla={sla}h" if sla is not None else "sla=-"
        print(f"  {status:6} {entry['id']:36} {age_s:10} {sla_s}")
    print("SUMMARY: " + " ".join(f"{k}={v}" for k, v in counts.items()))
    return 1 if counts["STALE"] or counts["FAIL"] else 0


if __name__ == "__main__":
    sys.exit(main())
