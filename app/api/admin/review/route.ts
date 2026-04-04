import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { reviewFeedbackEntry } from "@/lib/feedback-store"

const reviewSchema = z.object({
  feedbackId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  finalStatus: z.enum(["found", "not_found", "unsupported"]).optional(),
  reviewNotes: z.string().max(1000).optional().default(""),
})

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = reviewSchema.parse(await request.json())
    const entry = await reviewFeedbackEntry(payload)

    return NextResponse.json({ ok: true, entry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid review payload" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to review feedback" }, { status: 500 })
  }
}
