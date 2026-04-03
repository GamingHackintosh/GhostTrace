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
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Ghost className="h-10 w-10 text-primary" />
          <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Ghost<span className="text-primary">Trace</span>
        </h1>
      </div>
      
      <p className="text-muted-foreground text-center max-w-md">
        OSINT Username Intelligence. Enter a username to trace digital footprints across platforms.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
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

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" />
          Found
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          Not Found
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
          Checking
        </span>
      </div>
    </div>
  )
}
