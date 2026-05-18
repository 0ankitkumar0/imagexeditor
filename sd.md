# 🎨 PSD-Based T-Shirt Customization — Implementation Plan

> **Purpose:** This document is a complete, self-contained spec for an AI implementor to integrate the `productschema.psd` layer structure into the existing Next.js t-shirt customizer (`imagexeditor`). After implementing this plan, user-uploaded elements will be composited on the correct PSD layer and the final flattened image will be used as the UV texture for the Three.js 3D model.

---

## 1. Context — Existing System Overview

| Item | Detail |
|------|--------|
| Framework | Next.js 16 (App Router) + TypeScript |
| 2D Editor | Fabric.js v7 (canvas-based drawing/editing) |
| 3D Viewer | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Styling | Tailwind CSS v4 |
| Key entry point | `app/customize/page.tsx` |
| Editor state hook | `app/customize/hooks/useCustomizeEditor.ts` |
| Canvas component | `app/customize/components/CanvasWorkspace.tsx` |
| 3D scene | `app/preview/components/ThreeScene.tsx` |
| 3D model | `public/models/tshirt.glb` |

### How the current system works (end-to-end):
1. User opens `/customize?type=tshirt`.
2. `useCustomizeEditor` initialises one **Fabric.js `Canvas`** per view (front / back / left-sleeve / right-sleeve).
3. User adds text or images via the toolbar; elements are added directly to the Fabric canvas.
4. When the user switches to **3D view**, `captureAllCanvasTextures()` calls `canvas.toDataURL()` for every view → produces PNG data-URLs.
5. Those data-URLs are passed as `designTextures` to `<ThreeScene>`, which applies them as material textures on the GLB model.

### The problem this plan solves:
Currently the Fabric canvas only contains user-added elements — it has **no awareness of the PSD layer structure**. The goal is to make the final exported image faithfully reproduce the three PSD layers:

```
Layer 1 (top)    → "product image"          — the t-shirt PNG (already rendered as <img> behind canvas)
Layer 2 (middle) → "elements that user upload" — Fabric.js user content (already exists on canvas)
Layer 3 (bottom) → "canvas colour"           — the background colour (already stored as shirtColor)
```

The only thing **missing** is the final **compositing step**: merging all three layers into a single PNG that can serve as a proper UV texture.

---

## 2. PSD Layer Mapping

| PSD Layer Name | Role | Current System Equivalent |
|---|---|---|
| `canvas colour` (bottom) | Solid background / shirt colour | `shirtColor` state (`#ffffff` default) |
| `elements that user upload` (middle) | User's custom graphics & text | Fabric.js canvas objects |
| `product image` (top) | T-shirt shading/mask overlay PNG | `SHIRT_MASKS` object in `config.ts` |

> **Key insight:** The mask PNGs in `public/images/shirt-*.png` are already transparent-background shading overlays — they should be rendered **on top** of the user's design to simulate fabric shading. This is Layer 1 in the PSD.

---

## 3. What Needs to Change

### 3.1 Texture Compositing (Critical — must do first)

**File:** `app/customize/hooks/useCustomizeEditor.ts`

Replace `captureAllCanvasTextures()` with a new function `compositeViewTexture(view)` that:

1. Creates an **off-screen `<canvas>`** sized to `WORKSPACE_SIZE × WORKSPACE_SIZE` (1456×1456px, matching the UV map).
2. Draws **Layer 3 — canvas colour**: `ctx.fillStyle = shirtColor; ctx.fillRect(0, 0, 1456, 1456)`.
3. Draws **Layer 2 — elements uploaded by user**: render the Fabric.js canvas via `fabricCanvas.toDataURL()` and `drawImage()` into the correct region on the workspace canvas (see §3.4 for coordinate mapping).
4. Draws **Layer 1 — product image / mask**: load the corresponding mask PNG (`SHIRT_MASKS[view]`) and draw it at full size.
5. Return `offscreenCanvas.toDataURL('image/png')`.

