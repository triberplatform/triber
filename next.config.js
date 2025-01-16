// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'triber-api-spaces.lon1.digitaloceanspaces.com',
        pathname: '/businesses/logo/**',
      },
    ],
  },
  // add any additional configuration options here
};

module.exports = nextConfig;
