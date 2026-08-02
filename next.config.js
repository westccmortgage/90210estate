/** @type {import('next').NextConfig} */
const nextConfig = {
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

