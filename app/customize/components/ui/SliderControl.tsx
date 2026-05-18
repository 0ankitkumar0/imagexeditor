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
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 md:mb-2">
        <label className="text-xs md:text-sm font-medium text-text-primary flex items-center gap-1.5 md:gap-2">
          {Icon && <Icon className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" />}
          {label}
        </label>
        <div className="flex items-center">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className="w-10 md:w-12 text-[10px] md:text-xs font-medium text-text-primary text-right border border-border px-1 md:px-1.5 py-0.5 rounded-md bg-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {suffix && (
            <span className="text-[10px] md:text-xs text-text-secondary ml-0.5">{suffix}</span>
          )}
        </div>
      </div>
      <div className="relative flex items-center h-6 md:h-1.5">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80"
        />
      </div>
    </div>
  );
}
