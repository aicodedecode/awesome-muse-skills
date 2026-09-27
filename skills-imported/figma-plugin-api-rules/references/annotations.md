---
name: figma-plugin-api-rules/annotations
description: Read when working with Dev Mode annotations (node.annotations, figma.annotations) — not to be confused with Figma Comments (REST API)
---

# annotations — use_figma rules

## Universal principles

### annotations-api-shape
**Principle:** Dev Mode annotations are a separate channel from Figma Comments (REST API), visible to developers in Dev Mode when inspecting a specific node, not in the general Comments tab. Any `SceneNode` has `node.annotations: ReadonlyArray<Annotation>` (written by direct assignment despite `ReadonlyArray` in the typing — that's a type restriction on reading the array's elements, not on mutating the property itself). `Annotation = { label?: string, labelMarkdown?: string, properties?: AnnotationProperty[], categoryId?: string }`.
**Pattern:**
```js
const categories = await figma.annotations.getAnnotationCategoriesAsync(); // ALWAYS a fresh call before writing — don't rely on memory of categories from a past session
const category = categories.find(c => c.label === 'Interaction'); // the choice is contextual to the fact's content
node.annotations = [{ label: 'First fact.\n\nSecond fact.', categoryId: category.id }];
```

### annotations-category-existing-only
**Principle:** A category — only from those already existing in the file (`figma.annotations.getAnnotationCategoriesAsync()`); don't create a new one via `addAnnotationCategoryAsync()` without an explicit user request — categories are organisation-wide and adding a superfluous one litters Dev Mode for all files.
**Pattern:** find an existing one by `label` (`categories.find(c => c.label === '...')`); the choice is contextual to the fact's content (example: dynamic UI behaviour in response to a user action → `Interaction`; a structural layout decision without interactivity → `Design note`; data reflecting an entity's state → `Content`).

### annotations-content-rules
**Principle:** An annotation is a fact about a component's FINISHED behaviour ("this works like this"), not a TODO and not a process log. Content rules (cross-project, not specific to one file):
- Only positive statements of what the node IS — no "this is NOT a combobox" and similar negations.
- No process: don't write "verified", dates, the verification method, links to a specific conversation/session/ticket/task document — that leads into a log, not a spec. A path to the implementation file in code (`Component.tsx`) is a legitimate reference; it doesn't break the rule (it's not a meta-reference to the decision process).
- No personal names.
- Before writing a fact about a state/colour/behaviour — check against the ACTUAL current value on the node (a bound variable, fill, property, componentProperties), not the expected / "as it should be". A fact↔node discrepancy is a reason to fix the node, not to describe the mismatch in an annotation.
- The practical test: if the fact can't be phrased so that it makes equal sense in a year and to a person who didn't take part in the discussion — rephrase.
- Format — a bullet list, or (without bullets) one fact per paragraph: `\n\n` between facts inside one `label`.

### annotations-color-enum-violet
_(moved from `mcp-and-environment.md` — a basic Dev Mode annotation API fact, not MCP/environment)_
**Principle:** Dev Mode Annotations are a channel separate from Comments (`figma.annotations.addAnnotationCategoryAsync({label, color})` + `node.annotations = [{label, categoryId}]`) with a valid colour enum `yellow|orange|red|pink|violet|blue|teal|green`, where purple is `'violet'`, and `'purple'` fails validation.
**Symptom:** `Error: Property "categoryInput" failed validation: Invalid enum value... received 'purple'`.
**Pattern:** before creating a category check `getAnnotationCategoriesAsync` (see also `annotations-category-existing-only` above) — the preset categories Development/Interaction/Accessibility/Content (`isPreset:true`) exist in every file; a comment = a temporary TODO with resolve; an annotation = a permanent fact about the component's behaviour.
```js
// ❌ WRONG — 'purple' isn't in the enum
const category = await figma.annotations.addAnnotationCategoryAsync({ label: 'Design note', color: 'purple' });
// Error: Property "categoryInput" failed validation: Invalid enum value... received 'purple'

// ✅ RIGHT
const category = await figma.annotations.addAnnotationCategoryAsync({ label: 'Design note', color: 'violet' });
node.annotations = [{ label: 'Default state on creation: disabled', categoryId: category.id }];
```

### annotations-label-escapes-angle-brackets
_(moved from `mcp-and-environment.md` — a basic Dev Mode annotation API fact, not MCP/environment)_
**Principle:** `node.annotations = [{label, categoryId}]` HTML-escapes angle brackets in `label` (`<`/`>` → `&lt;`/`&gt;`) — don't use `<...>` placeholders in annotation text.
**Pattern:** don't carry `<...>` placeholders into annotation text literally.
```js
// ❌ risky — <value> may end up as &lt;value&gt; on save
node.annotations = [{ label: 'Search: <value>', categoryId }];

// ✅ safe — no angle brackets
node.annotations = [{ label: 'Search: the query text', categoryId }];
```

### annotations-clipped-node-placement
**Principle:** If the real node is physically hidden by a parent's clip/scroll (e.g. a table's cropped viewport) — the annotation pin in Dev Mode "hangs in the void"; the user can't see what it's attached to even if the fact itself is right.
**Pattern:** place the annotation on the semantically same node INSIDE an uncropped/full-width reference (if one exists nearby), not on the hidden "real" node of the original.

