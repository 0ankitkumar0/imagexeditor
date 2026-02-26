"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { ToolDetailsPanel } from "./components/ToolDetailsPanel";
import { CanvasWorkspace } from "./components/CanvasWorkspace";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { useCustomizeEditor } from "./hooks/useCustomizeEditor";

export default function CustomizePage() {
  const editor = useCustomizeEditor();
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);

  return (
    <div className="h-dvh w-full flex flex-col bg-white text-zinc-950 font-sans overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden bg-zinc-50">
        {/* Desktop LeftSidebar */}
        <div className="hidden md:block">
          <LeftSidebar
            activeTool={editor.activeTool}
            setActiveTool={editor.setActiveTool}
          />
        </div>

        {/* Desktop ToolDetailsPanel */}
        <div className="hidden md:flex">
          <ToolDetailsPanel
            activeTool={editor.activeTool}
            canvas={editor.canvas}
            selectedObject={editor.selectedObject}
            addText={editor.addText}
            canvasText={editor.canvasText}
            setCanvasText={editor.setCanvasText}
            fontFamily={editor.fontFamily}
            changeFont={editor.changeFont}
            shirtColor={editor.shirtColor}
            setShirtColor={editor.setShirtColor}
            addImage={editor.addImage}
            deleteSelected={editor.deleteSelected}
            duplicateSelected={editor.duplicateSelected}
            bringForward={editor.bringForward}
            sendBackward={editor.sendBackward}
          />
        </div>

        <CanvasWorkspace
          viewMode={editor.viewMode}
          shirtView={editor.shirtView}
          setShirtView={editor.setShirtView}
          handleViewToggle={editor.handleViewToggle}
          shirtColor={editor.shirtColor}
          designTextures={editor.designTextures}
          canvas={editor.canvas}
          onReset={editor.handleReset}
          handleFrontCanvas={editor.handleFrontCanvas}
          handleBackCanvas={editor.handleBackCanvas}
          handleLeftCanvas={editor.handleLeftCanvas}
          handleRightCanvas={editor.handleRightCanvas}
        />

        {/* Desktop PropertiesPanel */}
        <div className="hidden md:flex">
          <PropertiesPanel
            size={editor.size}
            setSize={editor.setSize}
            rotation={editor.rotation}
            setRotation={editor.setRotation}
            opacity={editor.opacity}
            setOpacity={editor.setOpacity}
            changeSelectedColor={editor.changeSelectedColor}
          />
        </div>
      </main>

      {/* Mobile Bottom Toolbar */}
      <div className="md:hidden shrink-0">
        <LeftSidebar
          activeTool={editor.activeTool}
          setActiveTool={(tool) => {
            editor.setActiveTool(tool);
            if (tool !== "select") {
              setMobilePanel("tool");
            } else {
              setMobilePanel(null);
            }
          }}
          mobile
          onPropertiesClick={() =>
            setMobilePanel(mobilePanel === "properties" ? null : "properties")
          }
        />
      </div>

      {/* Mobile Slide-up Panel Overlay */}
      {mobilePanel && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setMobilePanel(null)}
          />
          {/* Panel */}
          <div className="bg-white rounded-t-2xl shadow-2xl max-h-[65vh] flex flex-col animate-slide-up">
            {/* Handle & Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 bg-zinc-300 rounded-full" />
                <span className="font-semibold text-sm capitalize">
                  {mobilePanel === "properties"
                    ? "Properties"
                    : editor.activeTool}
                </span>
              </div>
              <button
                onClick={() => setMobilePanel(null)}
                className="p-2 -mr-2 rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {mobilePanel === "tool" && (
                <ToolDetailsPanel
                  activeTool={editor.activeTool}
                  canvas={editor.canvas}
                  selectedObject={editor.selectedObject}
                  addText={editor.addText}
                  canvasText={editor.canvasText}
                  setCanvasText={editor.setCanvasText}
                  fontFamily={editor.fontFamily}
                  changeFont={editor.changeFont}
                  shirtColor={editor.shirtColor}
                  setShirtColor={editor.setShirtColor}
                  addImage={editor.addImage}
                  deleteSelected={editor.deleteSelected}
                  duplicateSelected={editor.duplicateSelected}
                  bringForward={editor.bringForward}
                  sendBackward={editor.sendBackward}
                  mobile
                />
              )}
              {mobilePanel === "properties" && (
                <PropertiesPanel
                  size={editor.size}
                  setSize={editor.setSize}
                  rotation={editor.rotation}
                  setRotation={editor.setRotation}
                  opacity={editor.opacity}
                  setOpacity={editor.setOpacity}
                  changeSelectedColor={editor.changeSelectedColor}
                  mobile
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
