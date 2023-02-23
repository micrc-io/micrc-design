/**
 * next.config.js
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import type { ClientendContextData } from '../../_parser';

const tmpl = `// next config
const path = require('path');
const fs = require('fs');

const scope = '@colibri-tech';
const scope_reg = /^(.+?[\\/]node_modules)[\\/]((?!@colibri-tech)).*[\\/]*/;
const app_id = scope + '/system-design._apps.web.colibri-official-website';

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

const withTM = require('next-transpile-modules')([
    ...new Set(
        fs.readdirSync(path.resolve(require.resolve(app_id), '../../../'))
            .concat(fs.readdirSync(path.resolve(__dirname, 'node_modules/' + scope)))
            .filter(it => /^.*-design\\..*/.test(it))
            .map(it => scope + '/' + it)
    )
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

export function indexFile(data: ClientendContextData) {
  return `';
`;
}
