/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/GhostTrace',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
