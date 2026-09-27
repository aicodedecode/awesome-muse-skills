---
name: figma-plugin-api-rules/publishing-hygiene
description: Read BEFORE any text write into Figma — component descriptions, Dev Mode annotations, node/page/section names, TEXT in the layout. Rules against leaking internal process outward.
---

# publishing-hygiene — what must not be written into Figma

A Figma file is read by developers, QA and stakeholders outside the process that produced it. Everything written there is a publication, not a working note. Internal process must not be visible in it at all.

## Leak channels

All are equally visible from outside and all are checked before writing:

| Channel | Where it shows |
|---|---|
| `component.description` / `componentSet.description` | the Design panel, Dev Mode, the component library |
| `node.annotations` (Dev Mode annotations) | Dev Mode when inspecting the node |
| names of nodes, frames, sections | the layers panel, Dev Mode, export |
| page names | the file's page list |
| any `TEXT` in the layout | the layout itself |
| names of variables, styles, collections | the variables panel, Dev Mode |
| Code Connect mappings | Dev Mode, the code repository |

## Forbidden

- **Dates in any form** — a specific calendar date, "July", "last week".
- **People and role pointers** — names, handles, "by the owner's decision", "at the client's request", "the designer decided".
- **References to internal documents** — repository paths (`tasks/…`, `context/…`), names of `.md` files, section numbers of internal docs.
- **Your own process** — phase numbers, versions of your algorithms and pipelines, code names of initiatives, run identifiers.
- **Status service vocabulary** — `SANDBOX`, `pilot`, `retry`, `WIP`, `TODO`, `TBD`, `draft`, `copy`, `v2`, "verified", "agreed", "accepted".
- **History and negations** — "used to be", "removed because", "this is not …". A description records what the node is now.

## Allowed

- A statement of **what the node is and how to use it**.
- **A path to the implementation file in code** (`Sidebar.tsx`) — that's an address, not a meta-reference to process.
- Names of properties, variants, tokens, components.
- Product data in the layout — field values, dates in table cells, etc. That's content, not a leak.
- **A documentation page's own version and date block** — when the page IS the design system's documentation (a cover, a changelog), that's the artefact's own metadata, not a process leak. The ban on dates covers component descriptions, annotations and product screens.

## The practical test

A phrasing passes if it makes equal sense **in a year** and **to a person who took part in none of the discussions behind it**. If understanding the phrase requires knowing who decided what and when — rewrite.

## Mandatory checks

1. **Before writing** into any channel from the table — re-read the text against the "Forbidden" list.
2. **After any transfer by clone** — `await figmaHygieneSweep(clonedRoot.id, 'post-clone')`: removes foreign Dev Mode annotations unconditionally (see `references/annotations.md`, `clone-carries-dev-mode-annotations-invisibly`) and simultaneously checks node names/description/TEXT with the `LEAK` regex. SECTION nodes carry no `annotations` (see `annotations-not-supported-on-section-nodes` in `references/annotations.md`) — the sweep skips them explicitly by type guard rather than descending.
3. **Before handing over a screen** — `await figmaHygieneSweep(screenRoot.id, 'pre-handoff')`: the same `LEAK` check over names/description/TEXT PLUS the content (not just the presence) of the remaining Dev Mode annotations. Sift product texts in cells by hand — `LEAK` gives false positives; that's expected: a deterministic candidate detector, not a judge of an open vocabulary — free-form names and handles of people aren't caught by a regex. Extend the regex with your own language's process words.

```js
const LEAK = /(20\d\d-\d\d-\d\d|tasks\/|context\/|\.md\b|by the owner's decision|at the client's request|the designer decided|SANDBOX|WIP|TODO|TBD|pilot|retry|draft|copy|\bv2\b|verified|agreed|accepted|used to be|removed because|this is not\b)/i;
const CONT = new Set(['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'GROUP', 'SECTION']);

async function figmaHygieneSweep(nodeId, mode /* 'post-clone' | 'pre-handoff' */) {
  const root = await figma.getNodeByIdAsync(nodeId);
  if (!root) throw new Error(`figmaHygieneSweep: node ${nodeId} not found`);

  const found = [];
  const sweep = n => {
    if (LEAK.test(n.name)) found.push({ id: n.id, kind: 'name', v: n.name });

    if (n.type !== 'SECTION' && n.annotations && n.annotations.length) {
      if (mode === 'post-clone') {
        n.annotations = [];   // remove foreign ones unconditionally — clone-carries-dev-mode-annotations-invisibly
      } else {
        const text = n.annotations.map(a => a.label || a.labelMarkdown || '').join(' ');
        found.push({ id: n.id, kind: 'annotation', v: text, leak: LEAK.test(text) });
      }
    }

    if ((n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.description && LEAK.test(n.description))
      found.push({ id: n.id, kind: 'description', v: n.description });

    if (n.type === 'TEXT' && LEAK.test(n.characters))
      found.push({ id: n.id, kind: 'text', v: n.characters });

    if (CONT.has(n.type)) for (const c of n.children) sweep(c);
  };
  sweep(root);
  return found;
}
```

## Why the whole table, not just annotations

A rule that covers one channel gets applied to that channel only. A component `description` with a date in it, or a node name carrying an internal code name, leaks exactly as far as an annotation does — and no automated check catches either. There are many channels; the rule is one.
