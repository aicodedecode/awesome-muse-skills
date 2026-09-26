---
name: move-pro
description: Write Move modules for Aptos and Sui: resources, abilities, object model, entry functions, unit testing, and package publishing. Use when building on Move-based chains.
category: development
---

# Move Pro

A practical guide to the Move language as used on Aptos and Sui: resource-oriented programming, the abilities system, Sui's object model, testing, and publishing packages safely.

## Overview

Move treats digital assets as **resources** — values governed by linear types that cannot be implicitly copied or dropped. A coin or NFT is a struct with carefully chosen *abilities*; the type system itself prevents duplication and accidental destruction of assets. This eliminates entire bug classes (double-spend by copy, lost funds by drop) at compile time — but it means you must be explicit about every asset's lifecycle: where it is created, stored, transferred, and destroyed.

Aptos and Sui share the language core but differ in storage: Aptos uses accounts with resources stored under addresses; Sui uses an object-centric model where objects have owners.

## When to use

- Writing Move modules/packages on Aptos (account-based resources).
- Writing Move packages on Sui (object model, `sui::transfer`, PTBs).
- Designing fungible tokens or NFTs with Move's type system.
- Adding `#[test]` unit tests and publishing to devnet/testnet/mainnet.
- Reviewing Move code for ability misuse or stuck assets.

## Core concepts

- **Structs + abilities.** `struct Coin has store { value: u64 }`. The four abilities: `copy` (duplicable), `drop` (discardable), `store` (storable in global storage / other structs), `key` (top-level storage / object). Assets should have *neither* `copy` nor `drop`.
- **Resources must move.** Without `copy`/`drop`, the compiler forces you to explicitly `move_to`, transfer, or destroy every value. A function that takes a `Coin` and doesn't return or store it fails to compile — that's the safety net.
- **Modules vs scripts.** Modules hold persistent code and (on Aptos) resources; scripts are one-off transactions. Production logic lives in modules with `public entry fun` functions callable from transactions.
- **Aptos storage.** `move_to<T>(account, resource)` stores under an address; `borrow_global<T>(addr)` reads. `signer` proves authorization — never fabricate signers.
- **Sui objects.** Everything is an object with an owner: address-owned, object-owned, shared, or immutable. `transfer::public_transfer`, `transfer::share_object`, `transfer::freeze_object` set ownership. Entry functions take objects by value/reference.
- **Generics + phantom types.** `struct Coin<phantom CoinType> has store` — one generic coin module serves all currencies, distinguished by uninhabited witness types.
- **Events.** Emit events for mints, transfers, and state changes; indexers and UIs depend on them.

## Practical workflow

**1. Scaffold**
```bash
aptos move init --name my_module     # Aptos
sui move new my_package              # Sui
```

**2. Write the module (Aptos-flavored example)**
```move
module deployer::basic_coin {
    use std::signer;
    struct CoinStore has key { coin: u64 }

    public entry fun mint(account: &signer, amount: u64) acquires CoinStore {
        let addr = signer::address_of(account);
        if (!exists<CoinStore>(addr)) {
            move_to(account, CoinStore { coin: 0 });
        };
        let store = borrow_global_mut<CoinStore>(addr);
        store.coin = store.coin + amount;
    }
}
```
Note `acquires` annotations — the compiler tracks which globals a function touches.

**3. Unit test in-language**
```move
#[test(account = @0xCAFE)]
public entry fun test_mint(account: signer) acquires CoinStore {
    mint(&account, 100);
    assert!(borrow_global<CoinStore>(@0xCAFE).coin == 100, 0);
}
```
```bash
aptos move test   # or: sui move test
```
Move's built-in test framework with `#[test]`, `#[expected_failure]` is fast — use it heavily before any on-chain deploy.

**4. Publish**
```bash
aptos move publish --named-addresses deployer=<ADDR>   # devnet first
sui client publish --gas-budget 100000000
```
On Sui, choose the upgrade policy deliberately: `Immutable` for final code, `Compatible` only with a multisig-controlled upgrade cap.

**5. Interact.** Aptos: transactions call `entry` functions with typed args. Sui: build Programmable Transaction Blocks (PTBs) combining object inputs and Move calls — batch reads/writes atomically.

## Common pitfalls

- **Stuck assets.** Forgetting a withdraw/destroy path leaves resources permanently locked. Every resource type needs a complete lifecycle: create → store → transfer/withdraw → destroy.
- **Ability creep.** Adding `copy` or `drop` "to make it compile" defeats the type system. Fix the lifecycle instead.
- **Missing `acquires`.** The compiler rejects undeclared global access — annotate honestly; don't restructure code just to dodge it.
- **Signer confusion (Aptos).** `&signer` is a capability proving the holder authorized the transaction. Never store signers or pass them where an address suffices.
- **Object ownership mistakes (Sui).** Sending an object to the wrong owner, or forgetting to make a shared object when multiple users interact with it, bricks the flow. Decide ownership at design time.
- **Overly permissive upgrades.** A `Compatible` upgrade policy controlled by a single key is a backdoor. Use multisig + timelock for upgrade authority on mainnet.
- **Unbounded vectors.** Storing user-pushed items in a `vector` inside global storage grows gas costs linearly; paginate or cap.
- **Test-only code in production.** `#[test_only]` functions are stripped from published bytecode — keep them there, and never gate production logic on test helpers.
- **Ignoring events.** If indexers can't see it, your UI can't show it. Emit events for every meaningful mutation.
