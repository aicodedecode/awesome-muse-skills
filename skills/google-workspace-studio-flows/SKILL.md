---
name: google-workspace-studio-flows
description: Design and manage automations in Google Workspace Studio (formerly Workspace Flows): starters, AI and Workspace steps, webhooks and Apps Script custom steps, the platform limits that shape a design, and the test-run discipline. Use when the user wants to automate something inside Google Workspace, or asks what Studio can do.
category: workflow-automation
---

# Google Workspace Studio Flows

Google Workspace Studio (studio.workspace.google.com, formerly
Workspace Flows) is Google's no-code automation builder for
Google Workspace, powered by Gemini: describe an automation in
natural language, start from a template, or build from scratch.
There is no public API for managing flows; work happens on the
signed-in web surface. Flows run on Google's side, so they keep
firing even when the user's own machines and agents are offline.

## How a flow is built

- **Starter (the trigger)**: a schedule, a Gmail event, a Form
  submission, a Calendar or meeting event, a Drive file event, a
  Chat event, or a manual start.
- **Steps (the actions)**, up to 20 per flow:
  - AI steps: Ask Gemini, Decide, Summarize, Extract named
    fields from text or mail.
  - Logic: Check if (conditions), Filter a list, Repeat for each
    (loops).
  - Workspace actions: label or star Gmail, save attachments to
    Drive, create Docs, add or update Sheet rows, create Tasks,
    notify in Chat, draft or send replies.
  - Third-party steps (for example Asana, Mailchimp, Salesforce;
    availability varies by account type).
  - An outbound **webhook** step (GET/POST/PUT/PATCH/DELETE to a
    static URL), the natural bridge to systems outside Workspace.
  - **Custom steps and starters** built with Apps Script or HTTP
    add-ons, for anything the built-in steps cannot express.
- Variables pass between steps as chips: a Gemini summary from
  one step can feed the Chat notification in the next.

## Limits that shape the design

- 25 flows per user, on or off; 20 steps per flow.
- At most 25 active Gmail-started flows, and an undisclosed
  daily run cap across all of a user's flows; flows pause until
  it resets.
- Sheets steps (Add row / Update rows / Clear rows) only work on
  spreadsheets private to the flow owner; a shared sheet fails
  the flow.
- Gmail starter filters use default labels only, not custom
  labels.
- Sharing a flow inside an organization gives the recipient a
  copy, not a co-owned flow.
- A flow idle for 6 months turns off automatically.
- Some starters and steps are work/school-account only, and
  personal-account availability varies; check the specific
  starter or step in the editor before promising it.
- "Ask a Gem" steps are deprecated: no new ones, and flows using
  them stop after March 2027. Use Ask Gemini steps instead.

## Good first flows

- Star or label mail that matches a pattern, for follow-up.
- Extract action items from incoming mail into Tasks.
- Save mail attachments to a Drive folder automatically.
- When meeting notes are ready, extract your action items into
  tasks, or send yourself a pre-meeting brief in Chat.
- On a purchase-confirmation email, extract the key fields and
  start a research or filing step.

## Guardrails

- **A test run takes real actions**: it sends the messages,
  writes the files, and creates the tasks or events for real.
  Never test-run, turn on, share, or delete a flow without the
  user's explicit go-ahead for that specific flow, and say
  exactly what the run will do before it happens.
- Read-only inspection (the Discover page, the Flows list, the
  Activity tab, Approvals) needs no go-ahead.
- Before building a new flow, check the existing Flows list and
  any automations the user already runs elsewhere for the same
  job, and pick one owner. Two systems doing the same automation
  is a defect, not redundancy.
- Flows are created in a computer browser; once active, they run
  regardless of device.
- A third-party step can share Gmail or Calendar content with
  that service. Name the service and the data it will receive
  before enabling one, and let the user decide.
- Design for the limits above from the start: a flow that needs
  a shared spreadsheet or a 21st step is a redesign, not a
  workaround.
