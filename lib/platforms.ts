export interface Platform {
  name: string
  category: string
  urlTemplate: string
  icon: string
}

export const platforms: Platform[] = [
  // Social Media
  { name: "Twitter/X", category: "Social Media", urlTemplate: "https://twitter.com/{username}", icon: "twitter" },
  { name: "Instagram", category: "Social Media", urlTemplate: "https://instagram.com/{username}", icon: "instagram" },
  { name: "TikTok", category: "Social Media", urlTemplate: "https://tiktok.com/@{username}", icon: "tiktok" },
  { name: "Facebook", category: "Social Media", urlTemplate: "https://facebook.com/{username}", icon: "facebook" },
  { name: "LinkedIn", category: "Social Media", urlTemplate: "https://linkedin.com/in/{username}", icon: "linkedin" },
  { name: "Reddit", category: "Social Media", urlTemplate: "https://reddit.com/user/{username}", icon: "reddit" },
  { name: "Pinterest", category: "Social Media", urlTemplate: "https://pinterest.com/{username}", icon: "pinterest" },
  { name: "Tumblr", category: "Social Media", urlTemplate: "https://{username}.tumblr.com", icon: "tumblr" },
  
  // Developer
  { name: "GitHub", category: "Developer", urlTemplate: "https://github.com/{username}", icon: "github" },
  { name: "GitLab", category: "Developer", urlTemplate: "https://gitlab.com/{username}", icon: "gitlab" },
  { name: "Bitbucket", category: "Developer", urlTemplate: "https://bitbucket.org/{username}", icon: "bitbucket" },
  { name: "Stack Overflow", category: "Developer", urlTemplate: "https://stackoverflow.com/users/{username}", icon: "stackoverflow" },
  { name: "Dev.to", category: "Developer", urlTemplate: "https://dev.to/{username}", icon: "devto" },
  { name: "CodePen", category: "Developer", urlTemplate: "https://codepen.io/{username}", icon: "codepen" },
  { name: "Replit", category: "Developer", urlTemplate: "https://replit.com/@{username}", icon: "replit" },
  { name: "npm", category: "Developer", urlTemplate: "https://npmjs.com/~{username}", icon: "npm" },
  
  // Gaming
  { name: "Steam", category: "Gaming", urlTemplate: "https://steamcommunity.com/id/{username}", icon: "steam" },
  { name: "Twitch", category: "Gaming", urlTemplate: "https://twitch.tv/{username}", icon: "twitch" },
  { name: "Discord", category: "Gaming", urlTemplate: "https://discord.com/users/{username}", icon: "discord" },
  { name: "Xbox", category: "Gaming", urlTemplate: "https://xboxgamertag.com/search/{username}", icon: "xbox" },
  { name: "PlayStation", category: "Gaming", urlTemplate: "https://psnprofiles.com/{username}", icon: "playstation" },
  { name: "Roblox", category: "Gaming", urlTemplate: "https://roblox.com/user.aspx?username={username}", icon: "roblox" },
  
  // Media & Content
  { name: "YouTube", category: "Media", urlTemplate: "https://youtube.com/@{username}", icon: "youtube" },
  { name: "Spotify", category: "Media", urlTemplate: "https://open.spotify.com/user/{username}", icon: "spotify" },
  { name: "SoundCloud", category: "Media", urlTemplate: "https://soundcloud.com/{username}", icon: "soundcloud" },
  { name: "Vimeo", category: "Media", urlTemplate: "https://vimeo.com/{username}", icon: "vimeo" },
  { name: "Medium", category: "Media", urlTemplate: "https://medium.com/@{username}", icon: "medium" },
  { name: "Substack", category: "Media", urlTemplate: "https://{username}.substack.com", icon: "substack" },
  
  // Professional
  { name: "Dribbble", category: "Professional", urlTemplate: "https://dribbble.com/{username}", icon: "dribbble" },
  { name: "Behance", category: "Professional", urlTemplate: "https://behance.net/{username}", icon: "behance" },
  { name: "Figma", category: "Professional", urlTemplate: "https://figma.com/@{username}", icon: "figma" },
  { name: "About.me", category: "Professional", urlTemplate: "https://about.me/{username}", icon: "aboutme" },
  { name: "Linktree", category: "Professional", urlTemplate: "https://linktr.ee/{username}", icon: "linktree" },
  
  // Forums & Communities
  { name: "Hacker News", category: "Forums", urlTemplate: "https://news.ycombinator.com/user?id={username}", icon: "hackernews" },
  { name: "Product Hunt", category: "Forums", urlTemplate: "https://producthunt.com/@{username}", icon: "producthunt" },
  { name: "Quora", category: "Forums", urlTemplate: "https://quora.com/profile/{username}", icon: "quora" },
  
  // Crypto & Finance
  { name: "Keybase", category: "Crypto", urlTemplate: "https://keybase.io/{username}", icon: "keybase" },
  { name: "OpenSea", category: "Crypto", urlTemplate: "https://opensea.io/{username}", icon: "opensea" },
  
  // Other
  { name: "Gravatar", category: "Other", urlTemplate: "https://gravatar.com/{username}", icon: "gravatar" },
  { name: "Patreon", category: "Other", urlTemplate: "https://patreon.com/{username}", icon: "patreon" },
  { name: "Ko-fi", category: "Other", urlTemplate: "https://ko-fi.com/{username}", icon: "kofi" },
  { name: "Buy Me a Coffee", category: "Other", urlTemplate: "https://buymeacoffee.com/{username}", icon: "buymeacoffee" },
]

export const categories = [...new Set(platforms.map(p => p.category))]
