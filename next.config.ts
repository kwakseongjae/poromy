import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    // Configuration to convert SVG files to React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
