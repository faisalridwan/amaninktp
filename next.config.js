/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // Allow access from local network
    experimental: {
        allowedDevOrigins: [
            'localhost:3000',
            '192.168.1.102:3000',
            '192.168.1.102:3001'
        ]
    }
}

module.exports = nextConfig
