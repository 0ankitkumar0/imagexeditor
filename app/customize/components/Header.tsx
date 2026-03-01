import { ShoppingCart, ChevronLeft } from "lucide-react";

export function Header() {
  return (
    <header className="h-14 md:h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-3 md:px-6 z-20 shrink-0 shadow-sm">
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-zinc-950 text-white rounded-md flex items-center justify-center font-bold text-base md:text-lg">
            V
          </div>
          <span className="font-semibold text-base md:text-lg tracking-tight hidden sm:block">
            TryVirtual
          </span>
        </div>
        <div className="h-6 w-px bg-zinc-200 hidden sm:block"></div>
        <a
          href="#"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 items-center gap-1 transition-colors hidden sm:flex"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Product
        </a>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-2 md:px-3 py-2 transition-colors hidden sm:block">
          Save Draft
        </button>
        <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-1.5 md:gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Add to Cart -</span> $24.99
        </button>
      </div>
    </header>
  );
}
