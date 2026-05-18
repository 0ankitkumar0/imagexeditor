import { useRef, useState } from "react";
import {
  Trash2,
  Upload,
  Copy,
  ArrowUp,
  ArrowDown,
  MousePointer2,
  GripVertical,
  Sparkles,
} from "lucide-react";
import { Canvas, Object as FabricObject, IText } from "fabric";
import { FontPicker } from "./FontPicker";
import { AIPanel } from "./AIPanel";

interface ToolDetailsPanelProps {
  activeTool: string;
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  // Text tool
  addText: () => void;
  canvasText: string;
  setCanvasText: (text: string) => void;
  fontFamily: string;
  changeFont: (font: string) => void;
  // Colors tool
  shirtColor: string;
  setShirtColor: (color: string) => void;
  // Upload tool
  addImage: (file: File) => void;
  // Select tool
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  removeBackground: () => void;
  bgRemovalStatus: string | null;
  // Mobile
  mobile?: boolean;
}

export function ToolDetailsPanel({
  activeTool,
  canvas,
  selectedObject,
  addText,
  canvasText,
  setCanvasText,
  fontFamily,
  changeFont,
  shirtColor,
  setShirtColor,
  addImage,
  deleteSelected,
  duplicateSelected,
  bringForward,
  sendBackward,
  removeBackground,
  bgRemovalStatus,
  mobile,
}: ToolDetailsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isRemovingBg = !!bgRemovalStatus;
  return (
    <div className={mobile ? "" : "h-full w-72 bg-card border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0 transition-colors"}>
      {!mobile && (
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-text-primary capitalize">{activeTool}</h2>
          <p className="text-xs text-text-secondary mt-1">
            Add and manage your {activeTool}.
          </p>
        </div>
      )}
      <div className={mobile ? "p-4" : "p-5 flex-1 overflow-y-auto"}>
        {/* SELECT TOOL PANEL */}
        {activeTool === "select" && (
          <div className="space-y-4">
            {selectedObject ? (
              <>
                {/* Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-text-primary">Actions</h3>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={duplicateSelected}
                        className="flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 rounded-md border border-border bg-card hover:bg-surface text-xs md:text-sm text-text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                      <button
                        onClick={deleteSelected}
                        className="flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 rounded-md border border-red-200/50 bg-card hover:bg-red-500/10 text-xs md:text-sm text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                    
                    {/* NEW: Background Removal Button */}
                    {selectedObject.type === "image" && (
                      <button
                        onClick={removeBackground}
                        disabled={isRemovingBg}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs md:text-sm text-primary font-semibold transition-all ${
                          isRemovingBg ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isRemovingBg ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            {bgRemovalStatus}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            AI Remove Background
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Layer Order */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-text-primary">Layer Order</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={bringForward}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 rounded-md border border-border bg-card hover:bg-surface text-xs md:text-sm text-text-primary transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" /> Forward
                    </button>
                    <button
                      onClick={sendBackward}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 rounded-md border border-border bg-card hover:bg-surface text-xs md:text-sm text-text-primary transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" /> Backward
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center mt-6 md:mt-10 space-y-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface flex items-center justify-center">
                  <MousePointer2 className="w-4 h-4 md:w-5 md:h-5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">No element selected</p>
                  <p className="text-[10px] md:text-xs text-text-secondary mt-1">
                    Click on an object on the canvas to select and edit it.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TEXT TOOL PANEL */}
        {activeTool === "text" && (
          <div className="space-y-4">
            <button
              onClick={addText}
              className="w-full bg-surface hover:opacity-80 text-text-primary py-2.5 md:py-3 rounded-md font-bold text-lg md:text-xl transition-colors"
            >
              Add a heading
            </button>
            <div className="pt-4 border-t border-border">
              <label className="text-[10px] md:text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider">
                Font Family
              </label>
              <FontPicker value={fontFamily} onChange={changeFont} />
            </div>
          </div>
        )}

        {/* UPLOAD TOOL PANEL */}
        {activeTool === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:border-text-secondary hover:bg-surface transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) addImage(file);
              }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface flex items-center justify-center">
                <Upload className="w-4 h-4 md:w-5 md:h-5 text-text-secondary" />
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm font-medium text-text-primary">Click to upload</p>
                <p className="text-[10px] md:text-xs text-text-secondary mt-1">or drag & drop here</p>
              </div>
              <p className="text-[9px] md:text-[10px] text-text-secondary uppercase tracking-wider">PNG, JPG, SVG, WEBP</p>
            </div>
            <p className="text-[10px] md:text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2 flex items-center gap-1.5">
              <span className="font-semibold">Note:</span> PNG recommended for transparency.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addImage(file);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {/* COLORS TOOL PANEL */}
        {activeTool === "colors" && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="text-[10px] md:text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider">
                Base T-Shirt Color
              </label>
              <div className="flex gap-2 md:gap-3 flex-wrap mt-2">
                {[
                  "#ffffff",
                  "#09090b",
                  "#ef4444",
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#8b5cf6",
                  "#ec4899",
                  "#64748b",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => setShirtColor(color)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                      shirtColor === color
                        ? "border-primary scale-110"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI TOOL PANEL */}
        {activeTool === "ai" && <AIPanel addImage={addImage} />}

        {/* LAYERS TOOL PANEL */}
        {activeTool === "layers" && (
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-text-secondary uppercase tracking-wider font-bold mb-2">Drag to reorder</p>
            {canvas &&
              [...canvas.getObjects()].reverse().map((obj, displayIdx, arr) => {
                // displayIdx 0 = top layer, last = bottom layer
                // Fabric index: higher index = on top
                const fabricIdx = arr.length - 1 - displayIdx;
                return (
                  <div
                    key={displayIdx}
                    draggable
                    onDragStart={() => setDragIndex(displayIdx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(displayIdx);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={() => {
                      if (dragIndex !== null && dragIndex !== displayIdx && canvas) {
                        const objects = canvas.getObjects();
                        const fromFabricIdx = arr.length - 1 - dragIndex;
                        const toFabricIdx = arr.length - 1 - displayIdx;
                        const movedObj = objects[fromFabricIdx];
                        if (movedObj) {
                          // Move object to target fabric index
                          canvas.moveObjectTo(movedObj, toFabricIdx);
                          canvas.requestRenderAll();
                        }
                      }
                      setDragIndex(null);
                      setDragOverIndex(null);
                      forceUpdate((n) => n + 1);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={`flex items-center gap-2 p-2 md:p-3 rounded-md border cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIndex === displayIdx && dragIndex !== displayIdx
                        ? "border-accent bg-accent/10"
                        : selectedObject === obj
                        ? "border-primary bg-surface"
                        : "border-border hover:border-text-secondary bg-card"
                    } ${dragIndex === displayIdx ? "opacity-40" : ""}`}
                    onClick={() => {
                      canvas.setActiveObject(obj);
                      canvas.requestRenderAll();
                    }}
                  >
                    <GripVertical className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-secondary shrink-0" />
                    <span className="text-[9px] md:text-[10px] font-bold text-text-secondary bg-surface rounded px-1.5 py-0.5 shrink-0">
                      {displayIdx + 1}
                    </span>
                    <span className="text-xs md:text-sm font-medium flex-1 truncate text-text-primary">
                      {obj.type === "i-text"
                        ? (obj as IText).text
                        : obj.type === "image"
                        ? "Image"
                        : "Object"}
                    </span>
                    <Trash2
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-secondary hover:text-red-500 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        canvas.remove(obj);
                        canvas.discardActiveObject();
                        canvas.requestRenderAll();
                        forceUpdate((n) => n + 1);
                      }}
                    />
                  </div>
                );
              })}
          </div>
        )}

        {/* Default for empty panels */}
        {activeTool !== "select" &&
          activeTool !== "text" &&
          activeTool !== "upload" &&
          activeTool !== "colors" &&
          activeTool !== "layers" &&
          activeTool !== "ai" && (
            <div className="text-center text-text-secondary text-sm mt-10">
              Options for {activeTool} will appear here.
            </div>
          )}
      </div>
    </div>
  );
}
