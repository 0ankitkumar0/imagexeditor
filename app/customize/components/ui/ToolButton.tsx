import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function ToolButton({
  icon: Icon,
  label,
  active,
  onClick,
  compact,
}: ToolButtonProps) {
  const content = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative group transition-all duration-300 ${
        compact
          ? "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
          : "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5"
      } ${
        active
          ? "text-primary"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {/* Active Glow Effect */}
      {active && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 bg-primary/10 blur-md rounded-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div
        className={`flex items-center justify-center transition-all duration-300 ${
          compact
            ? `w-8 h-7 rounded-lg ${active ? "bg-surface shadow-sm" : "group-hover:bg-surface/50"}`
            : `w-10 h-10 rounded-xl ${active ? "bg-surface shadow-md ring-1 ring-primary/20" : "group-hover:bg-surface"}`
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-transform duration-300 ${
            active ? "stroke-[2.5px] scale-110" : "stroke-2 group-hover:scale-110"
          }`}
        />
      </div>
      
      {compact && (
        <span className="text-[9px] font-medium leading-tight truncate w-full text-center px-0.5">
          {label}
        </span>
      )}
    </motion.button>
  );

  if (compact) return content;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
