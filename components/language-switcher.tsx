"use client"

import { Globe } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1">
      <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
        <Globe className="h-3.5 w-3.5" />
        <span>Lang</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant={language === "en" ? "default" : "ghost"}
        className="h-8 rounded-full px-3 text-xs"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        type="button"
        size="sm"
        variant={language === "ru" ? "default" : "ghost"}
        className="h-8 rounded-full px-3 text-xs"
        onClick={() => setLanguage("ru")}
      >
        RU
      </Button>
    </div>
  )
}
