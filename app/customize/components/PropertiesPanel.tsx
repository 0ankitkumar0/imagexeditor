import {
  Maximize,
  RotateCcw,
  Layers,
  Palette,
} from "lucide-react";
import { Label } from "./ui/Label";
import { SliderControl } from "./ui/SliderControl";

interface PropertiesPanelProps {
  rotation: number;
  setRotation: (n: number) => void;
  opacity: number;
  setOpacity: (n: number) => void;
  changeSelectedColor: (color: string) => void;
  mobile?: boolean;
}

export function PropertiesPanel({
  rotation,
  setRotation,
  opacity,
  setOpacity,
  changeSelectedColor,
  mobile,
}: PropertiesPanelProps) {
  return (
    <div className={mobile ? "" : "h-full w-72 bg-card border-l border-border shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0 transition-colors"}>
      {!mobile && (
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Properties</h2>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-sm">
            Element
          </span>
        </div>
      )}

      <div className={mobile ? "p-4 space-y-4 md:space-y-6" : "p-5 flex-1 overflow-y-auto space-y-6"}>
        {/* Transform Sliders */}
        <div className="space-y-4">
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

        <div className="pt-4 border-t border-border">
          <Label className="text-[10px] md:text-xs uppercase tracking-wider mb-2 block">Element Color Fill</Label>
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
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                  color === "#09090b"
                    ? "border-text-secondary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-surface hover:bg-hover transition-colors">
              <Palette className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
