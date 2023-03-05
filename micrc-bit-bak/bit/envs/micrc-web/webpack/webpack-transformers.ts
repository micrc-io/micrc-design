/**
 * webpack config
 */
import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from '@teambit/webpack';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

/**
   * Transformation to apply for both preview and dev server
   * @param config
   * @param _context
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function commonTransformation(
  config: WebpackConfigMutator,
  // eslint-disable-next-line
  _context: WebpackConfigTransformContext,
) {
  // @ts-ignore
  const { options } = config.raw.module.rules
    .filter((it) => Object.keys(it).includes('oneOf')) // @ts-ignore
    .reduce((prev, curr) => prev.oneOf.concat(curr.oneOf), { oneOf: [] }) // @ts-ignore
    .find((it) => `${it.test}` === `${/(?<!\.module)\.less$/.toString()}`) // @ts-ignore
    .use
    .find((it) => it.loader.indexOf('less-loader') > -1);
  options.lessOptions = {
    javascriptEnabled: true,
  };

  config.addPlugins([
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../../msw/mockServiceWorker.js'), // @ts-ignore
          to: path.join(config.raw.output.path, 'mockServiceWorker.js'),
          force: true,
        },
      ],
    }),
  ]);

  return config;
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
