// next config
const path = require('path');
const fs = require('fs');

const scope = '@micrc';
const scope_reg = /^(.+?[\\/]node_modules)[\\/]((?!@micrc)).*[\\/]*/;
const app_id = '@micrc/demo.web.clientends.test';

const withPlugins = require('next-compose-plugins');

// noinspection JSValidateJSDoc
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  poweredByHeader: false,
  webpack: (
    config,
    _context,
  ) => {
    config.snapshot.managedPaths = [scope_reg];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config
  },
}

const collectModules = () => {
  return fs.readdirSync(path.resolve(require.resolve(app_id), '../../../'))
    .concat(fs.readdirSync(path.resolve(__dirname, 'node_modules/' + scope)) || [])
    .map(it => scope + '/' + it);
};

const withTM = require('next-transpile-modules')([
  ...new Set(collectModules())
]);

const withLess = require('next-with-less');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react"
  }
});

module.exports = withPlugins(
  [
    [withLess],
    [withMDX],
    [withTM],
  ],
  nextConfig,
);
