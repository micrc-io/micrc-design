/**
 * micrc workspace starter
 */
import { WorkspaceContext, Starter } from '@teambit/generator';

import parser from './template/_parser';

import { bitAssetType } from './template/files/bit-asset';
import { bitStyleType } from './template/files/bit-style';
import { eslintIgnore } from './template/files/eslintignore';
import { eslintrc } from './template/files/eslintrc';
import { gitIgnore } from './template/files/git-ignore';
import { packageJson } from './template/files/package-json';
import { prettierrc } from './template/files/prettierrc';
import { readme } from './template/files/readme-file';
import { storybookMain } from './template/files/storybook-main';
import { storybookMockServiceWorker } from './template/files/storybook-mock-service-worker';
import { storybookPreview } from './template/files/storybook-preview';
import { storybookPreviewBody } from './template/files/storybook-preview-body';
import { tsconfig } from './template/files/tsconfig';
import { vscodeLaunch } from './template/files/vscode-launch';
import { workspaceConfig } from './template/files/workspace-config';

export const starter: Starter = {
  name: 'micrc-workspace',
  description: 'micrc workspace template',
  generateFiles: async (context: WorkspaceContext) => [
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
      relativePath: '.storybook/mockServiceWorker.js',
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
      relativePath: `${parser(context).scope}/web/readme.md`,
      content: `# web ${parser(context).type}\n`,
    }, {
      relativePath: `${parser(context).scope}/mini/readme.md`,
      content: `# mini ${parser(context).type}\n`,
    }, {
      relativePath: `${parser(context).scope}/app/readme.md`,
      content: `# app ${parser(context).type}\n`,
    },
  ],
  importComponents: () => [],
};

export default starter;
