import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export type ReviewState = "pending" | "approved" | "rejected"
export type OverrideStatus = "found" | "not_found" | "unsupported"
export type TicketStatus = "open" | "in_review" | "resolved" | "rejected"

export interface FeedbackEntry {
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
  reviewState: ReviewState
  reviewNotes: string
  reviewedAt: string | null
}

export interface PlatformOverride {
  id: string
  username: string
  platform: string
  status: OverrideStatus
  note: string
  updatedAt: string
}

const dataDir = path.join(process.cwd(), "data")
const feedbackFile = path.join(dataDir, "feedback-entries.json")
const overridesFile = path.join(dataDir, "platform-overrides.json")

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true })
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDataDir()

  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await ensureDataDir()
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8")
}

function normalizeFeedbackEntry(entry: Partial<FeedbackEntry>, index: number): FeedbackEntry {
  return {
    id: entry.id || randomUUID(),
    ticketNumber: entry.ticketNumber || `GHT-${String(index + 1).padStart(4, "0")}`,
    username: entry.username || "",
    platform: entry.platform || "",
    currentStatus: entry.currentStatus || "",
    suggestedStatus: entry.suggestedStatus || "found",
    note: entry.note || "",
    proofUrl: entry.proofUrl || "",
    createdAt: entry.createdAt || new Date().toISOString(),
    ticketStatus:
      entry.ticketStatus ||
      (entry.reviewState === "approved"
        ? "resolved"
        : entry.reviewState === "rejected"
          ? "rejected"
          : "open"),
    reviewState: entry.reviewState || "pending",
    reviewNotes: entry.reviewNotes || "",
    reviewedAt: entry.reviewedAt || null,
  }
}

export async function listFeedbackEntries() {
  const entries = await readJsonFile<Partial<FeedbackEntry>[]>(feedbackFile, [])
  return entries.map(normalizeFeedbackEntry)
}

export async function listOverrides() {
  return readJsonFile<PlatformOverride[]>(overridesFile, [])
}

export async function createFeedbackEntry(input: {
  username: string
  platform: string
  currentStatus: string
  suggestedStatus: OverrideStatus
  note?: string
  proofUrl?: string
}) {
  const entries = await listFeedbackEntries()
  const nextTicketNumber = `GHT-${String(entries.length + 1).padStart(4, "0")}`

  const entry: FeedbackEntry = {
    id: randomUUID(),
    ticketNumber: nextTicketNumber,
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

  entries.unshift(entry)
  await writeJsonFile(feedbackFile, entries)

  return entry
}

export async function getFeedbackEntryById(feedbackId: string) {
  const entries = await listFeedbackEntries()
  return entries.find((entry) => entry.id === feedbackId) ?? null
}

export async function getPlatformOverride(username: string, platform: string) {
  const overrides = await listOverrides()
  const normalizedUsername = normalizeValue(username)
  const normalizedPlatform = normalizeValue(platform)

  return (
    overrides.find(
      (item) =>
        normalizeValue(item.username) === normalizedUsername &&
        normalizeValue(item.platform) === normalizedPlatform
    ) ?? null
  )
}

export async function reviewFeedbackEntry(input: {
  feedbackId: string
  action: "start_review" | "reopen" | "approve" | "reject"
  finalStatus?: OverrideStatus
  reviewNotes?: string
}) {
  const entries = await listFeedbackEntries()
  const overrides = await listOverrides()
  const entryIndex = entries.findIndex((entry) => entry.id === input.feedbackId)

  if (entryIndex === -1) {
    throw new Error("Feedback entry not found")
  }

  const entry = entries[entryIndex]
  const reviewedAt = new Date().toISOString()

  if (input.action === "start_review") {
    entries[entryIndex] = {
      ...entry,
      ticketStatus: "in_review",
      reviewNotes: input.reviewNotes?.trim() ?? entry.reviewNotes,
    }

    await writeJsonFile(feedbackFile, entries)
    return entries[entryIndex]
  }

  if (input.action === "reopen") {
    entries[entryIndex] = {
      ...entry,
      ticketStatus: "open",
      reviewState: "pending",
      reviewNotes: input.reviewNotes?.trim() ?? "",
      reviewedAt: null,
    }

    await writeJsonFile(feedbackFile, entries)
    return entries[entryIndex]
  }

  entries[entryIndex] = {
    ...entry,
    ticketStatus: input.action === "approve" ? "resolved" : "rejected",
    reviewState: input.action === "approve" ? "approved" : "rejected",
    reviewNotes: input.reviewNotes?.trim() ?? "",
    reviewedAt,
  }

  if (input.action === "approve" && input.finalStatus) {
    const override: PlatformOverride = {
      id: randomUUID(),
      username: entry.username,
      platform: entry.platform,
      status: input.finalStatus,
      note: input.reviewNotes?.trim() || entry.note,
      updatedAt: reviewedAt,
    }

    const existingIndex = overrides.findIndex(
      (item) =>
        normalizeValue(item.username) === normalizeValue(entry.username) &&
        normalizeValue(item.platform) === normalizeValue(entry.platform)
    )

    if (existingIndex >= 0) {
      overrides[existingIndex] = {
        ...overrides[existingIndex],
        status: override.status,
        note: override.note,
        updatedAt: override.updatedAt,
      }
    } else {
      overrides.unshift(override)
    }
  }

  await writeJsonFile(feedbackFile, entries)
  await writeJsonFile(overridesFile, overrides)

  return entries[entryIndex]
}
