"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, Object as FabricObject, IText, FabricImage } from "fabric";
import { loadGoogleFont } from "../data/googleFonts";
import { compositeViewTexture } from "@/lib/composite";
import { ShirtView, ProductType } from "../config";

import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal";

export function useCustomizeEditor(productType: ProductType = "tshirt") {
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
  const shirtColorRef = useRef("#ffffff");

  useEffect(() => {
    shirtColorRef.current = shirtColor;
  }, [shirtColor]);

  const [opacity, setOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(50);
  const [zoom, setZoom] = useState(1);

  // Loading States
  const [bgRemovalStatus, setBgRemovalStatus] = useState<string | null>(null);
  const isRemovingBg = !!bgRemovalStatus;

  // Textures for 3D View
  const [designTextures, setDesignTextures] = useState<Record<string, string>>({});
  const viewModeRef = useRef<"2D" | "3D">("2D");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize zoom based on screen width
  useEffect(() => {
    const updateZoom = () => {
      if (window.innerWidth < 768) {
        const scale = (window.innerWidth - 16) / 500;
        setZoom(Math.min(Math.max(scale, 0.5), 0.92));
      } else {
        setZoom(1.0);
      }
    };
    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  // ── Helper: Update Three.js Texture ───────────────────────────────

  const updateThreeTexture = useCallback(async () => {
    const textures: Record<string, string> = {};
    const allViews: { key: string; ref: ShirtView }[] = [
      { key: "front", ref: "front" },
      { key: "back", ref: "back" },
      { key: "leftSleeve", ref: "left-sleeve" },
      { key: "rightSleeve", ref: "right-sleeve" },
    ];
    for (const view of allViews) {
      const c = canvasesRef.current[view.ref];
      if (c) {
        c.discardActiveObject();
        c.renderAll();
        try {
          textures[view.key] = await compositeViewTexture(
            view.ref,
            c,
            shirtColorRef.current, // Use ref to avoid dependency cycle
            false, // 3D texture should be transparent
            productType
          );
        } catch (err) {
          console.error(`[Texture] Failed to composite ${view.ref}:`, err);
        }
      }
    }
    setDesignTextures(textures);
  }, [productType]); // productType is a dependency now

  const debouncedUpdateTexture = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      updateThreeTexture();
    }, 300);
  }, [updateThreeTexture]);

  // ── Helper: Replace Selected Fabric Image ─────────────────────────

  const replaceSelectedFabricImage = async (transparentUrl: string) => {
    if (!canvas || !selectedObject || selectedObject.type !== "image") return;

    // Load new image from transparent source
    const newImg = await FabricImage.fromURL(transparentUrl);

    // Rule: Preserve position, scale, rotation, layer order, and flips
    newImg.set({
      left: selectedObject.left,
      top: selectedObject.top,
      scaleX: selectedObject.scaleX,
      scaleY: selectedObject.scaleY,
      angle: selectedObject.angle,
      opacity: selectedObject.opacity,
      flipX: selectedObject.flipX,
      flipY: selectedObject.flipY,
      originX: selectedObject.originX,
      originY: selectedObject.originY,
      skewX: selectedObject.skewX,
      skewY: selectedObject.skewY,
    });

    // Find the original index to preserve layer order
    const index = canvas.getObjects().indexOf(selectedObject);

    canvas.remove(selectedObject);
    canvas.insertAt(index, newImg); // Preserve layer order
    canvas.setActiveObject(newImg);
    canvas.requestRenderAll();

    // Automatically refresh 3D view
    updateThreeTexture();
  };

  // ── Helper: Remove Background ────────────────────────────────────

  const removeBackground = async () => {
    if (!canvas || !selectedObject || selectedObject.type !== "image") {
      alert("Please select an image first.");
      return;
    }

    if (bgRemovalStatus) return;

    setBgRemovalStatus("Preparing AI background remover...");
    try {
      const fabricImg = selectedObject as FabricImage;

      // 1. Get high-quality source blob
      // We use a high multiplier to ensure we don't lose quality during the transfer
      const dataUrl = fabricImg.toDataURL({
        format: 'png',
        multiplier: 2 // Boost resolution for processing
      });
      const response = await fetch(dataUrl);
      const inputBlob = await response.blob();

      setBgRemovalStatus("Removing background...");

      // 2. Use @imgly/background-removal with high-quality settings
      const transparentBlob = await imglyRemoveBackground(inputBlob, {
        output: {
          format: "image/png",
          quality: 1.0, // Maximum quality
        },
        progress: (status, progress) => {
          if (status === "fetching") setBgRemovalStatus("Downloading AI models...");
          if (status === "processing") setBgRemovalStatus(`Removing background (${Math.round(progress * 100)}%)...`);
        }
      });

      setBgRemovalStatus("Optimizing image...");
      const transparentUrl = URL.createObjectURL(transparentBlob);

      // 3. Replace the image on canvas while preserving properties
      await replaceSelectedFabricImage(transparentUrl);

    } catch (err: any) {
      console.error("AI BG Removal Error:", err);
      alert("Failed to remove background locally. Please check your connection and try again.");
    } finally {
      setBgRemovalStatus(null);
    }
  };

  // ── Canvas Logic ───────────────────────────────────────────────

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

  const onCanvasReady = useCallback((view: string) => {
    return (fabricCanvas: Canvas) => {
      canvasesRef.current[view] = fabricCanvas;
      if (view === "front") setCanvas(fabricCanvas);

      const handleSelection = (e: { selected?: FabricObject[] }) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        if (obj) syncStateFromObject(obj);
      };

      fabricCanvas.on("selection:created", handleSelection);
      fabricCanvas.on("selection:updated", handleSelection);
      fabricCanvas.on("selection:cleared", () => setSelectedObject(null));
      fabricCanvas.on("object:modified", (e) => {
        if (e.target) handleSelection({ selected: [e.target] });
      });

      const refresh3D = () => { if (viewModeRef.current === "3D") debouncedUpdateTexture(); };
      fabricCanvas.on("object:added", refresh3D);
      fabricCanvas.on("object:removed", refresh3D);
      fabricCanvas.on("object:modified", refresh3D);
      fabricCanvas.on("text:changed", refresh3D);

      fabricCanvas.requestRenderAll();
    };
  }, [debouncedUpdateTexture]);

  const handleFrontCanvas = useCallback((c: Canvas) => onCanvasReady("front")(c), [onCanvasReady]);
  const handleBackCanvas = useCallback((c: Canvas) => onCanvasReady("back")(c), [onCanvasReady]);
  const handleLeftCanvas = useCallback((c: Canvas) => onCanvasReady("left-sleeve")(c), [onCanvasReady]);
  const handleRightCanvas = useCallback((c: Canvas) => onCanvasReady("right-sleeve")(c), [onCanvasReady]);

  useEffect(() => {
    if (viewMode === "3D") updateThreeTexture();
  }, [shirtColor, viewMode, updateThreeTexture]);

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

  const handleViewToggle = (mode: "2D" | "3D") => {
    viewModeRef.current = mode;
    if (mode === "3D") updateThreeTexture();
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
      } catch (err) { console.error("Failed to load image:", err); }
    };
    reader.readAsDataURL(file);
  };

  const changeFont = async (font: string) => {
    setFontFamily(font);
    await loadGoogleFont(font);
    if (canvas && selectedObject && selectedObject instanceof IText) {
      try { await document.fonts.load(`16px "${font}"`); } catch { }
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
    zoom, setZoom,
    // 3D textures
    designTextures,
    // Canvas handlers
    onCanvasReady,
    handleFrontCanvas, handleBackCanvas,
    handleLeftCanvas, handleRightCanvas,
    // Actions
    handleViewToggle, addText, addImage,
    changeSelectedColor, handleReset,
    deleteSelected, duplicateSelected,
    bringForward, sendBackward,
    // BG Removal
    removeBackground, isRemovingBg, bgRemovalStatus,
    replaceSelectedFabricImage, updateThreeTexture
  };
}
