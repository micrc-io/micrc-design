/**
 * css file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ComponentContextData } from '../_parse';

const tmpl = `/* {{context.name}} css */
{{{css}}}
`;

export function cssFile(data: ComponentContextData) {
  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'css',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
