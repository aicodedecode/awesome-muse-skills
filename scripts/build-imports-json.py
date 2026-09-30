#!/usr/bin/env python3
"""Build the curated-imports catalog: website/data/skills-imported.json + repo-root copy.

For each skills-imported/<name>/SKILL.md, extracts name/description/category from
frontmatter and mines attribution:
  - license: `license:` frontmatter, else LICENSE* file in the skill dir, else null
  - source/source_url: verified source-repo overrides first, else the most-mentioned
    github.com/<owner>/<repo> in SKILL.md, else null

Verified overrides (sources confirmed at import time):
  affaan-m/ECC, pbakaus/impeccable, higgsfield-ai/skills, emilkowalski/skills
"""

import json
import os
import re

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMPORTS_DIR = os.path.join(REPO_ROOT, "skills-imported")
OUT_ROOT = os.path.join(REPO_ROOT, "skills-imported.json")
OUT_WEB = os.path.join(REPO_ROOT, "website", "data", "skills-imported.json")
GITHUB_REPO = "https://github.com/aicodedecode/awesome-muse-skills"

ECC_49 = """taste taste-distillation taste-application tasteforge-video
make-interfaces-feel-better frontend-design-direction liquid-glass-design
motion-foundations motion-patterns motion-advanced manim-video
remotion-video-creation videodb video-editing fal-ai-media article-writing
content-engine seo social-publisher brand-voice brand-discovery deep-research
market-research competitive-platform-analysis exa-search browser-qa
click-path-audit verification-loop production-audit delivery-gate
nextjs-turbopack react-performance frontend-patterns deployment-patterns
skill-scout skill-stocktake skill-comply plan-canvas plan-orchestrate
product-lens product-capability prompt-optimizer context-budget
token-budget-advisor api-design security-review security-scan git-workflow
github-ops""".split()

HIGGSFIELD_8 = ["higgsfield-brandkit", "higgsfield-generate",
                "higgsfield-marketplace-cards", "higgsfield-product-photoshoot",
                "higgsfield-soul-id", "higgsfield-video-explainer",
                "higgsfield-websites", "higgsfield-youtube-thumbnail"]

EMIL_13 = ["animate", "animate-expo", "animation-vocabulary", "apple-design",
           "ask-sonner", "emil-design-eng", "find-animation-opportunities",
           "improve-animations", "mobile-native", "pick-ui-library",
           "prototype", "review-animations", "write-swift"]

VERIFIED = {}
for n in ECC_49:
    VERIFIED[n] = ("affaan-m/ECC", "https://github.com/affaan-m/ECC", "MIT")
VERIFIED["impeccable"] = ("pbakaus/impeccable",
                          "https://github.com/pbakaus/impeccable", "Apache-2.0")
for n in HIGGSFIELD_8:
    VERIFIED[n] = ("higgsfield-ai/skills",
                   "https://github.com/higgsfield-ai/skills", "MIT")
for n in EMIL_13:
    VERIFIED[n] = ("emilkowalski/skills",
                   "https://github.com/emilkowalski/skills", "MIT")

GH_RE = re.compile(r"github\.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)")
SKIP_REPOS = {"aicodedecode/awesome-muse-skills", "user/repo", "org/repo",
              "github/github"}


# Category taxonomy for curated imports. Most imports carry no frontmatter
# category (they'd all land in "general"), so we classify from name +
# description with ordered keyword rules — first match wins, most specific
# first. Explicit CAT_OVERRIDES handle provenance-known bundles.
CAT_RULES = [
    ("mobile", ["ios", "android", "expo", "flutter", "react native", "swift", "kotlin", "mobile app"]),
    ("media", ["video", "ffmpeg", "manim", "remotion", "3d", "three.js", "blender", "image generat", "text-to-speech", "tts ", "podcast", "audio", "thumbnail"]),
    ("security", ["secur", "pentest", "vulnerab", "exploit", "malware", "forensic", "threat", "owasp", "red team"]),
    ("ai-agents", ["agent", "mcp ", "mcp-", "multi-agent", "rag ", "rag-", "prompt engineer", "llm ", "langchain", "autogpt", "crewai", "tool use", "function calling"]),
    ("data", ["pandas", "data ", "dataset", "analytics", "visualiz", "chart", "dashboard", "etl ", "sql ", "database", "machine learning", "forecast", "scikit", "plot"]),
    ("devops", ["docker", "kubernet", "deploy", "ci/cd", "cicd", "terraform", "aws ", "cloudflare", "serverless", "nginx", "linux server", "infrastructure"]),
    ("testing", ["test", "qa ", "playwright", "cypress", "tdd ", "e2e ", "unit test", "integration test"]),
    ("web-dev", ["react", "next.js", "nextjs", "vue", "angular", "svelte", "api ", "rest ", "graphql", "backend", "fullstack", "full-stack", "typescript", "node.js", "web app", "website", "frontend"]),
    ("design", ["design", "a11y", "accessib", "ui ", "ux ", "figma", "css", "tailwind", "component", "animation", "motion", "aesthetic", "typograph", "color ", "layout", "shadcn"]),
    ("writing", ["writ", "copywrit", "blog", "documentation", "docs ", "editorial", "newsletter", "essay", "proofread"]),
    ("marketing", ["seo", "market", "social media", "growth", "ads ", "advertis", "brand", "content strateg", "launch", "copy "]),
    ("business", ["startup", "business", "finance", "saas", "pricing", "pitch", "fundrais", "product manag"]),
    ("dev-tools", ["git ", "github", "cli ", "command line", "debug", "vscode", "editor", "lint", "refactor", "code review", "terminal"]),
    ("productivity", ["productiv", "notetaking", "note-taking", "automat", "workflow", "checklist", "plann", "calendar", "task manag"]),
]

