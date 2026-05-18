"use client";

import { useState } from "react";
import { Sparkles, Wand2, Zap, AlertCircle, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIPanelProps {
  addImage: (file: File) => void;
}

export function AIPanel({ addImage }: AIPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const styles = [
    { id: "anime", label: "Anime" },
    { id: "streetwear", label: "Streetwear" },
    { id: "vintage", label: "Vintage" },
    { id: "minimal", label: "Minimal" },
    { id: "cyberpunk", label: "Cyberpunk" },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedBlob(null);
    setIsAdded(false);

    try {
      const response = await fetch("/api/ai-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedImageUrl(url);
      setGeneratedBlob(blob);
    } catch (err) {
      console.error("Generation Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCanvas = () => {
    if (generatedBlob) {
      const file = new File([generatedBlob], "ai-generated.png", { type: "image/png" });
      addImage(file);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    }
  };

  const suggestions = [
    "Cyberpunk tiger",
    "Minimalist mountain sunset",
    "Vintage retro cassette",
    "Abstract geometric patterns"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] md:text-xs font-semibold text-text-secondary uppercase tracking-wider block">
          AI Generation
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            className="w-full h-24 p-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 right-3">
            <Sparkles className="w-4 h-4 text-primary/40" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] md:text-xs font-semibold text-text-secondary uppercase tracking-wider block">
          Select Style
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStyle("")}
            className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all ${
              selectedStyle === ""
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border hover:border-primary/40"
            }`}
          >
            Default
          </button>
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all ${
                selectedStyle === style.id
                  ? "bg-primary text-white border-primary"
                  : "bg-surface border-border hover:border-primary/40"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] md:text-xs font-semibold text-text-secondary uppercase tracking-wider block">
          Suggestions
        </label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              disabled={isGenerating}
              className="text-[10px] px-2.5 py-1.5 rounded-full bg-surface border border-border hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
          isGenerating || !prompt
            ? "bg-surface text-text-secondary cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-primary/20"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate Magic
          </>
        )}
      </button>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-600"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-tight font-medium">{error}</p>
          </motion.div>
        )}

        {generatedImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImageUrl}
                alt="Generated AI art"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleAddToCanvas}
              disabled={isAdded}
              className={`w-full py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isAdded ? "bg-muted text-text-secondary cursor-default" : "bg-success hover:opacity-90"
              }`}
            >
              {isAdded ? (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Added to Canvas
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Design
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Powered by FLUX.1</span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          FLUX.1-schnell generates high-performance graphics optimized for custom apparel design.
        </p>
      </div>
    </div>
  );
}
