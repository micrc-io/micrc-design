'use strict'

import path from 'path';
import { fileURLToPath } from 'url';

import NextFederationPlugin from '@module-federation/nextjs-mf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sm = (config, options) => {
  const loader = {
    loader: path.resolve(__dirname, './_micrc/loaders/scss.module.cjs'),
  };
  if (options.isServer) {
    if (options.nextRuntime === 'nodejs') {
      config.module.rules[6]?.oneOf[10]?.use?.splice(1, 0, loader);
      config.module.rules[6]?.oneOf[10]?.use?.splice(0, 0, loader);
    }
    if (options.nextRuntime === 'edge') {
      config.module.rules[9]?.oneOf[10]?.use?.splice(1, 0, loader);
      config.module.rules[9]?.oneOf[10]?.use?.splice(0, 0, loader);
    }
  }
};

export const mf = (config, _options) => config.plugins.push(
  new NextFederationPlugin({
    name: 'remote1',
    filename: 'static/chunks/remoteEntry.js',
    exposes: {
      './comp': './unites/comp.tsx',
    },
    shared: {
      'antd/lib/config-provider': {
        eager: false,
        requiredVersion: false,
        singleton: true,
        import: undefined,
      },
      '@ant-design/cssinjs/lib/StyleContext': {
        eager: false,
        requiredVersion: false,
        singleton: true,
        import: undefined,
      },
    },
    extraOptions: {},
  }),
);
