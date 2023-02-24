/**
 * micrc web atom component template
 */
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { indexFile } from './files/index-file';

export const stateTemplate: ComponentTemplate = {
  name: 'micrc-web-state',
  description: '',
  generateFiles: (context: ComponentContext) => {
    console.log('state template');
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(context),
      },
    ];
  },
};
