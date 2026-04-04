import { createHash } from "node:crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE_NAME = "ghostrace_admin_session"

function getAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "change-me",
    secret: process.env.ADMIN_SESSION_SECRET || "ghosttrace-local-session-secret",
  }
}

function buildSessionToken() {
  const { username, password, secret } = getAdminConfig()

  return createHash("sha256")
    .update(`${username}:${password}:${secret}`)
    .digest("hex")
}

export function validateAdminCredentials(username: string, password: string) {
  const config = getAdminConfig()
  return username === config.username && password === config.password
}

export async function setAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_COOKIE_NAME, buildSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === buildSessionToken()
}
