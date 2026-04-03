# 👻 GhostTrace

> Discover hidden profiles. Trace any username across 50+ platforms.

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

**GhostTrace** is a powerful username reconnaissance tool that helps you find online profiles and accounts associated with a specific username across 50+ popular platforms. Whether you're researching, verifying accounts, or conducting digital investigations, GhostTrace makes it easy to discover where a username exists online.

## 🌟 Features

- **Multi-Platform Search**: Search across 50+ platforms including social media, developer networks, gaming platforms, and professional networks
- **Fast & Efficient**: Real-time search with simulated platform checking for instant results
- **Smart Categorization**: Organized platform discovery with categories like Social Media, Developer, Gaming, Media, Professional, and Crypto
- **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS
- **Dark Mode Support**: Full dark mode support for comfortable browsing
- **Real-time Results**: Instant feedback on account availability across platforms

## 📱 Supported Platforms

### Social Media
Twitter/X, Instagram, TikTok, Facebook, LinkedIn, Reddit, Pinterest, Tumblr

### Developer Platforms
GitHub, GitLab, Bitbucket, Stack Overflow, Dev.to, CodePen, Replit, npm

### Gaming Platforms
Steam, Twitch, Discord, Xbox, PlayStation, Roblox

### Media & Content
YouTube, Spotify, SoundCloud, Vimeo, Medium, Substack

### Professional Networks
Dribbble, Behance, Figma, About.me, Linktree

### And more...
Hacker News, Product Hunt, Quora, Keybase, OpenSea, Gravatar, Patreon, Ko-fi, Buy Me a Coffee

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GamingHackintosh/GhostTrace.git
   cd GhostTrace
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2.0 (React 19.2.4)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.2.2
- **UI Components**: Shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Embla Carousel
- **Themes**: next-themes

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── search-results.tsx # Results display
│   └── username-search.tsx # Search form
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── platforms.ts      # Platform definitions
│   └── utils.ts          # Helper functions
├── styles/              # CSS styles
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🔍 How It Works

1. Enter a username in the search box
2. Click "Search" or press Enter
3. Browse through organized platform categories
4. View search results with platform availability
5. Click any result to visit the profile directly

The application simulates checking profile availability with realistic timing and probability based on platform popularity.

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Loading States**: Smooth loading animations during searches
- **Error Handling**: Graceful error messages and fallbacks
- **Accessibility**: Built with accessibility best practices in mind
- **Performance Optimized**: Fast page loads and smooth interactions

## 📝 API Endpoints

### `POST /api/check-platform`

Check profile availability on a specific platform.

**Request:**
```json
{
  "url": "https://github.com/username",
  "platform": "GitHub"
}
```

**Response:**
```json
{
  "exists": true,
  "url": "https://github.com/username",
  "platform": "GitHub",
  "checked": true
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Real API integration for actual profile checking
- [ ] Username availability filtering
- [ ] Bulk username searches
- [ ] Export results to CSV/JSON
- [ ] Browser extension
- [ ] Advanced search filters
- [ ] User accounts and saved searches
- [ ] API rate limiting and authentication

## 📊 Statistics

- **Platforms Supported**: 50+
- **Categories**: 8
- **Built with**: Next.js, React, TypeScript, Tailwind CSS
- **Performance**: Lightning-fast searches with optimized caching

---

**GhostTrace** © 2026. Made with ❤️ for the OSINT community.

[⬆ Back to Top](#ghosttrace)
