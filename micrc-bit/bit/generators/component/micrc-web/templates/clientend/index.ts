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

const meta = {
  intro: {
    version: '0.0.1',
  },
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
};

export const clientendTemplate: ComponentTemplate = {
  name: 'micrc-web-clientend',
  description: '',
  generateFiles: (context: ComponentContext) => {
    console.log(context.componentId.toStringWithoutVersion());
    const data: ClientendContextData = parse(meta, context);
    throw Error('terminal');
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
        isMain: true,
        content: appTypeFile(data),
      },
      // app doc file
      {
        relativePath: 'app.docs.mdx',
        isMain: true,
        content: appDocFile(data),
      },
      // app package.json file
      {
        relativePath: 'app/package.json',
        isMain: true,
        content: appPackageFile(data),
      },
    ];
  },
};
