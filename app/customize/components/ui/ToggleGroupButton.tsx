import { LucideIcon } from "lucide-react";

interface ToggleGroupButtonProps {
  icon: LucideIcon;
  active: boolean;
}

export function ToggleGroupButton({ icon: Icon, active }: ToggleGroupButtonProps) {
  return (
    <button
      className={`flex-1 flex justify-center py-1.5 rounded-sm transition-colors ${
        active
          ? "bg-white shadow-sm text-zinc-900"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
