"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { MoveLeft, Check } from "lucide-react";

const ThreeScene = dynamic(() => import("./components/ThreeScene"), { ssr: false });

export default function PreviewPage() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load saved design from local storage
    const savedDesign = localStorage.getItem("tshirt-design");
    if (savedDesign) {
      setTextureUrl(savedDesign);
    }
  }, []);

  if (!textureUrl) {
    return <div className="text-center p-10">Loading design or no design found...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="h-16 px-6 bg-white border-b flex items-center justify-between">
         <Link href="/customize" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
             <MoveLeft className="w-4 h-4" /> Back to Editor
         </Link>
         <h1 className="text-xl font-bold">3D Preview</h1>
         <Button className="bg-green-600 hover:bg-green-700">
             <Check className="mr-2 h-4 w-4" /> Add to Cart
         </Button>
      </header>
      
      <main className="flex-1 relative">
         <div className="absolute inset-0 w-full h-full">
            <ThreeScene designTextures={{ front: textureUrl }} />
         </div>
         
         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 p-4 rounded-xl shadow-lg backdrop-blur-sm">
             <p className="text-sm text-center text-gray-600">
                 Drag to rotate • Scroll to zoom
             </p>
         </div>
      </main>
    </div>
  );
}
