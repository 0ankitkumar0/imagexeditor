import {
  Maximize,
  RotateCcw,
  Layers,
  Palette,
} from "lucide-react";
import { Label } from "./ui/Label";
import { SliderControl } from "./ui/SliderControl";

interface PropertiesPanelProps {
  size: number;
  setSize: (n: number) => void;
  rotation: number;
  setRotation: (n: number) => void;
  opacity: number;
  setOpacity: (n: number) => void;
  changeSelectedColor: (color: string) => void;
  mobile?: boolean;
}

export function PropertiesPanel({
  size,
  setSize,
  rotation,
  setRotation,
  opacity,
  setOpacity,
  changeSelectedColor,
  mobile,
}: PropertiesPanelProps) {
  return (
    <div className={mobile ? "" : "w-72 bg-white border-l border-zinc-200 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0"}>
      {!mobile && (
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Properties</h2>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-1 rounded-sm">
            Element
          </span>
        </div>
      )}

      <div className={mobile ? "p-4 space-y-6" : "p-5 flex-1 overflow-y-auto space-y-6"}>
        {/* Transform Sliders */}
        <div className="space-y-4">
          <SliderControl
            label="Size"
            value={size}
            setValue={setSize}
            min={10}
            max={200}
            icon={Maximize}
          />
          <SliderControl
            label="Rotation"
            value={rotation}
            setValue={setRotation}
            min={-180}
            max={180}
            suffix="°"
            icon={RotateCcw}
          />
          <SliderControl
            label="Opacity"
            value={opacity}
            setValue={setOpacity}
            min={0}
            max={100}
            suffix="%"
            icon={Layers}
          />
        </div>

        <div className="pt-4 border-t border-zinc-100">
          <Label>Element Color Fill</Label>
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              "#09090b",
              "#ffffff",
              "#ef4444",
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#8b5cf6",
            ].map((color) => (
              <button
                key={color}
                onClick={() => changeSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                  color === "#09090b"
                    ? "border-zinc-400"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors">
              <Palette className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
