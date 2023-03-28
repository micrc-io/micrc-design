/**
 * next.config.js
 */
import HandleBars from 'handlebars';

import type { ClientendContextData } from '../../_parser';

const tmpl = `// next config
const path = require('path');
const fs = require('fs');

const scope = '{{intro.account}}';
const scope_reg = {{{intro.accountPackageReg}}};
const app_id = '{{intro.appId}}';

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
  const modules = fs.readdirSync(path.resolve(require.resolve(app_id), '../../../'));
  if (fs.existsSync(path.resolve(__dirname, 'node_modules/' + scope))) {
    modules.concat(fs.readdirSync(path.resolve(__dirname, 'node_modules/' + scope)));
  }
  return modules.map(it => scope + '/' + it);
};

const withTM = require('next-transpile-modules')([
  ...new Set(collectModules())
]);

const withLess = require('next-with-less');

const withMDX = require('@next/mdx')({
  extension: /\\.mdx?$/,
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
`;

export function appConfigFile(data: ClientendContextData) {
  return HandleBars.compile(tmpl)(data);
}