### annotations-write-rejects-both-label-fields-read-may-return-both
_The same fact and the same fix as `annotations-read-returns-label-and-empty-labelmarkdown-write-rejects-both` below (WRITE requires exactly one of label/labelMarkdown; READ may return both — never re-assign/spread a read object as is). The difference of this case: legacy annotations were met where READ returned BOTH fields filled with REAL (not empty) identical text — written earlier through another API path / an older plugin version, not through the current `use_figma`._

### annotations-copy-raw-label-double-escapes-html-entities
**Principle:** Reading `node.annotations[0].label` from an already existing annotation, the returned string is the RAW stored representation, already containing HTML entities (e.g. `&quot;` instead of a literal `"`) if the source text was ever entered with quotes. If that string is copied 1:1 into the `label` of a NEW annotation on another node (the typical "duplicate an existing fact onto a paired node" pattern), the Plugin API escapes it ONCE MORE on write — `&quot;` becomes `&amp;quot;`, double escaping, visible only on a repeat read of the written value.
**Symptom:** the new annotation looks visually/structurally like the source, but on a `node.annotations` re-read shows `&amp;quot;` instead of `&quot;` where the source had quotes — a one-to-one string comparison with the source fails, although the fact itself (the text's meaning) is right.
**Pattern:** don't carry a raw `.label` between nodes by copying the string. Write literal JS text with real quote characters directly instead (not HTML entities) — the Plugin API escapes once on write itself; the result matches the source's stored format:
```js
// ❌ WRONG — carries an already-escaped string; gets double escaping
const source = existingNode.annotations[0];
newNode.annotations = [{ label: source.label, categoryId: source.categoryId }];

// ✅ RIGHT — literal text with real quotes; escaped once on write
newNode.annotations = [{
  label: 'Numbered pagination — the real component code uses `viewMode="compact"` (Prev/Next only).',
  categoryId: source.categoryId,
}];
```

### stale-annotation-survives-clone-or-redesign
**Principle:** A Dev Mode annotation inherited by cloning keeps describing the DONOR's state (or the node's state BEFORE a redesign), not the current reality of the target node — it survives both a structural redesign of the component (a dropdown button became a plain button, but the annotation "the dropdown combines N actions" stayed attached to the new node on every clone) and the cloning of a whole structure between semantically different elements (an Action bar with one domain's gating logic copied as a template for another domain's Action bar together with its annotation, although the new node behaves differently — e.g. a plain "Delete" button without gating).
**Symptom:** an annotation walk over the whole page finds textually identical facts multiplied onto N nodes (sometimes across several redesigns) — on a careful read the text describes a mechanic/component that physically isn't on this node (mentions a foreign code file, foreign gating logic, or behaviour cancelled by a later change).
**Pattern:** in an annotation walk don't trust that the fact was true on the source node (or true at the time of writing) — compare the annotation text with the STRUCTURE of the current node (the real child components, variant properties, the presence/absence of a dropdown affordance) the same way as when checking colour/state (see `annotations-content-rules` above). If the annotation describes a node rather than what's really drawn on it — that's a node/annotation bug requiring a fix, not "a discrepancy worth mentioning".
```js
// after any structural redesign of a component — redo the annotation walk
// over ALL clones of that component on the page/file, not only the node where the redesign was made
const stale = [];
figma.currentPage.findAll(n => n.annotations && n.annotations.length > 0).forEach(n => {
  n.annotations.forEach(a => {
    if (/dropdown|menu/i.test(a.label) && !hasDropdownAffordance(n)) stale.push(n.id); // an example heuristic
  });
});
```

