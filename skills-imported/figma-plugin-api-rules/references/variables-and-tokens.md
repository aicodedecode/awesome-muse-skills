---
name: figma-plugin-api-rules/variables-and-tokens
description: Read when binding variables/tokens — figma.variables, setBoundVariableForPaint, per-corner radius and per-paint colour bindings, collections and modes, tinted fills, library vs local files
---

# variables-and-tokens — use_figma rules

### token-name-vs-actual-value
**Principle:** A variable/token's name may not match its real value — check the token's actual value before use; don't guess from the name.

### setboundvariableforpaint-instance-child-strokes
**Principle:** The strokes of VECTOR children inside an instance accept variable binding via `setBoundVariableForPaint` — binding on instance sublayers works.
**Pattern:** find the nested node precisely: `variant.findOne(n => n.name === '…' && n.type === 'INSTANCE')`.

### addmode-returns-string
**Principle:** `VariableCollection.addMode('Name')` at runtime returns a string (the modeId), not a VariableMode object as in the docs — accessing `.modeId` gives `undefined` and breaks the subsequent `setValueForMode`.
**Symptom:** `newMode.modeId === undefined` → an error in `setValueForMode`.
**Pattern:** use the returned string directly as the modeId, or look up `collection.modes.find(m => m.name === '...').modeId`.
```js
// ❌ WRONG — assuming an object was returned
const newMode = semColl.addMode('Crimson Light');
semVar.setValueForMode(newMode.modeId, ...); // newMode.modeId === undefined → error

// ✅ RIGHT — addMode returns the string directly
const modeId = semColl.addMode('Crimson Light'); // this is already the modeId
semVar.setValueForMode(modeId, ...); // works

// Or: look up by name in the next call
const modeId = semColl.modes.find(m => m.name === 'Crimson Light').modeId;
```

### verify-variable-ids-before-write
_Core: full text — `../SKILL.md`._

### setboundvariableforpaint-no-gradient-stops
**Principle:** `figma.variables.setBoundVariableForPaint` accepts only `field='color'` for a SOLID paint — a path like `'gradientStops/0/color'` fails; for gradients `boundVariables` are set directly as an object `{ color: { type: 'VARIABLE_ALIAS', id } }` inside each gradientStop when creating the paint literal.
**Symptom:** the error `Invalid enum value. Expected 'color'` when trying to bind a variable to a gradient stop via `setBoundVariableForPaint`.
```js
// ❌ WRONG — Invalid enum value error
let gradientPaint = { type: 'GRADIENT_LINEAR', ... };
gradientPaint = figma.variables.setBoundVariableForPaint(
  gradientPaint, 'gradientStops/0/color', accentVar
);

// ✅ RIGHT — boundVariables directly in the gradientStop
const gradientPaint = {
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[1, 0, 0], [0, 1, 0]],
  gradientStops: [
    { position: 0, color: { r: 0.95, g: 0.95, b: 0.92, a: 1 },
      boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'VariableID:3:28' } } },
    { position: 1, color: { r: 0.95, g: 0.94, b: 0.92, a: 1 },
      boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'VariableID:4:19' } } },
  ],
};
node.fills = [gradientPaint];
```

### getvariablebyidasync-null-remote-variable
_Open discrepancy, unresolved: `harvest-variable-ids-from-bound-nodes-when-local-collection-is-empty` below resolves `getVariableByIdAsync` on IDs from the `boundVariables` of remote-library nodes and gets names successfully (several dozen tokens in one file) — at first glance the same condition that gives `null` here. Not re-checked live how the conditions differ (different collection types? a different publication state of the library?) — don't treat either entry as wrong without a re-check in a real file._
**Principle:** `figma.variables.getVariableByIdAsync` silently returns `null` (no exception) for a remote/library variable whose ID was taken from another node's `boundVariables` (format `<hash>/<num>:<num>`, not `VariableID:X:Y`), and `setBoundVariableForPaint(paint, 'color', null)` silently erases the binding — instead of resolving, copy `color` + `boundVariables` (`{color: {type: 'VARIABLE_ALIAS', id}}`) whole from the reference paint into the new paint object.
**Symptom:** the paint stays at the development colour without a variable binding; the resolve returns null without error.
**Pattern:** if `getVariableByIdAsync(id)` on an ID from another node's `boundVariables` gives `null` — don't treat the variable as non-existent; just copy the paint object whole; for local variables (`VariableID:X:Y`) the resolve works. The same direct-paint-object pattern as for gradient stops.
```js
// ❌ WRONG — getVariableByIdAsync returns null for a remote variable; the binding is silently lost
const refPaint = referenceVector.strokes[0]; // { color, boundVariables: { color: { id: '<remote-lib-hash>/<node-id>' } } }
const v = await figma.variables.getVariableByIdAsync(refPaint.boundVariables.color.id); // null
let s = { ...targetVector.strokes[0] };
s = figma.variables.setBoundVariableForPaint(s, 'color', v); // v=null → boundVariables silently erased
targetVector.strokes = [s];

// ✅ RIGHT — copy color + boundVariables WHOLE from the reference paint, without resolving
const refPaint = referenceVector.strokes[0];
targetVector.strokes = [{
  type: 'SOLID',
  color: { ...refPaint.color },
  boundVariables: { color: { type: 'VARIABLE_ALIAS', id: refPaint.boundVariables.color.id } }
}];
```

