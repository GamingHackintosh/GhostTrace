"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminFeedbackActions } from "@/components/admin-feedback-actions"
import { AdminCreateTicketForm } from "@/components/admin-create-ticket-form"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
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
  const { language } = useLanguage()
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
          setError(language === "ru" ? "Не удалось загрузить локальные тикеты админки." : "Could not load local admin tickets.")
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
    <main className="admin-workspace min-h-screen bg-background">
      <div className="admin-workspace__content mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="admin-workspace__header mb-10 flex flex-col gap-4 border-b border-border/60 pb-6">
          <div className="admin-workspace__header-row flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="admin-workspace__intro">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">GhostTrace</p>
              <h1 className="admin-workspace__title mt-2 text-3xl font-semibold tracking-tight">
                {language === "ru" ? "Очередь тикетов админки" : "Admin ticket queue"}
              </h1>
              <p className="admin-workspace__description mt-2 max-w-2xl text-sm text-muted-foreground">
                {language === "ru"
                  ? "Проверяйте пользовательские отчеты, управляйте ручными тикетами и применяйте подтвержденные overrides без отказа от статического хостинга."
                  : "Review user reports, manage manual tickets, and apply verified overrides without leaving static hosting."}
              </p>
              <div className="admin-workspace__tabs mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={activeTab === "queue" ? "default" : "outline"}
                  onClick={() => setActiveTab("queue")}
                >
                  {language === "ru" ? "Очередь тикетов" : "Ticket queue"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={activeTab === "create" ? "default" : "outline"}
                  onClick={() => setActiveTab("create")}
                >
                  {language === "ru" ? "Создать тикет" : "Create ticket"}
                </Button>
              </div>
            </div>

            <div className="admin-workspace__controls flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
              <span className="admin-workspace__session rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                {language === "ru" ? `Вошли как ${currentUser ?? "admin"}` : `Signed in as ${currentUser ?? "admin"}`}
              </span>
              <LanguageSwitcher />
              <Link href="/" className="admin-workspace__action inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-accent">
                {language === "ru" ? "Главная" : "Homepage"}
              </Link>
              <Link
                href="/tickets"
                className="admin-workspace__action inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-accent"
              >
                {language === "ru" ? "Публичные тикеты" : "Public tickets"}
              </Link>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="admin-workspace__metrics grid grid-cols-2 gap-3 xl:grid-cols-5">
            <StatusCard label="Новые" value={newTickets.length} tone="sky" />
            <StatusCard label="Назначенные" value={assignedTickets.length} tone="primary" />
            <StatusCard label="В ожидании" value={waitingTickets.length} tone="amber" />
            <StatusCard label="Решенные" value={tickets.filter((entry) => entry.ticketStatus === "resolved").length} tone="emerald" />
            <StatusCard label="Пользовательские" value={userTicketsCount} tone="muted" />
          </div>
        </header>

        {isLoading ? (
          <div className="admin-workspace__loading rounded-3xl border border-border/60 bg-card/60 p-6 text-sm text-muted-foreground">
            {language === "ru" ? "Загрузка админ-панели..." : "Loading admin dashboard..."}
          </div>
        ) : error ? (
          <div className="admin-workspace__error rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-700">
            {error}
          </div>
        ) : activeTab === "create" ? (
          <section className="admin-workspace__create-layout grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AdminCreateTicketForm
              onCreated={() => {
                reloadDashboard()
                setActiveTab("queue")
              }}
            />

            <aside className="admin-workspace__guide rounded-3xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-xl font-medium">Workflow</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>{language === "ru" ? "Пользователи могут создавать тикеты из карточек результатов или с публичной страницы очереди." : "Users can open tickets from result cards or from the public tickets page."}</p>
                <p>{language === "ru" ? "Администраторы могут вручную создавать внутренние тикеты, назначать их, переводить в ожидание и завершать с созданием override." : "Admins can create internal tickets manually, assign them, move them to waiting, and resolve them into overrides."}</p>
                <p>{language === "ru" ? "Все данные очереди остаются в localStorage, поэтому localhost и static hosting продолжают работать." : "All queue data stays in local storage, so localhost and static hosting remain supported."}</p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="admin-workspace__queue-layout grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="admin-workspace__main-column space-y-6">
              <TicketSection
                title={language === "ru" ? "Новые тикеты" : "New tickets"}
                description={
                  language === "ru"
                    ? `${newTickets.length} тикет(ов) ждут назначения`
                    : `${newTickets.length} ticket(s) waiting for assignment`
                }
                tickets={newTickets}
                emptyMessage={language === "ru" ? "Сейчас нет новых тикетов." : "No new tickets right now."}
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <TicketSection
                title={language === "ru" ? "Назначенные тикеты" : "Assigned tickets"}
                description={
                  language === "ru"
                    ? `${assignedTickets.length} тикет(ов) сейчас закреплены за администратором`
                    : `${assignedTickets.length} ticket(s) currently owned by an admin`
                }
                tickets={assignedTickets}
                emptyMessage={language === "ru" ? "Нет назначенных тикетов." : "No assigned tickets."}
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <TicketSection
                title={language === "ru" ? "Тикеты в ожидании" : "Waiting tickets"}
                description={
                  language === "ru"
                    ? `${waitingTickets.length} тикет(ов) ожидают дополнительного подтверждения`
                    : `${waitingTickets.length} ticket(s) paused and waiting for confirmation`
                }
                tickets={waitingTickets}
                emptyMessage={language === "ru" ? "Нет тикетов в статусе ожидания." : "No tickets are in waiting status."}
                currentUser={currentUser}
                onUpdated={reloadDashboard}
              />

              <div className="admin-workspace__reviewed-panel rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">{language === "ru" ? "Обработанные тикеты" : "Reviewed tickets"}</h2>
                <div className="mt-4 space-y-3">
                  {reviewedTickets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{language === "ru" ? "Пока нет обработанных тикетов." : "No reviewed tickets yet."}</p>
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

            <aside className="admin-workspace__side-column space-y-6">
              <div className="admin-workspace__summary-panel rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">{language === "ru" ? "Сводка по очереди" : "Queue overview"}</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>{language === "ru" ? "Тикеты от пользователей и задачи, созданные админом, используют одну и ту же очередь и жизненный цикл." : "Tickets from users and admin-created tasks share the same queue and lifecycle."}</p>
                  <p>{language === "ru" ? "Рекомендуемый процесс: назначить тикет, собрать доказательства, при необходимости перевести в ожидание, затем решить или отклонить." : "Recommended flow: assign ticket, gather proof, move to waiting if needed, then resolve or reject."}</p>
                </div>
              </div>

              <div className="admin-workspace__overrides-panel rounded-3xl border border-border/60 bg-card/60 p-6">
                <h2 className="text-xl font-medium">{language === "ru" ? "Активные overrides" : "Active overrides"}</h2>
                <div className="mt-4 space-y-3">
                  {overrides.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{language === "ru" ? "Пока нет ручных overrides." : "No manual overrides yet."}</p>
                  ) : (
                    overrides.map((entry) => (
                      <div key={entry.id} className="override-record rounded-2xl border border-border/50 bg-background/50 p-4 text-sm">
                        <p className="font-medium">
                          {entry.platform} / <span className="font-mono">{entry.username}</span>
                        </p>
                        <p className="mt-1 text-muted-foreground">{language === "ru" ? "Статус" : "Status"}: {entry.status}</p>
                        <p className="mt-1 text-muted-foreground">
                          {language === "ru" ? "Обновлено" : "Updated"}: {new Date(entry.updatedAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {language === "ru" ? "Заметки" : "Notes"}: {entry.note || (language === "ru" ? "Нет заметок" : "No notes")}
                        </p>
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
    <div className={`admin-metric-card rounded-2xl border p-4 ${classes[tone]}`}>
      <p className="text-xs uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-2 text-2xl font-semibold sm:text-3xl">{value}</p>
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
  const { language } = useLanguage()
  return (
    <div className="ticket-lane rounded-3xl border border-border/60 bg-card/60 p-4 sm:p-6">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="ticket-lane__list mt-6 space-y-4">
        {tickets.length === 0 ? (
          <div className="ticket-lane__empty rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
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
  const { language } = useLanguage()
  return (
    <article className="moderation-ticket-card space-y-4 rounded-2xl border border-border/60 bg-background/50 p-4 sm:p-5">
      <div className="moderation-ticket-card__header flex flex-wrap items-center justify-between gap-3">
        <div className="moderation-ticket-card__identity">
          <p className="moderation-ticket-card__number text-xs uppercase tracking-[0.2em] text-muted-foreground">{ticket.ticketNumber}</p>
          <h3 className="moderation-ticket-card__title mt-1 text-lg font-medium">
            {ticket.platform} / <span className="font-mono">{ticket.username}</span>
          </h3>
          <p className="moderation-ticket-card__status-line mt-1 text-sm text-muted-foreground">
            Current: {ticket.currentStatus} | Suggested: {ticket.suggestedStatus}
          </p>
        </div>
        <div className="moderation-ticket-card__badges flex flex-wrap gap-2">
          <span className={`moderation-ticket-card__state rounded-full border px-3 py-1 text-xs ${getTicketStatusClasses(ticket.ticketStatus)}`}>
            {getTicketStatusLabel(ticket.ticketStatus)}
          </span>
          <span className="moderation-ticket-card__origin rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
            {ticket.createdBy === "admin"
              ? language === "ru"
                ? "Тикет администратора"
                : "Admin ticket"
              : language === "ru"
                ? "Пользовательский тикет"
                : "User ticket"}
          </span>
        </div>
      </div>

      <div className="moderation-ticket-card__details grid gap-3 break-words text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">{language === "ru" ? "Создан" : "Submitted"}:</strong> {new Date(ticket.createdAt).toLocaleString()}
        </p>
        <p>
          <strong className="text-foreground">{language === "ru" ? "Исполнитель" : "Assignee"}:</strong> {ticket.assignee || (language === "ru" ? "Не назначен" : "Unassigned")}
        </p>
        <p>
          <strong className="text-foreground">{language === "ru" ? "Комментарий" : "Note"}:</strong> {ticket.note || (language === "ru" ? "Комментарий не указан" : "No note provided")}
        </p>
        <p>
          <strong className="text-foreground">{language === "ru" ? "Доказательство" : "Proof"}:</strong>{" "}
          {ticket.proofUrl ? (
            <a href={ticket.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {ticket.proofUrl}
            </a>
          ) : (
            language === "ru" ? "Нет ссылки" : "No proof URL"
          )}
        </p>
        {ticket.reviewNotes ? (
          <p>
            <strong className="text-foreground">{language === "ru" ? "Заметки модерации" : "Review notes"}:</strong> {ticket.reviewNotes}
          </p>
        ) : null}
      </div>

      <div className={`moderation-ticket-card__actions ${compact ? "pt-1" : ""}`}>
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
