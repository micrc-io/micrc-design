// bit workspace.jsonc
import { WorkspaceContext } from '@teambit/generator';
import { getWorkspaceConfigTemplateParsed, stringifyWorkspaceConfig } from '@teambit/config';

import parser from '../_parser';

export async function workspaceConfig(context: WorkspaceContext) {
  parser(context);
  const configParsed = await getWorkspaceConfigTemplateParsed();
  // 工作空间名称，default scope
  configParsed['teambit.workspace/workspace'].name = context.name;
  // 如果类型是components或者atoms,clientends，那么default scope应该必须是design
  configParsed['teambit.workspace/workspace'].defaultScope = context.name.split('-')[2] === 'components' || context.name.split('-')[2] === 'atoms' || context.name.split('-')[2] === 'clientends' ? 'colibri-tech.design' : context.defaultScope;
  // scope ui中展示的logo
  configParsed['teambit.workspace/workspace'].icon = 'https://bitsrc.imgix.net/eb3c4405de109d8186592f28c446b8bdd0814001.jpeg?fit=scale&w=91&h=85';

  // 组件生成器，设计系统只包含客户端口和通用组件生成器，包括web，mini和app三种类型
  configParsed['teambit.generator/generator'] = {
    aspects: [
      'micrc.bit/generators/micrc-web',
      'micrc.bit/generators/micrc-mini',
      'micrc.bit/generators/micrc-app',
    ],
  };
  configParsed['micrc.bit/generators/micrc-web'] = {};
  configParsed['micrc.bit/generators/micrc-mini'] = {};
  configParsed['micrc.bit/generators/micrc-app'] = {};
  configParsed['micrc.bit/compilations/micrc-web'] = {};
  configParsed['micrc.bit/compilations/micrc-mini'] = {};
  configParsed['micrc.bit/compilations/micrc-app'] = {};

  // 依赖包
  configParsed['teambit.dependencies/dependency-resolver'] = {
    packageManager: 'teambit.dependencies/pnpm',
    policy: {
      dependencies: {
        '@ant-design/icons': '5.0.1',
        '@babel/runtime': '7.21.0',
        '@storybook/addon-actions': '6.5.16',
        '@storybook/addon-docs': '6.5.16',
        '@storybook/addon-essentials': '6.5.16',
        '@storybook/addon-interactions': '6.5.16',
        '@storybook/addon-links': '6.5.16',
        '@storybook/builder-webpack5': '6.5.16',
        '@storybook/manager-webpack5': '6.5.16',
        '@storybook/react': '6.5.16',
        '@teambit/eslint-config-bit-react': '0.0.367',
        '@teambit/harmony': '0.4.6',
        ajv: '8.12.0',
        'ajv-errors': '3.0.0',
        'ajv-formats': '2.1.1',
        antd: '5.3.0',
        axios: '1.3.4',
        'babel-loader': '9.1.2',
        'babel-plugin-transform-taroapi': '3.6.2',
        chalk: '4.1.2',
        'copy-webpack-plugin': '9.1.0',
        'core-js': '3.29.1',
        'css-loader': '6.7.3',
        eslint: '8.35.0',
        'eslint-import-resolver-node': '0.3.7',
        'eslint-plugin-import': '2.27.5',
        'eslint-plugin-jest': '27.2.1',
        'eslint-plugin-jsx-a11y': '6.7.1',
        'eslint-plugin-mdx': '2.0.5',
        'eslint-plugin-react': '7.32.2',
        'fast-json-patch': '3.1.1',
        handlebars: '4.7.7',
        'json-schema-deref-sync': '0.14.0',
        'lodash.clonedeep': '4.5.0',
        'lodash.merge': '4.6.2',
        'lodash.omit': '4.5.0',
        'lodash.pick': '4.4.0',
        loglevel: '1.8.1',
        msw: '1.1.0',
        'omit-deep-lodash': '1.1.7',
        'openapi-client-axios': '7.1.3',
        'openapi-merge': '1.3.2',
        'openapi-sampler': '1.3.1',
        'openapi3-ts': '3.2.0',
        postcss: '8.4.21',
        'postcss-loader': '7.0.2',
        'postcss-pxtorem': '6.0.0',
        'postcss-pxtransform': '3.6.2',
        prettier: '2.8.4',
        'prettier-package-json': '2.8.0',
        'react-draggable': '4.4.5',
        'react-iframe': '1.8.5',
        'react-new-improved-window': '0.2.9',
        'resolve-url-loader': '5.0.0',
        sass: '1.58.3',
        'sass-loader': '13.2.0',
        'stream-http': '3.2.0',
        'style-loader': '3.3.1',
        'sync-request': '6.1.0',
        'taro-ui': '3.1.0-beta.4',
        typescript: '4.9.5',
        url: '0.11.0',
        util: '0.12.5',
        webpack: '5.75.0',
        zustand: '4.3.6',
      },
      peerDependencies: {
        '@micrc/bit.runtimes.micrc-web': '>= 0.0.21',
        '@tarojs/components': '3.5.12',
        '@tarojs/taro': '3.5.12',
        '@tarojs/taro-h5': '3.5.12',
        '@testing-library/react': '12.1.5',
        '@testing-library/react-native': '10.1.1',
        '@types/jest': '29.4.0',
        '@types/lodash.clonedeep': '4.5.7',
        '@types/lodash.merge': '4.6.7',
        '@types/lodash.omit': '4.5.7',
        '@types/lodash.pick': '4.4.7',
        '@types/node': '18.14.6',
        '@typescript-eslint/eslint-plugin': '5.54.0',
        react: '17.0.2',
        'react-dom': '17.0.2',
        'react-native': '0.71.3',
      },
    },
    packageManagerArgs: [],
    devFilePatterns: [
      '**/*.docs.mdx',
      '**/*.spec.ts',
      '**/*.composition.tsx',
      '**/*.stories.tsx',
    ],
    strictPeerDependencies: true,
  };

  configParsed['teambit.workspace/variants'] = {
    '{**/web/**}': {
      'micrc.bit/envs/micrc-web@1.0.3': {},
    },
    '{mini/**}': {
      'micrc.bit/envs/micrc-mini@0.0.2': {},
    },
    '{app/**}': {
      'micrc.bit/envs/micrc-app@0.0.3': {},
    },
  };

  // 清除注释. workspace.jsonc会被读取使用JSON.parse
  return stringifyWorkspaceConfig(configParsed).replace(/\/\*\*[\s\S]*?\*\*\//g, '').replace(/^\s*$\n/gm, '');
}
