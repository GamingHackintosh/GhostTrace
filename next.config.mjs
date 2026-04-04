import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath only needed for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/GhostTrace' : '',
  turbopack: {
    root: projectRoot,
  },
  allowedDevOrigins: ['192.168.1.106'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
