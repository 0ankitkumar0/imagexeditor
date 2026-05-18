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
          ? "bg-card shadow-sm text-text-primary"
          : "text-text-secondary hover:text-text-primary hover:bg-hover"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