### clone-inherited-annotations-dedup-component-vs-flow-sections
**Principle:** When flow/scenario sections are assembled by CLONING already-annotated component shells (see `stale-annotation-survives-clone-or-redesign`), every clone drags the donor's FULL set of component Dev Mode annotations — and one component mechanic (scrolling, a button's semantics, a row variant) ends up multiplied across dozens of nodes across all scenarios. These aren't "stale" annotations (the text may be right) but DUPLICATES: one and the same fact about the component repeated N times.
**Symptom:** an annotation walk over a group of flow sections finds K component annotations, each with identical text on M nodes (M = the number of clones) — dozens of repeats; meanwhile the flow mechanics themselves (what THIS transition demonstrates) are often not annotated at all, and new sections without clones are empty.
**Pattern:** split into TWO SSOTs so that no annotation repeats: (1) **component mechanics** — only in the canonical component section (the component/states matrix), where they're documented anyway; (2) **flow sections carry ONLY unique flow annotations** (one per scenario transition). Procedure: an annotation walk over each section → group by text → remove the component duplicates from the clones (`node.annotations = []`), keep/fill in one flow annotation per section → duplicate the final set into a paired doc (an SSOT backup + a "documented-in" column for a two-way annotations↔docs check). The dedup strategy (remove the component ones entirely vs keep one copy) is confirmed with the user — it changes whether a flow section is self-sufficient on mechanics.

### annotations-not-supported-on-section-nodes
**Principle:** `node.annotations = [...]` on a node of type `SECTION` throws `TypeError: no such property 'annotations' on SECTION node` — Dev Mode annotations are supported on ordinary scene nodes (FRAME/INSTANCE/TEXT/COMPONENT etc.), but not on the SECTION wrapper itself.
**Symptom:** an attempt to document a fact about a whole section (e.g. "the content is illustrative") fails atomically (nothing applies), although the same code works fine on any child of the same section.
**Pattern:** place the annotation on a suitable CHILD of the section — usually the heading TEXT/FRAME (if it already exists and already carries another annotation — just append a second entry to the existing `node.annotations` array; don't create a separate node for one annotation).
```js
// ❌ TypeError
section.annotations = [{ label: '...', categoryId }];

// ✅ on the section's heading (or any other direct child of it)
const header = section.findOne(n => n.type === 'TEXT');
header.annotations = [...(header.annotations || []), { label: '...', categoryId }];
```

### clone-carries-dev-mode-annotations-invisibly
**Principle:** `node.clone()` carries the node's Dev Mode annotations along with it, including annotations on nested nodes. In normal mode they're invisible — neither on the render nor in a structural check — so the clone "looks clean" while in Dev Mode it has foreign pins with facts about another screen, another resource and links to foreign tickets.
**Symptom:** on a new screen in Dev Mode there are annotations nobody added there: the text describes the donor's behaviour ("filter by entity status", links to `entity.api.ts`), although another section was assembled. A screenshot and a tree walk by types/names show no discrepancy.
**Pattern:** after any block transfer by clone — `await figmaHygieneSweep(clonedRoot.id, 'post-clone')` from `publishing-hygiene.md` (a single sweep: removes annotations unconditionally and checks names/description/TEXT in one pass); set your own annotations anew if the fact is relevant to the new node.

### annotations-read-returns-label-and-empty-labelmarkdown-write-rejects-both
**Principle:** Reading `node.annotations` returns objects that have BOTH fields — `label` with a value and `labelMarkdown: ""` (an empty string). Writing accepts strictly one of them. So the classic round trip "read → change → write back" fails: `Only one of label or labelMarkdown should be given`. An empty string doesn't count as an "absent" field.
**Symptom:** a script that reads the annotations, appends one more to the array and assigns the result back fails validation — although nothing resembling `labelMarkdown` is in the code. The error looks inexplicable because the extra field came from the read, not from the code.
**Pattern:** when writing, build the annotation objects FROM SCRATCH, passing only `label` (or only `labelMarkdown`) and `categoryId`. Never re-assign a read object as is — and don't spread it (`{...read, label: 'new'}` drags `labelMarkdown` along).
```js
// ❌ fails: the read object carries labelMarkdown: ""
node.annotations = [...node.annotations, existing];

// ✅ build anew, only the needed fields
node.annotations = [{ label: TEXT, categoryId }];   // categoryId resolved by label in this same call
```
Take only existing categories — `await figma.annotations.getAnnotationCategoriesAsync()`. The preset set is Development / Interaction / Accessibility / Content, but their `categoryId`s differ from file to file — read them in the same call; never hardcode an id seen in another file.

### node-annotations-property-not-recursive-false-negative-on-verify
**Principle:** `node.annotations` returns the annotations of THIS specific node ONLY — not the descendants'. A check "is there an annotation in this subtree" via `topNode.annotations.length === 0` gives a false negative if the annotation sits not on the very top node (sheet/frame) but on a nested child 2–3 levels deeper (which is typical — it's logical to place an annotation on the upload component/list itself, not on the whole sheet).
**Symptom:** a verification by another session (or the same one, in another pass) claims "no annotation at all" on a node that the screenshot and the previous self-report describe as annotated. The difference disappears on a repeat check `node.findAll(n => n.annotations && n.annotations.length > 0)` — the recursive walk finds the annotation exactly where it was left, just not on the top node.
**Pattern:** the check "is there an annotation in this subtree" — always recursive, never `node.annotations` on one specific id.
```js
// ❌ a false negative if the annotation is on a nested child
const hasAnnotation = topNode.annotations && topNode.annotations.length > 0;

// ✅ a recursive walk of the whole subtree
const annotated = topNode.findAll(n => n.annotations && n.annotations.length > 0);
const hasAnnotation = annotated.length > 0;
```

