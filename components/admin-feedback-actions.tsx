"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { reviewClientTicket, type TicketStatus } from "@/lib/client-ticket-store"

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
      setError("Could not update the ticket.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Admin notes"
        className="min-h-20 text-sm"
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {ticketStatus === "new" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("assign")} disabled={isSubmitting}>
            Назначить мне
          </Button>
        )}
        {(ticketStatus === "new" || ticketStatus === "assigned") && (
          <Button size="sm" variant="outline" onClick={() => submitReview("mark_waiting")} disabled={isSubmitting}>
            В ожидание
          </Button>
        )}
        {ticketStatus !== "new" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("reopen")} disabled={isSubmitting}>
            Вернуть в новые
          </Button>
        )}
        <Button size="sm" onClick={() => submitReview("resolve", "found")} disabled={isSubmitting}>
          Решить: found
        </Button>
        <Button size="sm" variant="secondary" onClick={() => submitReview("resolve", "not_found")} disabled={isSubmitting}>
          Решить: not found
        </Button>
        <Button size="sm" variant="outline" onClick={() => submitReview("resolve", "unsupported")} disabled={isSubmitting}>
          Решить: unsupported
        </Button>
        <Button size="sm" variant="destructive" onClick={() => submitReview("reject")} disabled={isSubmitting}>
          Отклонить
        </Button>
      </div>
    </div>
  )
}