CAT_OVERRIDES = {
    **{n: "design" for n in ["animate", "animate-expo", "animation-vocabulary", "apple-design",
        "ask-sonner", "emil-design-eng", "find-animation-opportunities", "improve-animations",
        "mobile-native", "pick-ui-library", "prototype", "review-animations", "write-swift"]},
    **{n: "media" for n in ["higgsfield-brandkit", "higgsfield-generate", "higgsfield-marketplace-cards",
        "higgsfield-product-photoshoot", "higgsfield-soul-id", "higgsfield-video-explainer",
        "higgsfield-websites", "higgsfield-youtube-thumbnail"]},
    "humanizer": "writing",
    "copywriting": "writing",
    "launch": "marketing",
    "21st-dev": "design",
    "firecrawl": "data",
    "local-scrape": "data",
    "gmaps-scraper": "data",
    "listmonk": "marketing",
    "codebase-memory": "dev-tools",
    "defuddle": "data",
    "archify-review": "web-dev",
    "scaffold-exercises": "writing",
    "pipecat-init": "ai-agents", "pipecat-talk": "ai-agents", "pipecat-deploy": "ai-agents",
    "twenty-create-app": "web-dev", "twenty-develop-app": "web-dev", "twenty-manage-app": "web-dev",
    "twenty-publish-app": "web-dev", "twenty-use-twenty-mcp": "ai-agents",
}


def classify_category(dirname, name, description):
    """Best-effort category for an import without a meaningful frontmatter one."""
    if dirname in CAT_OVERRIDES:
        return CAT_OVERRIDES[dirname]
    text = f"{name} {description}".lower()
    for cat, kws in CAT_RULES:
        for kw in kws:
            if kw in text:
                return cat
    return "general"


def parse_frontmatter(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm = {}
    for line in text[3:end].strip().splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip().strip("'\"")
    return fm, text


def detect_license(skill_dir, fm, body):
    lic = fm.get("license")
    if lic:
        return lic
    for fn in os.listdir(skill_dir):
        if fn.upper().startswith("LICENSE"):
            p = os.path.join(skill_dir, fn)
            try:
                head = open(p, encoding="utf-8", errors="ignore").read(400)
            except OSError:
                continue
            if "Apache License" in head:
                return "Apache-2.0"
            if "MIT License" in head or "Permission is hereby granted" in head:
                return "MIT"
            return "See LICENSE file"
    m = re.search(r"(?i)\blicensed under (?:the )?([A-Za-z0-9.\- ]+?)(?:\.|\n)", body[:2000])
    if m:
        return m.group(1).strip()
    return None


def detect_source(body):
    counts = {}
    for m in GH_RE.finditer(body):
        repo = m.group(1).rstrip(".").lower()
        if repo in SKIP_REPOS or repo.count("/") != 1:
            continue
        counts[repo] = counts.get(repo, 0) + 1
    if not counts:
        return None, None
    best = max(counts, key=counts.get)
    if counts[best] < 2:
        return None, None
    return best, f"https://github.com/{best}"


def main():
    entries = []
    names = sorted(d for d in os.listdir(IMPORTS_DIR)
                   if os.path.isdir(os.path.join(IMPORTS_DIR, d)))
    for dirname in names:
        skill_md = os.path.join(IMPORTS_DIR, dirname, "SKILL.md")
        if not os.path.isfile(skill_md):
            continue
        fm, body = parse_frontmatter(skill_md)
        name = fm.get("name", dirname)
        source, source_url, lic = None, None, None
        if dirname in VERIFIED:
            source, source_url, lic = VERIFIED[dirname]
        else:
            source, source_url = detect_source(body)
        if not lic:
            lic = detect_license(os.path.join(IMPORTS_DIR, dirname), fm, body)
        # multi-line descriptions: take first line
        desc = fm.get("description", "").split("\n")[0].strip()
        fm_cat = (fm.get("category") or "").strip().lower()
        category = fm_cat if fm_cat and fm_cat != "general" else classify_category(dirname, name, desc)
        entries.append({
            "name": name,
            "description": desc,
            "category": category,
            "path": f"skills-imported/{dirname}",
            "github_url": f"{GITHUB_REPO}/tree/main/skills-imported/{dirname}",
            "origin": "curated-import",
            "source": source,
            "source_url": source_url,
            "license": lic,
            "author": "curated-import",
        })
    payload = json.dumps(entries, indent=2, ensure_ascii=False) + "\n"
    with open(OUT_ROOT, "w", encoding="utf-8") as f:
        f.write(payload)
    os.makedirs(os.path.dirname(OUT_WEB), exist_ok=True)
    with open(OUT_WEB, "w", encoding="utf-8") as f:
        f.write(payload)
    n_src = sum(1 for e in entries if e["source"])
    n_lic = sum(1 for e in entries if e["license"])
    print(f"OK: {len(entries)} imports; {n_src} with source, {n_lic} with license")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
