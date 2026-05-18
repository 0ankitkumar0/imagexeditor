import { ShoppingCart, ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {

  return (
    <header className="h-11 md:h-14 border-b border-border bg-card flex items-center justify-between px-3 md:px-5 z-20 shrink-0 shadow-sm transition-colors">
      {/* Left: Logo + back link */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 bg-primary text-white rounded-md flex items-center justify-center font-bold text-sm">
            V
          </div>
          <span className="font-semibold text-sm tracking-tight hidden min-[360px]:block text-text-primary">
            TryVirtual
          </span>
        </div>

        <div className="h-4 w-px bg-border hidden sm:block mx-1" />

        {/* Back link — desktop/tablet only */}
        <Link
          href="/"
          className="text-xs font-medium text-text-secondary hover:text-text-primary items-center gap-1 transition-colors hidden sm:flex"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Home icon — mobile only */}
        <Link
          href="/"
          className="text-text-secondary hover:text-text-primary sm:hidden flex items-center p-1 -ml-1"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <ThemeToggle />

        <button className="text-xs font-medium text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-md hover:bg-surface transition-colors hidden sm:block">
          Save Draft
        </button>
        <button className="bg-primary hover:opacity-90 active:scale-95 text-white text-[10px] md:text-xs font-semibold px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-md shadow-sm transition-all flex items-center gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden min-[400px]:inline">Add to Cart ·</span>
          <span>₹ 399</span>
        </button>
      </div>
    </header>
  );
}

