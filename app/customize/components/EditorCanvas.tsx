"use client";

import { useEffect, useRef } from "react";
import { Canvas, FabricObject } from "fabric";

interface EditorCanvasProps {
  onCanvasReady: (canvas: Canvas) => void;
  /** Canvas width in px  — defaults to 220 */
  width?:  number;
  /** Canvas height in px — defaults to 300 */
  height?: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  onCanvasReady,
  width  = 220,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !canvasInstanceRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "transparent",
        preserveObjectStacking: true,
      });

      canvasInstanceRef.current = canvas;

      // ── Boundary enforcement ─────────────────────────────────
      const clampObject = (obj: FabricObject) => {
        if (!obj) return;
        obj.setCoords();
        const bound = obj.getBoundingRect();
        const cw = canvas.getWidth();
        const ch = canvas.getHeight();

        // If the object's bounding box exceeds canvas, scale it down
        if (bound.width > cw || bound.height > ch) {
          const shrink = Math.min(cw / bound.width, ch / bound.height) * 0.95;
          obj.scaleX = (obj.scaleX ?? 1) * shrink;
          obj.scaleY = (obj.scaleY ?? 1) * shrink;
          obj.setCoords();
        }

        // Re-read bounding rect after possible scale
        const b = obj.getBoundingRect();
        const objLeft = obj.left ?? 0;
        const objTop = obj.top ?? 0;
        const offsetX = objLeft - b.left;
        const offsetY = objTop - b.top;

        let newLeft = objLeft;
        let newTop = objTop;

        if (b.left < 0) newLeft = offsetX;
        if (b.top < 0) newTop = offsetY;
        if (b.left + b.width > cw) newLeft = cw - b.width + offsetX;
        if (b.top + b.height > ch) newTop = ch - b.height + offsetY;

        obj.set({ left: newLeft, top: newTop });
        obj.setCoords();
      };

      canvas.on("object:moving", (e) => { if (e.target) clampObject(e.target); });
      canvas.on("object:scaling", (e) => { if (e.target) clampObject(e.target); });
      canvas.on("object:rotating", (e) => { if (e.target) clampObject(e.target); });
      canvas.on("object:modified", (e) => { if (e.target) clampObject(e.target); });
      canvas.on("object:added", (e) => {
        if (e.target) setTimeout(() => { clampObject(e.target!); canvas.requestRenderAll(); }, 50);
      });

      onCanvasReady(canvas);

      return () => {
        canvas.dispose();
        canvasInstanceRef.current = null;
      };
    }
  }, [onCanvasReady, width, height]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
