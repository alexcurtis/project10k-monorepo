// /** @type {import('next').NextConfig} */

// import transpile from 'next-transpile-modules';

// const withModules = transpile([
//     '../../packages/block-editor'
// ], { debug: true });

// const nextConfig = {
//     reactStrictMode: false, // Enable This When Checking For Mounting Problems
//     // transpilePackages: ['@vspark/block-editor', '../../packages/block-editor']
// };

// export default withModules(nextConfig);


import { join } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const workspace = join(process.cwd(), '../../packages/block-editor');
console.log('workspace', workspace);

export default {
  webpack: (config, options) => {
    config.resolve.plugins = [
      ...config.resolve.plugins,
      new TsconfigPathsPlugin({ configFile: '../../packages/block-editor/tsconfig.json' }),
    ];
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [workspace],
        exclude: /node_modules/,
        use: options.defaultLoaders.babel,
      },
    ];
    return config;
  },
};

