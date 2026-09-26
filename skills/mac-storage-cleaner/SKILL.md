---
name: mac-storage-cleaner
description: Reclaim Mac storage systematically: finding space hogs, safe cleanup, and preventing re-clutter. Use when disk space runs low or the Mac feels sluggish from a full drive.
category: productivity
---

# Mac Storage Cleaner

## Overview

A full Mac is a slow Mac: macOS needs free space for virtual memory, updates, and caches. Below ~10-15% free, performance degrades.

Systematic cleanup: measure first (what's actually using space), remove safe targets in order, then prevent re-clutter.

Most 'mystery' storage is predictable: caches, old downloads, duplicate media, forgotten VMs, and iOS backups.

## When to use

- Mac warning about low disk space
- Mac feeling slow with a nearly full drive
- Preparing a Mac for a major OS update
- Finding what's actually consuming storage
- Setting up habits that prevent storage creep

## Core concepts

- **Measure first.**
  System Settings > General > Storage, or tools like DaisyDisk/GrandPerspective for visual maps. Never delete blind — know the big categories first.
- **Safe targets.**
  Caches (rebuildable), Downloads folder, Trash (all of them), old iOS backups, unused apps, duplicate files. Big wins, low risk.
- **Risky targets.**
  System files, Library folders (unless you know exactly what), 'Other' storage mysteries. When unsure: research before deleting.
- **Cloud offload.**
  iCloud 'Optimize Mac Storage' for photos/documents: full-res in cloud, thumbnails local. Understand it before enabling — it's not a backup.
- **App leftovers.**
  Deleted apps leave preferences/caches. App cleaners or manual ~/Library/Application Support sweeps for apps long gone.
- **Developer bloat.**
  Xcode simulators, Docker images, node_modules, old SDKs — gigabytes each. Developers: audit these first, they're often #1.
- **Media duplicates.**
  Photos duplicates, downloaded videos, podcast caches. Dedup tools + decisions about what's actually kept.
- **The 15% rule.**
  Keep 10-15% of disk free minimum. Below that: slowdowns, failed updates, swap pressure. Treat it as a hard floor.

## Practical workflow

1. **Measure.**
   Open Storage settings; get the category breakdown. For detail, run a disk visualization tool on the drive.
2. **Empty the trashes.**
   Trash, plus app-specific trashes (Photos, Mail). Emptied trash is the easiest gigabytes you'll ever reclaim.
3. **Clear Downloads.**
   Sort by size/date. Install what needs installing, file what needs filing, delete the rest. Then set a monthly reminder.
4. **Purge caches safely.**
   User caches (~/Library/Caches) can be cleared — apps rebuild them. Don't touch System caches casually.
5. **Remove unused apps.**
   Sort Applications by last-opened (or size). Delete + sweep leftovers in Application Support.
6. **Handle the big categories.**
   Photos: dedupe + optimize. iOS backups: delete old device backups. Developer: prune simulators, images, modules.
7. **Enable Optimize Storage.**
   If on iCloud: optimize photos/documents. Verify you understand the trade-off (needs internet for full-res).
8. **Set prevention habits.**
   Monthly: downloads + trash. Quarterly: big-category audit. Keep the 15% floor as a standing rule.

## Common pitfalls

- **Deleting blind.**
  Running 'cleaner' apps or rm -rf on Library without knowing what's what. Measure first, delete second.
- **Ignoring the 15% floor.**
  Running at 2% free and wondering why everything is slow. Free space is performance.
- **Cloud as backup confusion.**
  Optimize Storage removes local copies — if iCloud has issues, so do you. It's space management, not backup.
- **Forgetting app trashes.**
  Emptying Trash but not Photos' Recently Deleted or Mail's trash. Gigabytes hide in app-specific bins.
- **Aggressive system cleaning.**
  Third-party cleaners deleting needed caches/system files. macOS manages itself well; intervene surgically.
- **One-time cleanup only.**
  Cleaning once, then re-cluttering for a year. The monthly 10-minute habit beats the annual 3-hour purge.
- **Deleting photos without backup.**
  Purging originals to save space with no backup. Photos are irreplaceable — back up before optimizing.
- **Developer denial.**
  50GB of Docker images and simulators while deleting 200MB of documents. Check the actual hogs first.
