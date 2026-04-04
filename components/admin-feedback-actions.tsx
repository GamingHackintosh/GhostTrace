"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { reviewClientTicket } from "@/lib/client-ticket-store"

interface AdminFeedbackActionsProps {
  feedbackId: string
  ticketStatus?: "open" | "in_review" | "resolved" | "rejected"
  onUpdated?: () => void
}

export function AdminFeedbackActions({ feedbackId, ticketStatus = "open", onUpdated }: AdminFeedbackActionsProps) {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function submitReview(
    action: "start_review" | "reopen" | "approve" | "reject",
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
      })

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
        {ticketStatus === "open" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("start_review")} disabled={isSubmitting}>
            Start review
          </Button>
        )}
        {ticketStatus !== "open" && ticketStatus !== "in_review" && (
          <Button size="sm" variant="outline" onClick={() => submitReview("reopen")} disabled={isSubmitting}>
            Reopen ticket
          </Button>
        )}
        <Button size="sm" onClick={() => submitReview("approve", "found")} disabled={isSubmitting}>
          Approve found
        </Button>
        <Button size="sm" variant="secondary" onClick={() => submitReview("approve", "not_found")} disabled={isSubmitting}>
          Approve not found
        </Button>
        <Button size="sm" variant="outline" onClick={() => submitReview("approve", "unsupported")} disabled={isSubmitting}>
          Mark unsupported
        </Button>
        <Button size="sm" variant="destructive" onClick={() => submitReview("reject")} disabled={isSubmitting}>
          Reject
        </Button>
      </div>
    </div>
  )
}
