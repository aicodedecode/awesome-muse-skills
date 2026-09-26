---
name: obsidian-pro
description: Power-user Obsidian: plugin stack, Dataview queries, Canvas, daily-note workflows, sync, and vault architecture. Use when building a serious markdown-based knowledge system in Obsidian.
category: productivity
---

# Obsidian Pro

## Overview

Obsidian is a local-first markdown vault: plain-text files on your disk, editable forever, in any editor.

Links (`[[like this]]`) build a knowledge graph; backlinks reveal what references a note.

Dataview turns note metadata into live queries — your notes become a queryable database.

Canvas adds spatial whiteboards; daily notes give you a chronological spine; community plugins extend everything.

Everything works fully offline. The files are yours; no vendor can lock you out or shut you down.

Mental shift: your vault is a garden, not a filing cabinet. Value compounds through linking and revisiting.

## When to use

- Setting up a new vault or rescuing a messy one
- Choosing and configuring community plugins without breaking things
- Writing Dataview queries for dashboards, reviews, and task aggregation
- Designing daily-note, project, literature-note, and meeting workflows
- Setting up sync across devices or publishing notes to the web
- Migrating from Notion, Evernote, or Roam to local markdown

## Core concepts

- **Plain text is the asset.**
  Git works, grep works, any editor works. Favor standard markdown over plugin-specific syntax for anything important.
- **Links over folders.**
  Folders are coarse buckets (inbox, projects, areas, resources, archive). Links and tags create the real structure.
- **Properties (frontmatter).**
  YAML like `status:`, `project:`, `rating:` makes notes queryable. Dataview reads these to build live tables and lists.
- **Dataview.**
  Query blocks: open tasks across the vault, books rated 4+, deadlines this week. Build 2-3 dashboards and let them self-update.
- **Daily notes as spine.**
  One note per day: fleeting notes, tasks, links to project notes. Future you will search these more than anything.
- **Canvas.**
  Infinite whiteboards embedding notes, PDFs, images, and cards — ideal for planning and mapping ideas before writing.
- **Templater.**
  Templates with logic: dates, prompts, standardized structures. One hotkey to insert; that's what makes templates actually get used.
- **Plugin discipline.**
  Every plugin is a dependency that can break on update. Keep ~10-15 core ones, update deliberately, disable the rest.
- **One sync method.**
  Obsidian Sync, git, iCloud, or Dropbox — pick exactly one. Mixing sync methods corrupts files.

## Practical workflow

1. **Design the vault skeleton.**
   Top-level folders: `00 Inbox`, `10 Projects`, `20 Areas`, `30 Resources`, `40 Archive`, plus `Templates` and `Daily`.
2. **Install the core stack.**
   Templater, Dataview, Calendar, plus a few quality-of-life plugins. Add more only for proven, repeated needs.
3. **Set up daily notes.**
   Template with: today's focus (3 max), fleeting notes, tasks, people met. Assign a global hotkey.
4. **Define note templates.**
   Meeting, project, book/article, person — each with 3-6 frontmatter properties you'll actually query later.
5. **Build dashboards.**
   A Home note with Dataview queries: active projects, tasks due this week, recent notes, items needing review.
6. **Establish capture habits.**
   Quick-add hotkey or mobile capture straight to inbox; process the inbox into proper notes weekly.
7. **Choose sync and test restore.**
   Pick one method and verify you can actually restore before trusting it with your knowledge.
8. **Review and prune monthly.**
   Archive dead projects, merge duplicates, fix broken links, update dashboards that stopped being useful.
9. **Back up separately.**
   Sync is not backup. Keep versioned backups (git commits or Time Machine) of the vault.

## Common pitfalls

- **Plugin hoarding.**
  60 plugins, half unused, one update breaks the vault on deadline day. Audit quarterly; unused for a month gets removed.
- **Dataview for everything.**
  Queries are great for dashboards but fragile for critical data. Keep canonical facts in note bodies too.
- **Over-engineering frontmatter.**
  Twenty properties per note means you stop creating notes. Start with 3-5; add when a query demands it.
- **Ignoring mobile.**
  If capture doesn't work on your phone, the system dies in weeks. Mobile sync + one-tap capture before anything fancy.
- **No backup.**
  Local-first means local-only unless you back up. One disk failure without backup ends the vault.
- **Perfectionist linking.**
  Not every note needs ten links. Link when the connection is real; the graph is a byproduct of thinking.
- **Theme rabbit holes.**
  Weekends spent perfecting CSS instead of writing notes. Pick a readable theme in 10 minutes and move on.
- **Never processing the inbox.**
  500 daily notes of unprocessed fleeting notes is a write-only system. The weekly review converts capture into knowledge.
