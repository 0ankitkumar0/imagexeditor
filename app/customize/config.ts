// ═══════════════════════════════════════════════════════════════════
// WORKSPACE CONFIG — T-shirt customization canvas
// The workspace is 1456 × 1456 pixels with the background color
// representing the T-shirt color. The mask image (PNG with shading)
// sits on top as a non-selectable layer.
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// PSD LAYER CONFIGURATION
// These names match the exact layers in the productschema.psd
// ═══════════════════════════════════════════════════════════════════
export const PSD_LAYERS = {
  PRODUCT_IMAGE: "product image",                 // Top (mockup only)
  USER_ELEMENTS: "elements that user upload",    // Middle (editable)
  CANVAS_COLOUR: "canvas colour",                // Bottom (dynamic color)
} as const;

export interface PrintableArea {
  /** Percentage of container width  (e.g. "44%") */
  width: string;
  /** Percentage of container height */
  height: string;
  /** Percentage offset from top */
  top: string;
  /** Percentage offset from left */
  left: string;
  /** Internal Fabric canvas width in px */
  canvasWidth: number;
  /** Internal Fabric canvas height in px */
  canvasHeight: number;
}

export interface PrintableAreaPixels {
  dx: number;   // x offset in the 1456×1456 workspace
  dy: number;   // y offset
  dw: number;   // width in pixels
  dh: number;   // height in pixels
}

export type ProductType = "tshirt" | "hoodie";
export type ShirtView = "front" | "back" | "left-sleeve" | "right-sleeve";

// Main T-shirt workspace dimensions
export const WORKSPACE_SIZE = 1456;

// Mask images for each view
export const SHIRT_MASKS = {
  'front': '/images/shirt-front.png',
  'back': '/images/shirt-back.png',
  'left-sleeve': '/images/shirt-left-sleeve.png',
  'right-sleeve': '/images/shirt-right-sleeve.png',
} as const;

export const PRODUCT_PRINTABLE_PIXELS: Record<ProductType, Record<ShirtView, PrintableAreaPixels>> = {
  tshirt: {
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
  },
  hoodie: {
    front: {
      dx: Math.round(0.285 * WORKSPACE_SIZE),
      dy: Math.round(0.285 * WORKSPACE_SIZE),
      dw: Math.round(0.44 * WORKSPACE_SIZE),
      dh: Math.round(0.32 * WORKSPACE_SIZE),
    },
    back: {
      dx: Math.round(0.29 * WORKSPACE_SIZE),
      dy: Math.round(0.29 * WORKSPACE_SIZE),
      dw: Math.round(0.415 * WORKSPACE_SIZE),
      dh: Math.round(0.47 * WORKSPACE_SIZE),
    },
    'left-sleeve': {
      dx: Math.round(0.41 * WORKSPACE_SIZE),
      dy: Math.round(0.38 * WORKSPACE_SIZE),
      dw: Math.round(0.20 * WORKSPACE_SIZE),
      dh: Math.round(0.32 * WORKSPACE_SIZE),
    },
    'right-sleeve': {
      dx: Math.round(0.42 * WORKSPACE_SIZE),
      dy: Math.round(0.38 * WORKSPACE_SIZE),
      dw: Math.round(0.15 * WORKSPACE_SIZE),
      dh: Math.round(0.29 * WORKSPACE_SIZE),
    },
  },
};

export function getPrintableAreaPixels(productType: ProductType, view: ShirtView): PrintableAreaPixels {
  return PRODUCT_PRINTABLE_PIXELS[productType][view];
}

const PRODUCT_VIEW_IMAGE_KEYS: Record<ProductType, Record<ShirtView, string>> = {
  tshirt: {
    front: "tshirt-f",
    back: "tshirt-b",
    "left-sleeve": "tshirt-l",
    "right-sleeve": "tshirt-r",
  },
  hoodie: {
    front: "hoodie-front",
    back: "hoodie-back",
    "left-sleeve": "hoodie-left",
    "right-sleeve": "hoodie-right",
  },
};

export function getProductViewImagePath(
  productType: ProductType,
  view: ShirtView
): string {
  const key = PRODUCT_VIEW_IMAGE_KEYS[productType][view];
  return `/images/${productType}/${key}.png`;
}

// ═══════════════════════════════════════════════════════════════════
// PRINTABLE AREA CONFIGURATION — Adjust these values to control
// the size and position of each T-shirt printable area
// ═══════════════════════════════════════════════════════════════════

// TSHIRT printable areas
const TSHIRT_FRONT_AREA = {
  width: '44%',       // Width relative to container (%)
  height: '44.98%',   // Height relative to container (%)
  top: '29.99%',      // Top offset relative to container (%)
  left: '28.5%',        // Left offset relative to container (%)
  canvasWidth: 220,   // Fabric canvas pixel width
  canvasHeight: 300,  // Fabric canvas pixel height
};

const TSHIRT_BACK_AREA = {
  width: '42%',
  height: '52.47%',
  top: '22.49%',
  left: '28.6%',
  canvasWidth: 210,
  canvasHeight: 350,
};

const TSHIRT_LEFT_SLEEVE_AREA = {
  width: '28%',
  height: '26.99%',
  top: '42.73%',
  left: '40%',
  canvasWidth: 140,
  canvasHeight: 180,
};

const TSHIRT_RIGHT_SLEEVE_AREA = {
  width: '27.6%',
  height: '26.99%',
  top: '42.73%',
  left: '36.6%',
  canvasWidth: 138,
  canvasHeight: 180,
};

// HOODIE printable areas
// Adjust these separately from tshirt values as needed.
const HOODIE_FRONT_AREA = {
  width: '44%',
  height: '32%',
  top: '28.5%',
  left: '28.5%',
  canvasWidth: 220,
  canvasHeight: 213,
};

const HOODIE_BACK_AREA = {
  width: '41.5%',
  height: '47%',
  top: '29%',
  left: '29%',
  canvasWidth: 208,
  canvasHeight: 313,
};

const HOODIE_LEFT_SLEEVE_AREA = {
  width: '20%',
  height: '32%',
  top: '38%',
  left: '41%',
  canvasWidth: 100,
  canvasHeight: 213,
};

const HOODIE_RIGHT_SLEEVE_AREA = {
  width: '15%',
  height: '29%',
  top: '38%',
  left: '42%',
  canvasWidth: 75,
  canvasHeight: 193,
};

export const PRINTABLE_AREAS_BY_PRODUCT: Record<
  ProductType,
  Record<ShirtView, PrintableArea>
> = {
  tshirt: {
    front: TSHIRT_FRONT_AREA,
    back: TSHIRT_BACK_AREA,
    "left-sleeve": TSHIRT_LEFT_SLEEVE_AREA,
    "right-sleeve": TSHIRT_RIGHT_SLEEVE_AREA,
  },
  hoodie: {
    front: HOODIE_FRONT_AREA,
    back: HOODIE_BACK_AREA,
    "left-sleeve": HOODIE_LEFT_SLEEVE_AREA,
    "right-sleeve": HOODIE_RIGHT_SLEEVE_AREA,
  },
};

export function getPrintableAreasByProduct(
  productType: ProductType
): Record<ShirtView, PrintableArea> {
  return PRINTABLE_AREAS_BY_PRODUCT[productType];
}
