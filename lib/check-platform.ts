type CheckMethod = "github-api" | "head-status" | "unsupported"

export async function checkPlatform(
  url: string,
  platform: string,
  username: string,
  checkMethod: CheckMethod
) {
  try {
    if (!url || !platform || !username) {
      return { error: "Missing url or platform", exists: false }
    }

    const response = await fetch("/api/check-platform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        platform,
        username,
        checkMethod,
      }),
    })

    if (!response.ok) {
      throw new Error("API route is unavailable")
    }

    return await response.json()
  } catch {
    if (checkMethod === "unsupported") {
      return { exists: false, url, platform, checked: false, unsupported: true }
    }

    if (checkMethod === "github-api") {
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
        return {
          exists: response.ok,
          url,
          platform,
          checked: response.ok || response.status === 404,
          unsupported: false,
        }
      } catch {
        return { error: "Failed to check platform", exists: false }
      }
    }

    return { error: "Failed to check platform", exists: false, unsupported: true }
  }
}
