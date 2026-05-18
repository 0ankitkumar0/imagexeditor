"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string | string[]
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  forcedTheme?: string
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  nonce?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  )
}