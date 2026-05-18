import {
  Image as ImageIcon,
  Type,
  Palette,
  Layers,
  MousePointer2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { ToolButton } from "./ui/ToolButton";

interface LeftSidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  mobile?: boolean;
  onPropertiesClick?: () => void;
}

export function LeftSidebar({
  activeTool,
  setActiveTool,
  mobile,
  onPropertiesClick,
}: LeftSidebarProps) {
  if (mobile) {
    return (
      <nav className="bg-card border-t border-border flex items-stretch justify-around safe-area-bottom shadow-[0_-2px_8px_rgba(0,0,0,0.06)] transition-colors">
        <ToolButton
          icon={MousePointer2}
          label="Select"
          active={activeTool === "select"}
          onClick={() => setActiveTool("select")}
          compact
        />
        <ToolButton
          icon={ImageIcon}
          label="Upload"
          active={activeTool === "upload"}
          onClick={() => setActiveTool("upload")}
          compact
        />
        <ToolButton
          icon={Type}
          label="Text"
          active={activeTool === "text"}
          onClick={() => setActiveTool("text")}
          compact
        />
        <ToolButton
          icon={Palette}
          label="Colors"
          active={activeTool === "colors"}
          onClick={() => setActiveTool("colors")}
          compact
        />
        <ToolButton
          icon={Sparkles}
          label="AI"
          active={activeTool === "ai"}
          onClick={() => setActiveTool("ai")}
          compact
        />
        <ToolButton
          icon={Layers}
          label="Layers"
          active={activeTool === "layers"}
          onClick={() => setActiveTool("layers")}
          compact
        />
        {onPropertiesClick && (
          <ToolButton
            icon={SlidersHorizontal}
            label="Props"
            active={false}
            onClick={onPropertiesClick}
            compact
          />
        )}
      </nav>
    );
  }

  return (
    <aside className="h-full w-16 bg-card border-r border-border flex flex-col items-center py-3 gap-1 shrink-0 z-10 transition-colors">
      <ToolButton
        icon={MousePointer2}
        label="Select"
        active={activeTool === "select"}
        onClick={() => setActiveTool("select")}
      />
      <div className="w-8 h-px bg-border my-1" />
      <ToolButton
        icon={ImageIcon}
        label="Upload"
        active={activeTool === "upload"}
        onClick={() => setActiveTool("upload")}
      />
      <ToolButton
        icon={Type}
        label="Text"
        active={activeTool === "text"}
        onClick={() => setActiveTool("text")}
      />
      <ToolButton
        icon={Palette}
        label="Colors"
        active={activeTool === "colors"}
        onClick={() => setActiveTool("colors")}
      />
      <div className="w-8 h-px bg-border my-1" />
      <ToolButton
        icon={Sparkles}
        label="AI Magic"
        active={activeTool === "ai"}
        onClick={() => setActiveTool("ai")}
      />
      <ToolButton
        icon={Layers}
        label="Layers"
        active={activeTool === "layers"}
        onClick={() => setActiveTool("layers")}
      />
    </aside>
  );
}
