---
name: free-books-and-audiobooks
description: Find free, legal copies of books and audiobooks across Open Library, Project Gutenberg, LibriVox, and the Internet Archive, merged into one answer per title. Use when the user asks about a book, wants a free ebook or audiobook, asks for an ISBN lookup, or is building a reading list.
category: media
---

# Free Books and Audiobooks

Answer book questions from four free, no-account sources, and merge
the results into one row per title instead of one row per source.

## The four sources and what each answers

- **Open Library** (openlibrary.org): the bibliographic record.
  Editions, ISBNs, authors, publication data. Answers "what is
  this book and what editions exist?"
- **Project Gutenberg** (gutenberg.org): free full text for
  public-domain works, in epub, Kindle, and plain text. Answers
  "can I read the full text free?"
- **LibriVox** (librivox.org): free audiobooks of public-domain
  works, read by volunteers. Answers "is there a free audiobook?"
- **Internet Archive** (archive.org): a huge lending and archive
  library. Answers "does an archive holding exist?"

All four are free to search with no key and no account. Search them
through the web or any available book tooling; respect each site's
pace (Open Library asks anonymous clients to stay near 1 request
per second) and keep volume low: single lookups, not sweeps.

## Workflow

1. Search all four sources for the title, author, or ISBN the user
   gave. If the user gave an ISBN, start with the Open Library
   ISBN lookup, then check the other three for that exact edition
   or work.
2. Merge by (title, author). Never present the same title once per
   source.
3. Report, per title: the bibliographic basics (author, year,
   edition if it matters), then the free options with the actual
   links: full text at Gutenberg, audiobook at LibriVox, holding
   at the Internet Archive, and the Open Library work page.
4. If a source is down or errors, say that source was unavailable.
   Never claim a source had no results when the search itself
   failed.

## Rules

- Always give the actual URL from the results (the work page, the
  ebook page, the audiobook page), never a generic search link.
- Distinguish formats plainly: full text, audiobook, and archive
  holding are different things. A holding is not always a free
  download.
- Public-domain status varies by country. Gutenberg and LibriVox
  catalogs are US public domain; if the user is elsewhere, note
  that the same title may not be free for them.
- Bestseller lists and chart positions are a different question.
  This skill answers free-copy and bibliographic questions, not
  rankings.
- Library lending apps (Libby, OverDrive) are partner-gated and
  not covered here. If the user asks about borrowing a modern
  title through their library, say this skill cannot check that
  and point them to their library's own app.
- Slow sources are normal: the Gutenberg and LibriVox catalogs can
  take a while to answer. Wait for a search to finish rather than
  re-running it.

## Example answer shape

**Dune, Frank Herbert (1965)**
- Open Library: [work page link], many editions, ISBNs listed there
- Full text: not on Gutenberg (still under copyright)
- Audiobook: not on LibriVox (still under copyright)
- Archive: [Internet Archive link], lending copy may be available

**Pride and Prejudice, Jane Austen (1813)**
- Full text: [Gutenberg link], epub and plain text
- Audiobook: [LibriVox link], several volunteer readings
