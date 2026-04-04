"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAdmin } from "@/lib/client-ticket-store"

export function AdminLoginForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!loginAdmin(username, password)) {
        throw new Error("Invalid credentials")
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError(
        language === "ru"
          ? "Неверный логин или пароль. На localhost используйте admin / admin."
          : "Invalid login or password. Use admin / admin on localhost."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">{language === "ru" ? "Логин" : "Login"}</label>
        <Input value={username} onChange={(event) => setUsername(event.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">{language === "ru" ? "Пароль" : "Password"}</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (language === "ru" ? "Вход..." : "Signing in...") : language === "ru" ? "Войти" : "Sign in"}
      </Button>
    </form>
  )
}
