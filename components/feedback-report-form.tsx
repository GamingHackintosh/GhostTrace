"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ResultStatus } from "@/components/search-results"
import { createClientTicket } from "@/lib/client-ticket-store"

interface FeedbackReportFormProps {
  username: string
  platform: string
  currentStatus: ResultStatus
}

export function FeedbackReportForm({
  username,
  platform,
  currentStatus,
}: FeedbackReportFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [suggestedStatus, setSuggestedStatus] = useState<"found" | "not_found" | "unsupported">("found")
  const [note, setNote] = useState("")
  const [proofUrl, setProofUrl] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      createClientTicket({
        username,
        platform,
        currentStatus,
        suggestedStatus,
        note,
        proofUrl,
      })

      setSubmitted(true)
      setNote("")
      setProofUrl("")
    } catch {
      setError("Could not send feedback right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mt-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
        Thank you. Your report has been added to the moderation queue.
      </div>
    )
  }

  return (
    <div className="mt-3">
      {!isOpen ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          Report issue
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border/60 bg-background/60 p-3 space-y-3"
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <Button
              type="button"
              size="sm"
              variant={suggestedStatus === "found" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setSuggestedStatus("found")}
            >
              Profile exists
            </Button>
            <Button
              type="button"
              size="sm"
              variant={suggestedStatus === "not_found" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setSuggestedStatus("not_found")}
            >
              Profile not found
            </Button>
            <Button
              type="button"
              size="sm"
              variant={suggestedStatus === "unsupported" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setSuggestedStatus("unsupported")}
            >
              Mark unsupported
            </Button>
          </div>

          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Tell us what is wrong and what should be corrected."
            className="min-h-20 text-sm"
          />

          <Input
            value={proofUrl}
            onChange={(event) => setProofUrl(event.target.value)}
            placeholder="Proof URL (optional)"
            className="text-sm"
          />

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-8" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send report"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
