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
{{#if this.types}}
import {{this.default}}, {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{else}}
import {{this.default}} from '{{@key}}';
{{/if}}
{{/each}}

{{!-- 导入类型 --}}
{{#each typeImports}}
{{#if this.types}}
{{#if this.default}}
import type {{this.default}}, type {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{else}}
import type {
  {{#each this.types}}
  {{this}},
  {{/each}}
} from '{{@key}}';
{{/if}}
{{else}}
import type {{this.default}} from '{{@key}}';
{{/if}}
{{/each}}

{{!-- 导入使用的组件 --}}
{{#each componentImports}}
{{#if this.types}}
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
{{else}}
import {{this.default}} from '{{@key}}';
{{/if}}
{{/each}}

{{!-- 导入样式文件 --}}
import styles from './{{context.name}}.module.scss';

{{!-- props类型定义 --}}
export type {{context.namePascalCase}}Props = {
  {{#each props}}
  {{@key}}: {{{this}}},
  {{/each}}
};

{{!-- 类型定义 --}}
{{#each typeDefinitions}}
{{#if this.interface}}
interface {{@key}} {
  {{#each this.props}}
  {{@key}}: {{{this}}},
  {{/each}}
}
{{else}}
type {{@key}} = {
  {{#each this.props}}
  {{@key}}: {{{this}}},
  {{/each}}
};
{{/if}}

{{/each}}
{{{outerLogic}}}

{{!-- 定义组件本体 --}}
export function {{context.namePascalCase}}(props: {{context.namePascalCase}}Props) {
  {{!-- 定义内部状态 --}}
  {{#each localState}}
  const {{@key}} = useState({{{json this}}});
  {{/each}}

  {{{innerLogic}}}

  return(
    <>
      {{{assembler assembly.assemblies}}}
    </>
  )
}

{{!-- 默认props --}}
{{context.namePascalCase}}.defaultProps = {
  {{#each defaultProps}}
  {{@key}}?: {{{json this}}},
  {{/each}}
};
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
