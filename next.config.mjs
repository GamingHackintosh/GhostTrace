/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath only needed for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/GhostTrace' : '',
  allowedDevOrigins: ['192.168.1.106'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
