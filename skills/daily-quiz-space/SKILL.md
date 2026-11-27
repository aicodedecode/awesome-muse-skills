---
name: daily-quiz-space
description: Build a daily quiz Space: one fresh two-question personality quiz per day (pick an option, slide a scale), a named playful result, and a full archive where retakes append dated attempts and never overwrite history. Use when the user wants a light daily ritual Space with a growing archive.
category: muse
---

# Daily Quiz Space (template)

A portable space template in the Ideas spec format: what the space
is, how it works, what it connects to, and a build plan for each
component. Build it as a Muse Space (a full-stack web artifact)
driven by its own space actions rather than a static data block.
Nothing here depends on any particular person's setup.

## What this space is

A small daily ritual: one quiz at a time, two quick questions,
then a named result with a short playful blurb worth screenshotting.
Nothing is graded and no answer is wrong. Behind it, an archive
keeps every question, answer, result, and date; retakes append
dated attempts and never overwrite history.

## How it works

A daily job checks the current quiz's state through the space's
status action. If it has been answered, the job authors today's
quiz and appends it through the space's append action, then
verifies with the status action again. If the current quiz is
unanswered, nothing is added: one current quiz at a time, at most
one new quiz per day, and the next appears only after the current
is answered.

## Data connections

- The space's own status and append actions (its archive is the
  data store).
- No external accounts are needed.

## Components

### 1. Current quiz

Two questions: the first pick-an-option, the second a 1-to-5
scale, ending in a named result with a short playful blurb.

Build plan: authoring rules are part of the template: vary themes
and result names, never repeat a theme within 21 days (check the
archive first), and keep a standing topic ban list the user sets
(for example health, finance, relationship status, and politics
are common bans).

### 2. Archive

Every past quiz with its questions, the user's answers, results,
and dates, including retake attempts as dated appends.

Build plan: the archive is append-only; a retake adds an attempt,
it never edits the original entry.

### 3. Daily job

The check-and-append cycle described above.

Build plan: unanswered-quiz ladder: at 7 or more days unanswered,
send the user one short nudge; at 14 or more, propose pausing the
daily quiz in one short message; otherwise stay silent.

## Design principles

- Dynamic layout that uses the full available width and height,
  responsive on phone and desktop; check the render at phone
  dimensions before delivery.
- No pinned or sticky headers or controls; chrome scrolls away
  with the page.
- One control per function; never two controls doing the same
  thing.
- The quiz itself is the content; no prose inside the space
  narrating design decisions.
- Questions and results should be screenshot-friendly: short,
  self-contained, and readable at phone size.

## Rules that keep it honest

- Appends go through the space's own action, never by hand-writing
  quiz data into the space.
- One new quiz per day maximum, and only after the current one is
  answered.
- Durable insights from results (stable preferences the user shows
  over time) may be remembered only if the user opts in; raw
  answers stay in the archive either way.
- Layout, styling, and name changes are a separate, explicit
  request; the daily job never edits, retimes, or duplicates
  itself.
