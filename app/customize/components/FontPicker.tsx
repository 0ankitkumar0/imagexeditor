"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { GOOGLE_FONTS, loadGoogleFont } from "../data/googleFonts";

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load the currently selected font for preview
  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Filtered fonts list
  const filteredFonts = useMemo(() => {
    if (!search.trim()) return GOOGLE_FONTS;
    const q = search.toLowerCase().trim();
    return GOOGLE_FONTS.map((cat) => ({
      ...cat,
      fonts: cat.fonts.filter((f) => f.toLowerCase().includes(q)),
    })).filter((cat) => cat.fonts.length > 0);
  }, [search]);

  const totalResults = filteredFonts.reduce(
    (acc, cat) => acc + cat.fonts.length,
    0
  );

  const handleSelect = (font: string) => {
    onChange(font);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-left text-sm flex items-center justify-between gap-2 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
        style={{ fontFamily: `"${value}", sans-serif` }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow-xl max-h-[340px] flex flex-col overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-zinc-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fonts..."
                className="w-full pl-7 pr-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Font list */}
          <div ref={listRef} className="overflow-y-auto flex-1">
            {filteredFonts.map((cat) => (
              <div key={cat.category}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 sticky top-0 border-b border-zinc-100">
                  {cat.category}
                </div>
                {cat.fonts.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(font)}
                    onClick={() => handleSelect(font)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 transition-colors flex items-center ${
                      value === font
                        ? "bg-zinc-100 text-zinc-900 font-medium"
                        : "text-zinc-700"
                    }`}
                    style={{ fontFamily: `"${font}", sans-serif` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            ))}
            {totalResults === 0 && (
              <div className="px-3 py-6 text-sm text-zinc-400 text-center">
                No fonts found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
