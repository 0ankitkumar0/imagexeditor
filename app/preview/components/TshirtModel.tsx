"use client";

import { useGLTF, Center } from "@react-three/drei";
import { useRef, useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  Mesh,
  MeshStandardMaterial,
  Group,
  Box3,
  Vector3,
  CanvasTexture,
  SRGBColorSpace,
  Color,
} from "three";

// ═══════════════════════════════════════════════════════════════════
// Canvas design textures for each view
// ═══════════════════════════════════════════════════════════════════
interface DesignTextures {
  front?: string;
  back?: string;
  leftSleeve?: string;
  rightSleeve?: string;
}

interface TshirtModelProps {
  designTextures?: DesignTextures;
  shirtColor?: string;
}

const CONFIG = {
  model: "/models/tshirt.glb",
  uvMap: "/models/T-Shirt UV MAP.png",
  uvMapSize: 4267,
  regions: {
  front: { x: 50, y: 1500, width: 2063, height: 2655 },
    back: { x: 2227, y: 1100, width: 1957, height: 3055 },
    leftSleeve: { x: 2555, y: 150, width: 1367, height: 1001 },
    rightSleeve: { x: 370, y: 213, width: 1367, height: 1001 },
  },
  // Vertical centers for cropping
  centers: {
    front: { x: 0.495, y: 0.535 },
    back: { x: 0.496, y: 0.42 },
    leftSleeve: { x: 0.54, y: 0.562 },
    rightSleeve: { x: 0.504, y: 0.562 },
  },
  cropWidths: {
    body: 1020,
    back: 920,
    sleeve: 675,
  }
};

const TEXTURE_SIZE = 4096;

export const TshirtModel: React.FC<TshirtModelProps> = ({
  designTextures,
  shirtColor = "#ffffff",
}) => {
  const group = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<CanvasTexture | null>(null);
  const { camera } = useThree();
  const [cameraFitted, setCameraFitted] = useState(false);
  const [baseMap, setBaseMap] = useState<HTMLImageElement | null>(null);

  // Load the GLB model
  const { scene } = useGLTF(CONFIG.model);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Load the base UV map image
  useEffect(() => {
    const img = new Image();
    img.src = CONFIG.uvMap;
    img.onload = () => setBaseMap(img);
  }, []);

  // Create composite canvas for the texture
  useEffect(() => {
    const cvs = document.createElement("canvas");
    cvs.width = TEXTURE_SIZE;
    cvs.height = TEXTURE_SIZE;
    compositeCanvasRef.current = cvs;

    const tex = new CanvasTexture(cvs);
    tex.flipY = false;
    tex.colorSpace = SRGBColorSpace;
    textureRef.current = tex;

    // Initial fill with shirt color
    const ctx = cvs.getContext("2d");
    if (ctx) {
      ctx.fillStyle = shirtColor;
      ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      tex.needsUpdate = true;
    }

    return () => {
      tex.dispose();
    };
  }, []);

  // Apply material to the model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const mat = new MeshStandardMaterial({
          // Use white color because the texture already has the shirt color
          color: new Color("#ffffff"),
          roughness: 0.85,
          metalness: 0.0,
          map: textureRef.current,
        });
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        materialRef.current = mat;
      }
    });
  }, [clonedScene, shirtColor]);

  // Auto-fit camera
  useEffect(() => {
    if (!group.current || cameraFitted) return;
    const box = new Box3().setFromObject(group.current);
    if (box.isEmpty()) return;

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const fov = (camera as any).fov ?? 45;
    const aspect = (camera as any).aspect ?? 1;

    // Calculate distance to fit the object
    // For height fit: distance = (height/2) / tan(fov/2)
    // For width fit: distance = (width/2) / aspect / tan(fov/2)
    const hDist = size.y / (2 * Math.tan((fov * Math.PI) / 360));
    const wDist = (size.x / aspect) / (2 * Math.tan((fov * Math.PI) / 360));
    
    const distance = Math.max(hDist, wDist) * 1.1; // Reverted to perfect fit for T-shirt

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    setCameraFitted(true);
  }, [clonedScene, camera, cameraFitted]);

  // ═══════════════════════════════════════════════════════════════
  // COMPOSITE: Fill with shirt color + UV Map + draw all 4 design canvases
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const compositeCvs = compositeCanvasRef.current;
    const tex = textureRef.current;
    if (!compositeCvs || !tex) return;

    const ctx = compositeCvs.getContext("2d");
    if (!ctx) return;

    // Scale factor from UV map pixels to our composite texture
    const scale = TEXTURE_SIZE / CONFIG.uvMapSize;

    // Step 1: Fill entire texture with shirt color
    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    // Step 2: Draw the base UV map (if loaded)
    // We use "multiply" so the shadows/wireframe from the map 
    // are applied over the shirtColor base without turning it all white.
    if (baseMap) {
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(baseMap, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      ctx.globalCompositeOperation = "source-over"; // Reset for designs
    }

    // Step 3: Draw each design canvas into its correct UV region
    const drawDesign = (dataUrl: string | undefined, regionKey: keyof typeof CONFIG.regions) => {
      return new Promise<void>((resolve) => {
        if (!dataUrl) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          const region = CONFIG.regions[regionKey];
          const dx = region.x * scale;
          const dy = region.y * scale;
          const dw = region.width * scale;
          const dh = region.height * scale;

          // ── ACCURATE CROP LOGIC ────────────────────────────────────
          // We calculate the crop based on the UV region's aspect ratio
          // to prevent distortion, and center it on the EXACT printable
          // area centers defined in PRODUCT_CONFIGS.
          // ───────────────────────────────────────────────────────────
          const isSleeve = regionKey.includes("sleeve") || regionKey.includes("Sleeve");

          // Get values from config
          let sw = isSleeve ? CONFIG.cropWidths.sleeve : CONFIG.cropWidths.body;
          if (regionKey === "back") sw = CONFIG.cropWidths.back;

          // Match the height to the UV region's aspect ratio
          const aspect = region.height / region.width;
          const sh = sw * aspect;

          // Horizontal & Vertical centers
          const center = CONFIG.centers[regionKey];
          const sx = (1456 * center.x) - (sw / 2);
          const sy = (1456 * center.y) - (sh / 2);

          // Draw the design with precise cropping
          ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    };

    // Draw all designs, then update the texture
    Promise.all([
      drawDesign(designTextures?.front, "front"),
      drawDesign(designTextures?.back, "back"),
      drawDesign(designTextures?.leftSleeve, "leftSleeve"),
      drawDesign(designTextures?.rightSleeve, "rightSleeve"),
    ]).then(() => {
      tex.needsUpdate = true;
      if (materialRef.current) {
        materialRef.current.map = tex;
        materialRef.current.needsUpdate = true;
      }
    });
  }, [designTextures, shirtColor, baseMap]);

  return (
    <Center>
      <group ref={group} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
};

useGLTF.preload(CONFIG.model);
