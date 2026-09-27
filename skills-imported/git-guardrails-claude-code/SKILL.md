---
name: git-guardrails-claude-code
description: Set up a bash hook that blocks dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when the user wants to prevent destructive git operations, add git safety hooks, or block git push/reset for the agent.
---

# Setup Git Guardrails

Sets up a bash hook that intercepts and blocks dangerous git commands before the agent executes them.

## What Gets Blocked

- `git push` (all variants including `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, the agent sees a message telling it that it does not have authority to access these commands.

## How the hook works

The bundled script is at: [bin/block-dangerous-git.sh](bin/block-dangerous-git.sh)

It reads a JSON payload from stdin (`{"tool_input":{"command":"..."}}`, the Claude Code hook payload format), matches the command against a list of dangerous patterns, and exits non-zero with a BLOCKED message on a match.

## Steps

### 1. Ask scope

Ask the user: install for **this project only** (a `.agent-hooks/` dir in the repo) or **all projects** (this skill's `bin/` dir)?

### 2. Copy the hook script

Copy [bin/block-dangerous-git.sh](bin/block-dangerous-git.sh) to the target location based on scope:

- **Project**: `<repo>/.agent-hooks/block-dangerous-git.sh`
- **Global**: this skill's `bin/block-dangerous-git.sh`

Make it executable with `chmod +x`.

### 3. Add hook to the agent's settings

Wire the script into whatever hook mechanism the agent runtime provides (e.g. a `PreToolUse` hook for shell commands). The command to register is the absolute path to the copied script; the runtime must pipe the tool-call payload (`{"tool_input":{"command":"..."}}`) to the script's stdin. A minimal registration example (adapt to the runtime's settings format):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "<path-to-copied-script>/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

If the settings file already exists, merge the hook into the existing hook array. Don't overwrite other settings.

### 4. Ask about customization

Ask if user wants to add or remove any patterns from the blocked list. Edit the copied script accordingly.

### 5. Verify

Run a quick test:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

Should exit with code 2 and print a BLOCKED message to stderr.
