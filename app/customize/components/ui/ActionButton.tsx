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
      className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
