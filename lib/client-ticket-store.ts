export type OverrideStatus = "found" | "not_found" | "unsupported"
export type TicketStatus = "new" | "assigned" | "waiting" | "resolved" | "rejected"
export type TicketReviewState = "pending" | "approved" | "rejected"
export type TicketCreatedBy = "user" | "admin"

export interface ClientTicketEntry {
  id: string
  ticketNumber: string
  username: string
  platform: string
  currentStatus: string
  suggestedStatus: OverrideStatus
  note: string
  proofUrl: string
  createdAt: string
  ticketStatus: TicketStatus
  reviewState: TicketReviewState
  reviewNotes: string
  reviewedAt: string | null
  createdBy: TicketCreatedBy
  assignee: string | null
}

export interface ClientPlatformOverride {
  id: string
  username: string
  platform: string
  status: OverrideStatus
  note: string
  updatedAt: string
}

interface AdminSession {
  username: string
  loggedInAt: string
}

const TICKETS_KEY = "ghostrace_tickets"
const OVERRIDES_KEY = "ghostrace_overrides"
const SESSION_KEY = "ghostrace_admin_session"
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORDS = ["admin", "change-me"]

function hasWindow() {
  return typeof window !== "undefined"
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function getLegacyStatus(status?: string): TicketStatus {
  switch (status) {
    case "open":
      return "new"
    case "in_review":
      return "assigned"
    case "resolved":
      return "resolved"
    case "rejected":
      return "rejected"
    case "new":
    case "assigned":
    case "waiting":
      return status
    default:
      return "new"
  }
}

function readSession() {
  if (!hasWindow()) {
    return null
  }

  const raw = window.localStorage.getItem(SESSION_KEY)

  if (!raw) {
    return null
  }

  if (raw === "authenticated") {
    return {
      username: ADMIN_USERNAME,
      loggedInAt: new Date().toISOString(),
    } satisfies AdminSession
  }

  try {
    const parsed = JSON.parse(raw) as AdminSession
    return parsed.username ? parsed : null
  } catch {
    return null
  }
}

export function getTicketStatusLabel(status: TicketStatus) {
  switch (status) {
    case "new":
      return "Новый"
    case "assigned":
      return "Назначен"
    case "waiting":
      return "В ожидании"
    case "resolved":
      return "Решен"
    case "rejected":
      return "Отклонен"
    default:
      return status
  }
}

export function getTicketStatusClasses(status: TicketStatus) {
  switch (status) {
    case "new":
      return "border-sky-500/20 bg-sky-500/10 text-sky-600"
    case "assigned":
      return "border-primary/20 bg-primary/10 text-primary"
    case "waiting":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600"
    case "resolved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
    case "rejected":
      return "border-destructive/20 bg-destructive/10 text-destructive"
    default:
      return "border-border/60 bg-background/50 text-muted-foreground"
  }
}

export function loginAdmin(username: string, password: string) {
  const normalizedUsername = username.trim()
  const isValid = normalizedUsername === ADMIN_USERNAME && ADMIN_PASSWORDS.includes(password)

  if (isValid && hasWindow()) {
    writeJson(SESSION_KEY, {
      username: normalizedUsername,
      loggedInAt: new Date().toISOString(),
    } satisfies AdminSession)
  }

  return isValid
}

export function logoutAdmin() {
  if (hasWindow()) {
    window.localStorage.removeItem(SESSION_KEY)
  }
}

export function isAdminLoggedIn() {
  return Boolean(readSession())
}

export function getCurrentAdminUser() {
  return readSession()?.username ?? null
}

export function listClientTickets() {
  const tickets = readJson<Partial<ClientTicketEntry>[]>(TICKETS_KEY, [])

  return tickets.map((ticket, index) => ({
    id: ticket.id || crypto.randomUUID(),
    ticketNumber: ticket.ticketNumber || `GHT-${String(index + 1).padStart(4, "0")}`,
    username: ticket.username?.trim() || "",
    platform: ticket.platform?.trim() || "",
    currentStatus: ticket.currentStatus?.trim() || "unsupported",
    suggestedStatus: ticket.suggestedStatus || "found",
    note: ticket.note?.trim() || "",
    proofUrl: ticket.proofUrl?.trim() || "",
    createdAt: ticket.createdAt || new Date().toISOString(),
    ticketStatus: getLegacyStatus(ticket.ticketStatus),
    reviewState: ticket.reviewState || "pending",
    reviewNotes: ticket.reviewNotes?.trim() || "",
    reviewedAt: ticket.reviewedAt || null,
    createdBy: ticket.createdBy || "user",
    assignee: ticket.assignee?.trim() || null,
  }))
}

export function listClientOverrides() {
  return readJson<ClientPlatformOverride[]>(OVERRIDES_KEY, [])
}

export function createClientTicket(input: {
  username: string
  platform: string
  currentStatus: string
  suggestedStatus: OverrideStatus
  note?: string
  proofUrl?: string
  createdBy?: TicketCreatedBy
}) {
  const tickets = listClientTickets()
  const ticket: ClientTicketEntry = {
    id: crypto.randomUUID(),
    ticketNumber: `GHT-${String(tickets.length + 1).padStart(4, "0")}`,
    username: input.username.trim(),
    platform: input.platform.trim(),
    currentStatus: input.currentStatus.trim(),
    suggestedStatus: input.suggestedStatus,
    note: input.note?.trim() ?? "",
    proofUrl: input.proofUrl?.trim() ?? "",
    createdAt: new Date().toISOString(),
    ticketStatus: "new",
    reviewState: "pending",
    reviewNotes: "",
    reviewedAt: null,
    createdBy: input.createdBy ?? "user",
    assignee: null,
  }

  tickets.unshift(ticket)
  writeJson(TICKETS_KEY, tickets)
  return ticket
}

export function reviewClientTicket(input: {
  feedbackId: string
  action: "assign" | "mark_waiting" | "reopen" | "resolve" | "reject"
  finalStatus?: OverrideStatus
  reviewNotes?: string
  assignee?: string
}) {
  const tickets = listClientTickets()
  const overrides = listClientOverrides()
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === input.feedbackId)

  if (ticketIndex === -1) {
    throw new Error("Ticket not found")
  }

  const ticket = tickets[ticketIndex]

  if (input.action === "assign") {
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: "assigned",
      assignee: input.assignee?.trim() || ticket.assignee,
      reviewNotes: input.reviewNotes?.trim() ?? ticket.reviewNotes,
    }
  } else if (input.action === "mark_waiting") {
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: "waiting",
      assignee: input.assignee?.trim() || ticket.assignee,
      reviewNotes: input.reviewNotes?.trim() ?? ticket.reviewNotes,
    }
  } else if (input.action === "reopen") {
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: "new",
      reviewState: "pending",
      reviewNotes: input.reviewNotes?.trim() ?? "",
      reviewedAt: null,
      assignee: null,
    }
  } else {
    const reviewedAt = new Date().toISOString()
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: input.action === "resolve" ? "resolved" : "rejected",
      reviewState: input.action === "resolve" ? "approved" : "rejected",
      reviewNotes: input.reviewNotes?.trim() ?? "",
      reviewedAt,
      assignee: input.assignee?.trim() || ticket.assignee,
    }

    if (input.action === "resolve" && input.finalStatus) {
      const override = {
        id: crypto.randomUUID(),
        username: ticket.username,
        platform: ticket.platform,
        status: input.finalStatus,
        note: input.reviewNotes?.trim() || ticket.note,
        updatedAt: reviewedAt,
      }

      const existingIndex = overrides.findIndex(
        (item) =>
          normalizeValue(item.username) === normalizeValue(ticket.username) &&
          normalizeValue(item.platform) === normalizeValue(ticket.platform)
      )

      if (existingIndex >= 0) {
        overrides[existingIndex] = override
      } else {
        overrides.unshift(override)
      }
    }
  }

  writeJson(TICKETS_KEY, tickets)
  writeJson(OVERRIDES_KEY, overrides)
  return tickets[ticketIndex]
}

export function getClientOverride(username: string, platform: string) {
  const overrides = listClientOverrides()

  return (
    overrides.find(
      (item) =>
        normalizeValue(item.username) === normalizeValue(username) &&
        normalizeValue(item.platform) === normalizeValue(platform)
    ) ?? null
  )
}
