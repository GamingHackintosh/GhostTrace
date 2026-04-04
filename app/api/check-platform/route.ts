import { NextRequest, NextResponse } from "next/server"
import { getPlatformOverride } from "@/lib/feedback-store"

async function checkByHeadStatus(url: string) {
  const response = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: {
      "User-Agent": "GhostTrace/1.0 (+username-check)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  })

  if (response.status === 405) {
    const fallback = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "GhostTrace/1.0 (+username-check)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    })

    return fallback.status
  }

  return response.status
}

export async function POST(request: NextRequest) {
  try {
    const { url, platform, username, checkMethod } = await request.json()

    if (!url || !platform || !username || !checkMethod) {
      return NextResponse.json({ error: "Missing request fields" }, { status: 400 })
    }

    const override = await getPlatformOverride(username, platform)

    if (override) {
      return NextResponse.json({
        exists: override.status === "found",
        url,
        platform,
        checked: true,
        unsupported: override.status === "unsupported",
        overridden: true,
        overrideStatus: override.status,
      })
    }

    if (checkMethod === "unsupported") {
      return NextResponse.json({
        exists: false,
        url,
        platform,
        checked: false,
        unsupported: true,
      })
    }

    if (checkMethod === "github-api") {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "GhostTrace/1.0",
        },
        cache: "no-store",
      })

      return NextResponse.json({
        exists: response.ok,
        url,
        platform,
        checked: response.ok || response.status === 404,
        unsupported: false,
      })
    }

    if (checkMethod === "head-status") {
      const status = await checkByHeadStatus(url)

      return NextResponse.json({
        exists: status >= 200 && status < 400,
        url,
        platform,
        checked: status < 500,
        unsupported: false,
        statusCode: status,
      })
    }

    return NextResponse.json({ error: "Unsupported check method" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to check platform" }, { status: 500 })
  }
}
