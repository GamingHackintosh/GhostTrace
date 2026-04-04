"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminFeedbackActions } from "@/components/admin-feedback-actions"
import { AdminCreateTicketForm } from "@/components/admin-create-ticket-form"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { Button } from "@/components/ui/button"
import { isAdminLoggedIn, listClientOverrides, listClientTickets } from "@/lib/client-ticket-store"

interface FeedbackEntry {
  id: string
  ticketNumber: string
  username: string
  platform: string
  currentStatus: string
  suggestedStatus: "found" | "not_found" | "unsupported"
  note: string
  proofUrl: string
  createdAt: string
  ticketStatus: "open" | "in_review" | "resolved" | "rejected"
  reviewState: "pending" | "approved" | "rejected"
  reviewNotes: string
  reviewedAt: string | null
}

interface PlatformOverride {
  id: string
  username: string
  platform: string
  status: "found" | "not_found" | "unsupported"
  note: string
  updatedAt: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"queue" | "create">("queue")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
  const [overrides, setOverrides] = useState<PlatformOverride[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        if (!isAdminLoggedIn()) {
          router.replace("/admin/login")
          return
        }

        if (!cancelled) {
          setFeedback(listClientTickets())
          setOverrides(listClientOverrides())
          setError("")
        }
      } catch {
        if (!cancelled) {
          setError("Could not load local admin tickets.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [router])

  function reloadDashboard() {
    setFeedback(listClientTickets())
    setOverrides(listClientOverrides())
  }

  const openTickets = feedback.filter((entry) => entry.ticketStatus === "open")
  const inReviewTickets = feedback.filter((entry) => entry.ticketStatus === "in_review")
  const reviewedFeedback = feedback.filter((entry) => entry.reviewState !== "pending").slice(0, 20)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">GhostTrace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin ticket queue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review feedback tickets and apply manual overrides to improve platform accuracy.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={activeTab === "queue" ? "default" : "outline"}
                onClick={() => setActiveTab("queue")}
              >
                Ticket queue
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activeTab === "create" ? "default" : "outline"}
                onClick={() => setActiveTab("create")}
              >
                Create ticket
              </Button>
            </div>
          </div>
          <AdminLogoutButton />
        </header>

        {isLoading ? (
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 text-sm text-muted-foreground">
            Loading admin dashboard...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-700">
            {error}
          </div>
        ) : activeTab === "create" ? (
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminCreateTicketForm
              onCreated={() => {
                reloadDashboard()
                setActiveTab("queue")
              }}
            />

            <aside className="rounded-3xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-xl font-medium">How manual tickets work</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>Use this tab when you want to create a moderation task yourself without waiting for a user report.</p>
                <p>Each created ticket enters the same queue and receives its own ticket number.</p>
                <p>After creation, you can move it into review, resolve it, reject it, or turn it into a manual override.</p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Open tickets</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {openTickets.length} ticket(s) waiting to be taken into review
                </p>

                <div className="mt-6 space-y-4">
                  {openTickets.length === 0 ? (
                    <div className="rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
                      No open tickets right now.
                    </div>
                  ) : (
                    openTickets.map((entry) => (
                      <article key={entry.id} className="rounded-2xl border border-border/60 bg-background/50 p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.ticketNumber}</p>
                            <h3 className="mt-1 text-lg font-medium">
                              {entry.platform} / <span className="font-mono">{entry.username}</span>
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Current: {entry.currentStatus} | Suggested: {entry.suggestedStatus}
                            </p>
                          </div>
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                            Open
                          </span>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground">
                          <p><strong className="text-foreground">Submitted:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                          <p><strong className="text-foreground">Note:</strong> {entry.note || "No note provided"}</p>
                          <p>
                            <strong className="text-foreground">Proof:</strong>{" "}
                            {entry.proofUrl ? (
                              <a href={entry.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {entry.proofUrl}
                              </a>
                            ) : (
                              "No proof URL"
                            )}
                          </p>
                        </div>

                        <AdminFeedbackActions feedbackId={entry.id} ticketStatus={entry.ticketStatus} onUpdated={reloadDashboard} />
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Tickets in review</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inReviewTickets.length} ticket(s) currently being reviewed
                </p>

                <div className="mt-6 space-y-4">
                  {inReviewTickets.length === 0 ? (
                    <div className="rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
                      No tickets in review.
                    </div>
                  ) : (
                    inReviewTickets.map((entry) => (
                      <article key={entry.id} className="rounded-2xl border border-border/60 bg-background/50 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.ticketNumber}</p>
                            <h3 className="mt-1 text-lg font-medium">
                              {entry.platform} / <span className="font-mono">{entry.username}</span>
                            </h3>
                          </div>
                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-600">
                            In review
                          </span>
                        </div>

                        <div className="mt-4">
                          <AdminFeedbackActions feedbackId={entry.id} ticketStatus={entry.ticketStatus} onUpdated={reloadDashboard} />
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Resolved and rejected tickets</h2>
                <div className="mt-4 space-y-3">
                  {reviewedFeedback.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviewed feedback yet.</p>
                  ) : (
                    reviewedFeedback.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{entry.ticketNumber}</p>
                        <p className="font-medium">
                          {entry.platform} / <span className="font-mono">{entry.username}</span>
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {entry.ticketStatus} at {entry.reviewedAt ? new Date(entry.reviewedAt).toLocaleString() : "-"}
                        </p>
                        <p className="mt-1 text-muted-foreground">Notes: {entry.reviewNotes || "No notes"}</p>
                        <div className="mt-3">
                          <AdminFeedbackActions feedbackId={entry.id} ticketStatus={entry.ticketStatus} onUpdated={reloadDashboard} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-xl font-medium">Active overrides</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manual decisions that take priority over automatic checks
              </p>

              <div className="mt-5 space-y-3">
                {overrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No overrides yet.</p>
                ) : (
                  overrides.map((override) => (
                    <div key={override.id} className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                      <p className="font-medium">
                        {override.platform} / <span className="font-mono">{override.username}</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">Final status: {override.status}</p>
                      <p className="mt-1 text-muted-foreground">Updated: {new Date(override.updatedAt).toLocaleString()}</p>
                      <p className="mt-1 text-muted-foreground">Note: {override.note || "No note"}</p>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}
