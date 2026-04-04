"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClientTicket } from "@/lib/client-ticket-store"

interface AdminCreateTicketFormProps {
  onCreated?: () => void
}

export function AdminCreateTicketForm({ onCreated }: AdminCreateTicketFormProps) {
  const { language } = useLanguage()
  const [username, setUsername] = useState("")
  const [platform, setPlatform] = useState("")
  const [currentStatus, setCurrentStatus] = useState("unsupported")
  const [suggestedStatus, setSuggestedStatus] = useState<"found" | "not_found" | "unsupported">("found")
  const [note, setNote] = useState("")
  const [proofUrl, setProofUrl] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
      createdBy: "admin",
    })

    setUsername("")
    setPlatform("")
    setCurrentStatus("unsupported")
    setSuggestedStatus("found")
    setNote("")
    setProofUrl("")
    setSuccess(language === "ru" ? "Тикет создан и добавлен в очередь." : "Ticket created and added to the queue.")
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6">
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
        <label className="text-sm text-muted-foreground">{language === "ru" ? "Комментарий администратора" : "Admin note"}</label>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={language === "ru" ? "Опишите, зачем нужно создать этот тикет." : "Describe why this ticket should be created."}
          className="min-h-28"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}

      <Button type="submit">{language === "ru" ? "Создать тикет" : "Create ticket"}</Button>
    </form>
  )
}
