import { useRef, useState } from "react";
import {
  Trash2,
  Upload,
  Image as ImageIcon,
  Copy,
  ArrowUp,
  ArrowDown,
  MousePointer2,
  Info,
  GripVertical,
} from "lucide-react";
import { Canvas, Object as FabricObject, IText, FabricImage } from "fabric";
import { FontPicker } from "./FontPicker";

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
  mobile,
}: ToolDetailsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  return (
    <div className={mobile ? "" : "w-72 bg-white border-r border-zinc-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0"}>
      {!mobile && (
        <div className="p-5 border-b border-zinc-100">
          <h2 className="font-semibold text-zinc-900 capitalize">{activeTool}</h2>
          <p className="text-xs text-zinc-500 mt-1">
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
                  <h3 className="text-sm font-semibold text-zinc-700">Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={duplicateSelected}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-sm text-zinc-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Duplicate
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-red-200 bg-white hover:bg-red-50 text-sm text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>

                {/* Layer Order */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-700">Layer Order</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={bringForward}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-sm text-zinc-700 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" /> Forward
                    </button>
                    <button
                      onClick={sendBackward}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-sm text-zinc-700 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" /> Backward
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center mt-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                  <MousePointer2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">No element selected</p>
                  <p className="text-xs text-zinc-400 mt-1">
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
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-3 rounded-md font-bold text-xl transition-colors"
            >
              Add a heading
            </button>
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">
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
              className="border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) addImage(file);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700">Click to upload</p>
                <p className="text-xs text-zinc-400 mt-1">or drag & drop here</p>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider">PNG, JPG, SVG, WEBP</p>
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 flex items-center gap-1.5">
              <span className="font-semibold">Note:</span> PNG images recommended for best quality (transparent background).
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
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">
                Base T-Shirt Color
              </label>
              <div className="flex gap-3 flex-wrap mt-2">
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
                    className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                      shirtColor === color
                        ? "border-zinc-900 scale-110"
                        : "border-zinc-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAYERS TOOL PANEL */}
        {activeTool === "layers" && (
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-2">Drag to reorder</p>
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
                    className={`flex items-center gap-2 p-3 rounded-md border cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIndex === displayIdx && dragIndex !== displayIdx
                        ? "border-blue-400 bg-blue-50"
                        : selectedObject === obj
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    } ${dragIndex === displayIdx ? "opacity-40" : ""}`}
                    onClick={() => {
                      canvas.setActiveObject(obj);
                      canvas.requestRenderAll();
                    }}
                  >
                    <GripVertical className="w-4 h-4 text-zinc-300 shrink-0" />
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 rounded px-1.5 py-0.5 shrink-0">
                      {displayIdx + 1}
                    </span>
                    <span className="text-sm font-medium flex-1 truncate">
                      {obj.type === "i-text"
                        ? (obj as IText).text
                        : obj.type === "image"
                        ? "Image"
                        : "Object"}
                    </span>
                    <Trash2
                      className="w-4 h-4 text-zinc-400 hover:text-red-500 shrink-0"
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
          activeTool !== "layers" && (
            <div className="text-center text-zinc-400 text-sm mt-10">
              Options for {activeTool} will appear here.
            </div>
          )}
      </div>
    </div>
  );
}
