/** @type {import('next').NextConfig} */
const nextConfig = {};

nextConfig.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig;

