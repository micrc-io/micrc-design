import HandleBars from 'handlebars';
import prettier from 'prettier';
import { ModuleContextData } from '../_parse';

const tmpl = `// {{context.name}} composition
import React from 'react';

import { Default } from './{{context.name}}.stories';

export const DefaultStory = () => <Default {...Default.args} />;
`;

export function compositionFile(data: ModuleContextData) {
  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'typescript',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
      trailingComma: 'all',
    },
  );
}
