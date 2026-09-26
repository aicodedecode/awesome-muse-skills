---
name: lua-pro
description: Idiomatic Lua: tables as the universal structure, metatables, modules, and embedding patterns. Use when writing, reviewing, or structuring Lua code (games, embedded scripting, Neovim, Redis, nginx).
category: development
---

# Lua Pro

## Overview

Lua's genius — **one data structure (the table), first-class functions, and ruthless simplicity** —
makes it the premier embedding language (games, Redis, nginx/OpenResty, Neovim, Wireshark). Professional
Lua means mastering tables deeply, using metatables judiciously, writing clean modules, and respecting
the 1-based, dynamically-typed reality instead of fighting it.

The through-line: small language, deep mastery — tables, closures, and coroutines cover nearly everything.

## When to use

- Writing or reviewing Lua for games, embedded scripting, or config (Neovim, AwesomeWM).
- Designing Lua modules and APIs for host applications.
- Using metatables, metamethods, and OOP-ish patterns in Lua.
- Debugging table, scoping, or coroutine issues.
- Embedding Lua in a C/C++ host or extending Redis/nginx.

## Core concepts

- **Tables are everything.** Arrays (1-based!), dictionaries, objects, modules, namespaces — all
  tables. Master the idioms: `t[#t+1] = v` (append), `ipairs` for sequences, `pairs` for maps,
  and the critical distinction (a table with holes is not a sequence — `#` is undefined on it).
- **Modules via return.** The modern pattern: a file builds a local table and `return`s it;
  `require` caches by name. Avoid the old `module()` function and global pollution — locals and
  explicit returns keep namespaces clean.
- **Metatables: power with restraint.** `__index`/`__newindex` for defaults, prototypes, and
  read-only tables; `__call`, `__tostring`, arithmetic metamethods for DSLs. Prototype-based OOP
  via `__index` chains works — but keep hierarchies shallow and document the magic.
- **Closures over classes.** Lua's closures capture upvalues beautifully — factories returning
  closures often beat metatable-OOP for encapsulation (true private state, no `self` bookkeeping).
- **Coroutines for cooperative control flow.** `coroutine.create`/`resume`/`yield` — perfect for
  iterators, state machines, and game scripting (cutscenes, AI sequences). They're stackful and
  cheap; don't fear them, but don't use them where a simple iterator suffices.
- **Know the version.** Lua 5.1 (LuaJIT, Redis, nginx) vs 5.3/5.4 (integers, `//`, bitwise ops,
  `<close>` for to-be-closed variables). Write to your target's version — 5.1-isms and 5.4-isms
  don't mix.

## Practical workflow

1. **Structure as modules.** One file per module, local table, `return` at end; `require` for
   deps. Keep the global namespace clean (`_G` pollution is the original Lua sin).
2. **Be explicit about types at boundaries.** Dynamic typing means validation at API edges:
   `assert(type(x) == "table")` with messages in dev; graceful errors for host-provided data.
3. **Use the stdlib fully.** `string` (patterns — not regex! learn the pattern language),
   `table` (`insert`, `remove`, `sort`, `concat`, `pack`/`unpack`), `math`, `os`, `io`.
   `table.concat` beats loop-concatenation for building strings.
4. **Handle errors with pcall/xpcall.** Protected calls at host boundaries; `error()` with
   informative messages (include context!); don't let Lua errors crash the host silently —
   decide the policy per embedding.
5. **Test where it matters.** `busted` for unit tests; test pure logic heavily (it's easy to
   isolate); integration-test against the real host (Redis scripts against Redis, game logic in
   the engine harness).
6. **Lint and format.** `luacheck` (catches globals leaks, unused vars — essential in a
   dynamic language), `stylua` for formatting. In CI, always.

Module pattern:

```lua
-- order.lua
local Order = {}
Order.__index = Order

function Order.new(id, items)
  assert(type(id) == "string", "id must be a string")
  return setmetatable({ id = id, items = items or {} }, Order)
end

function Order:total()
  local sum = 0
  for _, item in ipairs(self.items) do
    sum = sum + item.price * item.qty
  end
  return sum
end

return Order
```

## Common pitfalls

- **0-based thinking.** `t[0]` is valid Lua — it's just not part of the sequence. Off-by-one bugs
  from other languages' habits; `#t` and `ipairs` ignore index 0.
- **Tables with holes.** Setting `t[3] = nil` in a 5-element sequence makes `#t` undefined —
  iteration silently drops elements. Use `table.remove` or rebuild; never nil-out sequence middles.
- **Global leaks.** Forgetting `local` creates a global — silent, far-reaching bugs. `luacheck`
  with `globals` whitelisting catches this; strict mode (`setmetatable(_G, ...)`) in dev.
- **Metatable magic without documentation.** `__index` chains three deep that nobody can trace.
  Metatables should make call sites *clearer*; if they confuse, use plain functions.
- **String patterns assumed to be regex.** Lua patterns aren't regex (`%d`, `%a`, no `|` alternation,
  `-` is non-greedy). Read the pattern docs once; it saves hours.
- **Floating-point as integer.** Pre-5.3 Lua has only doubles — `1/2 == 0.5`, large integers lose
  precision. Know your version's number model (5.3+ has true integers).
- **Not handling host errors.** A Redis Lua script error aborts the script; a Neovim plugin error
  breaks the editor loop. Wrap host entry points in `pcall` and define failure behavior.
