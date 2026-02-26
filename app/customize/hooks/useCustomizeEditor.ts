"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, Object as FabricObject, IText, FabricImage } from "fabric";
import { loadGoogleFont } from "../data/googleFonts";

export function useCustomizeEditor() {
  const [activeTool, setActiveTool] = useState("select");
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [shirtView, setShirtView] = useState("front");

  // Fabric Canvas State
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const canvasesRef = useRef<Record<string, Canvas | null>>({});
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

  // UI State synced with Canvas
  const [canvasText, setCanvasText] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(50);

  // Textures for 3D View
  const [designTextures, setDesignTextures] = useState<Record<string, string>>({});
  const viewModeRef = useRef<"2D" | "3D">("2D");

  // ── Helpers ──────────────────────────────────────────────────────

  const captureAllCanvasTextures = useCallback(() => {
    const textures: Record<string, string> = {};
    const allViews = [
      { key: "front", ref: "front" },
      { key: "back", ref: "back" },
      { key: "leftSleeve", ref: "left-sleeve" },
      { key: "rightSleeve", ref: "right-sleeve" },
    ];
    for (const view of allViews) {
      const c = canvasesRef.current[view.ref];
      if (c) {
        c.discardActiveObject();
        c.requestRenderAll();
        try {
          textures[view.key] = c.toDataURL({ multiplier: 2, format: "png" });
        } catch (err) {
          console.error(`[Texture] Failed to capture ${view.ref}:`, err);
        }
      }
    }
    setDesignTextures(textures);
  }, []);

  const syncStateFromObject = (obj: FabricObject) => {
    if (!obj) return;
    setRotation(Math.round(obj.angle || 0));
    setOpacity(Math.round((obj.opacity || 1) * 100));
    setSize(Math.round((obj.scaleX || 1) * 50));
    if (obj instanceof IText) {
      setCanvasText(obj.text || "");
      setFontFamily((obj as IText).fontFamily || "Inter");
    }
  };

  // ── Canvas Initialization ───────────────────────────────────────

  const onCanvasReady = useCallback((view: string) => {
    return (fabricCanvas: Canvas) => {
      canvasesRef.current[view] = fabricCanvas;

      if (view === "front") {
        setCanvas(fabricCanvas);
      }

      const handleSelection = (e: any) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        if (obj) {
          setRotation(Math.round(obj.angle || 0));
          setOpacity(Math.round((obj.opacity || 1) * 100));
          setSize(Math.round((obj.scaleX || 1) * 50));
          if (obj instanceof IText) {
            setCanvasText(obj.text || "");
          }
        }
      };

      fabricCanvas.on("selection:created", handleSelection);
      fabricCanvas.on("selection:updated", handleSelection);
      fabricCanvas.on("selection:cleared", () => setSelectedObject(null));
      fabricCanvas.on("object:modified", (e) => {
        if (e.target) handleSelection({ selected: [e.target] });
      });

      const updateTextureForPreview = () => {
        if (viewModeRef.current === "3D") {
          const textures: Record<string, string> = {};
          const allViews = [
            { key: "front", ref: "front" },
            { key: "back", ref: "back" },
            { key: "leftSleeve", ref: "left-sleeve" },
            { key: "rightSleeve", ref: "right-sleeve" },
          ];
          for (const v of allViews) {
            const c = canvasesRef.current[v.ref];
            if (c) {
              try {
                textures[v.key] = c.toDataURL({ multiplier: 2, format: "png" });
              } catch { /* skip */ }
            }
          }
          setDesignTextures(textures);
        }
      };
      fabricCanvas.on("object:added", updateTextureForPreview);
      fabricCanvas.on("object:removed", updateTextureForPreview);
      fabricCanvas.on("object:modified", updateTextureForPreview);
      fabricCanvas.on("text:changed", updateTextureForPreview);
    };
  }, []);

  const handleFrontCanvas = useCallback((c: Canvas) => onCanvasReady("front")(c), [onCanvasReady]);
  const handleBackCanvas = useCallback((c: Canvas) => onCanvasReady("back")(c), [onCanvasReady]);
  const handleLeftCanvas = useCallback((c: Canvas) => onCanvasReady("left-sleeve")(c), [onCanvasReady]);
  const handleRightCanvas = useCallback((c: Canvas) => onCanvasReady("right-sleeve")(c), [onCanvasReady]);

  // ── Effects ─────────────────────────────────────────────────────

  useEffect(() => {
    const newCanvas = canvasesRef.current[shirtView];
    if (newCanvas) {
      setCanvas(newCanvas);
      const activeObj = newCanvas.getActiveObject();
      setSelectedObject(activeObj || null);
      if (activeObj) syncStateFromObject(activeObj);
    }
  }, [shirtView]);

  useEffect(() => {
    if (!canvas || !selectedObject) return;
    if (selectedObject.angle !== rotation) {
      selectedObject.set("angle", rotation);
      canvas.requestRenderAll();
    }
  }, [rotation, canvas, selectedObject]);

  useEffect(() => {
    if (!canvas || !selectedObject) return;
    const newScale = size / 50;
    if (Math.abs((selectedObject.scaleX || 1) - newScale) > 0.01) {
      selectedObject.scale(newScale);
      canvas.requestRenderAll();
    }
  }, [size, canvas, selectedObject]);

  useEffect(() => {
    if (!canvas || !selectedObject) return;
    const newOpacity = opacity / 100;
    if (Math.abs((selectedObject.opacity || 1) - newOpacity) > 0.01) {
      selectedObject.set("opacity", newOpacity);
      canvas.requestRenderAll();
    }
  }, [opacity, canvas, selectedObject]);

  useEffect(() => {
    if (!canvas || !selectedObject || !(selectedObject instanceof IText)) return;
    if (selectedObject.text !== canvasText) {
      selectedObject.set("text", canvasText);
      canvas.requestRenderAll();
    }
  }, [canvasText, canvas, selectedObject]);

  // ── Event Handlers ──────────────────────────────────────────────

  const handleViewToggle = (mode: "2D" | "3D") => {
    viewModeRef.current = mode;
    if (mode === "3D") captureAllCanvasTextures();
    setViewMode(mode);
  };

  const addText = () => {
    if (canvas) {
      const text = new IText("New Text", {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        fontFamily: "Inter",
        fill: "#000",
        fontSize: 30,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.requestRenderAll();
    }
  };

  const addImage = (file: File) => {
    if (!canvas) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;
      try {
        const img = await FabricImage.fromURL(dataUrl);
        // Scale to fit within the printable area
        const maxW = canvas.getWidth() * 0.8;
        const maxH = canvas.getHeight() * 0.8;
        const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
        img.scale(scale);
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      } catch (err) {
        console.error("Failed to load image:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const changeFont = async (font: string) => {
    setFontFamily(font);
    // Dynamically load the font stylesheet from Google Fonts
    await loadGoogleFont(font);
    if (canvas && selectedObject && selectedObject instanceof IText) {
      // Wait for the browser to actually have the font ready
      try {
        await document.fonts.load(`16px "${font}"`);
      } catch { /* font may already be loaded */ }
      selectedObject.set("fontFamily", font);
      selectedObject.initDimensions();
      selectedObject.setCoords();
      canvas.requestRenderAll();
    }
  };

  const changeSelectedColor = (color: string) => {
    if (canvas && selectedObject) {
      selectedObject.set("fill", color);
      canvas.requestRenderAll();
    }
  };

  const deleteSelected = () => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      setSelectedObject(null);
    }
  };

  const duplicateSelected = async () => {
    if (!canvas || !selectedObject) return;
    const cloned = await selectedObject.clone();
    cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
  };

  const bringForward = () => {
    if (canvas && selectedObject) {
      canvas.bringObjectForward(selectedObject);
      canvas.requestRenderAll();
    }
  };

  const sendBackward = () => {
    if (canvas && selectedObject) {
      canvas.sendObjectBackwards(selectedObject);
      canvas.requestRenderAll();
    }
  };

  const handleReset = () => {
    if (canvas) {
      canvas.clear();
      setCanvasText("");
      setSize(50);
      setRotation(0);
    }
  };

  return {
    // Tool state
    activeTool, setActiveTool,
    viewMode, shirtView, setShirtView,

    // Canvas state
    canvas, selectedObject,

    // UI state
    canvasText, setCanvasText,
    fontFamily, changeFont,
    shirtColor, setShirtColor,
    opacity, setOpacity,
    rotation, setRotation,
    size, setSize,

    // 3D textures
    designTextures,

    // Canvas handlers
    handleFrontCanvas, handleBackCanvas,
    handleLeftCanvas, handleRightCanvas,

    // Actions
    handleViewToggle, addText, addImage,
    changeSelectedColor, handleReset,
    deleteSelected, duplicateSelected,
    bringForward, sendBackward,
  };
}
