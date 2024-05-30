/** @type {import('next').NextConfig} */

import transpilePackages from './transpile.config.mjs';
import { mf, sm } from './mf.config.mjs';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages,
  webpack(config, options) {
    mf(config, options);
    sm(config, options);
    return config;
  },
};

export default nextConfig;
