"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type SiteLanguage = "en" | "ru"

interface LanguageContextValue {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
}

const STORAGE_KEY = "ghostrace_language"

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en")

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY)

    if (savedLanguage === "ru" || savedLanguage === "en") {
      setLanguageState(savedLanguage)
      document.documentElement.lang = savedLanguage
      return
    }

    const browserLanguage = navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en"
    setLanguageState(browserLanguage)
    document.documentElement.lang = browserLanguage
  }, [])

  function setLanguage(language: SiteLanguage) {
    setLanguageState(language)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language)
      document.documentElement.lang = language
    }
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }

  return context
}
