---
name: getting-started-with-muse-skills
description: Honest onboarding to Muse skills: what they are, SKILL.md anatomy, how to actually use one in chat today, how to write your own, and safety norms.
category: muse
---

# Getting Started with Muse Skills

## Overview

A skill is a portable, reusable playbook: a short markdown file called `SKILL.md` that describes a capability or workflow in plain language. The format follows the open Agent Skills convention — `--- name / description ---` frontmatter at the top, then a structured body. Because a skill is just text, it works anywhere Muse can read text: in chat, in a repo, on a website. Nothing to install, nothing to execute. The skill gives Muse shared context for the task; you still review and approve anything it does.

The honest state of things, as of 2026-09-26: Meta's official Help Center documents customizing Muse's personality, name, and memories through conversation, but there is no officially documented user-facing "install a SKILL.md" flow for Meta's personal Muse assistant — no verified settings page, upload button, or plugin store. So the practical path today is delightfully low-tech: open a skill's SKILL.md, paste its content into chat, and ask Muse to use it or remember it for relevant tasks. That works reliably right now, and everything in this repo is written with that workflow in mind.

## When to use

- You're new to Muse and heard skills are a thing — start here before anything else
- You want to use one of this repo's skills but don't know the mechanics
- You want to write your own skill and need the file format and conventions
- You want to contribute a skill back to this repo
- You want to know what skills can and can't do before trusting one

## Core concepts

- **A skill is a text file, nothing more.**
  `SKILL.md` is markdown with a small frontmatter header (`name`, `description`, `category`). There is no code to run and no permissions attached. It cannot act on its own — Muse acts, and only with your approval.
- **The anatomy of SKILL.md.**
  Frontmatter up top: `name` (matches the directory name), `description` (one line: what it does plus when it triggers), `category` (which area it belongs to). Body below, in five sections: Overview, When to use, Core concepts, Practical workflow, Common pitfalls. Keep the body practical and chat-oriented — the user interacts via conversation.
- **No install flow — use chat.**
  Until Meta ships an official skill-management feature, the working method is: copy the SKILL.md text, paste it into the chat, and say something like "Use this skill for what I'm about to ask" or "Remember this for future calendar questions." Muse can also save durable preferences through its memory/customization features when relevant.
- **Skills are portable.**
  Because they're plain text, a skill can travel from this repo to your chat to someone else's assistant without any tooling. That portability is the whole point of the Agent Skills format.
- **Safety norms.**
  Never paste secrets, API keys, passwords, or tokens into a skill or into chat instructions around one. A skill never needs your credentials — if one asks, that's a red flag. Review anything the assistant proposes before it takes an action.
- **Contributing back.**
  This repo grows through contributions. Add your skill at `skills/<name>/SKILL.md` following the same frontmatter and five-section structure, and open a pull request.
- **Categories keep the catalog navigable.**
  Each skill carries a `category` tag (e.g. `muse`, `everyday-assistant`, `productivity`) so readers can browse by area. Pick the one that best matches your skill's home.
- **Write for a stranger, not yourself.**
  A good skill assumes nothing about the reader's setup beyond "talking to Muse in chat." If your skill only works with tools the reader may not have, say so plainly in the Overview.

## Practical workflow

1. **Pick a skill to try.**
   Browse the catalog for a skill matching something you actually need this week — e.g. the daily-briefing skill for your mornings. Real use beats browsing.
2. **Open its SKILL.md.**
   The file is plain markdown; you can read it directly. Skim the Practical workflow section — that's your script.
3. **Paste it into chat.**
   Copy the whole SKILL.md and paste it into your conversation with Muse. Add one sentence of intent, for example: "Please use this skill from now on for my morning briefings."
4. **Have a normal conversation.**
   The workflow sections are written conversationally: what to tell Muse, what context to provide, how to iterate. Follow them loosely. If the assistant misses something, say so — that's how the workflow gets tuned to you.
5. **Make it stick for recurring tasks.**
   For things you'll repeat (briefings, inbox triage, reminders), ask Muse to remember the pattern for next time. Conversational customization is the mechanism available today.
6. **Write your own skill.**
   Think of a workflow you've repeated at least three times. Write it up in the five-section structure: Overview (what and why), When to use (trigger phrases), Core concepts (the mental model), Practical workflow (conversational steps), Common pitfalls (what goes wrong). Keep it 80–150 lines — long enough to be useful, short enough to paste.
7. **Test it with a friend.**
   Before contributing, hand your skill to someone else and watch them use it with Muse. Every question they ask is a sentence you forgot to write.
8. **Share it.**
   Put your skill at `skills/<your-skill-name>/SKILL.md` in a fork of this repo and open a PR. Write everything from scratch in your own words; never copy another author's skill text.

## Common pitfalls

- **Hunting for an install button.**
  There isn't one today. Don't waste time looking for a plugin store or skills settings page — paste-into-chat is the real workflow, and it works.
- **Expecting the skill to run itself.**
  A skill is inert text. It only works when you bring it into a conversation. If nothing seems to happen, you probably never pasted it.
- **Pasting secrets with the skill.**
  Passwords, API keys, and tokens never belong in a skill file or in the chat around it. A skill that needs them is designed wrong.
- **Overwriting your own judgment.**
  The skill is advice, not a contract. If the assistant suggests something that feels off, say no. You approve actions, not the markdown.
- **Writing a skill nobody can paste.**
  A skill that depends on local file paths, custom tools, or hidden context dies outside your machine. Keep skills portable: plain language, no machine-specific assumptions.
- **Skipping the "When to use" section.**
  That's the trigger that helps you (and future readers) find the skill again. Vague descriptions mean the skill never gets used.
- **Copying instead of contributing.**
  The catalog's value is original, diverse voices. Copying someone else's skill text into a PR adds nothing and violates their work. Write it fresh.
- **One skill per file, one job per skill.**
  A skill that tries to cover email, calendar, fitness, and cooking helps with none of them. If your idea sprawls, split it — small skills compose better.
- **Assuming the reader knows the jargon.**
  Terms like "frontmatter" and "Agent Skills" mean nothing to a newcomer. Define them once, in plain words, the first time they appear.
