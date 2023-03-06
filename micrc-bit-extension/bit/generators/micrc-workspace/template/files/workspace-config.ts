// bit workspace.jsonc
import { WorkspaceContext } from '@teambit/generator';
import { getWorkspaceConfigTemplateParsed, stringifyWorkspaceConfig } from '@teambit/config';

import parser from '../_parser';

export async function workspaceConfig(context: WorkspaceContext) {
  parser(context);
  const configParsed = await getWorkspaceConfigTemplateParsed();
  // 工作空间名称，default scope
  configParsed['teambit.workspace/workspace'].name = context.name;
  configParsed['teambit.workspace/workspace'].defaultScope = context.defaultScope;
  // scope ui中展示的logo
  configParsed['teambit.workspace/workspace'].icon = 'https://bitsrc.imgix.net/eb3c4405de109d8186592f28c446b8bdd0814001.jpeg?fit=scale&w=91&h=85';

  // 组件生成器，设计系统只包含客户端口和通用组件生成器，包括web，mini和app三种类型
  configParsed['teambit.generator/generator'] = {
    aspects: [
      'micrc.bit/generators/component/micrc-web',
      // 'micrc.bit/generators/component/micrc-mini',
      // 'micrc.bit/generators/component/micrc-app',
    ],
  };
  configParsed['micrc.bit/generators/component/micrc-web'] = {};
  // configParsed['micrc.bit/generators/component/micrc-mini'] = {};
  // configParsed['micrc.bit/generators/component/micrc-app'] = {};

  // 编译时工具扩展
  configParsed['micrc.bit/compilations/micrc-web'] = {};
  // configParsed['micrc.bit/compilations/micrc-mini'] = {};
  // configParsed['micrc.bit/compilations/micrc-app'] = {};

  // 依赖包
  configParsed['teambit.dependencies/dependency-resolver'] = {
    packageManager: 'teambit.dependencies/pnpm',
    policy: {
      dependencies: {
        '@ant-design/icons': '4.7.0',
        '@babel/core': '7.18.6',
        '@mdx-js/react': '1.6.22',
        '@next/mdx': '12.1.6',
        '@storybook/addon-actions': '6.5.9',
        '@storybook/addon-docs': '6.5.9',
        '@storybook/addon-essentials': '6.5.9',
        '@storybook/addon-interactions': '6.5.9',
        '@storybook/addon-links': '6.5.9',
        '@storybook/builder-webpack5': '6.5.9',
        '@storybook/manager-webpack5': '6.5.9',
        '@storybook/mdx2-csf': '0.0.3',
        '@storybook/react': '6.5.9',
        '@storybook/testing-library': '^0.0.13',
        '@teambit/eslint-config-bit-react': '~0.0.367',
        '@typescript-eslint/eslint-plugin': '4.29.3',
        ajv: '8.11.0',
        'ajv-errors': '3.0.0',
        'ajv-formats': '2.1.1',
        antd: '4.21.4',
        axios: '0.27.2',
        'babel-loader': '8.2.5',
        'babel-plugin-transform-taroapi': '3.4.12',
        buffer: '6.0.3',
        'copy-webpack-plugin': '9.1.0',
        'css-loader': '6.7.1',
        encoding: '0.1.13',
        eslint: '7.32.0',
        'eslint-import-resolver-node': '0.3.6',
        'eslint-plugin-import': '2.22.1',
        'eslint-plugin-jest': '24.4.0',
        'eslint-plugin-jsx-a11y': '6.4.1',
        'eslint-plugin-mdx': '1.15.0',
        'eslint-plugin-react': '7.25.1',
        events: '3.3.0',
        express: '4.17.2',
        'fast-json-patch': '3.1.1',
        'https-browserify': '1.0.0',
        'json-schema-deref-sync': '0.14.0',
        'lodash.merge': '4.6.2',
        'lodash.omit': '4.5.0',
        'lodash.pick': '4.4.0',
        msw: '0.47.4',
        'omit-deep-lodash': '1.1.7',
        'openapi-client-axios': '5.1.2',
        'openapi-merge': '1.3.2',
        'openapi-sampler': '1.3.0',
        'openapi3-ts': '2.0.2',
        postcss: '8.4.14',
        'postcss-loader': '7.0.0',
        'postcss-pxtorem': '6.0.0',
        'postcss-pxtransform': '3.4.13',
        'prop-types': '15.8.1',
        'resolve-url-loader': '5.0.0',
        sass: '1.53.0',
        'sass-loader': '13.0.2',
        'stream-http': '3.2.0',
        'style-loader': '3.3.1',
        'swagger-client': '3.18.5',
        'taro-ui': '^3.1.0-beta.2',
        typescript: '4.7.4',
        url: '0.11.0',
        util: '0.12.4',
        webpack: '5.73.0',
        zustand: '4.0.0-rc.1',
      },
      peerDependencies: {
        '@tarojs/components': '3.4.12',
        '@tarojs/taro': '3.4.12',
        '@tarojs/taro-h5': '3.4.12',
        '@testing-library/react': '^12.1.5',
        '@testing-library/react-native': '10.1.1',
        '@types/lodash.merge': '4.6.7',
        '@types/lodash.omit': '4.5.7',
        '@types/lodash.pick': '4.4.7',
        react: '17.0.2',
        'react-dom': '17.0.2',
        'react-native': '0.69.1',
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
    '{base-ui/web/**}': {
      'micrc.bit/envs/micrc-web:1.0.0': {},
    },
    // '{base-ui/mini/**}': {
    //   'micrc.bit/envs/micrc-mini:1.0.0': {},
    // },
    // '{base-ui/app/**}': {
    //   'micrc.bit/envs/micrc-app:0.0.1': {},
    // },
  };

  return stringifyWorkspaceConfig(configParsed);
}
