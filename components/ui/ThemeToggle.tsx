"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full bg-surface border border-border/50"
        aria-label="Toggle theme"
      >
        <Sun className="w-4 h-4 text-text-secondary" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center
                 bg-white/80 dark:bg-slate-800/80
                 border border-border/50 dark:border-slate-700/50
                 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                 hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                 active:scale-95
                 backdrop-blur-sm
                 transition-all duration-200 ease-out
                 group"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 text-amber-500 transition-all duration-300
                      ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
        />
        <Moon
          className={`absolute inset-0 w-4 h-4 text-indigo-400 transition-all duration-300
                      ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
        />
      </div>

      <span
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    ${isDark ? "bg-indigo-500/20" : "bg-amber-500/20"}`}
      />

      {isDark && (
        <span className="absolute inset-0 rounded-full animate-pulse bg-indigo-500/10" />
      )}
    </button>
  )
}