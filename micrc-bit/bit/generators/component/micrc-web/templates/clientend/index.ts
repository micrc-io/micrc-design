/**
 * micrc web clientend template, base on nextjs
 */
import path from 'path';
import fs from 'fs';

import { ComponentTemplate, ComponentContext } from '@teambit/generator';

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

const SCHEMA_PATH = '.cache/micrc/schema/clientends';

export const clientendTemplate: ComponentTemplate = {
  name: 'micrc-web-clientend',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const nodeModulesPath = path.resolve(
      require.resolve('@micrc/bit.generators.component.micrc-web'),
      '../../../../',
    );
    const metaFile = `${context.componentId.toStringWithoutVersion().replace(/\//g, '-')}.json`;
    const metaFilePath = path.resolve(nodeModulesPath, SCHEMA_PATH, metaFile);
    const data: ClientendContextData = parse(
      JSON.parse(fs.readFileSync(metaFilePath).toString()),
      context,
    );
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
      // app pages/_app.ts file
      {
        relativePath: 'app/pages/_app.ts',
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
    ];
  },
};
