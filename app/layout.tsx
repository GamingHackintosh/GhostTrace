import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SmoothScroll from '../components/smooth-scroll'
import CustomCursor from '../components/custom-cursor'
import { LanguageProvider } from '../components/language-provider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GhostTrace - OSINT Username Intelligence',
  description: 'Track digital footprints across platforms. Enter a username and discover where profiles exist.',
  generator: 'v0.app',
  icons: {
    icon: '/GhostTrace/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <SmoothScroll />
          <CustomCursor />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
