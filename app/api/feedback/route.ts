import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createFeedbackEntry } from "@/lib/feedback-store"

const feedbackSchema = z.object({
  username: z.string().min(1).max(100),
  platform: z.string().min(1).max(100),
  currentStatus: z.string().min(1).max(50),
  suggestedStatus: z.enum(["found", "not_found", "unsupported"]),
  note: z.string().max(1000).optional().default(""),
  proofUrl: z.string().max(1000).optional().default(""),
})

export async function POST(request: NextRequest) {
  try {
    const payload = feedbackSchema.parse(await request.json())
    const entry = await createFeedbackEntry(payload)

    return NextResponse.json({
      ok: true,
      feedbackId: entry.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid feedback payload" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
  }
}
