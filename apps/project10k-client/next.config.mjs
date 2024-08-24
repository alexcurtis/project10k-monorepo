/** @type {import('next').NextConfig} */

import { join } from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const workspace = join(process.cwd(), "../../packages/block-editor");

export default {
    output: "standalone",
    reactStrictMode: false, // Enable This When Checking For Mounting Problems
    swcMinify: false,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};
