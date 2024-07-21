/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Enable This When Checking For Mounting Problems
    transpilePackages: ['@vspark/block-editor', '../../packages/block-editor']
};

export default nextConfig;
