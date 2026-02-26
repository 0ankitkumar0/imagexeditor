import { LucideIcon } from "lucide-react";

interface SliderControlProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  suffix?: string;
  icon?: LucideIcon;
}

export function SliderControl({
  label,
  value,
  setValue,
  min,
  max,
  suffix = "",
  icon: Icon,
}: SliderControlProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9\-]/g, "");
    if (raw === "" || raw === "-") return;
    const num = Math.min(max, Math.max(min, Number(raw)));
    setValue(num);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400" />}
          {label}
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className="w-12 text-xs font-medium text-zinc-700 text-right border border-zinc-200 px-1.5 py-0.5 rounded-md bg-zinc-50 outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-400"
          />
          {suffix && (
            <span className="text-xs text-zinc-400 ml-0.5">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 hover:accent-zinc-700"
      />
    </div>
  );
}
