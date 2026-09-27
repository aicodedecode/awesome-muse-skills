---
name: figma-plugin-api-rules/prototyping
description: Read when writing prototype links — setReactionsAsync, overlays, overlay position and backdrop
---

# prototyping — use_figma rules

### overlay-position-is-read-only-set-it-by-hand
**Principle:** A frame's `overlayPositionType` is read-only in the Plugin API: assigning it throws. The link that opens the overlay can be written — `setReactionsAsync` with `navigation: 'OVERLAY'` and `destinationId` set to the overlay frame — but where the overlay appears is set only by hand in the Prototype panel. `overlayBackground` and `overlayBackgroundInteraction` sit next to it in the same panel; keep them out of a write batch too until a separate call has proved they take a value.
**Symptom:** `TypeError: node.overlayPositionType: read-only property on FRAME node`. The throw rolls back the whole call, so the reactions written earlier in the same script are gone as well.
**Pattern:** write the reactions, leave the overlay settings at their defaults, and name the manual step in the hand-off: which frame, which position, which backdrop.
```js
await cell.setReactionsAsync([{
  trigger: { type: 'ON_CLICK' },
  actions: [{ type: 'NODE', destinationId: overlay.id, navigation: 'OVERLAY', transition: null, preserveScrollPosition: false }],
}]);
// ❌ overlay.overlayPositionType = 'MANUAL'; // throws: read-only
```
