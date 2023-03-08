/**
 * app doc file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { jsonObject } from '../../../lib/assembler';

import { ClientendContextData } from '../_parser';

const tmpl = `---
description: {{doc.title}}
label: {{{jsonObject doc.labels}}}
---

{{doc.showcase}} // todo 一个iframe, 一个链接

{{{doc.desc}}}
`;

export function appDocFile(data: ClientendContextData) {
  HandleBars.registerHelper('jsonObject', (context) => jsonObject(context));

  return prettier.format(
    HandleBars.compile(tmpl)(data),
    {
      parser: 'mdx',
      semi: true,
      singleQuote: true,
      bracketSameLine: false,
      singleAttributePerLine: true,
    },
  );
}
