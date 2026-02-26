"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { TshirtModel } from "./TshirtModel";

interface DesignTextures {
  front?: string;
  back?: string;
  leftSleeve?: string;
  rightSleeve?: string;
}

interface ThreeSceneProps {
  designTextures?: DesignTextures;
  shirtColor?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ designTextures, shirtColor }) => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 45, near: 0.01, far: 1000 }}
      dpr={[1, 2]}
      style={{ background: '#9ca3af' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -5, -5]} intensity={0.5} />
      <Environment preset="studio" />
      
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={true}
        minDistance={0.5}
        maxDistance={50}
      />
      
      <Suspense fallback={null}>
        <TshirtModel designTextures={designTextures} shirtColor={shirtColor} />
      </Suspense>
    </Canvas>
  );
};

export default ThreeScene;
