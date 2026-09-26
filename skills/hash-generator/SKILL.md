---
name: hash-generator
description: Generate and verify cryptographic hashes with algorithm selection, salting, and integrity workflows.
category: utilities
---

## Overview

Hashes are fingerprints for data: verifying downloads, deduplicating files, storing passwords
(properly), and building integrity checks. But not all hashes are equal — MD5 and SHA-1 are broken
for security, and password hashing needs specialized algorithms. This skill covers choosing the
right hash, generating and verifying checksums, and avoiding the classic mistakes.

## When to use

- Verifying file downloads against published checksums

- Choosing a hash algorithm for integrity or security

- Hashing passwords correctly (bcrypt/argon2, not SHA-256)

- Deduplicating files or detecting changes

- Understanding HMAC and digital signatures basics

## Core concepts

- - **Algorithm tiers.** Broken (MD5, SHA-1 — collisions practical; fine only for non-security
  checksums like quick dedup). Secure general-purpose (SHA-256, SHA-512, SHA-3, BLAKE2/3).
  Password-specific (bcrypt, scrypt, Argon2 — slow by design). Pick by threat model, not habit.
- - **Speed is a feature or a bug.** Fast hashes (SHA-256, BLAKE3) for file integrity — you want
  speed. Slow hashes (Argon2, bcrypt) for passwords — you want attackers slowed down. Using SHA-256
  for passwords is a vulnerability.
- - **Salts defeat rainbow tables.** Password hashing must use a unique random salt per password
  (bcrypt/Argon2 handle this internally). Unsalted hashes of common passwords are cracked instantly
  via precomputed tables.
- - **Checksums verify integrity, not authenticity.** A SHA-256 on the download page proves the file
  wasn't corrupted — but if the page was compromised, the hash was too. Authenticity needs
  signatures (GPG) or HTTPS from a trusted source.
- - **HMAC for message authentication.** Hash + secret key = proof the message came from someone
  with the key and wasn't altered. Used in API webhooks and tokens. Never roll your own MAC
  construction — use HMAC.
- - **Compare hashes safely.** Use constant-time comparison for security-sensitive hash checks
  (timing attacks can leak hash bytes). For file verification, normal string comparison is fine.

## Practical workflow

1. 1. **Choose the algorithm.** File integrity → SHA-256 (universal) or BLAKE3 (fastest). Passwords
   → Argon2id (modern best) or bcrypt (battle-tested). Checksums in legacy contexts → whatever's
   published, but verify the source.
2. **Generate checksums.** Shell:
   `sha256sum file.iso > file.iso.sha256`
   Verify: `sha256sum -c file.iso.sha256`
   Python: `hashlib.sha256(open("f","rb").read()).hexdigest()` (stream large files in chunks — don't
load multi-GB files into memory).
3. 3. **Verify downloads.** Compare against the publisher's published hash (fetched over HTTPS from
   the official site). Mismatch = do not use the file. Re-download or investigate — never override a
   failed check.
4. **Hash passwords properly.** Use a dedicated library (never raw SHA-256):
   Python example concept: `argon2.PasswordHasher().hash(password)` to store; `.verify(stored,
password)` to check. The library handles salt, cost factors, and format. Increase cost factors as
hardware improves.
5. 5. **Deduplicate with hashes.** Hash file contents (SHA-256) to find exact duplicates regardless
   of name. For near-duplicates (images), perceptual hashes (not cryptographic) are the tool.
6. 6. **Document the scheme.** In systems work: record which algorithm, how salts are
   generated/stored, and cost parameters. Future maintainers (and auditors) need this.

## Common pitfalls

- - **MD5/SHA-1 for security.** Collision attacks are practical. They're fine for non-adversarial
  checksums (cache keys, quick change detection) — never for signatures, certificates, or integrity
  against attackers.
- - **Fast hash for passwords.** SHA-256(password) falls to GPUs trying billions per second.
  Password hashing must be slow and salted — Argon2/bcrypt/scrypt only.
- - **No salt (or static salt).** Same password → same hash across users = rainbow-table
  vulnerability. Unique random salt per password, always.
- - **Trusting the hash source.** Verifying against a checksum posted on the same compromised page
  as the download. Get hashes from a separate trusted channel.
- - **Reading whole files into memory.** Hashing a 10GB file with `.read()` crashes. Stream in
  chunks (e.g., 64KB blocks).
- - **Rolling your own.** Custom hash constructions, homebrew KDFs, "double SHA-256 for extra
  security." Cryptography is a minefield — use standard, reviewed constructions.
