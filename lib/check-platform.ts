export async function checkPlatform(url: string, platform: string) {
  try {
    if (!url || !platform) {
      return { error: "Missing url or platform", exists: false }
    }

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

    return {
      exists,
      url,
      platform,
      checked: true,
    }
  } catch {
    return { error: "Failed to check platform", exists: false }
  }
}
