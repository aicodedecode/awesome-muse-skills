---
name: gpg-expert
description: GPG guidance — key management, signing commits, encrypting files, subkeys, revocation, and YubiKey workflows.
category: development
---

## Overview

GPG (GNU Privacy Guard) is the OpenPGP implementation behind signed git commits, encrypted files, and verified software releases. Its reputation for being hard to use is deserved — but the working subset (generate a key, sign commits, encrypt to recipients, manage subkeys, revoke when needed) is learnable in an afternoon and covers 95% of real usage.

This skill covers that working subset plus the operational practices that matter: subkeys for daily use, hardware keys (YubiKey) for high-value identities, revocation certificates generated before you need them, and the keyserver/Web-of-Trust realities of 2026.

## When to use

- Signing git commits and tags.
- Encrypting files or secrets for specific recipients.
- Setting up GPG subkeys and moving keys to a YubiKey.
- Generating revocation certificates.
- Verifying signatures on releases.
- Choosing between GPG, age, and SSH-based signing.

## Core concepts

- **Key pairs.** A primary key (certify + optionally sign) and subkeys (sign, encrypt, authenticate). The primary key is your identity — protect it; subkeys do daily work and are replaceable.
- **Subkeys.** Separate sign/encrypt/auth subkeys under one primary. Laptop compromise? Revoke the subkeys, keep the identity. This separation is the single most important GPG practice.
- **Web of Trust vs TOFU.** The WoT (keysigning parties) never scaled; in practice, trust is TOFU (trust on first use) plus verification through another channel (a video call, a known website, Keybase-style proofs). Set ownertrust realistically.
- **Keyservers.** SKS is dead (poisoned keys, GDPR issues); modern keys.openpgp.org is the sane default — it verifies email ownership before publishing. Don't upload keys you can't maintain.
- **Signing vs encrypting.** Sign = authenticity/integrity (anyone can verify, message readable). Encrypt = confidentiality (only recipients read). Sign-then-encrypt for both. Git commits use signing.
- **Detached signatures.** `.sig`/`.asc` files alongside releases — `gpg --verify` checks authenticity without hiding the content. The standard for software distribution.
- **Revocation certificates.** Generate at key creation (`gpg --gen-revoke`, stored offline) — revoking a lost/compromised key without the private key is impossible otherwise. This is the "backup" most people skip.
- **YubiKey / hardware keys.** Private key material generated on (or moved to) the token; signing/decryption require touch. The primary key lives offline; subkeys live on the YubiKey. `gpg --card-status` inspects.
- **gpg-agent.** Caches passphrases, integrates with pinentry; `gpg-agent` also provides SSH auth via the auth subkey (`enable-ssh-support`) — one hardware token for GPG + SSH.
- **Trust model for verification.** `gpg --verify` tells you the signature is valid AND whether you trust the key — "Good signature" from an untrusted key is informational, not assurance. Distinguish the two outputs.
- **Expiry.** Keys and subkeys should expire (1-2 years) — expiry is self-updating (extend anytime you hold the key) and bounds the damage of a lost key. Non-expiring keys are a liability.
- **age as the alternative.** For pure file encryption, `age` is simpler and modern (no keyrings, no WoT). Use GPG where signatures/identity matter; age where you just need "encrypt this file to this recipient."
- **SSH signing for git.** Git can sign with SSH keys (`gpg.format ssh`) — simpler if you already manage SSH keys, and GitHub verifies them. GPG remains the choice for encryption and the broader OpenPGP ecosystem.
- **Key rotation statements.** When rotating keys, publish a statement signed by the old key linking old and new fingerprints — prevents impersonation confusion during the transition.

## Practical workflow

1. **Generate properly.** Primary cert-only key + sign/encrypt/auth subkeys, with expirations, and a revocation cert stored offline:
   ```bash
   gpg --quick-generate-key "Ada Lovelace <ada@example.com>" ed25519 cert 2y
   gpg --quick-add-key <fingerprint> ed25519 sign 1y
   gpg --quick-add-key <fingerprint> cv25519 encrypt 1y
   gpg --output revoke.asc --gen-revoke <fingerprint>  # store OFFLINE
   ```
2. **Back up.** Export the full key (primary + subkeys) to encrypted offline media; export the public key for publishing. Test restore on a scratch machine — backups you can't restore are theater.
3. **Move subkeys to YubiKey.** `keytocard` for each subkey; verify with `gpg --card-status`; delete the on-disk secret subkeys after confirming (`gpg --delete-secret-subkeys`, keeping the primary offline).
4. **Sign git commits.** Configure git once; sign by default:
   ```bash
   git config --global user.signingkey <signing-subkey-id>
   git config --global commit.gpgsign true
   git config --global tag.gpgsign true
   # or SSH signing: git config --global gpg.format ssh
   ```
5. **Encrypt files to recipients.** `--encrypt --recipient` (can list several); `--armor` for text-safe output:
   ```bash
   gpg --encrypt --recipient ada@example.com --armor secrets.env
   gpg --decrypt secrets.env.asc
   ```
6. **Verify releases.** Import the project's key from a trustworthy source, check the fingerprint out-of-band, then `gpg --verify file.sig file`. Read both the validity AND trust lines.
7. **Publish thoughtfully.** `gpg --send-keys` to keys.openpgp.org (verifies your email); keep a public key page with the fingerprint for out-of-band verification.
8. **Rotate and revoke.** Extend expirations yearly; if a subkey is compromised, revoke just the subkey and roll a new one — the identity (primary) survives.

## Common pitfalls

- **No revocation certificate** — lost key = unrevocable identity; generate at creation, store offline.
- **Daily-driving the primary key** — compromise costs the identity; subkeys for daily use, primary offline.
- **Non-expiring keys** — unbounded liability; 1-2 year expirations, extendable anytime.
- **Uploading to dead keyservers** — SKS poisoning/GDPR; use keys.openpgp.org.
- **Confusing "Good signature" with trust** — validity ≠ trust; check the trust line.
- **Passphraseless keys** — a copied `~/.gnupg` is full impersonation; passphrases + agent.
- **Forgetting `gpg-agent`** — typing passphrases constantly; agent + pinentry configured once.
- **Encrypting without signing** — recipient can't verify sender; sign-then-encrypt for authenticity.
- **Wrong recipient / no self-encryption** — encrypting to others without including yourself; add yourself as recipient or you can't read your own files.
- **YubiKey without backup** — token lost = subkeys lost; keep offline subkey backups for re-provisioning.
- **Fingerprint not verified out-of-band** — trusting a keyserver alone; verify fingerprints via a second channel.
- **GPG for what age does better** — keyring ceremony for simple file encryption; age for encryption-only needs.
- **Expired subkeys breaking CI** — signing keys expiring unnoticed; monitor expirations and rotate proactively.