### variable-collection-mode-limit
**Principle:** A variable collection is limited to 20 modes on Pro/Starter plans and 40 on Enterprise — `collection.addMode(name)` after reaching the limit throws `"Limited to 20 modes only"` (`"Limited to 40 modes only"` on Enterprise); this is an architectural constraint of the whole DS strategy; there is no technical workaround.
**Symptom:** some COMPONENT_SET variants remain with empty `explicitVariableModes` (overflow beyond the cap) and display default-mode colours instead of per-brand/per-flavour.
**Pattern:** before designing a variable-driven system where modes = brands/flavours/themes and there are >10 of them — check the count against the plan limit in a Phase 0 preflight, with a sentinel test, BEFORE starting any such task. If the modes exceed the cap — switch to variant swap + baked values, or split into multiple collections (the consumer syncs by hand).
**Caution:** the sentinel test below checks headroom for exactly ONE additional mode — for a batch of N>1 new modes (the typical preflight scenario) it doesn't guarantee the whole batch fits; for a batch compute `collection.modes.length + N` against the plan's actual cap directly; use the sentinel test only as a quick "is there any headroom at all" check.
```js
// Discovery test — run in Phase 0, before starting work (checks headroom for +1 mode, not for the whole planned batch)
const test = brandCollection.addMode('_preflight_DELETE_ME');
brandCollection.removeMode(test);
// If it throws — pivot the plan BEFORE starting work, not after
```

### styles-ts-source-of-truth-for-variable-bindings
**Principle:** When a designer complains about "strange colours" after a rebrand / token reshuffle — first compare the Figma variable bindings with the component's `styles.ts` (or the equivalent style source) in code, rather than guessing the designer's intent; often Figma has long been bound to a token that got a new meaning in the rebrand, while the code has used another (unaffected) token all along.
**Pattern:** open `styles.ts` → find `color.X.Y` for the problematic state → inspect `boundVariables.color.id` of the corresponding node in Figma → resolve the name via `getVariableByIdAsync` → compare.

### dual-stroke-icon-inconsistent-path-variable
**Principle:** A monochrome icon must bind the stroke of every path to ONE colour variable — the bug: individual paths inside the icon are bound to another variable or to a hard-coded colour; this sits in the master / baked overrides and survives a component swap (the swap substitutes a new master but doesn't touch its internal per-path bindings). Its character is local and scattered — it can't be predicted, only scanned for; two-colour-by-design icons (checkmark + circle) must be accounted for separately; don't "fix" them.
**Symptom:** the icon renders with a foreign second colour on specific curves, not as a whole.
```js
// for each leaf with a stroke: tag = boundVariables.color.id OR 'RAW:'+rgb
// climb to the enclosing INSTANCE; group; if Object.keys(tags).length > 1 → flag
```

### mode-pinned-tests-via-setexplicitvariablemodeforcollection
**Principle:** Build a component's two-theme test blocks by cloning + pinning the collection's mode on the clone: `clone.setExplicitVariableModeForCollection(collection, modeId)` — the bindings aren't touched; component duplicates aren't needed.
**Pattern:** light block = clone + pin the light mode; dark block = clone + pin the dark mode.

### unbound-binding-scan-before-done
**Principle:** Before "done" on a component or a screen — scan for the unbound in **both directions**. Forward: `findAllWithCriteria` by types + a `boundVariables` check (color/spacing), `textStyleId` on every TEXT, `effectStyleId` on every node carrying effects; skip nodes with `;` in the id (instance internals). Reverse: every local text style, effect style and variable created in this build has at least one consumer — a style with zero users is the same defect as a node with zero bindings, and it is invisible from the node side. When auditing raw/hardcoded values, skip anything nested inside an `INSTANCE`, since its properties are owned by the main component and aren't locally editable:
```js
const inInstance = n => { let p = n.parent; while (p) { if (p.type === 'INSTANCE') return true; p = p.parent; } return false; };
const texts = root.findAllWithCriteria({ types: ['TEXT'] }).filter(n => !inInstance(n));
const unstyledText = texts.filter(t => !t.textStyleId).map(t => t.id);
const rawEffects = root.findAll(n => 'effects' in n && n.effects.length && !n.effectStyleId && !inInstance(n)).map(n => n.id);
const usedStyles = new Set([...texts.map(t => t.textStyleId), ...root.findAll(n => 'effectStyleId' in n).map(n => n.effectStyleId)]);
const orphanStyles = [...await figma.getLocalTextStylesAsync(), ...await figma.getLocalEffectStylesAsync()].filter(s => !usedStyles.has(s.id)).map(s => s.name);
return { unstyledText, rawEffects, orphanStyles };   // all three empty — done
```
**Symptom:** a "finished" component with a couple of raw hexes surfacing on a theme switch; a screen with a full type ramp in the styles panel and `textStyleId === ''` on every node; a shadow variable that nothing references because the effect style was authored with a raw colour.

### on-fill-icon-color-must-mirror-sibling-text-not-role-name
**Principle:** When adding an icon next to text on a coloured/accent fill (e.g. an active chip/pill with a dark background) — resolve the icon's colour by **inspecting the actual `boundVariables` of the neighbouring TEXT node in THE SAME state**, not by picking a same-named `icon/*` token by the semantics of the role. In several semantic schemes `icon/accent` / `text/accent` resolve to THE SAME monochrome colour as the `accent` fill itself (the "accent" role = the fill's own colour, not a contrast to it) — binding the icon to such a token makes it invisible on its own background. The real contrast token on the fill is often a different role (`text/inverse` / `icon/inverse`), which the neighbouring text already uses explicitly.
**Symptom:** the icon is technically in place (structure/visibility right) but not visible on the screenshot — it merges with the component's background; the bug is caught ONLY by screenshot, not by a structural read (fills/boundVariables read "correctly" syntax-wise; they just point at a token that's wrong in fact).
**Pattern:** before binding an icon on a coloured background — read `siblingTextNode.fills[0].boundVariables.color.id` → `getVariableByIdAsync` → use EXACTLY that resolved token (or its `icon/` analogue with the same role suffix) for the icon; don't build the binding on an intuitive similarity of names.
```js
// ❌ WRONG — by intuition "active state = accent role"
iconVector.strokes = [bindColor(iconAccentVar)]; // may coincide with the fill's background

// ✅ RIGHT — check against the neighbouring text's actual binding
const labelNode = variant.findOne(n => n.name === 'Label' && n.type === 'TEXT');
const labelVarId = labelNode.fills[0].boundVariables.color.id; // e.g. 'VariableID:2:54' = text/inverse
const matchingIconVar = await figma.variables.getVariableByIdAsync('VariableID:3:22'); // icon/inverse — the same role suffix
iconVector.strokes = [bindColor(matchingIconVar)];
```

