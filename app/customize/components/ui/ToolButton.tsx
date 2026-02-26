import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function ToolButton({ icon: Icon, label, active, onClick, compact }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${compact ? 'min-w-[3rem] h-12 rounded-lg' : 'w-14 h-14 rounded-xl'} flex flex-col items-center justify-center gap-0.5 transition-all ${
        active
          ? "bg-zinc-100 text-zinc-900 shadow-sm"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
      }`}
    >
      <Icon className={`${compact ? 'w-[18px] h-[18px]' : 'w-5 h-5'} ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
      <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-medium leading-tight`}>{label}</span>
    </button>
  );
}
