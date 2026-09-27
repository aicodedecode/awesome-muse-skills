---
name: figma-plugin-api-rules/figjam
description: Read when working in a FigJam board (/board/) — pasting images, stale reads
---

# figjam — use_figma rules

### use-figma-stale-reads-after-mutation
_Core: full text — `../SKILL.md`. Applies to FigJam boards exactly as to design files._

### figjam-paste-vs-upload-image-style
**Principle:** In FigJam a manual image paste (Cmd+V) creates a RECTANGLE with a card style (fills [SOLID white, IMAGE CROP], cornerRadius 4, a white 8 px stroke, three DROP_SHADOWs), while an agent upload via `upload_assets` + createFrame is a bare FRAME with one IMAGE FILL and no style; for agent images to look like manual cards the style must be applied by hand.
**Symptom:** agent images look "floating" without a frame and shadow next to manual cards.
```js
const f = await figma.getNodeByIdAsync(id);
f.cornerRadius = 4;
f.strokes = [{type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:1,g:1,b:1}}];
f.strokeWeight = 8;
f.strokeAlign = 'OUTSIDE';
f.effects = [
  {type:'DROP_SHADOW', visible:true, radius:6, color:{r:0,g:0,b:0,a:0.10}, offset:{x:0,y:2}, spread:0, blendMode:'NORMAL', showShadowBehindNode:true},
  {type:'DROP_SHADOW', visible:true, radius:2, color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:0}, spread:0, blendMode:'NORMAL', showShadowBehindNode:true},
  {type:'DROP_SHADOW', visible:true, radius:0, color:{r:0,g:0,b:0,a:0.20}, offset:{x:0,y:0}, spread:1, blendMode:'NORMAL', showShadowBehindNode:true},
];
```

## See also
- Uploading images via `upload_assets` (the asynchronous CROP race overwrites FILL; the render limit is ≈4096 px on the long side) — in `mcp-and-environment.md`: `upload-assets-async-crop-race`, `upload-assets-4096px-render-limit`. Mandatory when placing images on a board.
