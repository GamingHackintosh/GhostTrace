"use client"

import Link from "next/link"
import { useState, useCallback, useEffect } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { UsernameSearch } from "@/components/username-search"
import { SearchResults, SearchResult, ResultStatus } from "@/components/search-results"
import { platforms } from "@/lib/platforms"
import { checkPlatform } from "@/lib/check-platform"
import { getClientOverride, getCurrentAdminUser } from "@/lib/client-ticket-store"
import { Ghost } from "lucide-react"

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentAdminUser, setCurrentAdminUser] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    setCurrentAdminUser(getCurrentAdminUser())
  }, [])

  const handleSearch = useCallback(async (username: string) => {
    setIsSearching(true)
    setSearchedUsername(username)
    
    // Initialize all results as "checking"
    const initialResults: SearchResult[] = platforms.map((p) => ({
      platform: p.name,
      category: p.category,
      url: p.urlTemplate.replace("{username}", username),
      status: "checking" as ResultStatus,
    }))
    setResults(initialResults)

    const nextResults = await Promise.all(
      platforms.map(async (platform) => {
        const url = platform.urlTemplate.replace("{username}", username)
        const override = getClientOverride(username, platform.name)

        if (override) {
          return {
            platform: platform.name,
            category: platform.category,
            url,
            status: override.status as ResultStatus,
          }
        }

        try {
          const data = await checkPlatform(url, platform.name, username, platform.checkMethod)

          return {
            platform: platform.name,
            category: platform.category,
            url,
            status: (data.unsupported ? "unsupported" : data.exists ? "found" : "not_found") as ResultStatus,
          }
        } catch {
          return {
            platform: platform.name,
            category: platform.category,
            url,
            status: "error" as ResultStatus,
          }
        }
      })
    )

    setResults(nextResults)
    setIsSearching(false)
  }, [])

  return (
    <main className="home-page min-h-screen bg-background">
      {/* Background effects */}
      <div className="home-page__background fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="home-page__container relative flex flex-col items-center px-4 py-16">
        {/* Header */}
        <header className="home-header mb-16 flex w-full max-w-4xl items-center justify-between">
          <div className="home-header__brand flex items-center gap-2">
            <Ghost className="h-6 w-6 text-primary" />
            <span className="font-semibold">GhostTrace</span>
          </div>
          <nav className="home-header__nav flex items-center gap-6 text-sm text-muted-foreground">
            {currentAdminUser ? (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                {language === "ru" ? `Админ: ${currentAdminUser}` : `Admin: ${currentAdminUser}`}
              </span>
            ) : null}
            <LanguageSwitcher />
            <Link href="/about" className="home-header__link transition-colors hover:text-foreground">
              {language === "ru" ? "О проекте" : "About"}
            </Link>
            <Link href="/tickets" className="home-header__link transition-colors hover:text-foreground">
              {language === "ru" ? "Тикеты" : "Tickets"}
            </Link>
            <Link href="/admin/login" className="home-header__link transition-colors hover:text-foreground">
              {language === "ru" ? "Админ" : "Admin"}
            </Link>
            <a href="#" className="home-header__link transition-colors hover:text-foreground">
              API
            </a>
            <a
              href="https://github.com/GamingHackintosh/GhostTrace"
              target="_blank"
              rel="noopener noreferrer"
              className="home-header__link transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </header>

        {/* Search Section */}
        <section className={`home-search-section transition-all duration-500 ${searchedUsername ? "mb-12" : "mt-24"}`}>
          <UsernameSearch onSearch={handleSearch} isSearching={isSearching} />
        </section>

        {/* Results Section */}
        {searchedUsername && (
          <section className="home-results-section flex w-full justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SearchResults results={results} username={searchedUsername} />
          </section>
        )}

        {/* Footer */}
        <footer className="home-footer mt-auto pt-16 text-center text-sm text-muted-foreground">
          <p>
            {language === "ru"
              ? "Только публичные данные из открытых API. Только для исследовательских и учебных целей."
              : "Only public data from open APIs. For security research purposes only."}
          </p>
        </footer>
      </div>
    </main>
  )
}
