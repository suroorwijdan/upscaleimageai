/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['*', 'lh3.googleusercontent.com', 'evnscjmchcfxoqrrtavy.supabase.co', 'replicate.delivery'],
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
