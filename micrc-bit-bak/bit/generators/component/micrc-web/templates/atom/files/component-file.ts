/**
 * index.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { AtomContextData } from '../_parse';
import { propsAssembler, jsonObject } from '../../../lib/assembler';

const tmpl = `{{#each comment}}// {{this}}\n{{/each}}
{{!-- 导入react --}}
{{#each reactImports}}
import {{this.default}}, {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{/each}}
{{!-- 导入类型 --}}
{{typeDefinitions}}
{{!-- 导入使用的组件 --}}
{{#each componentImports}}
{{#if this.default}}
import {{this.default}}, {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{else}}
import {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{/if}}
{{/each}}
{{!-- 导入运行时工具 --}}
import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

{{!-- 导入样式文件 --}}
import styles from './{{context.name}}.module.scss';

{{!-- props类型定义 --}}
  {{{ props }}}

{{!-- 定义组件本体 --}}
export function {{context.namePascalCase}}(props: {{context.namePascalCase}}Props) {
  {{!-- 定义内部状态 --}}
  {{{ innerState }}}

  return(
    <>
      {{{ assembly }}}
    </>
  )
}
`;
export function componentFile(data: AtomContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));

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
