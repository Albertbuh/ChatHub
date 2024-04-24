/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     images: {
//       domains: ['sun9-6.userapi.com','sun9-31.userapi.com','sun23-1.userapi.com', 'sun23-2.userapi.com', 'pp.userapi.com','sun9-43.userapi.com','sun9-8.userapi.com','sun9-48.userapi.com'],
//     },
//   };
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
  export default nextConfig;