"use client"

import { ExternalLink, Check, X, Loader2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeedbackReportForm } from "@/components/feedback-report-form"
import { useState } from "react"

export type ResultStatus = "found" | "not_found" | "checking" | "error" | "unsupported"

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
  const unsupportedCount = results.filter((r) => r.status === "unsupported").length

  return (
    <div className="search-results w-full max-w-4xl space-y-6">
      {/* Stats Bar */}
      <div className="search-results__stats-bar flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/50 bg-card p-4">
        <div className="search-results__username flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tracing:</span>
          <code className="search-results__username-code rounded bg-secondary px-2 py-1 text-sm font-mono text-primary">
            {username}
          </code>
        </div>
        <div className="search-results__stats flex items-center gap-4 text-sm">
          <span className="search-results__stat-item flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="text-success font-medium">{foundCount}</span>
            <span className="text-muted-foreground">found</span>
          </span>
          <span className="search-results__stat-item flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
            <span className="text-destructive font-medium">{notFoundCount}</span>
            <span className="text-muted-foreground">not found</span>
          </span>
          {checkingCount > 0 && (
            <span className="search-results__stat-item flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">{checkingCount} checking</span>
            </span>
          )}
          {unsupportedCount > 0 && (
            <span className="search-results__stat-item flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/70" />
              <span className="text-muted-foreground">{unsupportedCount} unsupported</span>
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="search-results__filters flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="search-results__status-filters flex flex-wrap gap-2">
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
        <div className="search-results__filters-divider mx-2 h-4 w-px bg-border" />
        <div className="search-results__category-filters flex flex-wrap gap-2">
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
      <div className="search-results__grid grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredResults.map((result) => (
          <ResultCard key={result.platform} result={result} username={username} />
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="search-results__empty-state py-12 text-center text-muted-foreground">
          No results match your filters
        </div>
      )}
    </div>
  )
}

function ResultCard({ result, username }: { result: SearchResult; username: string }) {
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
    unsupported: {
      icon: X,
      color: "text-muted-foreground",
      bgColor: "bg-secondary/40",
      borderColor: "border-border/70",
    },
  }

  const config = statusConfig[result.status]
  const Icon = config.icon

  return (
    <div
      className={`search-results__card group relative rounded-lg border p-4 transition-all ${config.borderColor} ${config.bgColor} hover:border-primary/50`}
    >
      <div className="search-results__card-header flex items-start justify-between gap-2">
        <div className="search-results__card-content min-w-0 flex-1">
          <div className="search-results__card-title-row flex items-center gap-2">
            <h3 className="search-results__card-title truncate font-medium">{result.platform}</h3>
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
            className="search-results__card-link rounded-md p-2 transition-colors hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4 text-primary" />
          </a>
        )}
      </div>
      {result.status === "found" && (
        <p className="search-results__card-url mt-2 truncate text-xs font-mono text-muted-foreground">
          {result.url}
        </p>
      )}
      {result.status === "unsupported" && (
        <p className="search-results__card-url mt-2 text-xs text-muted-foreground">
          Reliable automatic check is not available for this platform in the current build.
        </p>
      )}
      <FeedbackReportForm
        username={username}
        platform={result.platform}
        currentStatus={result.status}
      />
    </div>
  )
}
