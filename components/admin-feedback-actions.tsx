"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { deleteClientTicket, reviewClientTicket, type TicketStatus } from "@/lib/client-ticket-store"

interface AdminFeedbackActionsProps {
  feedbackId: string
  ticketStatus?: TicketStatus
  currentUser?: string | null
  onUpdated?: () => void
}

export function AdminFeedbackActions({
  feedbackId,
  ticketStatus = "new",
  currentUser,
  onUpdated,
}: AdminFeedbackActionsProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function submitReview(
    action: "assign" | "mark_waiting" | "reopen" | "resolve" | "reject",
    finalStatus?: "found" | "not_found" | "unsupported"
  ) {
    setIsSubmitting(true)
    setError("")

    try {
      reviewClientTicket({
        feedbackId,
        action,
        finalStatus,
        reviewNotes: notes,
        assignee: currentUser ?? undefined,
      })

      setNotes("")
      onUpdated?.()
      router.refresh()
    } catch {
      setError(language === "ru" ? "Не удалось обновить тикет." : "Could not update the ticket.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      language === "ru"
        ? "Удалить этот тикет из очереди? Это действие нельзя отменить."
        : "Delete this ticket from the queue? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      deleteClientTicket(feedbackId)
      onUpdated?.()
      router.refresh()
    } catch {
      setError(language === "ru" ? "Не удалось удалить тикет." : "Could not delete the ticket.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder={language === "ru" ? "Заметки администратора" : "Admin notes"}
        className="min-h-20 text-sm"
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {ticketStatus === "new" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("assign")} disabled={isSubmitting}>
            {language === "ru" ? "Назначить мне" : "Assign to me"}
          </Button>
        )}
        {(ticketStatus === "new" || ticketStatus === "assigned") && (
          <Button size="sm" variant="outline" onClick={() => submitReview("mark_waiting")} disabled={isSubmitting}>
            {language === "ru" ? "В ожидание" : "Move to waiting"}
          </Button>
        )}
        {ticketStatus !== "new" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("reopen")} disabled={isSubmitting}>
            {language === "ru" ? "Вернуть в новые" : "Reopen"}
          </Button>
        )}
        <Button size="sm" onClick={() => submitReview("resolve", "found")} disabled={isSubmitting}>
          {language === "ru" ? "Решить: найден" : "Resolve: found"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => submitReview("resolve", "not_found")} disabled={isSubmitting}>
          {language === "ru" ? "Решить: не найден" : "Resolve: not found"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => submitReview("resolve", "unsupported")} disabled={isSubmitting}>
          {language === "ru" ? "Решить: unsupported" : "Resolve: unsupported"}
        </Button>
        <Button size="sm" variant="destructive" onClick={() => submitReview("reject")} disabled={isSubmitting}>
          {language === "ru" ? "Отклонить" : "Reject"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isSubmitting}>
          {language === "ru" ? "Удалить тикет" : "Delete ticket"}
        </Button>
      </div>
    </div>
  )
}