### deltae-color-matcher-must-check-token-opacity-not-just-rgb
**Principle:** An automatic colour matcher (a fuzzy match of a raw hex to the nearest palette variable via deltaE/Lab distance) compares only RGB — but in semantic palettes tokens with a `-tint`/`-tint-low` suffix are often canonically defined as THE SAME base colour at alpha < 1 (e.g. `fill/warning-tint` = the same hex as `warning`, but `a:0.12`), and `*-inverse` — as a colour meant for text/icons ON a dark background (in the Light theme it may resolve to a hex accidentally close to the needed light tone but semantically "the other way round"). A matcher blind to alpha and to the role suffix picks such a token by pure RGB proximity as if it were a plain solid equivalent — and `setBoundVariableForPaint` then carries the variable's alpha onto the paint, really making the element translucent/barely visible.
**Symptom:** an icon or text "fades" / becomes barely legible right after automatic tokenisation, although the binding itself is syntactically correct (`boundVariables.color` points at a valid variable) — visible only by screenshot, not by a structural read of fills. The bound paint's opacity (0.12, 0.5, etc.) was NOT explicitly set by code — it came from the variable's own alpha.
**Pattern:** before accepting a deltaE match — check the final `opacity` of the variable's resolved value (or `paint.opacity` AFTER binding). If the matched token contains `-tint`/`-tint-low`/`-inverse` in its name and the source is a solid (opacity=1) element not on an inverted background — don't trust the pure numeric match: look for a sibling token with the same base alias (usually `*-primary` without a suffix, or the `icon/`/`text/` equivalent of the same name without `-tint`/`-inverse`) via a shared resolved alias id, or simply leave the raw colour unbound if there's no solid equivalent.
```js
// after setBoundVariableForPaint — ALWAYS re-read the final opacity; don't trust only the fact of a successful bind
node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', matchedVar)];
if (node.fills[0].opacity < 0.95) {
  // suspicious — the matched token is probably "-tint"/"-inverse"; check the semantic correctness of the context
}
```

### tokenizing-container-bg-can-unmask-sibling-raw-white-as-visible-box
**Principle:** If a container's background and the background of a nested/neighbouring element originally coincide as raw hex (both `#FFFFFF`, both unbound) — they visually merge ("invisible") regardless of both being technically untokenised. Tokenising ONLY the container to a semantic variable (`fill/bg/secondary` etc., which is almost-but-not-exactly white, e.g. `#F9F9FB`) leaves the neighbouring element at the old pure `#FFFFFF` — the pair that used to be identical diverges by 1–2 RGB units, and the previously invisible boundary becomes a noticeable rectangle/blot.
**Symptom:** after binding a container's background to a token — the screenshot shows a NEW visual artefact (a rectangle/pill with a visible edge) where nothing was visible before, although the binding touched only the CONTAINER itself, not the "suddenly appeared" nested element — easy to take for a bug in the API itself rather than the unmasking of a long-existing desync of two raw fills.
**Pattern:** before and right after tokenising any container's background — find its direct visible children (`FRAME`/`INSTANCE`/`RECTANGLE`) with their own `fills` whose raw hex is close to the container's old background (typically `#FFFFFF` or another "pseudo-white") — tokenise them TO THE SAME token synchronously, in one pass, not token by token down a list without regard for adjacency. A screenshot check right after is mandatory; don't defer it to the end.
```js
// after bindFill(container, 'bgSecondary') — immediately check the direct children for a matching raw white
const suspects = container.children.filter(c => c.fills?.[0]?.type === 'SOLID' && !c.boundVariables?.fills
  && c.fills[0].color.r > 0.98 && c.fills[0].color.g > 0.98 && c.fills[0].color.b > 0.98);
// suspects.length > 0 — tokenise them with the same variable as the container BEFORE moving to the next node
```

