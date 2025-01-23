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
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;
