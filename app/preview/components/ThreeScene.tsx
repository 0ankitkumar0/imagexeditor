"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { TshirtModel } from "./TshirtModel";
import { HoodieModel } from "./HoodieModel";
import { ProductType } from "@/app/customize/config";

interface DesignTextures {
  front?: string;
  back?: string;
  leftSleeve?: string;
  rightSleeve?: string;
}

interface ThreeSceneProps {
  designTextures?: DesignTextures;
  shirtColor?: string;
  productType?: ProductType;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ designTextures, shirtColor, productType }) => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 2000 }}
      dpr={[1, 2]}
      style={{ background: '#acb1bd' }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow />
      <directionalLight position={[-10, 10, 5]} intensity={1.5} />
      <directionalLight position={[0, -10, 0]} intensity={0.8} />
      <Environment preset="city" />
      
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5}
        enableZoom={true}
        enablePan={true}
        minDistance={0.5}
        maxDistance={50}
      />
      
      <Suspense fallback={
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" wireframe />
        </mesh>
      }>
        <group key={productType}>
          {productType === "hoodie" ? (
            <HoodieModel designTextures={designTextures} shirtColor={shirtColor} />
          ) : (
            <TshirtModel designTextures={designTextures} shirtColor={shirtColor} />
          )}
        </group>
      </Suspense>
    </Canvas>
  );
};

export default ThreeScene;
