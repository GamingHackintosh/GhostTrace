"use client"

import { useState, useCallback } from "react"
import { Search, Ghost, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface UsernameSearchProps {
  onSearch: (username: string) => void
  isSearching: boolean
}

export function UsernameSearch({ onSearch, isSearching }: UsernameSearchProps) {
  const [username, setUsername] = useState("")
  const { language } = useLanguage()

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (username.trim() && !isSearching) {
        onSearch(username.trim())
      }
    },
    [username, isSearching, onSearch]
  )

  return (
    <div className="search-hero flex flex-col items-center gap-6 sm:gap-8">
      <div className="search-hero__brand flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <div className="search-hero__emblem relative">
          <Ghost className="h-10 w-10 text-primary" />
          <div className="search-hero__emblem-glow absolute inset-0 -z-10 bg-primary/30 blur-lg" />
        </div>
        <h1 className="search-hero__title text-3xl font-bold tracking-tight sm:text-4xl">
          Ghost<span className="text-primary">Trace</span>
        </h1>
      </div>
      
      <p className="search-hero__intro max-w-md px-2 text-center text-sm text-muted-foreground sm:text-base">
        {language === "ru"
          ? "OSINT-анализ username. Введите имя пользователя, чтобы проследить цифровые следы по платформам."
          : "OSINT Username Intelligence. Enter a username to trace digital footprints across platforms."}
      </p>

      <form onSubmit={handleSubmit} className="search-form w-full max-w-lg">
        <div className="search-form__row relative flex flex-col gap-2 sm:flex-row">
          <div className="search-form__field relative w-full flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === "ru" ? "Введите username..." : "Enter username..."}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full bg-secondary/50 pl-10 font-mono border-border/50 focus:border-primary"
              disabled={isSearching}
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            className="h-12 w-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 sm:w-auto"
            disabled={!username.trim() || isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {language === "ru" ? "Поиск" : "Tracing"}
              </>
            ) : (
              language === "ru" ? "Проверить" : "Trace"
            )}
          </Button>
        </div>
      </form>

      <div className="search-status-legend flex flex-wrap justify-center gap-x-4 gap-y-2 px-2 text-xs text-muted-foreground">
        <span className="search-status-legend__item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" />
          {language === "ru" ? "Найден" : "Found"}
        </span>
        <span className="search-status-legend__item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          {language === "ru" ? "Не найден" : "Not Found"}
        </span>
        <span className="search-status-legend__item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
          {language === "ru" ? "Проверка" : "Checking"}
        </span>
        <span className="search-status-legend__item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          {language === "ru" ? "Не поддерживается" : "Unsupported"}
        </span>
      </div>
    </div>
  )
}