```typescript
// Pseudocode for compositeViewTexture
async function compositeViewTexture(
  view: ShirtView,
  fabricCanvas: Canvas,
  shirtColor: string
): Promise<string> {
  const offscreen = document.createElement('canvas');
  offscreen.width = WORKSPACE_SIZE;   // 1456
  offscreen.height = WORKSPACE_SIZE;  // 1456
  const ctx = offscreen.getContext('2d')!;

  // Layer 3: Background colour
  ctx.fillStyle = shirtColor;
  ctx.fillRect(0, 0, WORKSPACE_SIZE, WORKSPACE_SIZE);

  // Layer 2: User elements from Fabric canvas
  const fabricDataUrl = fabricCanvas.toDataURL({ multiplier: 1, format: 'png' });
  const fabricImg = await loadImage(fabricDataUrl);
  const { dx, dy, dw, dh } = getPrintableAreaPixels(view); // see §3.4
  ctx.drawImage(fabricImg, dx, dy, dw, dh);

  // Layer 1: Product mask overlay
  const maskImg = await loadImage(SHIRT_MASKS[view]);
  ctx.drawImage(maskImg, 0, 0, WORKSPACE_SIZE, WORKSPACE_SIZE);

  return offscreen.toDataURL('image/png');
}
```

### 3.2 Printable Area → UV Pixel Coordinate Mapping

**File:** `app/customize/config.ts`

Add a new exported object `PRINTABLE_AREA_PIXELS` that maps each view to its **absolute pixel position** within the 1456×1456 workspace canvas. These values must be derived from the existing percentage-based `PRINTABLE_AREAS_BY_PRODUCT` values.

```typescript
// Add to config.ts
export interface PrintableAreaPixels {
  dx: number;   // x offset in the 1456×1456 workspace
  dy: number;   // y offset
  dw: number;   // width in pixels
  dh: number;   // height in pixels
}

export const TSHIRT_PRINTABLE_PIXELS: Record<ShirtView, PrintableAreaPixels> = {
  front: {
    dx: Math.round(0.285 * WORKSPACE_SIZE),   // left %
    dy: Math.round(0.2999 * WORKSPACE_SIZE),  // top %
    dw: Math.round(0.44 * WORKSPACE_SIZE),    // width %
    dh: Math.round(0.4498 * WORKSPACE_SIZE),  // height %
  },
  back: {
    dx: Math.round(0.286 * WORKSPACE_SIZE),
    dy: Math.round(0.2249 * WORKSPACE_SIZE),
    dw: Math.round(0.42 * WORKSPACE_SIZE),
    dh: Math.round(0.5247 * WORKSPACE_SIZE),
  },
  'left-sleeve': {
    dx: Math.round(0.40 * WORKSPACE_SIZE),
    dy: Math.round(0.4273 * WORKSPACE_SIZE),
    dw: Math.round(0.28 * WORKSPACE_SIZE),
    dh: Math.round(0.2699 * WORKSPACE_SIZE),
  },
  'right-sleeve': {
    dx: Math.round(0.366 * WORKSPACE_SIZE),
    dy: Math.round(0.4273 * WORKSPACE_SIZE),
    dw: Math.round(0.276 * WORKSPACE_SIZE),
    dh: Math.round(0.2699 * WORKSPACE_SIZE),
  },
};

export function getPrintableAreaPixels(view: ShirtView): PrintableAreaPixels {
  return TSHIRT_PRINTABLE_PIXELS[view];
}
```

### 3.3 Update `captureAllCanvasTextures` in the Hook

**File:** `app/customize/hooks/useCustomizeEditor.ts`

Replace the current `captureAllCanvasTextures` with an async version that calls `compositeViewTexture` for each view:

```typescript
const captureAllCanvasTextures = useCallback(async () => {
  const textures: Record<string, string> = {};
  const allViews: { key: string; ref: ShirtView }[] = [
    { key: 'front', ref: 'front' },
    { key: 'back', ref: 'back' },
    { key: 'leftSleeve', ref: 'left-sleeve' },
    { key: 'rightSleeve', ref: 'right-sleeve' },
  ];
  for (const view of allViews) {
    const c = canvasesRef.current[view.ref];
    if (c) {
      c.discardActiveObject();
      c.requestRenderAll();
      try {
        textures[view.key] = await compositeViewTexture(
          view.ref as ShirtView,
          c,
          shirtColor          // pass current shirt colour
        );
      } catch (err) {
        console.error(`[Texture] Failed to composite ${view.ref}:`, err);
      }
    }
  }
  setDesignTextures(textures);
}, [shirtColor]);
```

