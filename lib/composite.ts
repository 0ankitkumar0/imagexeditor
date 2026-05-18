import { Canvas as FabricCanvas } from 'fabric';
import { WORKSPACE_SIZE, getPrintableAreaPixels, PSD_LAYERS } from '../app/customize/config';
import type { ShirtView, ProductType } from '../app/customize/config';

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
 * Composites PSD layers into a single high-resolution PNG data-URL for the 3D texture.
 * Strictly follows the productschema.psd layer hierarchy and naming spec.
 */
export async function compositeViewTexture(
  view: ShirtView,
  fabricCanvas: FabricCanvas,
  shirtColor: string,
  includeBackground: boolean = true,
  productType: ProductType = 'tshirt'
): Promise<string> {
  const offscreen = document.createElement('canvas');
  offscreen.width = WORKSPACE_SIZE;
  offscreen.height = WORKSPACE_SIZE;
  const ctx = offscreen.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // ── LAYER: [canvas colour] (Bottom) ──────────────────────────
  // Rule: Dynamic shirt color controls this layer.
  if (includeBackground) {
    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, WORKSPACE_SIZE, WORKSPACE_SIZE);
  }

  // ── LAYER: [elements that user upload] (Middle) ─────────────
  // Rule: All editable user graphics render strictly inside this layer.
  const fabricDataUrl = fabricCanvas.toDataURL({ multiplier: 1, format: 'png' });
  const fabricImg = await loadImage(fabricDataUrl);
  const { dx, dy, dw, dh } = getPrintableAreaPixels(productType, view);
  ctx.drawImage(fabricImg, dx, dy, dw, dh);

  // ── LAYER: [product image] (Top) ─────────────────────────────
  // Rule: MUST NOT be included in the exported texture used on 3D model.
  // Thus, we strictly omit drawing SHIRT_MASKS or mockup silhouettes here.

  return offscreen.toDataURL('image/png');
}
