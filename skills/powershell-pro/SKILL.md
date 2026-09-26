---
name: powershell-pro
description: Professional PowerShell: cmdlets, pipeline patterns, modules, remoting, and Windows automation. Use when writing, reviewing, or structuring PowerShell scripts and modules.
category: development
---

# PowerShell Pro

## Overview

PowerShell is **an object pipeline, not a text pipeline** — cmdlets pass rich .NET objects, which
eliminates the parsing fragility of text-based shells. Professional PowerShell means thinking in
objects and pipelines, writing advanced functions with proper parameters, building modules instead
of script sprawl, and handling errors with the structured mechanisms the language provides.

The through-line: objects in, objects out — and scripts robust enough to run unattended.

## When to use

- Writing or reviewing PowerShell for Windows automation or cross-platform scripting.
- Building reusable functions, modules, or DSC configurations.
- Administering systems via remoting (WinRM/SSH).
- Debugging pipeline, scoping, or error-handling issues.
- Migrating from batch/CMD or ad-hoc commands to maintainable scripts.

## Core concepts

- **The pipeline passes objects.** `Get-Process | Where-Object CPU -gt 100 | Stop-Process` —
  no text parsing, no `awk`. Learn the core cmdlets deeply (`Where-Object`, `ForEach-Object`,
  `Select-Object`, `Sort-Object`, `Group-Object`, `Measure-Object`) — they compose into most
  solutions.
- **Advanced functions.** `[CmdletBinding()]` + `param()` with types, validation attributes
  (`[ValidateNotNullOrEmpty()]`, `[ValidateSet()]`), `ValueFromPipeline`, and `begin`/`process`/
  `end` blocks. This turns scripts into cmdlet-like tools with `-WhatIf`/`-Confirm` support
  (`SupportsShouldProcess`) — free safety for destructive operations.
- **Error handling: two kinds.** Terminating vs non-terminating errors; `$ErrorActionPreference =
  'Stop'` to make scripts fail fast; `try`/`catch`/`finally` for structured handling. Know which
  errors terminate by default and set the preference deliberately in scripts.
- **Modules over script sprawl.** `.psm1` modules with exported functions, manifest (`.psd1`)
  with versioning, published to a repository (PSGallery or internal). Dot-sourcing 20 script files
  is not a module system.
- **Remoting and sessions.** `Invoke-Command -ComputerName` / `New-PSSession` for remote execution;
  prefer fan-out over RDP-clicking. Mind the double-hop (CredSSP/ Kerberos delegation) and use
  Just Enough Administration (JEA) for least-privilege delegation.
- **Desired State Configuration (DSC).** Declarative system state ("this feature installed, this
  service running") — idempotent by design. The right tool when imperative scripts keep drifting.

## Practical workflow

1. **Start scripts with intent.**
   ```powershell
   [CmdletBinding(SupportsShouldProcess)]
   param(
     [Parameter(Mandatory, ValueFromPipelineByPropertyName)]
     [ValidateNotNullOrEmpty()][string]$ComputerName
   )
   $ErrorActionPreference = 'Stop'
   ```
2. **Write advanced functions.** One verb-noun function per file in a module (`Get-`,
   `Set-`, `New-`, `Remove-`, `Test-`, `Invoke-` per approved verbs); pipeline-aware via
   `process {}` blocks.
3. **Handle errors structurally.** `try/catch` around risky operations; `-ErrorAction Stop` to
   promote specific calls; always log context (which computer, which operation) — remote failures
   without context are undebuggable.
4. **Make it idempotent.** `Test-` functions that check state before `Set-` changes it; scripts
   safe to rerun. Destructive operations behind `ShouldProcess` (`-WhatIf` support).
5. **Test with Pester.** Unit-test functions with mocked cmdlets; integration-test against lab
   machines. Pester is the standard — use it.
6. **Operate securely.** Execution policy is not a security boundary (it's a guardrail); sign
   scripts in production; never hardcode credentials — use secret management (SecretManagement
   module, vaults); constrain remoting endpoints with JEA.

Idiomatic snippets:

```powershell
# Advanced function: pipeline-aware, validated, WhatIf-safe
function Remove-StaleProfile {
    [CmdletBinding(SupportsShouldProcess, ConfirmImpact='High')]
    param(
        [Parameter(Mandatory, ValueFromPipelineByPropertyName)]
        [ValidateNotNullOrEmpty()][string]$UserName,
        [int]$OlderThanDays = 90
    )
    process {
        $profile = Get-UserProfile $UserName
        if ($profile.LastUse -lt (Get-Date).AddDays(-$OlderThanDays)) {
            if ($PSCmdlet.ShouldProcess($UserName, 'Remove stale profile')) {
                Remove-UserProfile $profile
            }
        }
    }
}
```

## Common pitfalls

- **Text-parsing objects.** Converting rich objects to strings then regexing them — defeats the
  entire platform. Stay in the object pipeline.
- **Unscoped variables and scope bugs.** `$script:`/`$global:` misuse, or assuming a variable set
  inside `ForEach-Object` persists as expected. Learn the scopes; prefer function parameters and
  return values.
- **Non-terminating errors ignored.** A failed cmdlet in a loop that keeps going silently because
  `$ErrorActionPreference` wasn't set. Decide the failure policy per script.
- **`Invoke-Expression` on dynamic strings.** PowerShell's `eval` — injection risk and debugging
  hell. Use scriptblocks, splatting (`@params`), and the call operator (`&`) instead.
- **Hardcoded credentials.** Passwords in scripts, in history, in source control. Secret
  management modules exist — use them; rotate anything ever committed.
- **One giant script.** 1,000-line `Do-Everything.ps1` with no functions. Modularize: functions
  → module → manifest → repository.
- **Ignoring `-WhatIf`.** Destructive operations without `SupportsShouldProcess` — no dry-run, no
  safety net. If it can destroy, it supports `-WhatIf`.
