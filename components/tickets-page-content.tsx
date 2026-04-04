"use client"

import Link from "next/link"
import { Ghost } from "lucide-react"
import { PublicTicketBoard } from "@/components/public-ticket-board"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

export function TicketsPageContent() {
  const { language } = useLanguage()

  return (
    <main className="ticket-queue-page min-h-screen bg-background">
      <div className="ticket-queue-page__backdrop fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="ticket-queue-page__content relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="ticket-queue-page__header mb-10 flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="ticket-queue-page__intro">
            <div className="ticket-queue-page__brand flex items-center gap-3">
              <Ghost className="h-8 w-8 text-primary" />
              <h1 className="ticket-queue-page__title text-3xl font-semibold tracking-tight sm:text-4xl">
                {language === "ru" ? "Тикеты GhostTrace" : "GhostTrace Tickets"}
              </h1>
            </div>
            <p className="ticket-queue-page__description mt-3 max-w-2xl text-sm text-muted-foreground">
              {language === "ru"
                ? "Публичная очередь запросов на ручную проверку. Тикеты хранятся локально в браузере, поэтому работают и на static hosting, и на localhost."
                : "Public queue for manual review requests. Tickets are stored locally in the browser so they work on static hosting and localhost."}
            </p>
          </div>

          <div className="ticket-queue-page__actions flex flex-wrap gap-3 text-sm">
            <LanguageSwitcher />
            <Link href="/" className="ticket-queue-page__action inline-flex h-10 items-center rounded-md border border-border px-4 hover:bg-accent">
              {language === "ru" ? "Назад на главную" : "Back to home"}
            </Link>
            <Link href="/admin/login" className="ticket-queue-page__action inline-flex h-10 items-center rounded-md border border-border px-4 hover:bg-accent">
              {language === "ru" ? "Вход в админку" : "Admin login"}
            </Link>
          </div>
        </header>

        <PublicTicketBoard />
      </div>
    </main>
  )
}
