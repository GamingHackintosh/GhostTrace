"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminFeedbackActions } from "@/components/admin-feedback-actions"
import { AdminCreateTicketForm } from "@/components/admin-create-ticket-form"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { Button } from "@/components/ui/button"
import {
  getCurrentAdminUser,
  getTicketStatusClasses,
  getTicketStatusLabel,
  isAdminLoggedIn,
  listClientOverrides,
  listClientTickets,
  type ClientPlatformOverride,
  type ClientTicketEntry,
} from "@/lib/client-ticket-store"

export function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"queue" | "create">("queue")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [tickets, setTickets] = useState<ClientTicketEntry[]>([])
  const [overrides, setOverrides] = useState<ClientPlatformOverride[]>([])
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    function loadDashboard() {
      try {
        if (!isAdminLoggedIn()) {
          router.replace("/admin/login")
          return
        }

        if (!cancelled) {
          setTickets(listClientTickets())
          setOverrides(listClientOverrides())
          setCurrentUser(getCurrentAdminUser())
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
    setTickets(listClientTickets())
    setOverrides(listClientOverrides())
    setCurrentUser(getCurrentAdminUser())
  }

  const newTickets = tickets.filter((entry) => entry.ticketStatus === "new")
  const assignedTickets = tickets.filter((entry) => entry.ticketStatus === "assigned")
  const waitingTickets = tickets.filter((entry) => entry.ticketStatus === "waiting")
  const reviewedTickets = tickets.filter(
    (entry) => entry.ticketStatus === "resolved" || entry.ticketStatus === "rejected"
  )
  const userTicketsCount = tickets.filter((entry) => entry.createdBy === "user").length

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-border/60 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">GhostTrace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin ticket queue</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Review user reports, manage manual tickets, and apply verified overrides without leaving static hosting.
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

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                Signed in as {currentUser ?? "admin"}
              </span>
              <Link href="/" className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-accent">
                Homepage
              </Link>
              <Link
                href="/tickets"
                className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-accent"
              >
                Public tickets
              </Link>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatusCard label="Новые" value={newTickets.length} tone="sky" />
            <StatusCard label="Назначенные" value={assignedTickets.length} tone="primary" />
            <StatusCard label="В ожидании" value={waitingTickets.length} tone="amber" />
            <StatusCard label="Решенные" value={tickets.filter((entry) => entry.ticketStatus === "resolved").length} tone="emerald" />
            <StatusCard label="Пользовательские" value={userTicketsCount} tone="muted" />
          </div>
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
              <h2 className="text-xl font-medium">Workflow</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>Users can open tickets from result cards or from the public tickets page.</p>
                <p>Admins can create internal tickets manually, assign them, move them to waiting, and resolve them into overrides.</p>
                <p>All queue data stays in local storage, so localhost and static hosting remain supported.</p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <TicketSection
                title="New tickets"
                description={`${newTickets.length} ticket(s) waiting for assignment`}
                tickets={newTickets}
                emptyMessage="No new tickets right now."
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <TicketSection
                title="Assigned tickets"
                description={`${assignedTickets.length} ticket(s) currently owned by an admin`}
                tickets={assignedTickets}
                emptyMessage="No assigned tickets."
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <TicketSection
                title="Waiting tickets"
                description={`${waitingTickets.length} ticket(s) paused and waiting for confirmation`}
                tickets={waitingTickets}
                emptyMessage="No tickets are in waiting status."
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Reviewed tickets</h2>
                <div className="mt-4 space-y-3">
                  {reviewedTickets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviewed tickets yet.</p>
                  ) : (
                    reviewedTickets.map((entry) => (
                      <TicketCard
                        key={entry.id}
                        ticket={entry}
                        currentUser={currentUser}
                        onUpdated={reloadDashboard}
                        compact
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Queue overview</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>Tickets from users and admin-created tasks share the same queue and lifecycle.</p>
                  <p>Recommended flow: assign ticket, gather proof, move to waiting if needed, then resolve or reject.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">Active overrides</h2>
                <div className="mt-4 space-y-3">
                  {overrides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No manual overrides yet.</p>
                  ) : (
                    overrides.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                        <p className="font-medium">
                          {entry.platform} / <span className="font-mono">{entry.username}</span>
                        </p>
                        <p className="mt-1 text-muted-foreground">Status: {entry.status}</p>
                        <p className="mt-1 text-muted-foreground">
                          Updated: {new Date(entry.updatedAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-muted-foreground">Notes: {entry.note || "No notes"}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}

function StatusCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "sky" | "primary" | "amber" | "emerald" | "muted"
}) {
  const classes = {
    sky: "border-sky-500/20 bg-sky-500/10 text-sky-600",
    primary: "border-primary/20 bg-primary/10 text-primary",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    muted: "border-border/60 bg-background/60 text-muted-foreground",
  }

  return (
    <div className={`rounded-2xl border p-4 ${classes[tone]}`}>
      <p className="text-xs uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}

function TicketSection({
  title,
  description,
  tickets,
  emptyMessage,
  currentUser,
  onUpdated,
}: {
  title: string
  description: string
  tickets: ClientTicketEntry[]
  emptyMessage: string
  currentUser: string | null
  onUpdated: () => void
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 space-y-4">
        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          tickets.map((entry) => (
            <TicketCard
              key={entry.id}
              ticket={entry}
              currentUser={currentUser}
              onUpdated={onUpdated}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TicketCard({
  ticket,
  currentUser,
  onUpdated,
  compact = false,
}: {
  ticket: ClientTicketEntry
  currentUser: string | null
  onUpdated: () => void
  compact?: boolean
}) {
  return (
    <article className="space-y-4 rounded-2xl border border-border/60 bg-background/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{ticket.ticketNumber}</p>
          <h3 className="mt-1 text-lg font-medium">
            {ticket.platform} / <span className="font-mono">{ticket.username}</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Current: {ticket.currentStatus} | Suggested: {ticket.suggestedStatus}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs ${getTicketStatusClasses(ticket.ticketStatus)}`}>
            {getTicketStatusLabel(ticket.ticketStatus)}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
            {ticket.createdBy === "admin" ? "Admin ticket" : "User ticket"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}
        </p>
        <p>
          <strong className="text-foreground">Assignee:</strong> {ticket.assignee || "Unassigned"}
        </p>
        <p>
          <strong className="text-foreground">Note:</strong> {ticket.note || "No note provided"}
        </p>
        <p>
          <strong className="text-foreground">Proof:</strong>{" "}
          {ticket.proofUrl ? (
            <a href={ticket.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {ticket.proofUrl}
            </a>
          ) : (
            "No proof URL"
          )}
        </p>
        {ticket.reviewNotes ? (
          <p>
            <strong className="text-foreground">Review notes:</strong> {ticket.reviewNotes}
          </p>
        ) : null}
      </div>

      <div className={compact ? "pt-1" : ""}>
        <AdminFeedbackActions
          feedbackId={ticket.id}
          ticketStatus={ticket.ticketStatus}
          currentUser={currentUser}
          onUpdated={onUpdated}
        />
      </div>
    </article>
  )
}
