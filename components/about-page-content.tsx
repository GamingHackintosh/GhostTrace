"use client"

import Link from "next/link"
import { Ghost, Radar, Shield, Sparkles, ArrowLeft } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

const featureCards = {
  en: [
    {
      icon: Radar,
      title: "Username mapping",
      description: "GhostTrace turns one username into a structured scan across social, developer, gaming, media, and community platforms.",
    },
    {
      icon: Shield,
      title: "Public-signal mindset",
      description: "The project is framed around public-facing data and discovery patterns used in open-source intelligence workflows.",
    },
    {
      icon: Sparkles,
      title: "Readable results",
      description: "Instead of a raw list of links, the interface groups findings by category and status so the user can read signals faster.",
    },
  ],
  ru: [
    {
      icon: Radar,
      title: "Карта username",
      description: "GhostTrace превращает один username в структурированную карту по социальным, developer, gaming, media и community-платформам.",
    },
    {
      icon: Shield,
      title: "Подход открытых сигналов",
      description: "Проект опирается на публичные сигналы и паттерны поиска, характерные для open-source intelligence.",
    },
    {
      icon: Sparkles,
      title: "Читаемые результаты",
      description: "Вместо сырого списка ссылок интерфейс группирует находки по категориям и статусам, чтобы сигналы читались быстрее.",
    },
  ],
}

const sections = {
  ru: [
    {
      title: "Что такое GhostTrace",
      body: "GhostTrace — это визуальный OSINT-инструмент для поиска цифровых следов по username. Пользователь вводит одно имя, а интерфейс показывает, на каких популярных платформах такой профиль может существовать.",
    },
    {
      title: "Для чего он нужен",
      body: "Проект помогает быстро собрать первичную картину присутствия человека или бренда в сети. Это полезно для исследователей, аналитиков, журналистов, специалистов по безопасности и всех, кто работает с открытыми источниками.",
    },
    {
      title: "Как это выглядит сейчас",
      body: "Текущая версия делает акцент на интерфейсе, структуре результатов и демонстрации UX. Она показывает, как может выглядеть удобный OSINT-поиск по username, с фильтрацией, категориями и понятной визуализацией статусов.",
    },
    {
      title: "Главная идея",
      body: "GhostTrace задуман как быстрый, атмосферный и понятный инструмент, который превращает хаотичный поиск по десяткам сайтов в один аккуратный поток данных.",
    },
  ],
  en: [
    {
      title: "What GhostTrace is",
      body: "GhostTrace is a visual OSINT experience for tracing digital footprints by username. A user enters one handle, and the interface maps where that identity may appear across major platforms.",
    },
    {
      title: "Why it matters",
      body: "The project is useful for early-stage open-source intelligence work. It helps researchers, security teams, journalists, and investigators build a quick picture of a public identity across the web.",
    },
    {
      title: "What this version focuses on",
      body: "The current build is centered on presentation, interaction design, and result structure. It demonstrates how a username intelligence tool can feel fast, readable, and organized even before deeper platform-specific checks are added.",
    },
    {
      title: "Core philosophy",
      body: "GhostTrace aims to turn scattered public traces into a single calm interface: one search, multiple platforms, clean categories, and an immediate sense of where to look next.",
    },
  ],
}

export function AboutPageContent() {
  const { language } = useLanguage()
  const localizedFeatures = featureCards[language]
  const localizedSections = sections[language]

  return (
    <main className="about-page min-h-screen bg-background">
      <div className="about-page__background fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_24%)]" />
      <div className="about-page__container relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="about-header flex flex-col gap-6 border-b border-border/50 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="about-header__brand flex items-center gap-3">
            <div className="about-header__logo-wrap relative">
              <Ghost className="h-9 w-9 text-primary" />
              <div className="about-header__logo-glow absolute inset-0 -z-10 rounded-full bg-primary/20 blur-xl" />
            </div>
            <div className="about-header__title-block">
              <p className="about-header__eyebrow text-sm uppercase tracking-[0.3em] text-muted-foreground">GhostTrace</p>
              <h1 className="about-header__title text-3xl font-semibold tracking-tight sm:text-4xl">
                {language === "ru" ? "О проекте" : "About The Project"}
              </h1>
            </div>
          </div>

          <div className="about-header__actions flex flex-wrap items-center gap-3 text-sm">
            <Link href="/" className="about-header__back-link inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-foreground transition-colors hover:bg-secondary/70">
              <ArrowLeft className="h-4 w-4" />
              {language === "ru" ? "Назад к поиску" : "Back to Search"}
            </Link>
            <Link href="/admin/login" className="about-header__back-link inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-foreground transition-colors hover:bg-secondary/70">
              {language === "ru" ? "Админ" : "Admin"}
            </Link>
            <LanguageSwitcher />
          </div>
        </header>

        <section className="about-hero grid gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="about-hero__content space-y-6">
            <span className="about-hero__eyebrow inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <Radar className="h-3.5 w-3.5" />
              OSINT Username Intelligence
            </span>
            <div className="about-hero__copy space-y-4">
              <h2 className="about-hero__title max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {language === "ru"
                  ? "Кинематографичный интерфейс для поиска публичных цифровых сигналов по сети."
                  : "A cinematic interface for tracing public identity signals across the web."}
              </h2>
              <p className="about-hero__description max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {language === "ru"
                  ? "GhostTrace делает поиск по username более сфокусированным, аккуратным и понятным. Он собирает разрозненные проверки платформ в единый читаемый поток."
                  : "GhostTrace is designed to make username-based discovery feel focused, elegant, and useful. It brings scattered platform checks into one readable search flow with category-based structure and immediate visual feedback."}
              </p>
            </div>
          </div>

          <div className="about-hero__feature-grid grid gap-4">
            {localizedFeatures.map(({ icon: Icon, title, description }) => (
              <article key={title} className="about-feature-card rounded-3xl border border-border/60 bg-card/55 p-5 backdrop-blur-sm transition-colors hover:border-primary/30">
                <div className="about-feature-card__icon mb-3 inline-flex rounded-2xl bg-primary/12 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="about-feature-card__title text-lg font-medium">{title}</h3>
                <p className="about-feature-card__description mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-language-grid grid gap-6 pb-16">
          <article className="about-language-card rounded-[2rem] border border-border/60 bg-card/60 p-6 sm:p-8">
            <div className="about-language-card__header mb-6 flex items-center justify-between gap-3">
              <div className="about-language-card__title-block">
                <p className="about-language-card__eyebrow text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {language === "ru" ? "Русский" : "English"}
                </p>
                <h2 className="about-language-card__title mt-2 text-2xl font-semibold">
                  {language === "ru" ? "О проекте" : "About the project"}
                </h2>
              </div>
              <span className="about-language-card__badge rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                {language.toUpperCase()}
              </span>
            </div>

            <div className="about-language-card__sections space-y-5">
              {localizedSections.map((section) => (
                <div key={section.title} className="about-language-card__section rounded-2xl border border-border/50 bg-background/40 p-5">
                  <h3 className="about-language-card__section-title text-lg font-medium">{section.title}</h3>
                  <p className="about-language-card__section-text mt-2 text-sm leading-7 text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
