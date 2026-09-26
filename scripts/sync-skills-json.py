#!/usr/bin/env python3
"""Regenerate skills.json (repo root) and website/data/skills.json from skills/*/SKILL.md.

Each entry: {name, description, category, path, author, license}.
Category is read from an optional `category:` frontmatter key; defaults to
"general". Also copies the index into the website's data dir for the build.

Usage: python3 scripts/sync-skills-json.py  (run from repo root)
"""

import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILLS_DIR = os.path.join(REPO_ROOT, "skills")
OUT_ROOT = os.path.join(REPO_ROOT, "skills.json")
OUT_WEB = os.path.join(REPO_ROOT, "website", "data", "skills.json")
GITHUB_PLACEHOLDER = "https://github.com/aicodedecode/awesome-muse-skills"


def parse_frontmatter(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = {}
    for line in text[3:end].strip().splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip().strip("'\"")
    return fm


def main():
    entries = []
    for dirname in sorted(os.listdir(SKILLS_DIR)):
        skill_dir = os.path.join(SKILLS_DIR, dirname)
        skill_md = os.path.join(skill_dir, "SKILL.md")
        if not os.path.isdir(skill_dir) or not os.path.isfile(skill_md):
            continue
        fm = parse_frontmatter(skill_md)
        entries.append({
            "name": fm.get("name", dirname),
            "description": fm.get("description", ""),
            "category": fm.get("category", "general"),
            "path": f"skills/{dirname}",
            "github_url": f"{GITHUB_PLACEHOLDER}/tree/main/skills/{dirname}",
            "author": "awesome-muse-skills",
            "license": "MIT",
        })
    payload = json.dumps(entries, indent=2, ensure_ascii=False) + "\n"
    with open(OUT_ROOT, "w", encoding="utf-8") as f:
        f.write(payload)
    os.makedirs(os.path.dirname(OUT_WEB), exist_ok=True)
    with open(OUT_WEB, "w", encoding="utf-8") as f:
        f.write(payload)
    print(f"OK: wrote {len(entries)} skill(s) to skills.json and website/data/skills.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
