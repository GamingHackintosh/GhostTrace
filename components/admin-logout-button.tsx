"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/lib/client-ticket-store"

export function AdminLogoutButton() {
  const router = useRouter()
  const { language } = useLanguage()

  async function handleLogout() {
    logoutAdmin()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      {language === "ru" ? "Выйти" : "Logout"}
    </Button>
  )
}
