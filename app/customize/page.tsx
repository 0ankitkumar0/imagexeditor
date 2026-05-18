"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { ToolDetailsPanel } from "./components/ToolDetailsPanel";
import { CanvasWorkspace } from "./components/CanvasWorkspace";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { useCustomizeEditor } from "./hooks/useCustomizeEditor";
import type { ProductType } from "./config";

export default function CustomizePage() {
  return (
    <Suspense fallback={null}>
      <CustomizePageContent />
    </Suspense>
  );
}

function CustomizePageContent() {
  const searchParams = useSearchParams();
  const editor = useCustomizeEditor();
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);
  const queryType = searchParams.get("type");
  const productType: ProductType = queryType === "hoodie" ? "hoodie" : "tshirt";

  const closeMobilePanel = () => setMobilePanel(null);

  return (
    <div className="h-dvh w-full flex flex-col bg-background text-text-primary overflow-hidden transition-colors">
      <Header />

      {/* Main editing area */}
      <main className="flex-1 flex overflow-hidden bg-surface min-h-0 transition-colors">
        {/* Desktop: Left sidebar */}
        <div className="hidden md:block shrink-0">
          <LeftSidebar
            activeTool={editor.activeTool}
            setActiveTool={editor.setActiveTool}
          />
        </div>

        {/* Desktop: Tool details panel */}
        <div className="hidden md:flex shrink-0">
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
            removeBackground={editor.removeBackground}
            bgRemovalStatus={editor.bgRemovalStatus}
            />
        </div>

        {/* Canvas workspace — fills remaining space */}
        <CanvasWorkspace
          productType={productType}
          viewMode={editor.viewMode}
          shirtView={editor.shirtView}
          setShirtView={editor.setShirtView}
          handleViewToggle={editor.handleViewToggle}
          shirtColor={editor.shirtColor}
          designTextures={editor.designTextures}
          canvas={editor.canvas}
          onReset={editor.handleReset}
          onCanvasReady={editor.onCanvasReady}
          handleFrontCanvas={editor.handleFrontCanvas}
          handleBackCanvas={editor.handleBackCanvas}
          handleLeftCanvas={editor.handleLeftCanvas}
          handleRightCanvas={editor.handleRightCanvas}
          zoom={editor.zoom}
          setZoom={editor.setZoom}
        />

        {/* Desktop: Properties panel */}
        <div className="hidden md:flex shrink-0">
          <PropertiesPanel
            rotation={editor.rotation}
            setRotation={editor.setRotation}
            opacity={editor.opacity}
            setOpacity={editor.setOpacity}
            changeSelectedColor={editor.changeSelectedColor}
          />
        </div>
      </main>

      {/* ── Mobile bottom toolbar ─────────────────────────────────── */}
      <div className="md:hidden shrink-0 bg-card border-t border-border transition-colors">
        <LeftSidebar
          activeTool={editor.activeTool}
          setActiveTool={(tool) => {
            editor.setActiveTool(tool);
            // "select" tool has no panel — open other tools
            if (tool !== "select") {
              setMobilePanel("tool");
            } else {
              closeMobilePanel();
            }
          }}
          mobile
          onPropertiesClick={() =>
            setMobilePanel(mobilePanel === "properties" ? null : "properties")
          }
        />
      </div>

      {/* ── Mobile slide-up panel overlay ────────────────────────── */}
      {mobilePanel && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Tap-outside backdrop */}
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"
            onClick={closeMobilePanel}
          />

          {/* Panel sheet — max 60vh, sits above toolbar */}
          <div className="relative bg-card rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col animate-slide-up transition-colors">
            {/* Drag handle + title */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 bg-border rounded-full" />
                <span className="font-semibold text-sm capitalize text-text-primary">
                  {mobilePanel === "properties"
                    ? "Properties"
                    : editor.activeTool}
                </span>
              </div>
              <button
                onClick={closeMobilePanel}
                className="p-1.5 -mr-1 rounded-full hover:bg-surface active:bg-hover transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Scrollable panel content */}
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
