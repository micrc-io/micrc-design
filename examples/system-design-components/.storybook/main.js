// noinspection JSUnresolvedVariable,JSUnresolvedFunction,NpmUsedModulesInstalled
const webpack = require('webpack');
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,NpmUsedModulesInstalled
const CopyWebpackPlugin = require('copy-webpack-plugin');
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,NodeCoreCodingAssistance
const path = require('path');

const scope_reg = /^(.+?[\\/]node_modules)[\\/]((?!@micrc)).*[\\/]*/;

// noinspection JSUnresolvedVariable
module.exports = {
  "stories": [
    "../design/!(_apps)/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5",
  },
  "staticDirs": ['../public/storybook'],
  "babel": options => ({
    ...options,
    plugins: [
      ...options.plugins,
      babel_taro_h5_plugin,
    ],
  }),
  "webpackFinal": config => {
    return ({
      ...config,
      snapshot: {
        ...config.snapshot,
        managedPaths: [scope_reg],
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          ...webpack_taro_h5_rules,
          ...webpack_scss_rules,
        ],
      },
      resolve: {
        ...config.resolve,
        mainFields: webpack_taro_h5_mainFields,
        alias: {
          ...config.resolve.alias,
          ...webpack_taro_h5_alias,
        },
        fallback: {
          ...config.resolve.fallback,
          ...msw_node_module_fallback,
          ...openapi_node_module_fallback,
        },
      },
      plugins: [
        ...config.plugins,
        ...webpack_taro_h5_plugins,
        ...webpack_msw_plugins(config.output.path),
        ...webpack_openapi_merge_plugins,
      ],
    });
  },
}


// noinspection JSUnresolvedFunction,NpmUsedModulesInstalled,JSUnresolvedVariable
const babel_taro_h5_plugin = [
  require('babel-plugin-transform-taroapi').default,
  {
    apis: require(
        require.resolve(
            '@tarojs/taro-h5/dist/taroApis', {
              paths: [
                path.resolve(__dirname, '..')
              ]
            })
    ),
    packageName: '@tarojs/taro'
  },
];

// noinspection JSUnresolvedFunction,NpmUsedModulesInstalled
const webpack_scss_rules = [
  {
    test: /\.(scss|sass)$/,
    exclude: /(taro-ui)/,
    sideEffects: true,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
          }
        }
      },
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        }
      }
    ]
  }
];

// noinspection JSUnresolvedFunction,NpmUsedModulesInstalled
const webpack_taro_h5_rules = [
  {
    test: /(?<!\.module)\.(scss|sass)$/,
    include: /(taro-ui)/,
    sideEffects: true,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              require('postcss-pxtransform')({
                platform: 'h5',
                designWidth: 750,
              })
            ]
          }
        }
      },
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        }
      }
    ]
  }
];

const webpack_taro_h5_mainFields = ['main:h5', 'browser', 'module', 'jsnext:main', 'main'];

const webpack_taro_h5_alias = {
  '@tarojs/taro': '@tarojs/taro-h5',
  ['@tarojs/components$']: '@tarojs/components/dist-h5/react',
};

// noinspection JSUnresolvedFunction
const webpack_taro_h5_plugins = [
  new webpack.DefinePlugin({
    'process.env.TARO_ENV': JSON.stringify('h5'),
    ENABLE_INNER_HTML: JSON.stringify(false),
    ENABLE_ADJACENT_HTML: JSON.stringify(false),
    ENABLE_SIZE_APIS: JSON.stringify(false),
    ENABLE_TEMPLATE_CONTENT: JSON.stringify(false),
    ENABLE_CLONE_NODE: JSON.stringify(false),
    ENABLE_CONTAINS: JSON.stringify(false),
    ENABLE_MUTATION_OBSERVER: JSON.stringify(false),
  }),
];

// noinspection JSUnresolvedVariable
const webpack_msw_plugins = (output) => [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.join(__dirname, 'mockServiceWorker.js'),
        to: path.join(output, 'mockServiceWorker.js'),
        force: true,
      },
    ],
  }),
];

// noinspection JSUnresolvedVariable
const msw_node_module_fallback = {
  timers: false,
  '@mswjs/interceptors/lib/interceptors/ClientRequest': false,
  '@mswjs/interceptors/lib/interceptors/XMLHttpRequest': false,
  '@mswjs/interceptors/lib/utils/getCleanUrl': false,
  '@mswjs/interceptors/lib/utils/bufferUtils': false,
  'headers-polyfill/lib': false,
  'stream': false,
  'zlib': false,
};

// noinspection JSUnresolvedVariable
const openapi_node_module_fallback = {
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  url: require.resolve('url'),
  util: require.resolve('util'),
  events: require.resolve('events'),
  fs: false,
};

// noinspection JSUnresolvedFunction
const webpack_openapi_merge_plugins = [
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
  }),
];
