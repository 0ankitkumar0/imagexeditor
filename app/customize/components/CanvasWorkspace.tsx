import { Undo2, Redo2, RotateCcw, Box } from "lucide-react";
import { Canvas } from "fabric";
import dynamic from "next/dynamic";
import { EditorCanvas } from "./EditorCanvas";
import { ActionButton } from "./ui/ActionButton";
import { PRINTABLE_AREAS } from "../config";

const ThreeScene = dynamic(
  () => import("../../preview/components/ThreeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
        <Box className="w-8 h-8 animate-pulse" />
      </div>
    ),
  }
);

interface CanvasWorkspaceProps {
  viewMode: "2D" | "3D";
  shirtView: string;
  setShirtView: (view: string) => void;
  handleViewToggle: (mode: "2D" | "3D") => void;
  shirtColor: string;
  designTextures: Record<string, string>;
  canvas: Canvas | null;
  onReset: () => void;
  handleFrontCanvas: (c: Canvas) => void;
  handleBackCanvas: (c: Canvas) => void;
  handleLeftCanvas: (c: Canvas) => void;
  handleRightCanvas: (c: Canvas) => void;
}

export function CanvasWorkspace({
  viewMode,
  shirtView,
  setShirtView,
  handleViewToggle,
  shirtColor,
  designTextures,
  canvas,
  onReset,
  handleFrontCanvas,
  handleBackCanvas,
  handleLeftCanvas,
  handleRightCanvas,
}: CanvasWorkspaceProps) {
  return (
    <section
      className="flex-1 flex flex-col relative bg-[#f3f4f6] shadow-inner"
      style={{
        backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Controls - Top Left: Shirt View Toggle */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 max-w-[calc(100%-5rem)] md:max-w-none">
        {viewMode === "2D" && (
          <div className="bg-white rounded-full shadow-sm border border-zinc-200 p-1 flex items-center overflow-x-auto no-scrollbar">
            {["Front", "Back", "Left Sleeve", "Right Sleeve"].map((side) => {
              const val = side.toLowerCase().replace(" ", "-");
              return (
                <button
                  key={side}
                  onClick={() => setShirtView(val)}
                  className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                    shirtView === val
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {side}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Controls - Top Right: 2D/3D Toggle */}
      <div className="absolute top-3 right-3 md:top-6 md:right-6 z-10">
        <div className="bg-white rounded-full shadow-sm border border-zinc-200 p-1 flex items-center w-max">
          <button
            onClick={() => handleViewToggle("2D")}
            className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${
              viewMode === "2D"
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            2D
          </button>
          <button
            onClick={() => handleViewToggle("3D")}
            className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${
              viewMode === "3D"
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            3D
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-3 md:p-8 relative">
        {/* 3D Preview */}
        {viewMode === "3D" && (
          <div
            id="threejs-container"
            className="w-full max-w-125 aspect-3/4 bg-zinc-200/50 rounded-2xl flex items-center justify-center border border-zinc-200 shadow-inner relative overflow-hidden"
          >
            <ThreeScene
              designTextures={designTextures}
              shirtColor={shirtColor}
            />
          </div>
        )}

        {/* 2D Editor — always mounted, hidden when in 3D mode to preserve canvas state */}
        <div
          className="relative w-full max-w-125 aspect-3/4 flex items-center justify-center transition-all duration-300"
          style={{ display: viewMode === "2D" ? "flex" : "none" }}
        >
            {/* Dynamic T-Shirt Background based on shirtView */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
              <img
                src={`/images/${
                  shirtView === "front"
                    ? "shirt-front.png"
                    : shirtView === "back"
                    ? "shirt-back.png"
                    : shirtView === "left-sleeve"
                    ? "shirt-left-sleeve.png"
                    : "shirt-right-sleeve.png"
                }`}
                alt={`${shirtView} view`}
                className="max-w-full max-h-full object-contain drop-shadow-md transition-opacity duration-300"
                style={{ backgroundColor: shirtColor }}
              />
            </div>

            {/* Fabric.js Canvas Container & Printable Area */}
            {(() => {
              const area =
                PRINTABLE_AREAS[shirtView] ?? PRINTABLE_AREAS["front"];
              return (
                <div
                  id="fabric-canvas-container"
                  className="absolute border-2 border-dashed border-zinc-400/50 rounded-sm flex items-center justify-center group hover:border-blue-400 transition-all duration-200 z-10"
                  style={{
                    width: area.width,
                    height: area.height,
                    top: area.top,
                    left: area.left,
                  }}
                >
                  <span className="absolute -top-5 md:-top-6 text-[8px] md:text-[10px] font-bold text-zinc-400 tracking-wider uppercase bg-[#f3f4f6] px-1.5 md:px-2 rounded-full pointer-events-none">
                    Printable Area
                  </span>

                  {/* Each view has its own Fabric canvas; only the active one is visible */}
                  <div
                    className="w-full h-full relative overflow-visible"
                    style={{
                      display: shirtView === "front" ? "block" : "none",
                    }}
                  >
                    <EditorCanvas
                      onCanvasReady={handleFrontCanvas}
                      width={PRINTABLE_AREAS["front"].canvasWidth}
                      height={PRINTABLE_AREAS["front"].canvasHeight}
                    />
                  </div>
                  <div
                    className="w-full h-full relative overflow-visible"
                    style={{
                      display: shirtView === "back" ? "block" : "none",
                    }}
                  >
                    <EditorCanvas
                      onCanvasReady={handleBackCanvas}
                      width={PRINTABLE_AREAS["back"].canvasWidth}
                      height={PRINTABLE_AREAS["back"].canvasHeight}
                    />
                  </div>
                  <div
                    className="w-full h-full relative overflow-visible"
                    style={{
                      display:
                        shirtView === "left-sleeve" ? "block" : "none",
                    }}
                  >
                    <EditorCanvas
                      onCanvasReady={handleLeftCanvas}
                      width={PRINTABLE_AREAS["left-sleeve"].canvasWidth}
                      height={PRINTABLE_AREAS["left-sleeve"].canvasHeight}
                    />
                  </div>
                  <div
                    className="w-full h-full relative overflow-visible"
                    style={{
                      display:
                        shirtView === "right-sleeve" ? "block" : "none",
                    }}
                  >
                    <EditorCanvas
                      onCanvasReady={handleRightCanvas}
                      width={PRINTABLE_AREAS["right-sleeve"].canvasWidth}
                      height={PRINTABLE_AREAS["right-sleeve"].canvasHeight}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-zinc-200 px-3 md:px-4 py-2 md:py-3 flex items-center gap-1 z-10">
        <ActionButton icon={Undo2} title="Undo" onClick={() => {}} />
        <ActionButton icon={Redo2} title="Redo" onClick={() => {}} />
        <div className="w-px h-4 bg-zinc-200 mx-2"></div>
        <ActionButton
          icon={RotateCcw}
          title="Reset Canvas"
          onClick={onReset}
        />
      </div>
    </section>
  );
}
