"use client"

import Link from "next/link"
import { Ghost } from "lucide-react"
import { PublicTicketBoard } from "@/components/public-ticket-board"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

export function TicketsPageContent() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Ghost className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {language === "ru" ? "Тикеты GhostTrace" : "GhostTrace Tickets"}
              </h1>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {language === "ru"
                ? "Публичная очередь запросов на ручную проверку. Тикеты хранятся локально в браузере, поэтому работают и на static hosting, и на localhost."
                : "Public queue for manual review requests. Tickets are stored locally in the browser so they work on static hosting and localhost."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <LanguageSwitcher />
            <Link href="/" className="inline-flex h-10 items-center rounded-md border border-border px-4 hover:bg-accent">
              {language === "ru" ? "Назад на главную" : "Back to home"}
            </Link>
            <Link href="/admin/login" className="inline-flex h-10 items-center rounded-md border border-border px-4 hover:bg-accent">
              {language === "ru" ? "Вход в админку" : "Admin login"}
            </Link>
          </div>
        </header>

        <PublicTicketBoard />
      </div>
    </main>
  )
}
