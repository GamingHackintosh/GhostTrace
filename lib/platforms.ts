export interface Platform {
  name: string
  category: string
  urlTemplate: string
  icon: string
  checkMethod: "github-api" | "head-status" | "unsupported"
}

export const platforms: Platform[] = [
  // Social Media
  { name: "Twitter/X", category: "Social Media", urlTemplate: "https://twitter.com/{username}", icon: "twitter", checkMethod: "unsupported" },
  { name: "Instagram", category: "Social Media", urlTemplate: "https://instagram.com/{username}", icon: "instagram", checkMethod: "unsupported" },
  { name: "TikTok", category: "Social Media", urlTemplate: "https://tiktok.com/@{username}", icon: "tiktok", checkMethod: "unsupported" },
  { name: "Facebook", category: "Social Media", urlTemplate: "https://facebook.com/{username}", icon: "facebook", checkMethod: "unsupported" },
  { name: "LinkedIn", category: "Social Media", urlTemplate: "https://linkedin.com/in/{username}", icon: "linkedin", checkMethod: "unsupported" },
  { name: "Reddit", category: "Social Media", urlTemplate: "https://reddit.com/user/{username}", icon: "reddit", checkMethod: "unsupported" },
  { name: "Pinterest", category: "Social Media", urlTemplate: "https://pinterest.com/{username}", icon: "pinterest", checkMethod: "unsupported" },
  { name: "Tumblr", category: "Social Media", urlTemplate: "https://{username}.tumblr.com", icon: "tumblr", checkMethod: "unsupported" },
  
  // Developer
  { name: "GitHub", category: "Developer", urlTemplate: "https://github.com/{username}", icon: "github", checkMethod: "github-api" },
  { name: "GitLab", category: "Developer", urlTemplate: "https://gitlab.com/{username}", icon: "gitlab", checkMethod: "unsupported" },
  { name: "Bitbucket", category: "Developer", urlTemplate: "https://bitbucket.org/{username}", icon: "bitbucket", checkMethod: "unsupported" },
  { name: "Stack Overflow", category: "Developer", urlTemplate: "https://stackoverflow.com/users/{username}", icon: "stackoverflow", checkMethod: "unsupported" },
  { name: "Dev.to", category: "Developer", urlTemplate: "https://dev.to/{username}", icon: "devto", checkMethod: "unsupported" },
  { name: "CodePen", category: "Developer", urlTemplate: "https://codepen.io/{username}", icon: "codepen", checkMethod: "unsupported" },
  { name: "Replit", category: "Developer", urlTemplate: "https://replit.com/@{username}", icon: "replit", checkMethod: "unsupported" },
  { name: "npm", category: "Developer", urlTemplate: "https://npmjs.com/~{username}", icon: "npm", checkMethod: "unsupported" },
  
  // Gaming
  { name: "Steam", category: "Gaming", urlTemplate: "https://steamcommunity.com/id/{username}", icon: "steam", checkMethod: "unsupported" },
  { name: "Twitch", category: "Gaming", urlTemplate: "https://twitch.tv/{username}", icon: "twitch", checkMethod: "unsupported" },
  { name: "Discord", category: "Gaming", urlTemplate: "https://discord.com/users/{username}", icon: "discord", checkMethod: "unsupported" },
  { name: "Xbox", category: "Gaming", urlTemplate: "https://xboxgamertag.com/search/{username}", icon: "xbox", checkMethod: "unsupported" },
  { name: "PlayStation", category: "Gaming", urlTemplate: "https://psnprofiles.com/{username}", icon: "playstation", checkMethod: "unsupported" },
  { name: "Roblox", category: "Gaming", urlTemplate: "https://roblox.com/user.aspx?username={username}", icon: "roblox", checkMethod: "unsupported" },
  
  // Media & Content
  { name: "YouTube", category: "Media", urlTemplate: "https://youtube.com/@{username}", icon: "youtube", checkMethod: "unsupported" },
  { name: "Spotify", category: "Media", urlTemplate: "https://open.spotify.com/user/{username}", icon: "spotify", checkMethod: "unsupported" },
  { name: "SoundCloud", category: "Media", urlTemplate: "https://soundcloud.com/{username}", icon: "soundcloud", checkMethod: "unsupported" },
  { name: "Vimeo", category: "Media", urlTemplate: "https://vimeo.com/{username}", icon: "vimeo", checkMethod: "unsupported" },
  { name: "Medium", category: "Media", urlTemplate: "https://medium.com/@{username}", icon: "medium", checkMethod: "unsupported" },
  { name: "Substack", category: "Media", urlTemplate: "https://{username}.substack.com", icon: "substack", checkMethod: "unsupported" },
  
  // Professional
  { name: "Dribbble", category: "Professional", urlTemplate: "https://dribbble.com/{username}", icon: "dribbble", checkMethod: "unsupported" },
  { name: "Behance", category: "Professional", urlTemplate: "https://behance.net/{username}", icon: "behance", checkMethod: "unsupported" },
  { name: "Figma", category: "Professional", urlTemplate: "https://figma.com/@{username}", icon: "figma", checkMethod: "unsupported" },
  { name: "About.me", category: "Professional", urlTemplate: "https://about.me/{username}", icon: "aboutme", checkMethod: "head-status" },
  { name: "Linktree", category: "Professional", urlTemplate: "https://linktr.ee/{username}", icon: "linktree", checkMethod: "head-status" },
  
  // Forums & Communities
  { name: "Hacker News", category: "Forums", urlTemplate: "https://news.ycombinator.com/user?id={username}", icon: "hackernews", checkMethod: "unsupported" },
  { name: "Product Hunt", category: "Forums", urlTemplate: "https://producthunt.com/@{username}", icon: "producthunt", checkMethod: "unsupported" },
  { name: "Quora", category: "Forums", urlTemplate: "https://quora.com/profile/{username}", icon: "quora", checkMethod: "unsupported" },
  
  // Crypto & Finance
  { name: "Keybase", category: "Crypto", urlTemplate: "https://keybase.io/{username}", icon: "keybase", checkMethod: "head-status" },
  { name: "OpenSea", category: "Crypto", urlTemplate: "https://opensea.io/{username}", icon: "opensea", checkMethod: "unsupported" },
  
  // Other
  { name: "Gravatar", category: "Other", urlTemplate: "https://gravatar.com/{username}", icon: "gravatar", checkMethod: "unsupported" },
  { name: "Patreon", category: "Other", urlTemplate: "https://patreon.com/{username}", icon: "patreon", checkMethod: "unsupported" },
  { name: "Ko-fi", category: "Other", urlTemplate: "https://ko-fi.com/{username}", icon: "kofi", checkMethod: "unsupported" },
  { name: "Buy Me a Coffee", category: "Other", urlTemplate: "https://buymeacoffee.com/{username}", icon: "buymeacoffee", checkMethod: "unsupported" },
]

export const categories = [...new Set(platforms.map(p => p.category))]
