# Skill import manifest — 2026-10-10

Port of **anthropics/knowledge-work-plugins** (Apache-2.0, (c) Anthropic)
into Muse AI skill format: `skills-imported/`.
Source: https://github.com/anthropics/knowledge-work-plugins (cloned 2026-10-10).

Every SKILL.md carries a provenance HTML comment (after the frontmatter) with the
original path and the Muse AI adaptations applied. No installers run. Plugin
READMEs/LICENSEs preserved under `skills-imported/_kw-meta/`.

## Counts

- 252 upstream skills -> 252 skill dirs (26 renamed for collisions, see below)
- 15 upstream slash commands -> 12 new skill dirs + 3 companion files
- **Total new: 264 skill dirs** in `skills-imported/` (1,485 -> 1,749)
- Validation: 264/264 pass (frontmatter `name` == dirname, lowercase-hyphens,
  non-empty `description`)

## Renames (collision handling)

Within-upstream dupes and collisions with existing `skills/` / `skills-imported/`
entries were prefixed with the plugin name:

| New name | Original |
|---|---|
| apollo-prospect | partner-built/apollo/skills/prospect |
| bio-research-scvi-tools | bio-research/skills/scvi-tools |
| bio-research-start | bio-research/skills/start |
| common-room-account-research | partner-built/common-room/skills/account-research |
| common-room-call-prep | partner-built/common-room/skills/call-prep |
| common-room-prospect | partner-built/common-room/skills/prospect |
| data-data-visualization | data/skills/data-visualization |
| data-statistical-analysis | data/skills/statistical-analysis |
| design-design-critique | design/skills/design-critique |
| design-design-system | design/skills/design-system |
| engineering-architecture | engineering/skills/architecture |
| engineering-code-review | engineering/skills/code-review |
| engineering-incident-response | engineering/skills/incident-response |
| enterprise-search-search | enterprise-search/skills/search |
| marketing-competitive-brief | marketing/skills/competitive-brief |
| marketing-email-sequence | marketing/skills/email-sequence |
| marketing-seo-audit | marketing/skills/seo-audit |
| product-management-competitive-brief | product-management/skills/competitive-brief |
| productivity-start | productivity/skills/start |
| sales-account-research | sales/skills/account-research |
| sales-call-prep | sales/skills/call-prep |
| sales-daily-briefing | sales/skills/daily-briefing |
| sales-lead-triage | sales/skills/lead-triage |
| small-business-content-strategy | small-business/skills/content-strategy |
| small-business-lead-triage | small-business/skills/lead-triage |
| zoom-plugin-start | partner-built/zoom-plugin/skills/start |

Nested zoom-plugin groups were flattened with dashed names, e.g.
`skills/meeting-sdk/android` -> `zoom-plugin-meeting-sdk-android`.

## Text mapping (Claude -> Muse AI)

| Original | Ported |
|---|---|
| Claude Cowork / Claude Code / Claude | Muse AI |
| Cowork / cowork (standalone) | Muse AI |
| MCP server(s) / MCP | connector(s) |
| `.mcp.json` (prose) | `connector config` |
| `CLAUDE.md` | `MUSE.md` |
| `${CLAUDE_PLUGIN_ROOT}` | this skill's directory |
| `.claude/` paths | `.muse/` (or the working folder for brand-voice guideline files) |
| `/plugin:command` slash refs | `the "<skill>" skill` (rename-aware) |
| `~~category` placeholders | kept as-is (tool-agnostic by design) |

## Slash commands (15)

Muse AI has no slash-command surface, so each command became a skill:

- New skills: `pdf-annotate`, `pdf-fill-form`, `pdf-open`, `pdf-sign`,
  `product-brainstorm`, `common-room-generate-account-plan`,
  `common-room-weekly-brief`, `slack-channel-digest`, `slack-draft-announcement`,
  `slack-find-discussions`, `slack-standup`, `slack-summarize-channel`
- Companion files (same-named skill already existed, command kept as
  `command-<name>.md` + pointer section): `discover-brand`,
  `brand-voice-enforcement`, `guideline-generation`
- brand-voice `agents/*.md` copied into the related skill dirs
  (`discover-brand`, `guideline-generation`)

## Structural notes

- `CONNECTORS.md` (10 plugins) copied into each of that plugin's skill dirs;
  skills whose plugin has none got the blockquote rewritten to explain
  `~~category` inline instead of a dangling link.
- `.mcp.json` files (Claude Code runtime configs) intentionally skipped; the
  connector tables in CONNECTORS.md already summarize them.
- `settings/` dirs (Claude Code settings JSON) skipped.
- `productivity` `dashboard.html` copied into `productivity-start` and
  `productivity-task-management` (the two skills referencing it).
- `cowork-plugin-management` (`create-cowork-plugin`, `cowork-plugin-customizer`)
  is Claude Code plugin-mechanics heavy (hooks.json, `.mcp.json`); ported with
  prose mapping but would need a Muse-native rewrite for full use. Same applies
  to `build-connector`.
- Extra frontmatter keys from upstream (`allowed-tools`, `triggers`,
  `user-invocable`, `argument-hint`, `compatibility`) kept as inert metadata.

## Safety scan

- Pattern scan (`curl |`, `wget`, `rm -rf`, `sudo`, `eval(`, `exec(`, `api[_-]?key`,
  `password`, `fetch(`, `XMLHttpRequest`): 1,098 hits, all benign prose
  (password-policy guidance, "never ask for a password", SDK `apiKey` param
  names, JS `fetch(` examples).
- Danger scan (piped-curl, `rm -rf /`, real API-key formats): only hits are
  official upstream install commands in vendor SDK docs (`curl -s
  https://get.nextflow.io | bash` is Nextflow's documented installer;
  `sudo apt install` build deps in Zoom SDK guides; `rm -rf
  /var/lib/apt/lists/*` Dockerfile cleanup). No embedded secrets.
- No executables added; `scripts/` and `references/` copied as static content.
