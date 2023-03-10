/**
 * component file
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { propsAssembler, jsonObject } from '../../../lib/assembler';

import { ModuleContextData } from '../_parse';

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
import type { {{@key}}Props } from '{{this}}';
import { {{@key}} } from '{{{this}}}';
{{/each}}

{{!-- 导入store --}}
{{#each storeImport}}
import { {{@key}} as module } from '{{this}}'
{{/each}}
{{!-- 导入运行时store工具 --}}
import { moduleStore } from '@micrc/bit.runtimes.micrc-web';

{{!-- 导入样式文件 --}}
import styles from './{{context.name}}.module.scss';

{{!-- props类型定义 --}}
export type {{context.namePascalCase}}Props = {
  {{#each props}}
  {{@key}}?: {{{this}}},
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

{{!-- 定义组件本体 --}}
export function {{context.namePascalCase}}({ router, integration }: {{context.namePascalCase}}Props) {
  {{!-- 定义内部状态 --}}
  {{#each innerState}}
  const {{@key}} = useState({{{json this}}});
  {{/each}}

  {{!-- 定义binding和action --}}
  const { bind, action } = moduleStore(
    {
      module,
      states: {
        {{#each innerState}}
        {{@key}},
        {{/each}}
      }
    },
    router,
    '{{{context.componentId}}}',
  );

  {{!-- 定义actions, 受限于hooks规则 --}}
  {{#each actions}}
  const {{@key}} = action({{{json this}}})
  {{/each}}

  return (
    <>
      {{#with assembly}}
      <{{layout}}
      {{{propsAssembler  props}}}
      />
      {{/with}}
      { integration ? <IntegrationSimulator integration={integration} /> : null }
    </>
  );
}
`;

export function componentFile(data: ModuleContextData) {
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
