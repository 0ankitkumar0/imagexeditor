import {
  Image as ImageIcon,
  Type,
  Palette,
  Layers,
  MousePointer2,
  SlidersHorizontal,
} from "lucide-react";
import { ToolButton } from "./ui/ToolButton";

interface LeftSidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  mobile?: boolean;
  onPropertiesClick?: () => void;
}

export function LeftSidebar({ activeTool, setActiveTool, mobile, onPropertiesClick }: LeftSidebarProps) {
  if (mobile) {
    return (
      <nav className="bg-white border-t border-zinc-200 flex items-center justify-around px-1 py-1.5 safe-area-bottom">
        <ToolButton icon={MousePointer2} label="Select" active={activeTool === "select"} onClick={() => setActiveTool("select")} compact />
        <ToolButton icon={ImageIcon} label="Upload" active={activeTool === "upload"} onClick={() => setActiveTool("upload")} compact />
        <ToolButton icon={Type} label="Text" active={activeTool === "text"} onClick={() => setActiveTool("text")} compact />
        <ToolButton icon={Palette} label="Colors" active={activeTool === "colors"} onClick={() => setActiveTool("colors")} compact />
        <ToolButton icon={Layers} label="Layers" active={activeTool === "layers"} onClick={() => setActiveTool("layers")} compact />
        {onPropertiesClick && (
          <ToolButton icon={SlidersHorizontal} label="Props" active={false} onClick={onPropertiesClick} compact />
        )}
      </nav>
    );
  }

  return (
    <aside className="w-20 bg-white border-r border-zinc-200 flex flex-col items-center py-4 gap-2 shrink-0 z-10">
      <ToolButton
        icon={MousePointer2}
        label="Select"
        active={activeTool === "select"}
        onClick={() => setActiveTool("select")}
      />
      <div className="w-10 h-px bg-zinc-100 my-2"></div>
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
      <div className="w-10 h-px bg-zinc-100 my-2"></div>
      <ToolButton
        icon={Layers}
        label="Layers"
        active={activeTool === "layers"}
        onClick={() => setActiveTool("layers")}
      />
    </aside>
  );
}
