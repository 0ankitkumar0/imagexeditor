# Custom T-Shirt Editor

A Next.js 16 (App Router) project for designing and previewing custom t-shirts in 3D.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **2D Editor**: Fabric.js (v6+)
- **3D Preview**: Three.js + React Three Fiber
- **UI Components**: shadcn/ui patterns
- **Package Manager**: pnpm

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure
- `app/customize`: 2D Editor logic using Fabric.js
- `app/preview`: 3D Preview logic using Three.js
- `components/ui`: UI components (Button, Slider, Dialog)
- `components/common`: Common wrappers
- `lib`: Utilities and helpers

## Notes
- Ensure you have a T-shirt image at `public/images/tshirt-2d.png` for the editor background.
- Ensure you have a GLB model at `public/models/tshirt.glb` for the 3D preview, or the code will use a fallback box.
