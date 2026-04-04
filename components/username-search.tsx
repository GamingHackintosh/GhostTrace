"use client"

import { useState, useCallback } from "react"
import { Search, Ghost, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface UsernameSearchProps {
  onSearch: (username: string) => void
  isSearching: boolean
}

export function UsernameSearch({ onSearch, isSearching }: UsernameSearchProps) {
  const [username, setUsername] = useState("")

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
    <div className="username-search flex flex-col items-center gap-8">
      <div className="username-search__title-group flex items-center gap-3">
        <div className="username-search__logo-wrap relative">
          <Ghost className="h-10 w-10 text-primary" />
          <div className="username-search__logo-glow absolute inset-0 -z-10 bg-primary/30 blur-lg" />
        </div>
        <h1 className="username-search__title text-4xl font-bold tracking-tight">
          Ghost<span className="text-primary">Trace</span>
        </h1>
      </div>
      
      <p className="username-search__description max-w-md text-center text-muted-foreground">
        OSINT Username Intelligence. Enter a username to trace digital footprints across platforms.
      </p>

      <form onSubmit={handleSubmit} className="username-search__form w-full max-w-lg">
        <div className="username-search__controls relative flex gap-2">
          <div className="username-search__input-wrap relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary font-mono"
              disabled={isSearching}
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!username.trim() || isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Tracing
              </>
            ) : (
              "Trace"
            )}
          </Button>
        </div>
      </form>

      <div className="username-search__legend flex items-center gap-4 text-xs text-muted-foreground">
        <span className="username-search__legend-item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" />
          Found
        </span>
        <span className="username-search__legend-item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          Not Found
        </span>
        <span className="username-search__legend-item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
          Checking
        </span>
        <span className="username-search__legend-item flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          Unsupported
        </span>
      </div>
    </div>
  )
}
