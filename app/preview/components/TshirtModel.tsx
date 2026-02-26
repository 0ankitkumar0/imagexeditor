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

// ═══════════════════════════════════════════════════════════════════
// UV REGION CONFIG — Pixel positions on the 4267×4267 UV map
// Extracted from the GLB model's actual TEXCOORD_0 vertex data.
//
// The UV map has 4 regions (separated by gaps in UV space):
//   Top-Left:    Left Sleeve    (x:294, y:213, 1367×951)
//   Top-Right:   Right Sleeve   (x:2405, y:256, 1367×920)
//   Bottom-Left: Back Body      (x:0, y:1612, 2063×2655)
//   Bottom-Right: Front Body    (x:2227, y:1612, 1957×2498)
//
// Adjust these if the design doesn't align on your model.
// ═══════════════════════════════════════════════════════════════════
const UV_MAP_SIZE = 4267; // The UV map image is 4267×4267

const UV_REGIONS = {
  front:        { x: 2227, y: 1612, width: 1957, height: 2498 },
  back:         { x: 0,    y: 1612, width: 2063, height: 2655 },
  leftSleeve:   { x: 294,  y: 213,  width: 1367, height: 951  },
  rightSleeve:  { x: 2405, y: 256,  width: 1367, height: 920  },
};

// Composite texture resolution (must be power of 2 for GPU)
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

  // Load the GLB model
  const { scene } = useGLTF("/models/tshirt.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

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
          color: new Color(shirtColor),
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
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as any).fov ?? 45;
    const distance = maxDim / (2 * Math.tan((fov * Math.PI) / 360));

    camera.position.set(center.x, center.y, center.z + distance * 1.5);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    setCameraFitted(true);
  }, [clonedScene, camera, cameraFitted]);

  // ═══════════════════════════════════════════════════════════════
  // COMPOSITE: Fill with shirt color + draw all 4 design canvases
  // (No UV map image drawn — only the user's designs)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const compositeCvs = compositeCanvasRef.current;
    const tex = textureRef.current;
    if (!compositeCvs || !tex) return;

    const ctx = compositeCvs.getContext("2d");
    if (!ctx) return;

    // Scale factor from UV map pixels to our composite texture
    const scale = TEXTURE_SIZE / UV_MAP_SIZE;

    // Step 1: Fill entire texture with shirt color (clean base, no labels)
    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    // Step 2: Draw each design canvas into its correct UV region
    // Preserves aspect ratio and centers within the UV region
    const drawDesign = (dataUrl: string | undefined, regionKey: keyof typeof UV_REGIONS) => {
      return new Promise<void>((resolve) => {
        if (!dataUrl) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          const region = UV_REGIONS[regionKey];
          const dx = region.x * scale;
          const dy = region.y * scale;
          const dw = region.width * scale;
          const dh = region.height * scale;

          // Calculate aspect-ratio-preserving dimensions
          const srcAspect = img.width / img.height;
          const dstAspect = dw / dh;

          let drawW: number, drawH: number, drawX: number, drawY: number;

          if (srcAspect > dstAspect) {
            // Source is wider — fit to width, center vertically
            drawW = dw;
            drawH = dw / srcAspect;
            drawX = dx;
            drawY = dy + (dh - drawH) / 2;
          } else {
            // Source is taller — fit to height, center horizontally
            drawH = dh;
            drawW = dh * srcAspect;
            drawX = dx + (dw - drawW) / 2;
            drawY = dy;
          }

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
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
  }, [designTextures, shirtColor]);

  return (
    <Center>
      <group ref={group} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
};

useGLTF.preload("/models/tshirt.glb");
