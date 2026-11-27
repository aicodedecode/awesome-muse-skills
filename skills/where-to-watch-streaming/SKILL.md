---
name: where-to-watch-streaming
description: Find where a movie or TV show streams, rents, or buys, with per-country offers, prices, and quality, using JustWatch data. Use when the user asks where can I watch X, is X on Netflix, Hulu, or Max, or what it costs to rent or buy a title.
category: media
---

# Where to Watch: Streaming Availability

Answer "where can I watch this" from live availability data
(JustWatch is the usual source, directly or through TMDB's watch
providers, which JustWatch powers). Availability changes weekly;
never answer from memory.

## Workflow

1. Identify the exact title. If the name is ambiguous (remakes,
   same-name shows), confirm which year or version the user means
   before reporting offers.
2. Look up the title for the user's country. Default to the
   country they are in; use another country only when they ask
   (travel, family abroad, a release that has not reached them).
3. Report the offers by type, keeping the three kinds separate:
   - **Stream**: subscription services carrying it, named plainly.
   - **Rent**: store, price, and quality (4K or HD) for each.
   - **Buy**: store, price, and quality for each.
4. Give the actual watch, rent, or buy URL for each offer, never
   just the platform name.
5. If the title is not available in their country, say so, and
   only mention other countries if the user asked about them.

## Rules

- Prices and quality come from the lookup, quoted exactly. Do not
  round, convert currency silently, or carry a price over from a
  previous conversation.
- Availability data comes from an unofficial feed and can lag or
  break. If a lookup errors, say availability could not be checked
  right now. Never present remembered offers as current.
- A title leaving a service soon is worth one line when the data
  shows an expiry date.
- This skill is streaming and home viewing only. Theater tickets
  and showtimes are a different task.
- Free-with-ads services (Tubi, Pluto TV, Freevee and similar) are
  real offers: include them, labeled as free with ads.
- For recommendations, pair this with ratings and cast data when
  available, but keep the availability answer itself to verified
  offers.
