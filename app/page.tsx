"use client"

import { useState, useCallback } from "react"
import { UsernameSearch } from "@/components/username-search"
import { SearchResults, SearchResult, ResultStatus } from "@/components/search-results"
import { platforms } from "@/lib/platforms"
import { Ghost } from "lucide-react"

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])

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

    // Check each platform with staggered timing for visual effect
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i]
      const url = platform.urlTemplate.replace("{username}", username)
      
      // Stagger the updates for visual effect
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100))
      
      try {
        const response = await fetch("/api/check-platform", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, platform: platform.name }),
        })
        
        const data = await response.json()
        
        setResults((prev) =>
          prev.map((r) =>
            r.platform === platform.name
              ? { ...r, status: data.exists ? "found" : "not_found" }
              : r
          )
        )
      } catch {
        setResults((prev) =>
          prev.map((r) =>
            r.platform === platform.name ? { ...r, status: "error" } : r
          )
        )
      }
    }

    setIsSearching(false)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="relative flex flex-col items-center px-4 py-16">
        {/* Header */}
        <header className="w-full max-w-4xl flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Ghost className="h-6 w-6 text-primary" />
            <span className="font-semibold">GhostTrace</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              API
            </a>
            <a
              href="https://github.com/GamingHackintosh/GhostTrace"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </header>

        {/* Search Section */}
        <section className={`transition-all duration-500 ${searchedUsername ? "mb-12" : "mt-24"}`}>
          <UsernameSearch onSearch={handleSearch} isSearching={isSearching} />
        </section>

        {/* Results Section */}
        {searchedUsername && (
          <section className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SearchResults results={results} username={searchedUsername} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-16 text-center text-sm text-muted-foreground">
          <p>
            Only public data from open APIs. For security research purposes only.
          </p>
        </footer>
      </div>
    </main>
  )
}
