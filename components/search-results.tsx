"use client"

import { ExternalLink, Check, X, Loader2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export type ResultStatus = "found" | "not_found" | "checking" | "error"

export interface SearchResult {
  platform: string
  category: string
  url: string
  status: ResultStatus
}

interface SearchResultsProps {
  results: SearchResult[]
  username: string
}

export function SearchResults({ results, username }: SearchResultsProps) {
  const [filterStatus, setFilterStatus] = useState<ResultStatus | "all">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const categories = [...new Set(results.map((r) => r.category))]
  
  const filteredResults = results.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false
    if (filterCategory !== "all" && r.category !== filterCategory) return false
    return true
  })

  const foundCount = results.filter((r) => r.status === "found").length
  const notFoundCount = results.filter((r) => r.status === "not_found").length
  const checkingCount = results.filter((r) => r.status === "checking").length

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tracing:</span>
          <code className="px-2 py-1 bg-secondary rounded text-sm font-mono text-primary">
            {username}
          </code>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="text-success font-medium">{foundCount}</span>
            <span className="text-muted-foreground">found</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
            <span className="text-destructive font-medium">{notFoundCount}</span>
            <span className="text-muted-foreground">not found</span>
          </span>
          {checkingCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">{checkingCount} checking</span>
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="h-7 text-xs"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "found" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("found")}
            className="h-7 text-xs"
          >
            Found
          </Button>
          <Button
            variant={filterStatus === "not_found" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("not_found")}
            className="h-7 text-xs"
          >
            Not Found
          </Button>
        </div>
        <div className="h-4 w-px bg-border mx-2" />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterCategory === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilterCategory("all")}
            className="h-7 text-xs"
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterCategory(cat)}
              className="h-7 text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredResults.map((result) => (
          <ResultCard key={result.platform} result={result} />
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results match your filters
        </div>
      )}
    </div>
  )
}

function ResultCard({ result }: { result: SearchResult }) {
  const statusConfig = {
    found: {
      icon: Check,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
    },
    not_found: {
      icon: X,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
    },
    checking: {
      icon: Loader2,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-border",
    },
    error: {
      icon: X,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
    },
  }

  const config = statusConfig[result.status]
  const Icon = config.icon

  return (
    <div
      className={`group relative p-4 rounded-lg border transition-all ${config.borderColor} ${config.bgColor} hover:border-primary/50`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{result.platform}</h3>
            <Icon
              className={`h-4 w-4 flex-shrink-0 ${config.color} ${
                result.status === "checking" ? "animate-spin" : ""
              }`}
            />
          </div>
          <Badge variant="outline" className="mt-1 text-xs">
            {result.category}
          </Badge>
        </div>
        {result.status === "found" && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-primary" />
          </a>
        )}
      </div>
      {result.status === "found" && (
        <p className="mt-2 text-xs text-muted-foreground font-mono truncate">
          {result.url}
        </p>
      )}
    </div>
  )
}
