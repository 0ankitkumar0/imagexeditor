import { Canvas } from "fabric";

export const initCanvas = (canvasId: string, width: number, height: number) => {
  const canvas = new Canvas(canvasId, {
    width,
    height,
    backgroundColor: "transparent",
    preserveObjectStacking: true,
  });

  return canvas;
};
