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
{{!-- import type { {{@key}}Props } from '{{this}}'; 暂不需要 --}}
import { {{@key}} } from '{{{this}}}';
{{/each}}

{{!-- 导入运行时store工具 --}}
import { remoteStore, Authorized } from '@micrc/bit.runtimes.micrc-web';
{{!-- 导入远程状态模块 --}}
import { useStore as module } from './state';

{{!-- 导入图片 --}}
{{#each images}}
import {{this.name}}Source from './images/{{{this.filename}}}';
{{/each}}

{{!-- nextjs中必须使用src --}}
{{#each images}}
// @ts-ignore
const {{this.name}} = {{this.name}}Source.src || {{this.name}}Source;
{{/each}}

{{!-- 定义权限 --}}
const permissions = {{{json permissions}}}

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
export function {{context.namePascalCase}}({ router , fix, callback }: {{context.namePascalCase}}Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = remoteStore(
    {
      module,
      states: {}
    },
    router,
    '{{{context.componentId}}}',
    fix,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bind, action, subscribe } =store;

  {{!-- 定义模块id，传给需要i18n的组件 --}}
  const id = useState({ value: '{{{context.componentId}}}' });
  store.appendState({ id });

  {{!-- 定义actions, 受限于hooks规则 --}}
  {{#each actions}}
  const {{@key}} = action({{{json this}}})
  {{/each}}

  {{!-- 定义内部状态 --}}
  {{#each localState}}
  const {{@key}} = useState({{{json this}}});
  store.appendState({ {{@key}} })
  {{/each}}

  {{!-- 定义binds, 受限于hooks规则,如（在table columns的render中） --}}
  {{#each binds}}
  const {{@key}} = bind({{{json this}}});
  {{/each}}

  {{!-- 定义组件入口 --}}
  {{#ifOr entry.mount.actions entry.unmount.actions}}
  useEffect(() => {
    {{#if entry.mount.actions}}
    {{{json entry.mount}}}
    {{{entry.mount.name}}}()
    {{/if}}
    {{#if entry.unmount.actions}}
    return () => {
      {{{json entry.unmount}}}
      {{{entry.unmount.name}}}()
    };
    {{/if}}
  }, []);
  {{/ifOr}}

  {{!-- 判断consume 对象是否为空对象 --}}
  {{#if (get_length integration.simulation.consume)}}
  useEffect(() => {
    {{#each integration.simulation.consume}}
    {{#each this.consumers}}
    {{{json this.listener}}}
    const {{../this.name}}Unsubscribe = subscribe('{{../this.name}}', {{this.listener.name}}, callback);
    {{/each}}
    {{/each}}
    return () => {
      {{#each integration.simulation.consume}}
      {{#each this.consumers}}
      {{../this.name}}Unsubscribe();
      {{/each}}
      {{/each}}
    };
  }, []);
  {{/if}}

  return (
    <Authorized permissions={permissions}>
      {{#with assembly}}
      <{{layout}}
      {{{propsAssembler props}}}
      />
      {{/with}}
    </Authorized>
  );
}

{{!-- 默认props --}}
{{context.namePascalCase}}.defaultProps = {
  {{#each defaultProps}}
  {{@key}}?: {{{json this}}},
  {{/each}}
};
`;

export function componentFile(data: ModuleContextData) {
  HandleBars.registerHelper('propsAssembler', (context) => propsAssembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));
  HandleBars.registerHelper('get_length', (obj) => Object.keys(obj).length);
  HandleBars.registerHelper(
    'ifOr',
    // eslint-disable-next-line func-names
    function (
      this: any,
      condition1: any[],
      condition2: any[],
      options: Handlebars.HelperOptions,
    ) {
      if (condition1.length > 0 || condition2.length > 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  );
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
