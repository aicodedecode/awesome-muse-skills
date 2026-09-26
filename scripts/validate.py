#!/usr/bin/env python3
"""Validate every skills/*/SKILL.md in this repo.

Checks:
  - SKILL.md exists and starts with YAML frontmatter
  - frontmatter has non-empty `name:` and `description:`
  - `name` is lowercase-hyphens and matches its directory name

Usage: python3 scripts/validate.py  (run from repo root)
Exit code 0 = all valid; non-zero with clear errors otherwise.
"""

import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILLS_DIR = os.path.join(REPO_ROOT, "skills")
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def parse_frontmatter(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    if not text.startswith("---"):
        return None, "missing frontmatter (file must start with '---')"
    end = text.find("\n---", 3)
    if end == -1:
        return None, "unterminated frontmatter (no closing '---')"
    fm = {}
    for line in text[3:end].strip().splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip().strip("'\"")
    return fm, None


def main():
    errors = []
    checked = 0
    if not os.path.isdir(SKILLS_DIR):
        print("ERROR: skills/ directory not found", file=sys.stderr)
        return 1
    for dirname in sorted(os.listdir(SKILLS_DIR)):
        skill_dir = os.path.join(SKILLS_DIR, dirname)
        if not os.path.isdir(skill_dir) or dirname.startswith("."):
            continue
        checked += 1
        skill_md = os.path.join(skill_dir, "SKILL.md")
        if not os.path.isfile(skill_md):
            errors.append(f"{dirname}: missing SKILL.md")
            continue
        fm, err = parse_frontmatter(skill_md)
        if err:
            errors.append(f"{dirname}: {err}")
            continue
        name = fm.get("name", "")
        desc = fm.get("description", "")
        if not name:
            errors.append(f"{dirname}: frontmatter missing 'name:'")
        elif not NAME_RE.match(name):
            errors.append(f"{dirname}: name '{name}' must be lowercase-hyphens")
        elif name != dirname:
            errors.append(f"{dirname}: name '{name}' does not match directory")
        if not desc:
            errors.append(f"{dirname}: frontmatter missing/empty 'description:'")
    if errors:
        print(f"VALIDATION FAILED ({len(errors)} error(s), {checked} skill(s) checked):")
        for e in errors:
            print(f"  - {e}")
        return 1
    print(f"OK: {checked} skill(s) validated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
