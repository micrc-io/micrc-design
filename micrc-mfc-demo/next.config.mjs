/** @type {import('next').NextConfig} */

import transpilePackages from './transpile.config.mjs';
import { mf } from './mf.config.mjs';

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages,
  webpack(config, options) {
    mf(config, options);
    return config;
  }
};

export default nextConfig;
