---
name: defuddle
description: Extract the main content of any web page as clean Markdown or HTML (Obsidian Web Clipper's engine). Use when you need article extraction in a Node/JS runtime, on math-heavy pages, when you want rich metadata (author, published date, schema.org), or as a quick CLI one-liner. The Python-side equivalent is trafilatura in the local-scrape skill.
---

# defuddle

Article-extraction library by Stephan Ango (kepano, Obsidian CEO) — the engine
behind Obsidian Web Clipper. Takes a URL or HTML, finds the main content,
returns cleaned HTML or Markdown. A more forgiving Mozilla Readability
replacement: removes fewer uncertain elements, standardizes footnotes / code
blocks / math / callouts, and extracts rich metadata. MIT licensed.

Verified working in this environment 2026-09-30 via `npx defuddle`.

## When to use defuddle vs trafilatura

Default article extraction stays **trafilatura** (Python, in the `local-scrape`
skill). Reach for defuddle when:

- The consumer is **JavaScript** — Next.js API routes, Node scripts, browser
  extensions. Native TS, three bundles: `defuddle` (browser, zero deps),
  `defuddle/full` (math + Markdown), `defuddle/node` (Node, accepts any DOM).
- The page is **math-heavy** — MathJax/KaTeX become standard MathML with the
  LaTeX preserved in `data-latex`. (Relevant: KaTeX is in the test-series
  stack.)
- You want **rich metadata** in one call: author, title, description,
  published date, site, domain, favicon, image, language, word count, raw
  schema.org data, meta tags.
- You want a **one-liner** without writing a script (see CLI below).

## CLI (no install needed)

```bash
# URL → Markdown with YAML frontmatter (title, author, source, published…)
npx defuddle parse https://example.com/article --markdown --frontmatter

# JSON with metadata + content
npx defuddle parse page.html --json

# Single property
npx defuddle parse page.html --property title

# Local file / stdin
npx defuddle parse page.html --markdown
cat page.html | npx defuddle parse --markdown

# Debug a bad extraction
npx defuddle parse https://example.com/article --debug
```

## Node.js

```js
import { parseHTML } from 'linkedom';      // or jsdom / happy-dom
import { Defuddle } from 'defuddle/node';

const { document } = parseHTML(html);
const result = await Defuddle(document, 'https://example.com/article', {
  markdown: true,
  useAsync: false,   // IMPORTANT: see below
});
console.log(result.content);   // Markdown
console.log(result.title, result.author, result.published);
```

(`package.json` needs `"type": "module"` for `defuddle/node`.)

## Standing caution: `useAsync`

`parseAsync()` falls back to **third-party APIs** (e.g. FxTwitter) when the
HTML has no usable content (client-side-rendered pages). That breaks the
free-tier-only posture — always pass `useAsync: false` in our usage. For
JS-heavy pages, use the browser tools instead (per the Firecrawl rule:
local/bare fetch first, browser second, Firecrawl last resort).

## Output notes

- Headings standardized (H1→H2, title-matching first heading removed);
  footnotes normalized; callouts (GitHub alerts, Bootstrap alerts, asides)
  become Obsidian-style `> [!info]` blocks in Markdown.
- `contentSelector` option bypasses auto-detection when you know the article
  container's CSS selector.
- Author's own warning: "very much a work in progress" — spot-check output
  on a new domain before batching.

---
## Provenance (system note, 2026-09-30)

- Source: https://github.com/kepano/defuddle. License: MIT.
- Smoke-tested 2026-09-30: `npx defuddle parse https://blog.cloudflare.com/
  --markdown --frontmatter` returned clean Markdown + full frontmatter.
- Complements (does not replace) the Python `local-scrape` skill.
