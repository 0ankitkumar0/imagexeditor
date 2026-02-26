import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Design Your Dream T-Shirt
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Create unique custom t-shirts with our easy-to-use 3D design editor. 
        Upload images, add text, and preview in real-time.
      </p>
      
      <div className="flex gap-4">
        <Link href="/customize">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Designing
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6">
           Learn More
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
             <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto text-blue-600 text-xl font-bold">1</div>
             <h3 className="font-semibold text-lg mb-2">Customize</h3>
             <p className="text-gray-500">Add text, images, and shapes to your t-shirt design.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
             <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto text-purple-600 text-xl font-bold">2</div>
             <h3 className="font-semibold text-lg mb-2">Preview 3D</h3>
             <p className="text-gray-500">See how your design looks on a real model in 3D.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
             <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto text-green-600 text-xl font-bold">3</div>
             <h3 className="font-semibold text-lg mb-2">Order</h3>
             <p className="text-gray-500">Get your custom t-shirt delivered to your doorstep.</p>
          </div>
      </div>
    </div>
  );
}
