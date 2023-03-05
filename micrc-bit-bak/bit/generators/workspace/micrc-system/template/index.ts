/**
 * template
 */
import { WorkspaceContext, WorkspaceTemplate } from '@teambit/generator';

import validate from './_validate';

import { workspaceConfig } from './files/workspace-config';
import { readme } from './files/readme-file';
import { gitIgnore } from './files/git-ignore';
import { bitAssetType } from './files/bit-asset';
import { bitStyleType } from './files/bit-style';
import { vscodeLaunch } from './files/vscode-launch';
import { eslintIgnore } from './files/eslintignore';
import { eslintrc } from './files/eslintrc';
import { tsconfig } from './files/tsconfig';
import { prettierrc } from './files/prettierrc';
import { storybookMain } from './files/storybook-main';
import { storybookMockServiceWorker } from './files/storybook-mock-service-worker';
import { storybookPreview } from './files/storybook-preview';
import { storybookPreviewBody } from './files/storybook-preview-body';
import { packageJson } from './files/package-json';

export const workspaceTemplate: WorkspaceTemplate = {
  name: 'micrc-system-workspace-template',
  description: 'micrc design-system workspace template for generation',
  generateFiles: async (context: WorkspaceContext) => {
    const { scope } = validate(context);
    return [
      {
        relativePath: 'workspace.jsonc',
        content: await workspaceConfig(context),
      }, {
        relativePath: '.gitignore',
        content: gitIgnore(),
      }, {
        relativePath: 'README.md',
        content: readme(),
      }, {
        relativePath: 'types/asset.d.ts',
        content: bitAssetType(),
      }, {
        relativePath: 'types/style.d.ts',
        content: bitStyleType(),
      }, {
        relativePath: '.vscode/launch.json',
        content: vscodeLaunch(),
      }, {
        relativePath: '.eslintignore',
        content: eslintIgnore(),
      }, {
        relativePath: '.eslintrc.js',
        content: eslintrc(),
      }, {
        relativePath: 'tsconfig.json',
        content: tsconfig(),
      }, {
        relativePath: '.prettierrc.js',
        content: prettierrc(),
      }, {
        relativePath: 'public/storybook/readme.md',
        content: '# storybook exported here\n',
      }, {
        relativePath: '.storybook/main.js',
        content: storybookMain(context),
      }, {
        relativePath: '.storybook/mockServiceWorker-0.47.4.js',
        content: storybookMockServiceWorker(),
      }, {
        relativePath: '.storybook/preview.jsx',
        content: storybookPreview(),
      }, {
        relativePath: '.storybook/preview-body.html',
        content: storybookPreviewBody(),
      }, {
        relativePath: 'package.json',
        content: packageJson(),
      }, {
        relativePath: `${scope}/bases/web/readme.md`,
        content: '# web base components\n',
      }, {
        relativePath: `${scope}/bases/mini/readme.md`,
        content: '# mini base components\n',
      }, {
        relativePath: `${scope}/bases/app/readme.md`,
        content: '# app base components\n',
      }, {
        relativePath: `${scope}/atoms/web/readme.md`,
        content: '# web atom components\n',
      }, {
        relativePath: `${scope}/atoms/mini/readme.md`,
        content: '# mini atom components\n',
      }, {
        relativePath: `${scope}/atoms/app/readme.md`,
        content: '# app atom components\n',
      }, {
        relativePath: `${scope}/_apps/web/readme.md`,
        content: '# web clientend base on nextjs\n',
      }, {
        relativePath: `${scope}/_apps/mini/readme.md`,
        content: '# mini clientend base on taro\n',
      }, {
        relativePath: `${scope}/_apps/app/readme.md`,
        content: '# app clientend base on react-native\n',
      },
    ];
  },
  importComponents: () => [
  ],
};
