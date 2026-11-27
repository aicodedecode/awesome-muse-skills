---
name: food-logging-verification
description: Log food and drinks so the record can be trusted: identify items from photo evidence, verify nutrition from the official source before logging, write to one source of truth, and verify every entry by reading it back. Use when the user reports a meal, sends a food photo or receipt, or adds an item to something already logged.
category: everyday-assistant
---

# Food Logging Verification

A food log is only useful if its numbers are real. This method
treats every food or drink report, a chat message, a receipt, a
follow-up "also had half a brownie", or a photo showing food,
as a logging task to complete in the same turn, and it refuses
to guess at the two things that make logs worthless: what the
item was, and what is in it.

## Identify the meal

- **Read the photo evidence first.** Check the photo's EXIF
  data: the capture time is an eat-time clue, and the GPS is a
  venue clue for a photo found later.
- Cross-check the location against nearby food venues and match
  against what the photo actually shows. Zoom into crops of the
  dish, the packaging, and any printed text (napkins, cups,
  wrappers): printed phrases often match a menu headline
  verbatim and settle the venue.
- Match signature items to candidate menus. A topping, sauce, or
  preparation one place carries and its neighbor does not is
  stronger evidence than the container shape, which rival chains
  share.
- Name proteins by how they are cooked, not by habit: shredded
  and braised excludes seared and cubed; pale shreds argue
  chicken or pork over dark beef.
- Log the best-supported identification, and flag any component
  that stays genuinely ambiguous with the exact alternative and
  its values, so a correction takes one edit. Leave a truly
  unidentifiable item pending identification instead of
  guessing; log everything else and name the pending item as
  the open item.

## Verify the nutrition

- Take nutrition from the restaurant's official nutrition sheet
  or menu first, then from a branded database entry in a food
  database (for example Cronometer), then from a generic entry
  such as USDA data. Never guess a number, and never present an
  estimate as a verified value.
- Log fractional items as the fraction of the verified full
  serving: half of an item whose official serving is 180 kcal
  logs as 90 kcal.
- Record the full profile for every item, not calories alone:
  protein, carbs, fat, fiber, sodium, and sugars.
- If a value had to come from a substitute or generic entry,
  say so in the confirmation and note the expected variance.

## Eat time

- Default the eat time to the moment the user reports the item;
  a live report is logged at report time, on that date, with no
  time-confirmation question.
- A different time the user states in the report itself ("ate
  this at 7 last night") overrides the default.
- For food photos discovered later, where there is no live
  report, the photo's EXIF time is the eat time.
- A follow-up item reported minutes later from the same meal
  groups with that meal.

## Write, then verify by read-back

- Your food log is the single source of truth: write there
  first, and check the day's entries before writing so nothing
  is logged twice.
- Skip zero-calorie water; it adds no value and clutters the
  day.
- **Verify every write by reading the log back** and comparing
  entries and totals against the verified build. A successful
  write message is not verification.
- Mirror the entries anywhere else (a local tracker, a summary)
  only after the read-back matches, using the read-back values.
- Apply corrections the same way: when the user corrects an
  identification or a count, fix the log first, read back, then
  update the mirrors, in the same turn.

## Confirm once

Send one confirmation: the meal name, the verified total,
protein, the day total so far, and any flag that matters
(a guardrail breach such as sodium over a daily cap, stated
plainly and without a lecture) or open item. Keep the full
component list in the log, not in the chat message.
