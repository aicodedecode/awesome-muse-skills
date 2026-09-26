---
name: cms-pro
description: Integrate headless CMSs: content modeling, APIs, previews, webhooks, and editorial workflows. Use when content teams need to publish without developers.
category: web-development
---

# CMS Pro

A practical guide to headless CMS integration: content modeling, delivery APIs, preview/draft workflows, webhooks for revalidation, and the editorial UX that makes content teams self-sufficient.

## Overview

A headless CMS separates **content management** (editorial UI, workflows) from **presentation** (your frontend consuming a content API). The integration work: modeling content types well, fetching efficiently, previewing drafts, and revalidating statically-generated pages on publish. Good modeling is 80% of success — bad models produce either developer bottlenecks or content chaos.

## When to use

- Marketing sites, blogs, docs, and landing pages edited by non-developers.
- Choosing/evaluating a headless CMS (any vendor — patterns are universal).
- Preview environments for draft content.
- Webhook-driven revalidation and rebuilds.

## Core concepts

- **Content modeling.** Content types (Post, Page, Author), fields (rich text, references, media, SEO meta), and validations. Model for the editors' mental model, not the database's.
- **References vs embeds.** Reference shared entities (authors, categories); embed page-specific blocks. Over-referencing complicates queries; over-embedding duplicates content.
- **Delivery API.** Read-optimized CDN API (usually GraphQL or REST) with draft/published variants. Query at build time (static) or request time (dynamic) per page needs.
- **Preview.** Draft mode: editors see unpublished content via preview URLs/tokens. Implementation: preview API route that bypasses the published cache with a secret token.
- **Webhooks.** CMS publishes → webhook → revalidate affected paths (`revalidatePath`/`revalidateTag`) or trigger rebuild. Map content types to URL patterns for surgical invalidation.
- **Portable text / rich text.** Structured rich text (blocks, marks, custom objects) rendered by your components — never raw HTML from the CMS without sanitization.
- **Media.** CMS-hosted assets via CDN with transforms (resize, format). Use the CMS's image API, not originals.

## Practical workflow

**1. Model content.**
```
Post: title, slug (unique, validated), excerpt, body (portable text),
      coverImage (media), author (reference), categories (references[]),
      seo { title, description, ogImage }, publishedAt, status
```
Add help text and validations on every field — editors shouldn't guess.

**2. Fetch (Next.js example).**
```ts
// lib/cms.ts
export async function getPost(slug: string, draft = false) {
  return cms.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug },
    { token: draft ? PREVIEW_TOKEN : undefined, perspective: draft ? 'drafts' : 'published' });
}
```

**3. Draft preview.**
```ts
// app/api/preview/route.ts — validates ?secret=, enables draft mode, redirects to the page
// page.tsx reads draftMode() and passes draft flag to fetches
```

**4. Revalidate on publish.** CMS webhook → `/api/revalidate` (verify signature!) → `revalidateTag('posts')` or `revalidatePath('/blog/[slug]')`. Tag-based invalidation scales best.

**5. Render rich text safely.** Map portable-text blocks to your components (headings, quotes, code blocks, embeds); sanitize any raw HTML.

**6. Editorial QA.** Preview links in the CMS workflow; required SEO fields; image alt requirements; broken-link checks on publish.

## Common pitfalls

- **Modeling for developers.** Field names and structures editors don't understand → constant support requests. Name things in editorial language; add help text.
- **N+1 queries.** Fetching a list then each item's references individually. Use query projections/GROQ to fetch nested data in one request.
- **No preview.** Editors publishing blind → broken layouts discovered in production. Draft preview is not optional for rich pages.
- **Full rebuilds on every edit.** Rebuilding 10k pages for a typo fix. Webhook + tag/path revalidation instead.
- **Unsigned webhooks.** Revalidation endpoints without signature verification = anyone can purge your cache / trigger builds. Verify signatures.
- **Raw HTML rendering.** `{@html body}` from CMS content = XSS vector. Structured rich text + component mapping, or strict sanitization.
- **Slug changes breaking URLs.** Allow slug edits but keep redirect history (old slug → new). Or lock slugs after publish.
- **Missing SEO fields.** No title/description/OG per page = weak sharing and search. Make them required with sensible fallbacks.
- **Vendor lock-in blindness.** Proprietary rich-text formats and media URLs complicate migration. Prefer portable formats; keep media URLs abstracted.
