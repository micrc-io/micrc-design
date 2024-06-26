/**
 * index.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { assembler, jsonObject } from '../../../lib/assembler';

import { ComponentContextData } from '../_parse';

const tmpl = `/* eslint-disable react/no-unused-prop-types */
{{#each comment}}// {{this}}\n{{/each}}
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

{{!-- 导入内部组件（将三方组件包一层i18n） --}}
{{#each insideComponentsImports}}
{{!-- import type { {{@key}}Props } from '{{this}}'; 暂不需要 --}}
import { {{@key}} } from '{{{this}}}';
{{/each}}

{{!-- 导入atom组件 --}}
{{#each atomImports}}
{{!-- import type { {{@key}}Props } from '{{this}}'; 暂不需要 --}}
import { {{@key}} } from '{{{this}}}';
{{/each}}

{{!-- 导入运行时工具 --}}
import { localStore, I18NVisibleProxy, I18NHighlight, i18nHightLight,  } from '@micrc/bit.runtimes.micrc-web';

{{!-- 导入样式文件 --}}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './{{context.name}}.module.scss';

{{!-- 导入图片 --}}
{{#each images.local}}
import {{this.name}}Source from './images/{{{this.filename}}}';
{{/each}}

{{!-- nextjs中必须使用src --}}
{{#each images.local}}
// @ts-ignore
const {{this.name}} = {{this.name}}Source.src || {{this.name}}Source;
{{/each}}

{{!-- props类型定义 --}}
export type {{context.namePascalCase}}Props = {
  {{#each props}}
  /**
   * {{this.description}}
   */
  {{@key}}: {{{this.type}}},
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = localStore(
    {
      props,
      states: {}
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action } =store;

  {{!-- 定义内部状态 --}}
  {{#each localState}}
  const {{@key}} = useState({{{json this}}});
  store.appendState({ {{@key}} })
  {{/each}}

  {{{innerLogic}}}

  return (
    {{{assembler assembly.assemblies}}}
  );
}

{{!-- 默认props --}}
{{context.namePascalCase}}.defaultProps = {
  {{#each defaultProps}}
  {{@key}}?: {{{json this}}},
  {{/each}}
};
`;

export function componentFile(data: ComponentContextData) {
  HandleBars.registerHelper('assembler', (context) => assembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));

  return prettier.format(HandleBars.compile(tmpl)(data), {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    bracketSameLine: false,
    singleAttributePerLine: true,
    trailingComma: 'all',
  });
}