> **Note:** Since `shirtColor` is now a dependency, the `useEffect` that watches `shirtColor` should also re-composite textures when in 3D mode.

### 3.4 Helper: `loadImage`

Add a small utility in `lib/utils.ts` or inside the hook file:

```typescript
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```

### 3.5 Real-time Compositing in 3D Mode

In `onCanvasReady` (inside `useCustomizeEditor.ts`), the `updateTextureForPreview` callback currently calls `toDataURL` directly. Update it to call the async `compositeViewTexture` instead:

```typescript
const updateTextureForPreview = async () => {
  if (viewModeRef.current === '3D') {
    await captureAllCanvasTextures();
  }
};
```

Attach this to: `object:added`, `object:removed`, `object:modified`, `text:changed`.

### 3.6 Shirt Colour Change → Re-composite

In `useCustomizeEditor.ts`, add an effect:

```typescript
useEffect(() => {
  if (viewMode === '3D') {
    captureAllCanvasTextures();
  }
}, [shirtColor, viewMode, captureAllCanvasTextures]);
```

---

## 4. Files to Modify (Summary)

| File | What Changes |
|---|---|
| `app/customize/config.ts` | Add `PrintableAreaPixels` interface, `TSHIRT_PRINTABLE_PIXELS` map, `getPrintableAreaPixels()` helper |
| `app/customize/hooks/useCustomizeEditor.ts` | Replace `captureAllCanvasTextures` with async compositing version; add `loadImage` helper; add `shirtColor` effect |
| `lib/utils.ts` *(optional)* | Move `loadImage` helper here if shared |
| `app/customize/components/CanvasWorkspace.tsx` | No structural change needed |
| `app/preview/components/ThreeScene.tsx` | Verify it accepts data-URL textures per view — likely no change needed |

---

## 5. New Files to Create

| File | Purpose |
|---|---|
| `lib/composite.ts` | Standalone `compositeViewTexture()` and `loadImage()` — keeps the hook clean |

### `lib/composite.ts` full spec:

```typescript
import { Canvas as FabricCanvas } from 'fabric';
import { WORKSPACE_SIZE, SHIRT_MASKS, getPrintableAreaPixels } from '../app/customize/config';
import type { ShirtView } from '../app/customize/config';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Composites 3 PSD-equivalent layers into a single PNG data-URL:
 *   Layer 3 (bottom): solid shirtColor fill
 *   Layer 2 (middle): user-uploaded elements from Fabric canvas
 *   Layer 1 (top):    product image / shading mask PNG
 */
export async function compositeViewTexture(
  view: ShirtView,
  fabricCanvas: FabricCanvas,
  shirtColor: string
): Promise<string> {
  const offscreen = document.createElement('canvas');
  offscreen.width = WORKSPACE_SIZE;
  offscreen.height = WORKSPACE_SIZE;
  const ctx = offscreen.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // ── Layer 3: canvas colour ──────────────────────────────────────
  ctx.fillStyle = shirtColor;
  ctx.fillRect(0, 0, WORKSPACE_SIZE, WORKSPACE_SIZE);

  // ── Layer 2: elements that user upload ─────────────────────────
  const fabricDataUrl = fabricCanvas.toDataURL({ multiplier: 1, format: 'png' });
  const fabricImg = await loadImage(fabricDataUrl);
  const { dx, dy, dw, dh } = getPrintableAreaPixels(view);
  ctx.drawImage(fabricImg, dx, dy, dw, dh);

  // ── Layer 1: product image (shading mask) ──────────────────────
  const maskImg = await loadImage(SHIRT_MASKS[view]);
  ctx.drawImage(maskImg, 0, 0, WORKSPACE_SIZE, WORKSPACE_SIZE);

  return offscreen.toDataURL('image/png');
}
```

---

## 6. ThreeScene Texture Application (Verify / No Change Expected)

The existing `ThreeScene` component receives:
```typescript
designTextures: Record<string, string>  // { front, back, leftSleeve, rightSleeve }
```
Each string is a PNG data-URL. It creates a `THREE.TextureLoader` or `useTexture` to apply it to the GLB mesh material.