### harvest-variable-ids-from-bound-nodes-when-local-collection-is-empty
_See the open caveat in `getvariablebyidasync-null-remote-variable` above — the same call under a similar condition is documented there as returning `null`._
**Principle:** In a file that consumes a remote token library, `getLocalVariableCollectionsAsync` returns an almost empty result — all the needed variables are remote, and there's nowhere to enumerate them "by name". The reliable source of IDs is the file itself: walk the subtree of an already assembled screen, collect `boundVariables.color` from `fills` and `strokes`, resolve to names. This gives a verified list of exactly the tokens really applied in this file, with their actual values.
**Symptom:** searching for a variable by name or by colour value among the local collections gives zero candidates, although the token is visibly used in the file. The temptation — take a `VariableID` from memory or from notes on another file; they don't resolve or point at a different variable.
**Pattern:** harvest first, write second. Side benefit: the harvest shows which token family the system really assigns to the needed role — and that is the answer to "which token to paint with", otherwise decided by taste.
```js
const seen = {};
const walk = async n => {
  for (const arr of [n.fills, n.strokes]) {
    if (!Array.isArray(arr)) continue;
    for (const p of arr) {
      const b = p.boundVariables && p.boundVariables.color;
      if (!b) continue;
      const v = await figma.variables.getVariableByIdAsync(b.id);
      if (v && !seen[v.name]) seen[v.name] = { id: v.id, sample: p.color, on: n.name };
    }
  }
  if (CONTAINER_TYPES.has(n.type)) for (const c of n.children) await walk(c);
};
```

