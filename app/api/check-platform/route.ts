import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, platform } = await request.json()

    if (!url || !platform) {
      return NextResponse.json({ error: "Missing url or platform" }, { status: 400 })
    }

    // Simulate checking the platform with realistic timing
    // In a production app, you would make actual HEAD/GET requests to check profile existence
    // Note: Many platforms block automated requests, so this uses simulation for demo
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 800))

    // Simulate realistic results - some platforms are more likely to have profiles
    const popularPlatforms = [
      "GitHub",
      "Twitter/X",
      "Instagram",
      "Reddit",
      "YouTube",
      "LinkedIn",
      "Discord",
      "Steam",
      "Twitch",
    ]

    const mediumPlatforms = [
      "TikTok",
      "Facebook",
      "Pinterest",
      "Spotify",
      "Medium",
      "Dev.to",
      "Stack Overflow",
      "CodePen",
    ]

    // Determine probability of profile existing based on platform popularity
    let probability = 0.15 // Base probability for uncommon platforms

    if (popularPlatforms.includes(platform)) {
      probability = 0.65
    } else if (mediumPlatforms.includes(platform)) {
      probability = 0.35
    }

    // Use a seeded random based on the URL to get consistent results for the same username
    const hash = url.split("").reduce((acc: number, char: string) => {
      return acc + char.charCodeAt(0)
    }, 0)
    const seededRandom = (hash % 100) / 100

    const exists = seededRandom < probability

    return NextResponse.json({
      exists,
      url,
      platform,
      checked: true,
    })
  } catch {
    return NextResponse.json({ error: "Failed to check platform" }, { status: 500 })
  }
}
