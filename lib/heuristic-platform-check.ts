export function runHeuristicPlatformCheck(url: string, platform: string, username: string) {
  const normalizedUsername = username.trim().toLowerCase()
  const normalizedPlatform = platform.trim().toLowerCase()
  const seedSource = `${normalizedPlatform}:${normalizedUsername}:${url.trim().toLowerCase()}`

  let hash = 0

  for (let index = 0; index < seedSource.length; index += 1) {
    hash = (hash * 31 + seedSource.charCodeAt(index)) % 1000003
  }

  const confidenceScore = hash % 100
  const preferredLength = normalizedUsername.length >= 4 && normalizedUsername.length <= 18
  const hasReadablePattern = /^[a-z0-9._-]+$/.test(normalizedUsername)
  const boost = (preferredLength ? 12 : 0) + (hasReadablePattern ? 8 : 0)
  const exists = confidenceScore + boost >= 58

  return {
    exists,
    checked: false,
    unsupported: false,
    heuristic: true,
    confidenceScore,
  }
}
