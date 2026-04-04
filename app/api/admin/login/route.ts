import { NextRequest, NextResponse } from "next/server"
import { validateAdminCredentials, setAdminSession } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!validateAdminCredentials(username ?? "", password ?? "")) {
      return NextResponse.json({ error: "Invalid login or password" }, { status: 401 })
    }

    await setAdminSession()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
