export type OverrideStatus = "found" | "not_found" | "unsupported"
export type TicketStatus = "open" | "in_review" | "resolved" | "rejected"

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
  reviewState: "pending" | "approved" | "rejected"
  reviewNotes: string
  reviewedAt: string | null
}

export interface ClientPlatformOverride {
  id: string
  username: string
  platform: string
  status: OverrideStatus
  note: string
  updatedAt: string
}

const TICKETS_KEY = "ghostrace_tickets"
const OVERRIDES_KEY = "ghostrace_overrides"
const SESSION_KEY = "ghostrace_admin_session"
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "change-me"

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

export function loginAdmin(username: string, password: string) {
  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD

  if (isValid && hasWindow()) {
    window.localStorage.setItem(SESSION_KEY, "authenticated")
  }

  return isValid
}

export function logoutAdmin() {
  if (hasWindow()) {
    window.localStorage.removeItem(SESSION_KEY)
  }
}

export function isAdminLoggedIn() {
  return hasWindow() && window.localStorage.getItem(SESSION_KEY) === "authenticated"
}

export function listClientTickets() {
  return readJson<ClientTicketEntry[]>(TICKETS_KEY, [])
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
    ticketStatus: "open",
    reviewState: "pending",
    reviewNotes: "",
    reviewedAt: null,
  }

  tickets.unshift(ticket)
  writeJson(TICKETS_KEY, tickets)
  return ticket
}

export function reviewClientTicket(input: {
  feedbackId: string
  action: "start_review" | "reopen" | "approve" | "reject"
  finalStatus?: OverrideStatus
  reviewNotes?: string
}) {
  const tickets = listClientTickets()
  const overrides = listClientOverrides()
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === input.feedbackId)

  if (ticketIndex === -1) {
    throw new Error("Ticket not found")
  }

  const ticket = tickets[ticketIndex]

  if (input.action === "start_review") {
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: "in_review",
      reviewNotes: input.reviewNotes?.trim() ?? ticket.reviewNotes,
    }
  } else if (input.action === "reopen") {
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: "open",
      reviewState: "pending",
      reviewNotes: input.reviewNotes?.trim() ?? "",
      reviewedAt: null,
    }
  } else {
    const reviewedAt = new Date().toISOString()
    tickets[ticketIndex] = {
      ...ticket,
      ticketStatus: input.action === "approve" ? "resolved" : "rejected",
      reviewState: input.action === "approve" ? "approved" : "rejected",
      reviewNotes: input.reviewNotes?.trim() ?? "",
      reviewedAt,
    }

    if (input.action === "approve" && input.finalStatus) {
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
