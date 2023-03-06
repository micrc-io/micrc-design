/**
 * webpack config
 */
import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from '@teambit/webpack';
import webpack from 'webpack';

const handleTaroH5 = (config: WebpackConfigMutator) => {
  // webpack config for taro h5
  config.addResolve({
    mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
  });
  config.addAliases({
    '@tarojs/taro': '@tarojs/taro-h5',
    '@tarojs/components$': '@tarojs/components/dist-h5/react',
  });
  config.addPlugins([
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
  ]);

  // taro-ui taroify taro-component size handler
  // append postcss plugin -- postcss-pxtransform
  // @ts-ignore
  config.raw.module.rules // @ts-ignore
    .filter((it) => Object.keys(it).includes('oneOf')) // @ts-ignore
    .reduce((prev, curr) => prev.oneOf.concat(curr.oneOf), { oneOf: [] }) // @ts-ignore
    .find((it) => `${it.test}` === `${/(?<!\.module)\.(scss|sass)$/.toString()}`) // @ts-ignore
    .use // @ts-ignore
    .find((it) => it.loader.indexOf('postcss-loader') > -1) // @ts-ignore
    .options.postcssOptions.plugins // @ts-ignore
    // eslint-disable-next-line global-require
    .push(require('postcss-pxtransform')({
      platform: 'h5',
      designWidth: 750,
    }));

  // babel-loader for taro h5
  config.addModuleRule({
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          [
            // eslint-disable-next-line global-require
            require('babel-plugin-transform-taroapi').default,
            {
              // eslint-disable-next-line global-require,import/no-dynamic-require
              apis: require(
                require.resolve(
                  '@tarojs/taro-h5/dist/taroApis', {
                    paths: [
                      // eslint-disable-next-line global-require
                      require('path').resolve(__dirname, '..'),
                    ],
                  },
                ),
              ),
              packageName: '@tarojs/taro',
            },
          ],
        ],
      },
    },
  }, { position: 'prepend' });
  return config;
};

/**
   * Transformation to apply for both preview and dev server
   * @param config
   * @param _context
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function commonTransformation(
  config: WebpackConfigMutator,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: WebpackConfigTransformContext,
) {
  // Merge config with the webpack.config.js file
  // if you choose to import a module export format config.
  // config.merge([webpackConfig]);
  // config.addAliases({});
  // config.addModuleRule(youRuleHere);
  return handleTaroH5(config);
}

/**
   * Transformation for the preview only
   * @param config
   * @param context
   * @returns
   */
export const previewConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext,
) => commonTransformation(config, context);

/**
   * Transformation for the dev server only
   * @param config
   * @param context
   * @returns
   */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext,
) => commonTransformation(config, context);
