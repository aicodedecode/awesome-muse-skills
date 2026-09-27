#!/usr/bin/env python3
"""Push a local directory to a GitHub repo via the git-database REST API.

Auth goes through the Secure Vault GitHub connector using the authd surrogate
exchange: this script fetches a short-lived *surrogate* token (never the real
secret) via `authdc cred surrogate custom.github` and sends it as a Bearer
header; authd swaps it for the real credential at egress.

Equivalent of: git add -A && git commit && git push (initial or updating).
"""
import argparse
import base64
import hashlib
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
except ImportError:
    sys.exit("the 'requests' package is required: pip install requests")

API = "https://api.github.com"
SKIP_DIRS = {".git", "node_modules", ".next", "out", "dist", "build"}
SKIP_FILES = {".DS_Store"}


def get_surrogate_token():
    out = subprocess.run(
        ["authdc", "cred", "surrogate", "custom.github"],
        capture_output=True, text=True, check=True,
    ).stdout
    creds = json.loads(out)["credentials"]
    if not creds:
        sys.exit("No custom.github credential found. Connect it via the Secure Vault first.")
    return creds[0]["surrogate"]


def api(session, method, path, **kwargs):
    r = session.request(method, API + path, timeout=60, **kwargs)
    if r.status_code in (401, 403):
        sys.exit(f"GitHub API {r.status_code}: {r.text[:300]} — credential missing, expired, or lacking scope.")
    if not r.ok:
        sys.exit(f"GitHub API {method} {path} -> {r.status_code}: {r.text[:500]}")
    return r.json() if r.text else None


def collect_files(root):
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn in SKIP_FILES:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root).replace(os.sep, "/")
            files.append((full, rel))
    return files


def git_blob_sha(data: bytes) -> str:
    """SHA1 git would assign this content as a blob, without uploading."""
    h = hashlib.sha1()
    h.update(f"blob {len(data)}\0".encode())
    h.update(data)
    return h.hexdigest()


def create_blob(session, owner, repo, full, rel, remote_blobs):
    with open(full, "rb") as f:
        raw = f.read()
    local_sha = git_blob_sha(raw)
    if remote_blobs.get(rel) == local_sha:
        mode = "100755" if os.access(full, os.X_OK) else "100644"
        return {"path": rel, "mode": mode, "type": "blob", "sha": local_sha}, True
    data = api(session, "POST", f"/repos/{owner}/{repo}/git/blobs",
               json={"content": base64.b64encode(raw).decode("ascii"),
                     "encoding": "base64"})
    mode = "100755" if os.access(full, os.X_OK) else "100644"
    return {"path": rel, "mode": mode, "type": "blob", "sha": data["sha"]}, False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--owner", required=True)
    ap.add_argument("--repo", required=True)
    ap.add_argument("--branch", default=None)
    ap.add_argument("--message", default="Push via github-push skill")
    ap.add_argument("--workers", type=int, default=12)
    a = ap.parse_args()

    root = os.path.abspath(a.dir)
    if not os.path.isdir(root):
        sys.exit(f"not a directory: {root}")

    session = requests.Session()
    session.headers.update({
        "Authorization": f"Bearer {get_surrogate_token()}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "muse-github-push-skill",
    })

    repo = api(session, "GET", f"/repos/{a.owner}/{a.repo}")
    branch = a.branch or repo["default_branch"]
    print(f"Target: {a.owner}/{a.repo} branch '{branch}'")

    # Look up the branch first: unchanged files are skipped by comparing
    # local git blob SHAs against the remote tree (saves hundreds of calls
    # on repeat pushes and avoids secondary rate limits).
    ref_path = f"/repos/{a.owner}/{a.repo}/git/refs/heads/{branch}"
    r = session.get(API + ref_path, timeout=60)
    parents, ref_exists, remote_blobs = [], False, {}
    if r.status_code == 200:
        tip = r.json()["object"]["sha"]
        parents, ref_exists = [tip], True
        commit = api(session, "GET", f"/repos/{a.owner}/{a.repo}/git/commits/{tip}")
        rtree = api(session, "GET",
                    f"/repos/{a.owner}/{a.repo}/git/trees/{commit['tree']['sha']}?recursive=1")
        remote_blobs = {t["path"]: t["sha"] for t in rtree.get("tree", [])
                        if t["type"] == "blob"}
        print(f"Remote tree has {len(remote_blobs)} blobs; diffing locally...")
    elif r.status_code == 404:
        print("Branch does not exist yet; uploading everything.")
    else:
        sys.exit(f"ref lookup failed: {r.status_code} {r.text[:300]}")

    files = collect_files(root)
    print(f"Uploading {len(files)} files as blobs...")
    tree_entries = []
    skipped = 0
    with ThreadPoolExecutor(max_workers=a.workers) as ex:
        futs = {ex.submit(create_blob, session, a.owner, a.repo, full, rel,
                          remote_blobs): rel
                for full, rel in files}
        done = 0
        for fut in as_completed(futs):
            entry, was_skipped = fut.result()
            tree_entries.append(entry)
            skipped += was_skipped
            done += 1
            if done % 100 == 0:
                print(f"  ...{done}/{len(files)}")
    print(f"  ...{len(files)}/{len(files)} blobs done "
          f"({skipped} unchanged, {len(files) - skipped} uploaded)")

    # GitHub times out creating very large trees in one call, so build the
    # tree incrementally: create the first chunk, then chain the rest via
    # base_tree. Full slash-paths in entries auto-create intermediate trees.
    CHUNK = 100
    tree_sha = None
    for i in range(0, len(tree_entries), CHUNK):
        chunk = tree_entries[i:i + CHUNK]
        payload = {"tree": chunk}
        if tree_sha:
            payload["base_tree"] = tree_sha
        tree = api(session, "POST", f"/repos/{a.owner}/{a.repo}/git/trees",
                   json=payload)
        tree_sha = tree["sha"]
        print(f"  tree chunk {i // CHUNK + 1}/{(len(tree_entries) + CHUNK - 1) // CHUNK}: {tree_sha[:12]}")
    print(f"Tree created: {tree_sha[:12]}")

    commit = api(session, "POST", f"/repos/{a.owner}/{a.repo}/git/commits",
                 json={"message": a.message, "tree": tree_sha, "parents": parents})
    print(f"Commit created: {commit['sha'][:12]}")

    if ref_exists:
        api(session, "PATCH", ref_path, json={"sha": commit["sha"]})
        print(f"Branch '{branch}' fast-forwarded.")
    else:
        api(session, "POST", f"/repos/{a.owner}/{a.repo}/git/refs",
            json={"ref": f"refs/heads/{branch}", "sha": commit["sha"]})
        print(f"Branch '{branch}' created.")
    print(f"Done: https://github.com/{a.owner}/{a.repo}/commit/{commit['sha']}")


if __name__ == "__main__":
    main()
