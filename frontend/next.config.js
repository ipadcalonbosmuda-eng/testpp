/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    NEXT_PUBLIC_NETWORK_CHAIN_ID: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID,
    NEXT_PUBLIC_NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
