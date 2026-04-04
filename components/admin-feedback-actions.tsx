"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface AdminFeedbackActionsProps {
  feedbackId: string
}

export function AdminFeedbackActions({ feedbackId }: AdminFeedbackActionsProps) {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitReview(action: "approve" | "reject", finalStatus?: "found" | "not_found" | "unsupported") {
    setIsSubmitting(true)

    try {
      await fetch("/api/admin/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId,
          action,
          finalStatus,
          reviewNotes: notes,
        }),
      })

      router.refresh()
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

      <div className="flex flex-wrap gap-2">
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
