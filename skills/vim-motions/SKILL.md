---
name: vim-motions
description: Vim motions mastery — operators, text objects, macros, marks, registers, and efficient editing patterns.
category: development
---

## Overview

Vim motions are a composable editing language: operators (delete, change, yank) combined with motions (word, paragraph, search) and text objects (inside quotes, around function). `di"` (delete inside quotes), `ciw` (change inner word), `dap` (delete around paragraph) — precision editing without reaching for the mouse, and the same grammar works in Neovim, VS Code's Vim mode, and every JetBrains IDE.

This skill is about the grammar and the high-leverage pieces: text objects, macros, marks, and registers. It's editor-agnostic — the motions transfer everywhere Vim emulation exists.

## When to use

- Learning or leveling up Vim-style editing (any editor with Vim mode).
- Editing structured text precisely (code, config, prose).
- Automating repetitive edits with macros.
- Navigating large files efficiently.
- Understanding registers, marks, and the jumplist.

## Core concepts

- **The grammar: operator + motion.** `d` (delete), `c` (change), `y` (yank) + `w` (word), `$` (end of line), `}` (paragraph), `/pattern` (search). `d2w`, `c$`, `y}` — learn the composition, not individual commands.
- **Text objects.** `i`/`a` + delimiter: `iw`/`aw` (word), `i"`/`a"` (quotes), `i(`/`a(` (parens), `it`/`at` (tags), `ip`/`ap` (paragraph), `if`/`af` (function, via Treesitter). `ci"` and `da(` are daily drivers — editing delimited structures without counting characters.
- **Counts.** Prefix numbers multiply: `3j`, `d4w`, `2ci"`. Combined with `.` (repeat), counts turn one precise edit into bulk edits.
- **`.` (dot repeat).** Repeats the last change — the most underused power feature. Make edits repeatable (one change per dot), then `....` or `j.j.j.` applies them down a column.
- **Motions for navigation.** `f`/`t` + char (find/till on line, `;` repeats), `%` (matching bracket), `*` (search word under cursor), `}`/`{` (paragraphs), `gg`/`G` (file ends), `H`/`M`/`L` (screen positions). `}` jumping beats scrolling.
- **Marks.** `ma` sets mark a, `` `a `` jumps back (line+column), `'a` line only. Uppercase marks (`mA`) span files. Marks are manual bookmarks for "I'll be back here" navigation.
- **Jumplist.** `Ctrl-o`/`Ctrl-i` move through jump history (definitions, searches) — the "back button" of editing. Distinct from marks: automatic, chronological.
- **Registers.** `"` unnamed, `0` last yank, `1-9` delete history, `a-z` named (`"ayy`), `+`/`*` system clipboard, `_` black hole, `=` expression register (`"=2+2` then `p`). `"0p` pasting the last yank after a delete — the register trick that ends paste frustration.
- **Macros.** `qa` record into register a, `q` stop, `@a` replay, `@@` repeat. For repetitive structured edits across lines: record once, `100@a` or apply with `:g`. Macros are programming by demonstration.
- **Visual mode.** `v` (char), `V` (line), `Ctrl-v` (block) — block mode (`Ctrl-v`, `I`, type, `Esc`) edits columns: commenting, alignment, tabular data. The feature that converts skeptics.
- **Search and substitute.** `/pattern` + `n`/`N`, `:s` with ranges (`:%s/old/new/gc`), `\v` very-magic for readable regex. `gn` operates on the next search match — `cgn` changes it, `.` repeats.
- **Global command.** `:g/pattern/cmd` — run commands on matching lines (`:g/TODO/d`, `:g/^$/d` delete blank lines). Ex-command power for bulk operations.
- **Folds.** `za` toggle, `zM`/`zR` close/open all — navigate large files by structure. Method-based or Treesitter folds.
- **Surround (plugin or built-in).** Changing delimiters: `cs"'` (quotes to single), `ysiw]` — with mini.surround or vim-surround. Delimiter manipulation is constant in code.
- **Text-object plugins.** Treesitter text objects (`@function.outer`, `@class.outer`, `@parameter.inner`) — code-aware selections beyond built-in delimiters; `vaf` selects the whole function precisely.
- **`:normal` command.** Run normal-mode keystrokes across a range — `:%normal @a` replays a macro on every line; macros + ranges are the bulk-editing superpower.

## Practical workflow

1. **Learn the grammar first.** Practice operator+motion+text-object combos on real code: `ciw`, `di"`, `ca(`, `dap`, `yit`. Ten combos cover 80% of edits.
2. **Make `.` your multiplier.** Structure edits as one repeatable change, then repeat with `.` — e.g., `ci"` on one string, `n.n.n.` down the matches.
3. **Record macros for repetition.** Repetitive multi-step edit? `qa`, do it once carefully (use `0`/`$`/`f` motions, not `h`/`l` counts), `q`, then `@a` / `100@a`:
   ```
   qa            " start recording to register a
   0f"ci"new<Esc> " example: replace quoted value on the line
   j             " next line
   q             " stop
   50@a          " replay 50 times
   ```
4. **Use marks for return trips.** `ma` before diving into a definition, `` `a `` to return. Uppercase for cross-file.
5. **Master registers.** `"0p` after deletes, `"_d` to delete without clobbering yank, `"+y` to the system clipboard.
6. **Block mode for columns.** `Ctrl-v`, select column, `I`/`A`/`c`, `Esc` — commenting blocks, aligning assignments, editing CSV-ish data.
7. **Search-driven editing.** `/pattern`, `cgn`, `.` — change all matches with full control, reviewing each.
   " bulk edit: run macro a on every line matching TODO
   :g/TODO/normal @a
   " apply a normal-mode command to a line range
   :10,20normal I//

8. **Bulk with `:g` and `:%s`.** Global command for line operations, substitute with `c` flag for confirmation on risky replaces.

## Common pitfalls

- **Arrow keys / mouse dependence** — staying in insert mode navigating; `Esc` and motions are the point.
- **Counting with `h`/`l`** — `12l` instead of `f;`; use find motions and text objects.
- **Not using text objects** — `vlllld` instead of `diw`; objects are precise and repeatable.
- **Forgetting `.`** — retyping repeated edits; make it repeatable, then dot.
- **Macros with absolute motions** — recorded `jjjj` breaking on different shapes; use `0`, `/`, `}` in macros.
- **Yank clobbered by delete** — pasting the deleted text; `"0p` or named registers.
- **Ignoring block mode** — column edits done line by line; `Ctrl-v` is transformative.
- **`:%s` without `c` on risky replaces** — blind global replace; confirm, or use `cgn`+`.`.
- **No marks/jumplist use** — losing your place; `ma`/`` `a `` and `Ctrl-o`.
- **Insert-mode everything** — living in insert mode; normal mode is home, insert is a visit.
- **Learning commands, not grammar** — memorizing `dd`, `yy` as atoms instead of `d`+`d`; composition scales, memorization doesn't.
- **Skipping `*` and `#`** — manual searching for the word under cursor; they're instant.
- **Never leaving the comfort zone** — `hjkl` forever; `f`/`t`, text objects, and macros are the actual speedups.
- **Never using `:normal`** — macros replayed by hand across ranges; `:%normal @a` applies to every line.
- **Forgetting `gv`** — reselecting the last visual selection manually; `gv` restores it instantly.
- **Recording macros with counts** — `5j` inside a macro breaking on irregular text; relative motions (`}`, `/pattern`) survive shape changes.
