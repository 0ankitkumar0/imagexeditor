"use client";

import { Undo2, Redo2, RotateCcw, Box, Plus, Minus } from "lucide-react";
import { Canvas } from "fabric";
import dynamic from "next/dynamic";
import { EditorCanvas } from "./EditorCanvas";
import {
  getPrintableAreasByProduct,
  getProductViewImagePath,
  type ProductType,
  type ShirtView,
} from "../config";

const ThreeScene = dynamic(
  () => import("../../preview/components/ThreeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted text-text-secondary">
        <Box className="w-8 h-8 animate-pulse" />
      </div>
    ),
  }
);

interface CanvasWorkspaceProps {
  productType: ProductType;
  viewMode: "2D" | "3D";
  shirtView: string;
  setShirtView: (view: string) => void;
  handleViewToggle: (mode: "2D" | "3D") => void;
  shirtColor: string;
  designTextures: Record<string, string>;
  canvas: Canvas | null;
  onReset: () => void;
  onCanvasReady: (view: string) => (canvas: Canvas) => void;
  handleFrontCanvas: (c: Canvas) => void;
  handleBackCanvas: (c: Canvas) => void;
  handleLeftCanvas: (c: Canvas) => void;
  handleRightCanvas: (c: Canvas) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const VIEWS = [
  { label: "Front", short: "Front", val: "front" },
  { label: "Back", short: "Back", val: "back" },
  { label: "L. Sleeve", short: "L·Slv", val: "left-sleeve" },
  { label: "R. Sleeve", short: "R·Slv", val: "right-sleeve" },
];

/* ─── Design tokens ────────────────────────────────────────────────────
   Minimal monochrome: card pill, active fill, zero colour
──────────────────────────────────────────────────────────────────────── */
const PILL_BASE =
  "bg-card border border-border " +
  "shadow-[0_2px_12px_rgba(0,0,0,0.08)]";

// Active segment: solid primary fill, white text
const ACTIVE_SEG =
  "bg-primary text-white shadow-[0_1px_4px_rgba(0,0,0,0.18)]";

// Inactive: muted text, surface hover bg with soft shadow
const INACTIVE_SEG =
  "text-text-secondary hover:text-text-primary hover:bg-surface hover:shadow-[0_1px_6px_rgba(0,0,0,0.08)]";

/** Minimal floating pill shell */
function RoyalPill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-full p-[3px] flex items-center gap-[2px] ${PILL_BASE} ${className}`}>
      {children}
    </div>
  );
}

export function CanvasWorkspace({
  productType,
  viewMode,
  shirtView,
  setShirtView,
  handleViewToggle,
  shirtColor,
  designTextures,
  canvas,
  onReset,
  onCanvasReady,
  handleFrontCanvas,
  handleBackCanvas,
  handleLeftCanvas,
  handleRightCanvas,
  zoom,
  setZoom,
}: CanvasWorkspaceProps) {
  const activeView: ShirtView =
    shirtView === "back" ||
      shirtView === "left-sleeve" ||
      shirtView === "right-sleeve"
      ? shirtView
      : "front";

  const productImagePath = getProductViewImagePath(productType, activeView);
  const printableAreas = getPrintableAreasByProduct(productType);

  return (
    <section
      className="flex-1 flex flex-col relative bg-surface shadow-inner overflow-hidden transition-colors"
      style={{
        backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          TOP-LEFT · View tab switcher — classic dark pill with gold active
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === "2D" && (
        <div className="absolute top-3 left-3 z-30">
          <RoyalPill className="overflow-x-auto no-scrollbar max-w-[calc(100vw-90px)] md:max-w-none">
            {VIEWS.map(({ label, short, val }) => {
              const isActive = shirtView === val;
              return (
                <button
                  key={val}
                  onClick={() => setShirtView(val)}
                  className={`
                    flex-shrink-0 px-2.5 md:px-3.5 py-[4px] rounded-full
                    text-[9px] md:text-[10px] font-bold tracking-widest uppercase
                    whitespace-nowrap transition-all duration-200
                    ${isActive ? ACTIVE_SEG : INACTIVE_SEG}
                  `}
                >
                  <span className="md:hidden">{short}</span>
                  <span className="hidden md:inline">{label}</span>
                </button>
              );
            })}
          </RoyalPill>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TOP-RIGHT · 2D / 3D toggle — tiny royal pill
      ══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-3 right-3 z-30">
        <RoyalPill>
          {(["2D", "3D"] as const).map((mode) => {
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleViewToggle(mode)}
                className={`
                  px-3 py-[4px] rounded-full
                  text-[9px] font-bold tracking-[0.15em] uppercase
                  transition-all duration-200
                  ${isActive ? ACTIVE_SEG : INACTIVE_SEG}
                `}
              >
                {mode}
              </button>
            );
          })}
        </RoyalPill>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TOP-RIGHT (below 2D/3D) · Zoom — desktop only, same dark theme
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === "2D" && (
        <div className="hidden md:flex absolute top-12 right-3 z-20 flex-col">
          <div className="bg-card border border-border shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-xl flex flex-col items-center overflow-hidden divide-y divide-border transition-colors">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
              title="Zoom In"
              className="px-2.5 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            <div className="px-2 py-0.5 text-[7px] font-black tracking-widest text-text-secondary w-full text-center">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))}
              title="Zoom Out"
              className="px-2.5 py-1.5 text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CANVAS AREA
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden flex items-center justify-center pt-11 pb-12 px-2">

        {/* 3D Preview */}
        {viewMode === "3D" && (
          <div
            id="threejs-container"
            className="w-full h-full max-w-[92vw] sm:max-w-sm md:max-w-2xl rounded-2xl bg-surface flex items-center justify-center border border-border shadow-2xl overflow-hidden transition-colors"
          >
            <ThreeScene 
              designTextures={designTextures} 
              shirtColor={shirtColor} 
              productType={productType}
            />
          </div>
        )}

        {/* 2D Editor */}
        <div
          className="w-full h-full flex items-center justify-center overflow-auto no-scrollbar touch-none"
          style={{ display: viewMode === "2D" ? "flex" : "none" }}
        >
          <div
            className="relative flex items-center justify-center origin-center shrink-0"
            style={{
              width: "500px",
              height: "667px",
              transform: `scale(${zoom})`,
              transition: "transform 0.2s ease-out",
            }}
          >
            {/* T-shirt background */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
              <img
                src={productImagePath}
                alt={`${shirtView} view`}
                className="max-w-full max-h-full object-contain drop-shadow-2xl transition-opacity duration-300"
                style={{ backgroundColor: shirtColor }}
              />
            </div>

            {/* Printable area + Fabric canvases */}
            {(() => {
              const area = printableAreas[activeView] ?? printableAreas.front;
              return (
                <div
                  id="fabric-canvas-container"
                  className="absolute border-2 border-dashed border-primary/30 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors z-10"
                  style={{
                    width: area.width,
                    height: area.height,
                    top: area.top,
                    left: area.left,
                  }}
                >
                  <span className="absolute -top-5 text-[8px] font-black text-primary/70 tracking-widest uppercase bg-card/80 backdrop-blur-sm px-2 rounded-full pointer-events-none transition-colors">
                    Printable Area
                  </span>
                  {[
                    { view: "front", handler: handleFrontCanvas, a: printableAreas.front },
                    { view: "back", handler: handleBackCanvas, a: printableAreas.back },
                    { view: "left-sleeve", handler: handleLeftCanvas, a: printableAreas["left-sleeve"] },
                    { view: "right-sleeve", handler: handleRightCanvas, a: printableAreas["right-sleeve"] },
                  ].map(({ view, handler, a }) => (
                    <div
                      key={view}
                      className="w-full h-full relative overflow-visible"
                      style={{ display: shirtView === view ? "block" : "none" }}
                    >
                      <EditorCanvas onCanvasReady={handler} width={a.canvasWidth} height={a.canvasHeight} />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM-CENTER · Undo / Redo / Reset — same royal dark style
      ══════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <RoyalPill>
          {/* Undo */}
          <button
            title="Undo"
            onClick={() => { }}
            className={`p-[6px] rounded-full transition-colors ${INACTIVE_SEG}`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          {/* Redo */}
          <button
            title="Redo"
            onClick={() => { }}
            className={`p-[6px] rounded-full transition-colors ${INACTIVE_SEG}`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="w-px h-3 bg-border mx-0.5 shrink-0" />

          {/* Reset */}
          <button
            title="Reset Canvas"
            onClick={onReset}
            className={`p-[6px] rounded-full transition-colors ${INACTIVE_SEG}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </RoyalPill>
      </div>
    </section>
  );
}