**After this plan is implemented**, those data-URLs will now contain the full 1456×1456 composited image (colour + user elements + mask overlay) instead of just the raw Fabric canvas content. No changes needed to `ThreeScene.tsx` unless the UV mapping needs correction.

> **UV Map:** The file `public/models/uv-template.png` exists — use it to verify that the printable area pixel coordinates in §3.4 correctly land within the t-shirt UV region. If not, adjust `TSHIRT_PRINTABLE_PIXELS` values.

---

## 7. Implementation Order (Step-by-Step for AI)

```
Step 1  →  Read and understand this document fully
Step 2  →  Create lib/composite.ts with compositeViewTexture + loadImage
Step 3  →  Update app/customize/config.ts:
             - Add PrintableAreaPixels interface
             - Add TSHIRT_PRINTABLE_PIXELS constant
             - Add getPrintableAreaPixels() function
             - Export SHIRT_MASKS (move from local to exported if not already)
Step 4  →  Update app/customize/hooks/useCustomizeEditor.ts:
             - Import compositeViewTexture from lib/composite
             - Replace captureAllCanvasTextures with async compositing version
             - Update updateTextureForPreview callback to use async compositing
             - Add shirtColor dependency effect
Step 5  →  Verify app/preview/components/ThreeScene.tsx accepts data-URLs (read file)
Step 6  →  Test:
             a. Open /customize
             b. Set a shirt colour (non-white)
             c. Upload an image element
             d. Switch to 3D view
             e. The 3D model should show: colour fill + uploaded element + shading mask
Step 7  →  If 3D texture looks misaligned, adjust pixel offsets in TSHIRT_PRINTABLE_PIXELS
```

---

## 8. Edge Cases & Gotchas

| Issue | Solution |
|---|---|
| `crossOrigin` CORS error for mask PNGs | Serve mask PNGs from `/public` (already done) — use `img.crossOrigin = 'anonymous'` in `loadImage` |
| Fabric canvas `toDataURL` CORS taint | All user-uploaded images are loaded via FileReader as data-URLs — no CORS issue |
| `captureAllCanvasTextures` was synchronous | Now async — update all call sites with `await` |
| `shirtColor` not in hook's closure for compositing | Pass as parameter to `compositeViewTexture` to avoid stale closures |
| Hoodie product type | `SHIRT_MASKS` only has tshirt views — add hoodie-specific masks or skip compositing for hoodie |
| `WORKSPACE_SIZE = 1456` but mask PNGs may be different resolution | `drawImage` will auto-scale — no issue |
| Real-time 3D update performance | Debounce `updateTextureForPreview` by ~300ms to avoid excessive re-compositing on every keystroke |

---

## 9. Debounce Pattern for Real-Time Updates

To avoid performance issues when user types text or drags elements in 3D mode:

```typescript
// In useCustomizeEditor.ts
const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const debouncedCaptureTextures = useCallback(() => {
  if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  debounceTimerRef.current = setTimeout(() => {
    captureAllCanvasTextures();
  }, 300);
}, [captureAllCanvasTextures]);

// Use debouncedCaptureTextures instead of captureAllCanvasTextures
// in the updateTextureForPreview callback
```

---

## 10. Expected Final Data Flow

```
User uploads image
       ↓
FileReader → dataURL
       ↓
FabricImage.fromURL() → added to Fabric canvas (Layer 2)
       ↓
User switches to 3D view  OR  modifies canvas while in 3D
       ↓
compositeViewTexture(view, fabricCanvas, shirtColor)
  ├─ offscreen canvas 1456×1456
  ├─ fillRect(shirtColor)           ← Layer 3: canvas colour
  ├─ drawImage(fabricCanvas export, dx, dy, dw, dh)  ← Layer 2: user elements
  └─ drawImage(maskPNG, 0, 0, 1456, 1456)           ← Layer 1: product image
       ↓
PNG data-URL → designTextures[view]
       ↓
ThreeScene → THREE.Texture applied to GLB mesh material
       ↓
3D model shows composited result ✓
```

---

*Last updated: 2026-05-13 | Conversation: bb7ab1c3-f481-4cb4-9088-66189aee76aa*
