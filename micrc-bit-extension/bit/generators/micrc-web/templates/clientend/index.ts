/**
 * micrc web clientend template, base on nextjs
 */
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { handlePath } from '../../lib/schema-path';

import type { ClientendContextData } from './_parser';
import { parse } from './_parser';

import { indexFile } from './files/index-file';
import { appTypeFile } from './files/app-type-file';
import { appDocFile } from './files/app-doc-file';
import { appPackageFile } from './files/app/package-file';
import { appConfigFile } from './files/app/next-config-file';
import { appPageFiles } from './files/app/page-files';
import { appEntryFile } from './files/app/entry-file';
import { apiProxyFile } from './files/app/api/api-proxy-file';
import { apiFiles } from './files/app/api/api-files';
import { appMSWFile } from './files/app/public/mock-file';
import { appGlobalCssFile } from './files/app/styles/globals-css-file';
import { appAntdLessFile } from './files/app/styles/antd-themes/default-less-file';
import { appBabelFile } from './files/app/babel-file';
import { appEslintignoreFile } from './files/app/eslintignore-file';
import { appEslintFile } from './files/app/eslintrc-file';
import { appGitignoreFile } from './files/app/gitignore-file';
import { appNextEnvFile } from './files/app/next-env-file';
import { appTsConfigFile } from './files/app/ts-config-file';
import { appEnvFile } from './files/app/env-file';
import { appEnvDevFile } from './files/app/env-dev-file';
import { appEnvProdFile } from './files/app/env-prod-file';
import { appMetaI18nFile } from './files/app/meta/i18n-file';
import { appMetaIntegrationFile } from './files/app/meta/integration-file';
import { appI18nSubmissionFile } from './files/app/meta/submission/i18n-file';
import { appMenuSubmissionFile } from './files/app/meta/submission/menu-file';
import { appPermissionSubmissionFile } from './files/app/meta/submission/permission-file';
import { appTrackerSubmissionFile } from './files/app/meta/submission/tracker-file';
import { appMetaTrackerFile } from './files/app/meta/tracker-file';

export const clientendTemplate: ComponentTemplate = {
  name: 'micrc-web-clientend',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const { metaFilePath, metaBasePath } = handlePath(context);
    const data: ClientendContextData = parse(
      JSON.parse(fs.readFileSync(metaFilePath).toString()),
      context,
    );
    data.intro.metaBasePath = metaBasePath;
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(data),
      },
      // app type file
      {
        relativePath: 'app.react-app.ts',
        content: appTypeFile(data),
      },
      // app doc file
      {
        relativePath: 'app.docs.mdx',
        content: appDocFile(data),
      },
      // app package.json file
      {
        relativePath: 'app/package.json',
        content: appPackageFile(data),
      },
      // app next.config.js file
      {
        relativePath: 'app/next.config.js',
        content: appConfigFile(data),
      },
      // app .babelrc file
      {
        relativePath: 'app/.babelrc',
        content: appBabelFile(),
      },
      // app .eslintignore file
      {
        relativePath: 'app/.eslintignore',
        content: appEslintignoreFile(),
      },
      // app .eslintrc.json file
      {
        relativePath: 'app/.eslintrc.json',
        content: appEslintFile(),
      },
      // app .gitignore file
      {
        relativePath: 'app/.gitignore',
        content: appGitignoreFile(),
      },
      // app next-env.d.ts file
      {
        relativePath: 'app/next-env.d.ts',
        content: appNextEnvFile(),
      },
      // app tsconfig.json file
      {
        relativePath: 'app/tsconfig.json',
        content: appTsConfigFile(),
      },
      // app .env file
      {
        relativePath: 'app/.env',
        content: appEnvFile(),
      },
      // app .env.development file
      {
        relativePath: 'app/.env.development',
        content: appEnvDevFile(),
      },
      // app .env.production file
      {
        relativePath: 'app/.env.production',
        content: appEnvProdFile(),
      },
      // app pages/_app.ts file
      {
        relativePath: 'app/pages/_app.tsx',
        content: appEntryFile(data),
      },
      // app pages/api/[...slug].ts file
      {
        relativePath: 'app/pages/api/[...slug].ts',
        content: apiProxyFile(),
      },
      // app api files
      {
        relativePath: 'app/pages/readme',
        content: apiFiles(data),
      },
      // app page files
      {
        relativePath: 'app/pages/readme',
        content: appPageFiles(data),
      },
      // app public/mockServiceWorker.js
      {
        relativePath: 'app/public/mockServiceWorker.js',
        content: appMSWFile(),
      },
      // app styles/globals.css
      {
        relativePath: 'app/styles/globals.css',
        content: appGlobalCssFile(),
      },
      // app styles/antd-themes/default.less
      {
        relativePath: 'app/styles/antd-themes/default.less',
        content: appAntdLessFile(),
      },
      // app meta/i18.json
      {
        relativePath: 'app/meta/submission/i18.json',
        content: appI18nSubmissionFile(data),
      },
      // app meta/tracker.json
      {
        relativePath: 'app/meta/submission/tracker.json',
        content: appTrackerSubmissionFile(data),
      },
      // app meta/menu.json
      {
        relativePath: 'app/meta/submission/menu.json',
        content: appMenuSubmissionFile(),
      },
      // app meta/permission.json
      {
        relativePath: 'app/meta/submission/permission.json',
        content: appPermissionSubmissionFile(),
      },
      // app meta/i18.json
      {
        relativePath: 'app/meta/i18n.json',
        content: appMetaI18nFile(data),
      },
      // app meta/tracker.json
      {
        relativePath: 'app/meta/tracker.json',
        content: appMetaTrackerFile(data),
      },
      // app meta/integration.json
      {
        relativePath: 'app/meta/integration.json',
        content: appMetaIntegrationFile(data),
      },
    ];
  },
};
