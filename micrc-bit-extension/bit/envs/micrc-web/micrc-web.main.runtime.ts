/**
 * web-react runtime
 */
import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain, UseWebpackModifiers } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';

import { MicrcWebAspect } from './micrc-web.aspect';
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from './webpack/webpack-transformers';

// import { ts设置
//   devConfigTransformer,
//   buildConfigTransformer,
// } from "./typescript/ts-transformer";

export class MicrcWebMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };

    // const tsModifiers: UseTypescriptModifiers = { ts设置
    //   devConfig: [devConfigTransformer],
    //   buildConfig: [buildConfigTransformer],
    // };

    const MicrcWebEnv = react.compose([
      /**
       * Uncomment to override the config files for TypeScript, Webpack or Jest
       * Your config gets merged with the defaults
       */

      // react.useTypescript(tsModifiers),
      // note: this cannot be used in conjunction with react.overrideCompiler
      react.useWebpack(webpackModifiers),
      // react.overrideJestConfig(require.resolve('./jest/jest.config')),

      /**
       * override the ESLint default config here then check your files for lint errors
       * @example
       * bit lint
       * bit lint --fix
       */
      // react.useEslint({
      //   transformers: [
      //     (config) => {
      //       config.setRule('no-console', ['error']);
      //       return config;
      //     }
      //   ]
      //
      // }),

      /**
       * override the Prettier default config here the check your formatting
       * @example
       * bit format --check
       * bit format
       */
      // react.usePrettier({
      //   transformers: [
      //     (config) => {
      //       config.setKey('tabWidth', 2);
      //       return config;
      //     }
      //   ]
      // }),

      /**
       * override dependencies here
       * @example
       * Uncomment types to include version 17.0.3 of the types package
       */
      react.overrideDependencies({
        peerDependencies: {
          react: '>= 18.2.0',
          'react-dom': '>= 18.2.0',
          antd: '>= 5.8.0',
          'core-js': '>= 3.0.0',
          '@ant-design/icons': '>= 5.0.1',
        },
        devDependencies: {
          '@types/react': '18.2.14',
          '@types/react-dom': '18.2.6',
        },
      }),
    ]);
    envs.registerEnv(MicrcWebEnv);
    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
