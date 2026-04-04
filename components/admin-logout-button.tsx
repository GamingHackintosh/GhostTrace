"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/lib/client-ticket-store"

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    logoutAdmin()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}
