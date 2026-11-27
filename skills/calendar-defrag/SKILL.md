---
name: calendar-defrag
description: Audit and repair a fragmented calendar: find back-to-backs, missing travel and buffer time, double bookings, and focus time squeezed out, then propose a concrete fix plan and apply only the changes the user approves. Use when the user's calendar feels packed or chaotic, before a heavy week, or when they ask to clean up or defragment their schedule.
category: productivity
---

# Calendar Defrag

Calendars fragment the way disks do: meetings land wherever
there is a gap, buffers vanish, and the day becomes unusable in
pieces too small to think in. A defrag pass reads the calendar as
a whole, names the fragmentation, proposes specific repairs, and
applies only what the user approves.

## The audit

Read the window the user cares about (default: the next two
weeks) and classify every problem you find:

- **Back-to-backs**: three or more meetings in a row with no gap.
  Note the longest unbroken run each day.
- **Missing travel time**: an in-person event whose location
  differs from the event before it, with less time between them
  than the trip takes. Use measured travel time, not a guess.
- **Missing buffers**: meetings that predictably run over (reviews,
  interviews, calls with external parties) scheduled flush
  against the next commitment.
- **Double bookings and zombies**: overlapping events both marked
  busy, declined events still blocking time, and recurring series
  whose real instance moved but the ghost remains.
- **Focus squeeze**: days with no block of 90 minutes or more of
  unscheduled time during working hours.
- **Context scatter**: the same project or person split into many
  small meetings across a day when one block would do.
- **Edge erosion**: first meeting hard against the start of the
  workday, last meeting hard against its end, lunch regularly
  eaten by a standing meeting.

## The fix plan

Present the audit as a plan, not a pile of observations. For each
problem, one concrete proposed repair:

- Add a travel block of the measured duration before the event
  that needs it, named for the trip.
- Insert 15 or 30 minute buffers after the meetings that run
  over, or shorten the recurring meeting itself.
- Move the movable meeting to the proposed new time, naming the
  slot and why it is free of the other problems above.
- Decline or delete the zombie, with the evidence it is dead.
- Protect one focus block per squeezed day at the user's best
  working hours, before proposing any new meetings there.
- Batch scattered small meetings on the same topic into one block
  when the attendees overlap.

Order the plan by impact: fixes that recover the most usable time
or remove a real conflict first. Estimate the recovered time for
the window in total.

## Approval and applying

- Nothing moves on the calendar until the user approves the plan,
  or the specific items from it. Present the plan, let them strike
  items, then apply exactly what survived.
- Moving a meeting with other attendees sends them a change
  notice; flag every plan item that does that before applying, so
  there are no surprise emails.
- Recurring meetings: change one instance unless the user
  approves changing the series, and say which you did.
- After applying, read the calendar back and confirm each change
  landed as planned. Report the before and after shape of the
  worst day, not just a list of edits.

## Standing prevention (offer, do not impose)

If the same fragmentation keeps returning, offer standing rules
the user can adopt: default buffers after external meetings, a
protected daily focus block, travel blocks created automatically
when an in-person event is added away from the previous location,
and a weekly ten-minute defrag of the coming week. Adopt only the
ones the user picks.
