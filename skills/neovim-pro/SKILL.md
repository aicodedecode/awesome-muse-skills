---
name: neovim-pro
description: Neovim guidance — Lua configuration, lazy.nvim plugin management, LSP setup, Telescope, and Treesitter.
category: development
---

## Overview

Neovim is Vim evolved: the same modal editing, plus a Lua configuration language, built-in LSP client, Treesitter parsing, and a plugin ecosystem (lazy.nvim, Telescope) that makes it a genuine IDE competitor. It's fast, keyboard-driven, and runs anywhere — including over SSH where GUI editors can't follow.

The modern Neovim stack is Lua + lazy.nvim + LSP + Treesitter + Telescope. This skill covers configuring that stack well: startup performance, LSP for your languages, fuzzy finding, and the options that make daily editing pleasant.

## When to use

- Setting up Neovim from scratch or migrating from Vim/VS Code.
- Configuring LSP for a language (completions, go-to-definition, diagnostics).
- Debugging slow startup or plugin issues.
- Choosing plugins (or deciding you need fewer).
- Writing Lua config and custom keymaps.
- Using Telescope, Treesitter, and modern editing plugins.

## Core concepts

- **Lua config.** `init.lua` replacing vimscript — `vim.opt`, `vim.keymap.set`, `vim.api`. Lua is faster and more expressive; keep config organized (`lua/config/options.lua`, `keymaps.lua`, `plugins/`).
- **lazy.nvim.** The plugin manager: lazy-loading by event/cmd/ft/keys, lockfile (`lazy-lock.json`) for reproducible installs, profiling (`:Lazy profile`) for startup analysis. Lazy-load everything that isn't needed at startup.
- **LSP (built-in client).** Language servers via `nvim-lspconfig` (or `vim.lsp.config` in 0.11+): completions, hover, go-to-definition, references, rename, diagnostics, code actions. Mason installs servers; configure per-language settings deliberately.
- **Treesitter.** Real parsing (not regex) for highlighting, indentation, text objects, and incremental selection. Install parsers for your languages; `:TSUpdate` keeps them current. This is what makes highlighting correct.
- **Telescope.** Fuzzy finder for files, grep, buffers, LSP symbols, git — the command palette of Neovim. Configure `live_grep` with ripgrep args; learn the core pickers deeply rather than installing ten finders.
- **Completion.** nvim-cmp (or blink.cmp) wired to LSP + snippets + buffer/path sources. Snippets (LuaSnip) for boilerplate. Tune: completion should feel instant, not a popup lottery.
- **Formatting/linting.** conform.nvim / nvim-lint bridging external tools (prettier, ruff, stylua) — format-on-save with fallback to LSP formatting. Keep formatting deterministic across the team (same configs as CI).
- **Keymaps.** `<leader>` (space) as the namespace; consistent mnemonics (`<leader>ff` find files, `<leader>fg` grep, `<leader>ca` code action). Document your maps (`:map`, which-key) — undiscoverable maps don't exist.
- **Options that matter.** `number`/`relativenumber`, `expandtab`/`shiftwidth` per language, `undofile` (persistent undo — non-negotiable), `ignorecase`/`smartcase`, `scrolloff`, `signcolumn=yes` (no layout shift), `updatetime` (CursorHold responsiveness).
- **Diagnostics.** Virtual text vs signs vs float — configure for readability; `[d`/`]d` navigate; `<leader>e` float for details. Diagnostics should inform, not decorate.
- **Sessions/projects.** Session management (persistence.nvim, or built-in `:mksession`) per project; project-root detection. Restore your layout where you left it.
- **Startup profiling.** `--startuptime`, `:Lazy profile` — measure plugin cost; the usual suspects are colorschemes doing too much and plugins loading eagerly that should be lazy.
- **Terminal integration.** `:terminal` buffers, toggleterm for floating terminals — Neovim as the whole workspace, not just the editor pane.
- **Remote editing.** Neovim over SSH (it's a terminal app) — the killer feature vs GUI editors for server work.

## Practical workflow

1. **Structure the config.** `init.lua` bootstrapping lazy.nvim, then modules:
   ```lua
   -- init.lua
   require("config.options")
   require("config.keymaps")
   require("config.lazy")  -- bootstraps lazy.nvim, imports plugins/
   ```
2. **Set options first.** The sane baseline before any plugins:
   ```lua
   vim.opt.number = true; vim.opt.relativenumber = true
   vim.opt.expandtab = true; vim.opt.shiftwidth = 2; vim.opt.tabstop = 2
   vim.opt.undofile = true; vim.opt.ignorecase = true; vim.opt.smartcase = true
   vim.opt.signcolumn = "yes"; vim.opt.updatetime = 250
   vim.g.mapleader = " "
   ```
3. **Install lazy.nvim with lazy-loading.** Specs with `event`, `cmd`, `ft`, `keys` — nothing loads before it's needed:
   ```lua
   { "nvim-telescope/telescope.nvim", cmd = "Telescope",
     keys = { { "<leader>ff", "<cmd>Telescope find_files<cr>" } },
     dependencies = { "nvim-lua/plenary.nvim" } }
   ```
4. **Configure LSP per language.** Mason for installation, lspconfig for setup, on_attach keymaps (gd, gr, K, <leader>ca, <leader>rn):
   ```lua
   vim.api.nvim_create_autocmd("LspAttach", {
     callback = function(args)
       local map = function(m, lhs, rhs)
         vim.keymap.set(m, lhs, rhs, { buffer = args.buf }) end
       map("n", "gd", vim.lsp.buf.definition)
       map("n", "gr", vim.lsp.buf.references)
       map("n", "K", vim.lsp.buf.hover)
       map("n", "<leader>rn", vim.lsp.buf.rename)
       map("n", "<leader>ca", vim.lsp.buf.code_action)
     end,
   })
   ```
5. **Add Treesitter.** Ensure installed parsers for your languages; enable highlight/indent; add text objects (`@function.outer`) — editing by syntax nodes.
6. **Wire completion + formatting.** cmp/blink with LSP source; conform.nvim format-on-save matching CI's formatter config.
7. **Profile startup.** `:Lazy profile`, `--startuptime`; lazy-load offenders; target sub-100ms.
8. **Version everything.** Config in git; `lazy-lock.json` committed; new machine setup is clone + open.

## Common pitfalls

- **Eager-loading everything** — 800ms startup; lazy-load by event/cmd/ft.
- **No lockfile committed** — plugin updates breaking config; commit `lazy-lock.json`.
- **LSP configured but Mason missing servers** — "LSP not working"; ensure servers installed and attached (`:LspInfo`).
- **Conflicting formatters** — LSP format + conform fighting; pick one path per language.
- **Vimscript in Lua config** — mixing styles; commit to Lua (`vim.opt`, not `set`).
- **Undiscoverable keymaps** — maps nobody remembers; which-key + documented leader mnemonics.
- **No persistent undo** — losing undo history on close; `undofile` is one line.
- **Signcolumn layout shift** — diagnostics jumping text; `signcolumn=yes` always.
- **Treesitter parsers missing** — broken highlighting; `:TSUpdate` and ensure_installed.
- **Plugin hoarding** — 60 plugins, 10 used; audit quarterly, remove ruthlessly.
- **Colorscheme without terminal true-color** — wrong colors; fix terminal/tmux first.
- **Ignoring `:checkhealth`** — built-in diagnostics for providers, parsers, LSP; run it first when debugging.
- **Leader key conflicts** — plugins stealing your leader maps; check with `:verbose map`.
