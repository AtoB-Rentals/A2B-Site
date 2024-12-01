/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*'
            }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;
