"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createClientTicket,
  getTicketStatusClasses,
  getTicketStatusLabel,
  listClientTickets,
  type ClientTicketEntry,
  type OverrideStatus,
} from "@/lib/client-ticket-store"

export function PublicTicketBoard() {
  const { language } = useLanguage()
  const [tickets, setTickets] = useState<ClientTicketEntry[]>([])
  const [username, setUsername] = useState("")
  const [platform, setPlatform] = useState("")
  const [currentStatus, setCurrentStatus] = useState("unsupported")
  const [suggestedStatus, setSuggestedStatus] = useState<OverrideStatus>("found")
  const [note, setNote] = useState("")
  const [proofUrl, setProofUrl] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    setTickets(listClientTickets())
  }, [])

  function reloadTickets() {
    setTickets(listClientTickets())
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!username.trim() || !platform.trim()) {
      setError(language === "ru" ? "Username и платформа обязательны." : "Username and platform are required.")
      return
    }

    createClientTicket({
      username,
      platform,
      currentStatus,
      suggestedStatus,
      note,
      proofUrl,
      createdBy: "user",
    })

    setUsername("")
    setPlatform("")
    setCurrentStatus("unsupported")
    setSuggestedStatus("found")
    setNote("")
    setProofUrl("")
    setSuccess(language === "ru" ? "Тикет создан. Он уже отображается в очереди модерации." : "Ticket created. It is now visible in the moderation queue.")
    reloadTickets()
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">GhostTrace Queue</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{language === "ru" ? "Создать публичный тикет" : "Create a public ticket"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "ru"
              ? "Используйте эту форму, если автоматический результат неверен или вы хотите запросить ручную проверку."
              : "Use this form if the automatic result is wrong or if you want to request a manual review."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Username</label>
            <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="openai" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{language === "ru" ? "Платформа" : "Platform"}</label>
            <Input value={platform} onChange={(event) => setPlatform(event.target.value)} placeholder="GitHub" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{language === "ru" ? "Текущий статус" : "Current status"}</label>
            <Input
              value={currentStatus}
              onChange={(event) => setCurrentStatus(event.target.value)}
              placeholder="unsupported"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{language === "ru" ? "Ожидаемый статус" : "Suggested status"}</label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant={suggestedStatus === "found" ? "default" : "outline"} onClick={() => setSuggestedStatus("found")}>
                {language === "ru" ? "Найден" : "Found"}
              </Button>
              <Button type="button" size="sm" variant={suggestedStatus === "not_found" ? "default" : "outline"} onClick={() => setSuggestedStatus("not_found")}>
                {language === "ru" ? "Не найден" : "Not found"}
              </Button>
              <Button type="button" size="sm" variant={suggestedStatus === "unsupported" ? "default" : "outline"} onClick={() => setSuggestedStatus("unsupported")}>
                {language === "ru" ? "Не поддерживается" : "Unsupported"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{language === "ru" ? "Ссылка-доказательство" : "Proof URL"}</label>
          <Input value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} placeholder="https://example.com/profile" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{language === "ru" ? "Комментарий" : "Comment"}</label>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={language === "ru" ? "Опишите, что именно нужно проверить." : "Explain what should be reviewed."}
            className="min-h-28"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <Button type="submit">{language === "ru" ? "Отправить тикет" : "Submit ticket"}</Button>
      </form>

      <section className="rounded-3xl border border-border/60 bg-card/60 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{language === "ru" ? "Очередь" : "Queue"}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{language === "ru" ? "Видимая очередь тикетов" : "Visible ticket backlog"}</h2>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={reloadTickets}>
            {language === "ru" ? "Обновить" : "Refresh"}
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {tickets.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-background/50 p-5 text-sm text-muted-foreground">
              {language === "ru"
                ? "Тикетов пока нет. Создайте первый с этой страницы или из карточки результата."
                : "No tickets yet. Create the first one from this page or from a result card."}
            </div>
          ) : (
            tickets.map((ticket) => (
              <article key={ticket.id} className="rounded-2xl border border-border/60 bg-background/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{ticket.ticketNumber}</p>
                    <h3 className="mt-1 text-lg font-medium">
                      {ticket.platform} / <span className="font-mono">{ticket.username}</span>
                    </h3>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs ${getTicketStatusClasses(ticket.ticketStatus)}`}>
                    {getTicketStatusLabel(ticket.ticketStatus)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{language === "ru" ? "Текущий" : "Current"}:</strong> {ticket.currentStatus}
                  </p>
                  <p>
                    <strong className="text-foreground">{language === "ru" ? "Ожидаемый" : "Suggested"}:</strong> {ticket.suggestedStatus}
                  </p>
                  <p>
                    <strong className="text-foreground">{language === "ru" ? "Создан" : "Submitted"}:</strong> {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong className="text-foreground">{language === "ru" ? "Исполнитель" : "Assignee"}:</strong> {ticket.assignee || (language === "ru" ? "Пока не назначен" : "Not assigned yet")}
                  </p>
                  <p>
                    <strong className="text-foreground">{language === "ru" ? "Комментарий" : "Comment"}:</strong> {ticket.note || (language === "ru" ? "Без комментария" : "No comment")}
                  </p>
                  {ticket.reviewNotes ? (
                    <p>
                      <strong className="text-foreground">{language === "ru" ? "Заметки модерации" : "Review notes"}:</strong> {ticket.reviewNotes}
                    </p>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
