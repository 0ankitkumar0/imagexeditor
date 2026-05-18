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

interface HoodieModelProps {
  designTextures?: DesignTextures;
  shirtColor?: string;
}

const CONFIG = {
  model: "/models/Hoodie.glb",
  uvMap: "/models/Hooodie-uv.png",
  uvMapSize: 1024,
  regions: {
    front: { x: 5, y: 520, width: 495, height: 495 },
    back: { x: 515, y: 520, width: 495, height: 495 },
    leftSleeve: { x: 535, y: 140, width: 460, height: 380 },
    rightSleeve: { x: 15, y: 140, width: 460, height: 380 },
  },
  centers: {
    front: { x: 0.5, y: 0.53 },
    back: { x: 0.5, y: 0.48 },
    leftSleeve: { x: 0.5, y: 0.55 },
    rightSleeve: { x: 0.5, y: 0.55 },
  },
  cropWidths: {
    body: 1000,
    back: 950,
    sleeve: 750,
  }
};

const TEXTURE_SIZE = 4096;

export const HoodieModel: React.FC<HoodieModelProps> = ({
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

  const { scene } = useGLTF(CONFIG.model);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const img = new Image();
    img.src = CONFIG.uvMap;
    img.onload = () => setBaseMap(img);
  }, []);

  useEffect(() => {
    const cvs = document.createElement("canvas");
    cvs.width = TEXTURE_SIZE;
    cvs.height = TEXTURE_SIZE;
    compositeCanvasRef.current = cvs;

    const tex = new CanvasTexture(cvs);
    tex.flipY = false;
    tex.colorSpace = SRGBColorSpace;
    textureRef.current = tex;

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

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.visible = true; // Force visibility
        const mat = new MeshStandardMaterial({
          color: new Color(shirtColor), // Use shirtColor as base if texture fails
          roughness: 0.7,
          metalness: 0.1,
          map: textureRef.current,
        });
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        materialRef.current = mat;
      }
    });
  }, [clonedScene, shirtColor]);

  // Auto-fit camera logic
  useEffect(() => {
    if (!group.current || cameraFitted) return;
    const box = new Box3().setFromObject(group.current);
    if (box.isEmpty()) return;

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const fov = (camera as any).fov ?? 45;
    const aspect = (camera as any).aspect ?? 1;

    // Calculate distance to fit the object
    const hDist = size.y / (2 * Math.tan((fov * Math.PI) / 360));
    const wDist = (size.x / aspect) / (2 * Math.tan((fov * Math.PI) / 360));
    
    const distance = Math.max(hDist, wDist) * 0.95; // Tighter fit for more zoom

    camera.position.set(center.x, center.y, center.z + distance);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    setCameraFitted(true);
  }, [clonedScene, camera, cameraFitted]);

  useEffect(() => {
    const compositeCvs = compositeCanvasRef.current;
    const tex = textureRef.current;
    if (!compositeCvs || !tex) return;

    const ctx = compositeCvs.getContext("2d");
    if (!ctx) return;

    const scale = TEXTURE_SIZE / CONFIG.uvMapSize;

    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    if (baseMap) {
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(baseMap, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
      ctx.globalCompositeOperation = "source-over";
    }

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

          const isSleeve = regionKey.includes("sleeve") || regionKey.includes("Sleeve");
          let sw = isSleeve ? CONFIG.cropWidths.sleeve : CONFIG.cropWidths.body;
          if (regionKey === "back") sw = CONFIG.cropWidths.back;

          const aspect = region.height / region.width;
          const sh = sw * aspect;

          const center = CONFIG.centers[regionKey];
          const sx = (1456 * center.x) - (sw / 2);
          const sy = (1456 * center.y) - (sh / 2);

          ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataUrl;
      });
    };

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
