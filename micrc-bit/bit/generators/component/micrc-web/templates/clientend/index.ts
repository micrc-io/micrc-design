/**
 * micrc web clientend template, base on nextjs
 */
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

const meta = {
  intro: {
    version: '0.0.1',
  },
  pages: {
    '/uri': {
      modules: {
        DemoModule2: {
          package: '@micrc/demo-domain-design.modules.DemoModule2',
          version: '0.0.1',
        },
        DemoModule1: {
          package: '@micrc/demo-domain-design.modules.DemoModule1',
          version: '0.0.2',
        },
      },
      components: {
        DemoComponent1: {
          package: '@micrc/demo-system-design.bases.DemoComponent1',
          version: '0.0.3',
        },
        DemoComponent2: {
          package: '@micrc/demo-system-design.bases.DemoComponent2',
          version: '0.0.4',
        },
      },
      assembly: {
        layout: 'DemoComponent1',
        props: {},
      },
    },
  },
};

export const clientendTemplate: ComponentTemplate = {
  name: 'micrc-web-clientend',
  description: '',
  generateFiles: (context: ComponentContext) => {
    const data: ClientendContextData = parse(meta, context);
    // throw Error('terminal');
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
        content: apiProxyFile(data),
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
