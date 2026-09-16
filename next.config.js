/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production builds on Netlify send listing photos through the Image CDN (app/lib/image-cdn.ts).
  env: { IMAGE_CDN: process.env.NETLIFY === 'true' ? 'netlify' : '' },
  images: {
    // Serve remote images directly (no optimization server round-trip),
    // which keeps the demo working in restricted network environments.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;