### annotation-writes-via-getnodebyidasync-need-no-page-switch
**Principle:** `figma.getNodeByIdAsync(id)` + a direct property mutation (`node.annotations = [...]`, `node.characters`, any setter) works without `await figma.setCurrentPageAsync(...)`, regardless of which page the node physically lies on — `setCurrentPageAsync` is needed only for page-relative operations (`figma.currentPage.appendChild`, `page.findAll`, `page.children`), not for a targeted read/write by an already-known id. This is separate from the rule `cross-page-appendchild-moves-node` (that one is about moving a node BETWEEN pages via `targetPage.appendChild`); here it's about a targeted edit WITHOUT a move.
**Symptom:** the intuitive (and superfluous) urge to group a batch of annotations/targeted edits by page and make one `use_figma` call per page — while the `figma-use` skill's rule "one setCurrentPageAsync per call" concerns the operations THIS call does via `figma.currentPage`, not any call touching several pages.
**Pattern:** one script can walk a list of ids from different pages and write/read a property of each pointwise — without a single `setCurrentPageAsync`, if the only operation is `getNodeByIdAsync` + a mutation/read of the node's own property.
```js
// ✅ 49 annotations on nodes of three different pages (02 Section A / 03 Section B / 05 Section C) in one script — no page switch
for (const item of ITEMS) {
  const node = await figma.getNodeByIdAsync(item.id);
  node.annotations = [{ label: item.label, categoryId: item.categoryId }];
}
```

### annotation-verify-pass-misses-language-consistency-unless-asked
**Principle:** An LLM verifier explicitly given a text-hygiene checklist (dates/names/paths/service vocabulary/negations) and a fact check against a packet file reliably catches those specific violations — but checks nothing the checklist doesn't name literally. The text's language (conformance to the file's own convention — one language throughout) isn't part of the standard hygiene list, and a verifier that didn't get an explicit "check the language" silently passes an annotation written in another language.
**Symptom:** an adversarial verify pass over 52 annotation drafts gave 27 approved + 25 needs_revision on content/format — not one verdict mentioned that 2 of the drafts (siblings, the same wording) were in a different language from the other 50. The difference was found only by a separate, non-LLM pass (a deterministic alphabet regex, e.g. Latin vs Cyrillic).
**Pattern:** when composing a verify prompt for annotations — explicitly list any file-wide convention (language, tone, node-number format, etc.) the draft must obey, rather than relying on an "obvious" inconsistency being caught within a general "check for violations" assignment. Additionally — a deterministic regex sweep (Cyrillic/Latin, dates, service words) over ALL final texts before writing to Figma as a cheap last line of defence, independent of LLM verdicts.
