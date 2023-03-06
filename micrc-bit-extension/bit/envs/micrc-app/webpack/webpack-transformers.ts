import {
  WebpackConfigTransformer, WebpackConfigMutator, WebpackConfigTransformContext,
} from '@teambit/webpack';

/**
 * Transformation to apply for both preview and dev server
 * @param config
 * @param _context
 */
function commonTransformation(
  config: WebpackConfigMutator, // eslint-disable-next-line
  _context: WebpackConfigTransformContext,
) {
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
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};

/**
 * Transformation for the dev server only
 * @param config
 * @param context
 * @returns
 */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext,
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};