### setboundvariableforpaint-returns-frozen-paint-and-drops-source-opacity
**Principle:** `figma.variables.setBoundVariableForPaint(paint, 'color', v)` returns a NEW paint whose **own `opacity` from the source paint is reset to 1** — only the colour is bound; the paint's own alpha isn't carried over. Worse: the returned object is **frozen**, so a head-on fix (`newPaint.opacity = 0.7`) is a silent no-op: no error, `fills` is assigned, and on a repeat read the opacity is still 1. Opacity can be restored only on a PLAIN copy (`JSON.parse(JSON.stringify(...))`), not on the returned object. The same trap in the other direction: setting `opacity` on a paint *before* it's on the node clobbers it to 1 (a solid fill; same-colour text becomes invisible) — e.g. an eyebrow chip at `Action/Regular` 0.16 renders solid and its text vanishes.
**Symptom:** a translucent element (a progress bar, an overlay, a tint backing) becomes noticeably more saturated than its neighbours assembled from the same donor after binding to a token. The first attempt to restore the opacity "doesn't work" without any sign of error — a second readback shows the same value of 1, so it's easy to conclude opacity can't be written on this node at all.
**Pattern:** remember the donor paint's `opacity` BEFORE binding; after binding, put the new paint into a plain array and set the opacity there. Recipe — assign the bound paint first, then clone and set opacity as a separate step.
```js
const srcOpacity = donor.fills[0].opacity;             // remember BEFORE

let fills = JSON.parse(JSON.stringify(node.fills));    // the read-only array → a plain copy
fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', v);
fills = JSON.parse(JSON.stringify(fills));             // ⚠️ UNFREEZE — otherwise the line below is a no-op
fills[0].opacity = srcOpacity;
node.fills = fills;

// a readback is mandatory: check both boundVariables.color and opacity
```
Adjacent: `deltae-color-matcher-must-check-token-opacity-not-just-rgb` above — there opacity drifts the other way (the variable's own alpha is carried onto the paint). The common rule is one: **after `setBoundVariableForPaint` always re-read the final `opacity`, not only the fact of a successful bind.**

**Reliability clarification (more important than the original wording above).** The plain copy within the same call does NOT always work: on a sample of 8 bars in one file it worked once and in the other seven silently didn't apply, including with a double `JSON.parse(JSON.stringify(...))` round trip. No error any time; `fills` is assigned; the readback shows `opacity: 1`. **The reliable pattern — restore the opacity in a SEPARATE next `use_figma` call, on top of the already-bound fills.** Plan two calls by default; if the first happened to work, the second becomes a harmless no-op.
```js
// call 1 — binding only
bar.fills = [figma.variables.setBoundVariableForPaint(bar.fills[0], 'color', v)];

// call 2 (a separate use_figma) — restore the opacity on top of the result
const flat = JSON.parse(JSON.stringify(bar.fills[0]));
flat.opacity = 0.7;
bar.fills = [flat];
```

**`clone` drops opacity in exactly the same way.** The trap isn't limited to binding: a node copy obtained via `node.clone()` (including when moving between pages) may arrive with `opacity: 1` where the donor had `0.7` — the variable binding meanwhile survives the move correctly. So after EVERY cloning of a translucent element the opacity must be re-read alongside the binding, rather than assuming the clone is identical to the donor.

**Verify by render, not only by structure.** The difference between `0.7` and `1` on a 3 px bar isn't obvious to the eye. A cheap objective check — sample a pixel inside the element and compare with the composite `255 + (channel − 255) × opacity` over the background: at 0.7 over white `#79ce64` gives `(161,221,146)`, at 1.0 — `(121,206,100)`; the distance between the hypotheses is two orders of magnitude above rounding error.

### check-collection-modes-before-normalising-onto-a-flavour-named-variable

**Principle:** Before "normalising" a token muddle onto a variable with a brand/flavour in its name (`BRD1/…`, `BRD2/…`, `Brand X/…`), check which collections both sides come from and how many modes they have. The typical layout in a multi-brand file: there is a **multi-mode** collection (`Brand` with a mode per flavour) and there are **single-mode** variables in the design system named after a flavour (`BRD1/CO\BRD1\ThemePrimary`). Their values coincide, so by colour they're indistinguishable — but the first switches with the frame and the second is nailed down forever. The intuition "bring everything to the variable with the right brand in the name" leads exactly the wrong way: it freezes the flavour.
**Symptom:** after "tidying the tokens" the screen stops switching to another brand as a whole — some nodes change colour, some stay on the old one. At the moment of the edit everything looks perfect, because the active mode matches the baked-in flavour; the discrepancy shows only to whoever switches the mode (or to the developer of another flavour altogether).
**Pattern:** for each candidate variable resolve `variableCollectionId` → `getVariableCollectionByIdAsync` → look at `modes.length`. Separately read `explicitVariableModes` on the root frame and its ancestors: if the frame pins the collection to a specific mode, then **the multi-mode variable is the right target**, and the flavour-named single-mode ones must be moved onto it, not the other way round.
```js
const v = await figma.variables.getVariableByIdAsync(boundId);
const coll = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
// coll.modes.length > 1  → switchable, probably the normalisation target
// coll.modes.length === 1 && /^[A-Z]{2,4}\//.test(v.name) → nailed to a flavour, probably the source

let n = frame, pins = {};
while (n && n.type !== 'PAGE') { Object.assign(pins, n.explicitVariableModes || {}); n = n.parent; }
// non-empty pins on a multi-mode collection = the frame already knows how to switch; don't break it
```

### same-role-different-family-may-alias-identical-primitives
**Principle:** "Rebind the glyph from `text/<role>` to `icon/<role>`" is a semantic edit but NOT necessarily a visual one: in a semantic collection both variables often alias the same primitive in EVERY mode. Before declaring such a rebind "visible in N themes" and requiring the user's decision — unwrap the alias down to the primitive in every mode of both variables and compare. The number of modes is identical for variables of one collection by construction; only the alias target can diverge.
**Symptom:** the handover/task states "the rebind is visible in three themes, because one variable is defined in seven modes and the other in four" — while a measurement gives one collection, four modes for both and identical primitives.
**Pattern:**
```js
const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
for (const m of col.modes) {
  const val = v.valuesByMode[m.modeId];
  if (val && val.type === 'VARIABLE_ALIAS') {
    const t = await figma.variables.getVariableByIdAsync(val.id);   // the primitive
    // compare t.name of both variables in the same mode
  }
}
```

### hex-match-scan-must-include-opacity-not-just-rgb
**Principle:** A script "scan the scene for hard-coded colour X → bind what's found to a variable" must key the match on `hex(color) + opacity`, not only on the `#rrggbb` from `paint.color`. `paint.color` stores ONLY the RGB channel; alpha lives separately in `paint.opacity`. Comparing a candidate node with the target opaque hex by a bare string `'#' + r + g + b === '#ffffff'` without checking `opacity` falsely matches ANY translucent paint of the same RGB (e.g. `rgba(255,255,255,0.3)`), because the RGB part is identical and alpha takes no part in the comparison at all.
**Symptom:** a node that by design should stay an untouched hardcode (a translucent "alias without a fitting variable", documented as `missing-on-figma`/deferred) suddenly gets a variable binding along with the rest of the exact-match group — `use_figma` throws no error, the script report shows "N mutations, 0 errors", looks clean. The side effect is worse than the false bind itself: `setBoundVariableForPaint` resets `opacity` to `1` (see `setboundvariableforpaint-returns-frozen-paint-and-drops-source-opacity` above) — a node that was 30% transparent becomes fully opaque without a single error signal.
**Pattern:** in the classification/comparison function build the key as `hex(color) + (opacity < 1 ? Math.round(opacity*100) : '')` — the same way deduplication is done in the inventory scan (the bucket key), not as in a separate write script where, through inattention, the `hex` function may be rewritten anew without the alpha suffix. Most reliable — reuse LITERALLY the same `hex` function between the read-only inventory script and the subsequent write script (one implementation, not two similar ones).
```js
// ❌ WRONG — RGB without alpha; falsely matches a translucent paint of the same colour
function hex(c) {
  return '#' + [c.r,c.g,c.b].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('');
}
if (hex(paint.color) === '#ffffff') bindPaint(node, targetVar); // also matches at paint.opacity === 0.3

// ✅ RIGHT — opacity takes part in the comparison key
function hexWithAlpha(paint) {
  const base = hex(paint.color);
  return paint.opacity !== undefined && paint.opacity < 1 ? base + Math.round(paint.opacity * 100) : base;
}
if (hexWithAlpha(paint) === '#ffffff') bindPaint(node, targetVar); // '#ffffff30' won't match; stays untouched
```

### setboundvariable-invalid-for-stroke-paint-color
**Principle:** `node.setBoundVariable('strokes', index, variable)` doesn't bind a variable to the colour of a paint object in the `strokes` array — the right way: build the paint object, run it through `figma.variables.setBoundVariableForPaint(paint, 'color', variable)`, and assign the result to `node.strokes = [paint]`.
**Symptom:** the script runs without error, `node.strokes` contains a solid paint, but `boundVariables` on that paint is empty or points elsewhere — the border either doesn't render at all or renders in the default/black colour instead of the token.
**Pattern:**
```js
// ❌ WRONG — doesn't bind the strokes colour
node.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.setBoundVariable('strokes', 0, variable);

// ✅ RIGHT
let paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
paint = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
node.strokes = [paint];
```

### addmode-copies-existing-mode-values-not-blank
**Principle:** `VariableCollection.addMode(name)` doesn't create a new mode with empty/default values — Figma copies into it the values FROM AN ALREADY EXISTING mode of the collection (by observation — not necessarily the first in the list; in the real case the new mode received a copy of a mode's values that at that moment hadn't yet been brought to its final state). If any interval passes between `addMode` and the completion of the data edit in the file — the new mode temporarily (or permanently, if unchecked) holds references to what was there BEFORE the edit, including the variables the edit intended to orphan and delete.
**Symptom:** a script looking for "what else references the deletion candidates" RIGHT after `addMode` finds unexpected living references with a `modeId` belonging to the just-created mode — looks like a search bug, while these are real, just-copied alias bindings.
**Pattern:** if a new placeholder mode ("to be filled later") is created within the same session as a cleanup/deletion of the collection's other variables — either (a) create the placeholder mode AFTER the cleanup is complete, or (b) right after `addMode` explicitly overwrite its values from a meaningful source (e.g. mirror another, already correct mode via `targetVar.setValueForMode(newModeId, targetVar.valuesByMode[sourceModeId])` for every variable of the collection) — this both gives the placeholder a sane starting set and removes accidental references to what's planned for deletion. In any case: **the final "nothing else references this" check before deleting variables must run AFTER all operations on the collection's modes** (addMode/removeMode/renameMode), not before — otherwise it checks an already stale state.
```js
// after addMode — don't treat the new mode as empty; check/overwrite explicitly
const newModeId = collection.addMode('BrandA Light');
for (const v of allVarsInCollection) {
  const sourceVal = v.valuesByMode[knownGoodModeId];
  if (sourceVal !== undefined) v.setValueForMode(newModeId, sourceVal);
}
```

### empty-scopes-array-is-a-distinct-state-not-all_scopes-serialization
**Principle:** `variable.scopes = []` is a SEPARATE, meaningful value ("hidden from all property pickers"), not how the `ALL_SCOPES` default serialises on readback. An explicitly set `ALL_SCOPES` reads back literally as the array `["ALL_SCOPES"]`, not as an empty array — both states are programmatically distinguishable. In files with a two-tier token architecture (primitives → semantics) this is NOT a bug but a deliberate convention: the primitive collection (`Colors-base`-like) keeps all its variables at `scopes: []` so the designer doesn't see hundreds of raw hex primitives in the fill/stroke/text picker — the path to a colour goes only through semantic tokens, which, conversely, carry meaningful role scopes (`["TEXT_FILL"]`, `["FRAME_FILL","SHAPE_FILL"]`, etc.).
**Symptom:** the general rule "always set explicit scopes; don't leave ALL_SCOPES" (see Rule 16 in the `figma-use` SKILL.md), applied literally to NEW primitives in a file with such an architecture, is a regression: the new primitives (the only ones in the file with explicit non-ALL_SCOPES) become the only ones visible in the pickers, while all their existing sibling primitives (`scopes: []`) stay hidden. The result is the reverse of the intent — not a "cleaner" picker but a single "leaked" set of primitives among the correctly hidden ones.
**Pattern:** before creating new variables in an existing collection — read `scopes` on 10–15 existing variables of THE SAME collection (not an adjacent one). If unanimously `[]` — it's the "hidden from pickers" convention; copy it rather than overriding with the general rule. The general Rule 16 remains right for semantic / newly started collections without an established convention; for primitive collections inside an already settled two-tier architecture the file's convention takes priority (the same general principle "look for the file's convention first" met earlier — here specifically for scopes).
```js
// Distinguish: an explicit ALL_SCOPES reads literally, not as []
const v = await figma.variables.getVariableByIdAsync(id);
console.log(v.scopes); // ["ALL_SCOPES"] if explicitly set SO, [] if "hidden from pickers"

// Before creating new primitives — check the collection's convention
const existingSample = await Promise.all(
  colorsBaseCollection.variableIds.slice(0, 15).map(id => figma.variables.getVariableByIdAsync(id))
);
const allEmpty = existingSample.every(v => v && v.scopes.length === 0);
// allEmpty === true → the new primitives also get scopes: [], not an explicit fill/text list
```

### editing-shared-primitive-in-place-vs-new-primitive-plus-per-mode-repoint-have-opposite-cascade-scope

**Principle:** Two mechanically different ways to "fix a token's value" in a multi-mode/multi-brand collection give OPPOSITE cascades. (1) Editing the value of an ALREADY EXISTING primitive in place (`setValueForMode` on the single mode of the primitive collection) — changes the colour EVERYWHERE any semantic token aliases that primitive, in ANY mode/brand of the semantic collection, including those not meant to be touched. (2) Creating a NEW primitive and re-pointing the alias of ONE semantic token ONLY in ONE specific mode — changes exclusively that mode; the sibling modes (other brands/themes) still aliasing the OLD primitive stay at the old value — even if by the task's meaning "one primitive fix should close all themes at once".

**Symptom:** both ways were applied in one session to neighbouring roles of the same task (positive/negative/warning contrast in Brand B Light) — and the results diverged. Editing `green/50` in place (the primitive was used EXCLUSIVELY by the Brand B-Light text/icon/border-positive roles, by nothing else) automatically fixed Brand A Light too (its `text/positive` aliases the same `green/50`) — the plan "one fix closes Brand B and Brand A" worked literally. For red/yellow the same literal plan ("raise red/60 / yellow/60 right in the primitives") had to be replaced with new `red/45`/`yellow/33` + a re-point of ONLY the Brand B Light value — because `red/60`/`yellow/60` were SIMULTANEOUSLY needed untouched in the dark-mode border and in the fill of both themes. Side effect: Brand A Light, which also aliased the old `red/60`/`yellow/60`, stayed with the old broken contrast until a SEPARATE explicit second re-point call aimed specifically at the Brand A Light value of the same tokens — nothing "arrived" by itself.

**Pattern:** before promising "a shared-primitive fix fixes all brands at once" — for EACH touched semantic token check by harvest whether the candidate primitive is used ONLY by the role/mode you're about to change, or ALSO by roles/modes that mustn't be touched (fills, the dark-mode border, etc.). If the primitive is exclusive to the needed scope → an in-place edit; the cascade is free and complete. If the primitive is shared with the untouchable — a new primitive + a re-point specifically per (token × mode); and in a multi-brand collection a re-point doesn't propagate between modes BY ITSELF — every mode/brand that should receive the fix requires ITS OWN explicit re-point call.
```js
// harvest: which (token × mode) already alias the candidate primitive — BEFORE deciding in-place vs new-primitive
const usages = [];
for (const v of allSemanticVars) {
  for (const mode of semanticCollection.modes) {
    const val = v.valuesByMode[mode.modeId];
    if (val && val.type === 'VARIABLE_ALIAS' && val.id === candidatePrimitiveId) {
      usages.push({ token: v.name, mode: mode.name });
    }
  }
}
// usages holds ONLY the desired scope → safe to edit the primitive in place
// usages holds roles/modes that mustn't change → a new primitive + a re-point per each (token, mode)
```

### harvest-sibling-brand-alias-map-as-transplant-template-for-new-brand

**Principle:** When a new brand's source (an external patch/mockup) covers only part of the semantic palette (~36 of 129 slots in the observed case) and the rest require derivation — don't derive them from scratch by reasoning slot by slot. Instead, in one read-only call harvest the FULL map "semantic slot name → which primitive it aliases" for an already implemented sibling brand (the closest in architecture, usually the last added) in BOTH of its modes — this gives a ready, already validated "formula" of relations (hover = which step/alpha from the base, tint/tint-low = which % alpha, `-inverse` = the same token's value in the opposite mode, neutral-border tiers = which steps of the neutral ladder) for transposition onto the new brand's primitives. Return `[name, aliasNameOrHex, aliasNameOrHex]` triples (more compact than objects with repeating keys) — for 129 variables this fits within the `use_figma` budget without pagination (see `use-figma-result-hard-truncated-at-20kb-plan-recursive-capture` in `mcp-and-environment.md`).

**Symptom of no harvest:** an attempt to derive all the derived slots by intuition / from scratch gives an inconsistent system (different alpha % for tokens of the same role, random hover directions — now darker, now lighter, without a single rule) and requires many rounds of visual correction, as in the first pass on a sibling brand (several superseded edits after showing the user).

**Pattern:** (1) harvest the sibling brand → a table of formulas; (2) classify each of the 129 slots: sourced (present directly in the new brand's source — it always has priority) vs derived (transferred by the sibling's formula, but onto ITS OWN primitives); (3) for derived — formulate explicit, uniform rules BEFORE writing the script (e.g. "hover = index+1 in the same radix ladder", "tint/tint-low = alpha 12%/8% of `strong`", "`-inverse` = the same token's value in the opposite mode"); don't decide each slot anew; (4) create the missing alpha/hover primitives in ONE pass, computing them programmatically from the already-created base primitives (not transcribing hex by hand — a typo risk); (5) write the mapping table as data (an array of triples), not as assignments scattered through the code — so it can be checked for completeness (`missingSlots.length === 0`) at one glance at the script's return.

**Limitation of the method:** the sibling brand's formula transfers the TOPOLOGY of relations (which primitive role corresponds to which semantic slot), not the values themselves — the final colours must still be shown to the user as a screenshot BEFORE treating the theme as finished; the method reduces the number of correction rounds; it doesn't cancel the visual review itself.

### swap-primitive-values-not-aliases-to-invert-a-shared-role-pair

**Principle:** If several semantic slots (`fill/bg/primary`, `fill/neutral-primary`, their `-inverse` pairs in both modes) all alias ONE and the same pair of primitives ("background"/"surface", "A"/"B"), and the user decided to swap which of the two is visually lighter — don't re-point the aliases per semantic slot separately (a risk of missing one of the pair's several places of use). Instead swap the VALUES (`setValueForMode`) of the two primitives themselves; don't touch the primitives' names. A primitive's role is described by its name ("background" = the page tone, "surface" = the card tone) — that statement stays true regardless of which specific hex is currently in the role; the whole alias network referencing these two IDs updates for free in one write, including the indirect `-inverse` slots in the opposite mode, easy to forget in a manual re-point.

**Symptom of the alternative (undesirable) approach:** trying to "fix" this by re-pointing each affected Semantic Palette slot separately — requires knowing in advance the full list of slots that will end up affected (in the observed case at least 6: `fill/bg/primary`, `fill/bg/secondary`, `fill/neutral-primary`, plus three `-inverse` derivatives in the other mode) — missing one gives a silently inconsistent result where part of the UI uses the new logic and part the old.

**Pattern:**
```js
const bgVal = bgVar.valuesByMode[modeId];
const surfVal = surfaceVar.valuesByMode[modeId];
bgVar.setValueForMode(modeId, surfVal);
surfaceVar.setValueForMode(modeId, bgVal);
// the Semantic Palette isn't touched at all — the whole effect goes through the already existing aliases
```
Before the swap — read-only confirm that the primitive (or pair) is really exclusive to the needed brand/mode (such facts are worth recording in your own per-project notes) — otherwise the swap cascades into another brand sharing the same primitive.

**When it does NOT work:** if only PART of the affected slots should swap while another part shouldn't (e.g. `fill/bg/tertiary` takes no part in the pair and must stay as is) — the value swap of the two primitives leaves them alone only if they really reference a third, independent primitive. Check that BEFORE the swap: harvest which slots alias exactly this pair of primitives and which — something else, despite the visual similarity of the role.

### hsl-lightness-disagrees-with-wcag-luminance-at-nontrivial-saturation

**Principle:** When interpolating/rebuilding a colour ladder (a constant-H/S HSL interpolation between anchors), a check "lightness monotonicity preserved" via HSL lightness (`(max(r,g,b)+min(r,g,b))/2`) can give a false positive — the real (WCAG-weighted) luminance can go in the REVERSE order if one of the steps is noticeably more saturated than its neighbours. WCAG relative luminance (`0.2126R+0.7152G+0.0722B` on gamma-corrected channels) weights the G channel disproportionately (0.7152) — a colour with G raised relative to R/B (typical for "green" accents/wash surfaces) can have a HIGHER real brightness at a NUMERICALLY lower HSL-L than a less saturated neighbour with a higher HSL-L. This isn't a hypothetical edge case — the discrepancy is large enough to literally flip the "primary > secondary > tertiary" order that the HSL-L check reports as "OK" at that moment.

**Symptom:** a monotonicity check script (written via HSL-L as a cheaper/more intuitive proxy for real brightness) returns `monotonic: true`, but `fill/bg/tertiary` is visually/really lighter than `fill/bg/secondary` — the same defect class as a first-pass monotonicity check for a new brand ladder, which must be done via WCAG luminance, but which is easy to accidentally bypass if, when writing a new ad hoc interpolation script, HSL-L is taken "for speed" without recalling the already documented formula.

**Pattern:** for ANY ladder monotonicity check (not only "the first pass of a new brand" — the same risk in a point edit of one or two steps of an existing ladder) compute the order EXCLUSIVELY by WCAG relative luminance, never by bare HSL-L, even as a draft/intermediate check — if an intermediate HSL-L check says "OK", that's no guarantee; the final check must be via luminance on the live values just written to Figma (not on numbers pre-computed in the head). If an anchor colour is noticeably more saturated than the neighbouring ladder steps (check: the anchor's S / the neighbours' median S > ~3×) — treat that anchor as a potential source of such a discrepancy in advance, not after the fact.

### cornerradius-binding-lands-on-four-per-corner-fields
**Principle:** `setBoundVariable('cornerRadius', v)` binds the **four per-corner fields** (topLeft/topRight/bottomLeft/bottomRight), NOT an aggregate — `node.boundVariables.cornerRadius` stays false. Bind and verify all four. Re-check the radius after creating wrappers (a wrapper set to 24 has read back as 72). Cover the binding edge cases in the first pass: mixed per-corner radii (corners that differ), values `>=100`, negative values, and sub-pixel (fractional) values — handle all of these up front; they're repeatedly missed.
**Symptom:** the audit reports the radius as unbound although a bind call "succeeded"; a wrapper's radius reads back as a multiple of the intended value.

### when-the-file-is-the-library-resolve-local-variables
**Principle:** If you're editing the library file itself, resolve against local variables (`getLocalVariablesAsync` / local collections), not `figma.teamLibrary` (returns empty). Local colour bindings are **correct**, not orphaned — only truly hardcoded values are fix candidates. Bind by VariableID, then verify: a library's colour/spacing/radius vars are **local** (`remote:false`) — bind colours with `figma.variables.getVariableByIdAsync(id)` + `setBoundVariableForPaint`, and spacing/radius with `setBoundVariable`. The resolver can fail silently, so always run a binding audit at the end.
