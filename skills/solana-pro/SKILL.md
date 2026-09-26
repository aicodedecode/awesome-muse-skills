---
name: solana-pro
description: Build Solana programs with Anchor: accounts model, PDAs, CPIs, SPL tokens, testing on local validator, and devnet/mainnet deployment. Use when developing on Solana.
category: development
---

# Solana Pro

A practical guide to Solana program development with Anchor: the accounts model, Program Derived Addresses, cross-program invocations, SPL tokens, and a testing-to-deployment workflow that catches the bugs unique to Solana.

## Overview

Solana inverts the EVM model: **programs are stateless; all state lives in accounts** passed into each instruction. Your program never "owns" its data implicitly — every account it reads or writes must be handed to it, validated, and checked. This makes Solana fast and parallelizable, but it shifts security work onto account validation: wrong owner, missing signer, or spoofed account are the dominant bug classes.

Anchor (the standard framework) removes most boilerplate with declarative account constraints (`#[account(...)]`), an IDL for clients, and a test harness.

## When to use

- Writing Anchor programs: tokens, vaults, staking, NFT logic, governance.
- Working with SPL tokens and Metaplex-style NFTs.
- Deriving and using PDAs for program-controlled accounts.
- Calling other programs via CPI (e.g., transferring SPL tokens).
- Testing with the local validator and deploying to devnet/mainnet.

## Core concepts

- **Accounts, not storage.** An instruction receives a list of accounts; the program deserializes the ones it needs. Accounts have an `owner` (the program allowed to write them), `lamports` (rent-bearing balance), and `data`.
- **Rent exemption.** Accounts must hold enough lamports to be rent-exempt or they can be garbage-collected. Always fund new accounts sufficiently and prefer closing (not abandoning) accounts you no longer need — closing refunds lamports.
- **PDAs (Program Derived Addresses).** Deterministic addresses derived from seeds + program ID, with no private key. Only the program can "sign" for them via `invoke_signed`. Used for vaults, escrow, and authority accounts.
- **Signers.** Any account that must authorize must be marked `Signer` and actually sign the transaction. A missing signer check is a critical vulnerability.
- **CPI (Cross-Program Invocation).** Calling another program (e.g., the Token program to transfer). With PDAs, use `CpiContext::new_with_signer` and the exact seeds.
- **Compute units.** Each transaction has a compute budget (~1.4M CU default). Heavy loops or many CPIs can exhaust it — request more with `ComputeBudgetInstruction` when needed.
- **Sysvars & syscalls.** Clock, Rent sysvars give on-chain time and rent state; prefer them over client-supplied values.
- **IDL.** Anchor generates an Interface Description Language file from your program — clients (JS/TS) use it for typed calls. Keep it versioned with the program.

## Practical workflow

**1. Scaffold**
```bash
anchor init my-program && cd my-program
solana-test-validator &   # local cluster in background
```

**2. Define state and instructions**
```rust
#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 1,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```
Anchor's constraints (`init`, `seeds`, `bump`, `mut`, `Signer`) are your first line of defense — prefer constraints over manual checks.

**3. Test on the local validator**
```ts
// tests/my-program.ts — use anchor's provider against localhost
const tx = await program.methods.initialize().accounts({ user: wallet.publicKey }).rpc();
```
Write tests for: happy path, wrong signer rejected, wrong PDA seeds rejected, double-init rejected, close refunds lamports.

**4. Build, deploy, verify**
```bash
anchor build
anchor deploy --provider.cluster devnet   # then mainnet with a funded keypair
anchor idl init --filepath target/idl/my_program.json <PROGRAM_ID> --provider.cluster devnet
```
Pin the program ID in `Anchor.toml` and `lib.rs` (`declare_id!`) — they must match.

**5. Client integration.** Use `@coral-xyz/anchor` with the IDL; derive PDAs client-side with `PublicKey.findProgramAddressSync` using identical seeds.

## Common pitfalls

- **Missing signer checks.** If an instruction changes authority or moves funds, the authorizing account must be a `Signer` — Anchor won't infer this for raw `AccountInfo`.
- **Account substitution.** Validate every account's owner and (for PDAs) seeds. An attacker can pass any account; `#[account(owner = ...)]` or `has_one` constraints close this.
- **Seed collisions.** Two different account types derived from overlapping seeds can collide. Namespace seeds (`b"vault"`, `b"escrow"`) and include distinguishing keys.
- **Abandoned rent.** Creating accounts without a close path locks lamports forever. Add `close = destination` where the lifecycle ends.
- **Lamport/SOL confusion.** 1 SOL = 1,000,000,000 lamports. Use `LAMPORTS_PER_SOL`, never magic numbers.
- **Unchecked arithmetic.** Use `checked_add`/`checked_sub` or Anchor's default checked math; silent overflow corrupts balances.
- **Stale IDL.** Regenerate and republish the IDL on every program change; a mismatched IDL makes clients construct invalid transactions.
- **Mainnet keypair hygiene.** Deploy keys hold upgrade authority — store them in a hardware wallet or multisig (e.g., Squads), never in a repo or chat.
- **Ignoring compute limits.** Profile with `solana simulate`; a transaction that fits on devnet can fail on congested mainnet if it's near the CU ceiling.
