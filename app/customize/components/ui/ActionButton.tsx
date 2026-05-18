import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

export function ActionButton({ icon: Icon, title, onClick }: ActionButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="p-2 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
