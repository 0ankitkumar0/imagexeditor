// ═══════════════════════════════════════════════════════════════════
// PRINTABLE AREA CONFIG — Edit these values to adjust size & position
// Percentage values are relative to the shirt container (aspect-3/4).
// canvasWidth / canvasHeight are the internal Fabric canvas resolution
// in pixels (higher = better export quality). The canvas auto-scales
// visually to fit the container on any screen size.
// ═══════════════════════════════════════════════════════════════════

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

export const PRINTABLE_AREAS: Record<string, PrintableArea> = {
  'front':         { width: '44%',   height: '44.98%', top: '29.99%', left: '27%',   canvasWidth: 220, canvasHeight: 300 },
  'back':          { width: '42%',   height: '52.47%', top: '22.49%', left: '28.6%', canvasWidth: 210, canvasHeight: 350 },
  'left-sleeve':   { width: '28%',   height: '26.99%', top: '42.73%', left: '40%',   canvasWidth: 140, canvasHeight: 180 },
  'right-sleeve':  { width: '27.6%', height: '26.99%', top: '42.73%', left: '36.6%', canvasWidth: 138, canvasHeight: 180 },
};
