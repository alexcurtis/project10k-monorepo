/** @type {import('next').NextConfig} */

import { join } from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const workspace = join(process.cwd(), "../../packages/block-editor");

export default {
    output: "standalone",
    reactStrictMode: false, // Enable This When Checking For Mounting Problems
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    // // Custom Webpack Resolution for The Block Editor. So It Can Use The @/ tsconfig paths together
    // webpack: (config, options) => {
    //     config.resolve.plugins = [
    //         ...config.resolve.plugins,
    //         new TsconfigPathsPlugin({ configFile: "../../packages/block-editor/tsconfig.json" }),
    //     ];
    //     //Referenced In Fix For TS Paths - But seems to work fine without it
    //     // config.module.rules = [
    //     //     ...config.module.rules,
    //     //     {
    //     //         test: /\.(js|jsx|ts|tsx)$/,
    //     //         include: [workspace],
    //     //         exclude: /node_modules/,
    //     //         use: options.defaultLoaders.babel,
    //     //     },
    //     // ];
    //     return config;
    // },
};
