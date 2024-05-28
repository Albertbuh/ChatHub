/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "sun25-1.userapi.com",
            port: "",
            pathname: "/**",
        }, {
            protocol: "https",
            hostname: "sun25-2.userapi.com",
            port: "",
            pathname: "/**",
        }, {
            protocol: "https",
            hostname: "pp.userapi.com",
            port: "",
            pathname: "/**",
        }, 
        {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**',
          },
        {
            protocol: "https",
            hostname: "sun9-21.userapi.com",
            port: "",
            pathname: "/**",
        }],
        
    },
};

export default nextConfig;
