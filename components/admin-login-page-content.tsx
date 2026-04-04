"use client"

import Link from "next/link"
import { Ghost, Shield } from "lucide-react"
import { AdminLoginForm } from "@/components/admin-login-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

export function AdminLoginPageContent() {
  const { language } = useLanguage()

  return (
    <main className="admin-auth-page min-h-screen bg-background">
      <div className="admin-auth-page__backdrop fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%)]" />
      <div className="admin-auth-page__content relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:py-16">
        <div className="admin-auth-page__layout grid w-full max-w-4xl gap-8 lg:grid-cols-[1fr_420px]">
          <section className="admin-auth-page__intro space-y-6">
            <div className="admin-auth-page__badge inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
              <Shield className="h-3.5 w-3.5" />
              {language === "ru" ? "Доступ администратора" : "Admin Access"}
            </div>

            <div className="admin-auth-page__copy space-y-4">
              <div className="admin-auth-page__brand flex items-center gap-3">
                <Ghost className="h-9 w-9 text-primary" />
                <h1 className="admin-auth-page__title text-3xl font-semibold tracking-tight sm:text-4xl">GhostTrace Admin</h1>
              </div>
              <p className="admin-auth-page__description max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                {language === "ru"
                  ? "Проверяйте пользовательские отчеты, подтверждайте статус профилей вручную и постепенно повышайте качество данных."
                  : "Review user reports, confirm profile status manually, and build a cleaner intelligence layer over time."}
              </p>
            </div>

            <div className="admin-auth-page__actions flex flex-wrap gap-3">
              <Link href="/" className="admin-auth-page__back-link text-sm text-primary hover:underline">
                {language === "ru" ? "Назад на главную" : "Back to homepage"}
              </Link>
              <LanguageSwitcher />
            </div>
          </section>

          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
