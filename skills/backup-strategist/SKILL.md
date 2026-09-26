---
name: backup-strategist
description: Design backup strategies that survive real disasters: 3-2-1 rule, versioning, testing restores, and covering all devices. Use when setting up backups or auditing whether current backups actually work.
category: productivity
---

# Backup Strategist

## Overview

Backups are the only defense against ransomware, theft, hardware failure, and human error. Everything else is convenience.

The 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 offsite. Simple, battle-tested, sufficient for almost everyone.

An untested backup is a hope, not a backup. Restore testing is the strategy's load-bearing wall.

## When to use

- Setting up backups for the first time (personal or small team)
- Auditing whether existing backups actually work
- Protecting against ransomware or device theft/loss
- Designing backup for creative work (photos, video, code)
- Planning disaster recovery for a small business

## Core concepts

- **3-2-1 rule.**
  3 copies, 2 media types (e.g., external drive + cloud), 1 offsite. Survives drive failure, theft, fire, and ransomware (if versioned).
- **Versioning.**
  Keep multiple historical versions, not just the latest. Ransomware encrypts the latest too — version history is the escape hatch.
- **What's worth backing up.**
  Irreplaceable first: photos, documents, work, code, configs. OS and apps are reinstallable — deprioritize them.
- **Automation.**
  Backups must run without you. Scheduled, automatic, with failure alerts. Manual backups get skipped exactly when needed most.
- **Encryption.**
  Encrypt backups, especially offsite/cloud. Your backup contains everything — protect it like the original.
- **Restore testing.**
  Quarterly: restore a random file, a folder, and (yearly) a full system. Document the process while calm, not during disaster.
- **RPO and RPO thinking.**
  Recovery Point Objective: how much work can you lose? (hourly? daily?) Set backup frequency to match. RTO: how fast must you be back?
- **Offsite options.**
  Cloud backup services, a drive at a relative's house, NAS sync to a second location. Offsite protects against the big disasters.

## Practical workflow

1. **Inventory what matters.**
   List irreplaceable data and where it lives (laptop, phone, NAS, cloud). You can't back up what you haven't identified.
2. **Set up local backup.**
   External drive + automatic versioned backup (Time Machine, File History, restic, etc.). First copy, fast restores.
3. **Add offsite backup.**
   Cloud backup service or rotated offsite drive. Encrypted. This is the disaster copy — automate it.
4. **Configure versioning.**
   30+ days of versions minimum; longer for critical work. Verify old versions are actually retrievable.
5. **Encrypt everything.**
   Backup encryption on, keys/passphrases stored safely (password manager + physical copy).
6. **Test a restore now.**
   Before trusting the system: restore files to a test location. Time it. Document the steps.
7. **Set failure alerts.**
   Backup software must notify on failure. A silently-failing backup is worse than none — it breeds false confidence.
8. **Schedule restore tests.**
   Quarterly file/folder restores, yearly full-system drill. Calendar it like any critical maintenance.

## Common pitfalls

- **No offsite copy.**
  Local backup + house fire/theft = total loss. Offsite is not optional; it's the point.
- **Untested backups.**
  'It says completed' isn't a test. Until you've restored, you have a theory, not a backup.
- **Sync confused with backup.**
  Cloud sync (Dropbox, iCloud) mirrors deletions and ransomware. Sync is convenience; versioned backup is protection.
- **Manual backups.**
  'I'll back up monthly' means never. Automate fully or accept you have no backup.
- **Unencrypted offsite.**
  Your entire digital life on someone else's server unencrypted. Encrypt, always.
- **Backing up everything equally.**
  Hourly versioned backup of a 2TB movie collection wastes resources. Tier by irreplaceability.
- **No RPO decision.**
  Daily backups when you can't afford to lose an hour of work. Match frequency to what loss you can tolerate.
- **Forgetting phones.**
  Years of photos on a phone with no backup. Phones need backup plans too — automatic cloud + periodic local.
