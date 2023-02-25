/**
 * index.ts
 */
import HandleBars from 'handlebars';
import prettier from 'prettier';

import { ComponentContextData } from '../_parse';

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

{{!-- 导入运行时工具 --}}
import { useComponentStore as useStore } from '@micrc/bit.runtimes.micrc-web';

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
{{!-- 定义组件本体 --}}
export function {{context.namePascalCase}}(props: {{context.namePascalCase}}Props) {
  {{!-- 定义内部状态 --}}
  {{#each innerState}}
  const {{@key}} = useState({{{json this}}});
  {{/each}}
  {{!-- 定义binding和action --}}
  const { bind, action } = useStore({
    props,
    states: {
      {{#each innerState}}
      {{@key}},
      {{/each}}
    },
  });

  return (
    <>
      {{{assembler assembly}}}
    </>
  );
}
`;

const propsAssembler = (props: object): string => {
  let retVal = '';
  Object.keys(props).forEach((name) => {
    const prop = props[name];
    const strProp = typeof prop === 'string' && !prop.startsWith('bind') && !/\(.*\) => action/.test(prop);
    const propStr = strProp ? `'${prop}'` : '';
    // eslint-disable-next-line no-underscore-dangle
    const objProp = typeof prop === 'object' && prop._val;
    // eslint-disable-next-line no-underscore-dangle
    const propObj = objProp ? `{${JSON.stringify(prop._val)}}` : '';
    const exprProp = typeof prop === 'string' && (prop.startsWith('bind') || /\(.*\) => action/.test(prop));
    const propExpr = exprProp ? `{${prop}}` : '';
    const compProp = typeof prop === 'object' && !objProp;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const propComp = compProp ? `{${assembler(prop)}}` : '';
    retVal += ` ${name}=${propStr}${propObj}${propExpr}${propComp}`;
  });
  return retVal;
};

const assembler = (components: object): string => {
  let retVal = '';
  Object.keys(components).forEach((name) => {
    const comp = components[name];
    const nullChildren: boolean = !comp.children;
    const textChildren: boolean = comp.children && typeof comp.children === 'string';
    const nestedChildren: boolean = comp.children && typeof comp.children === 'object';
    const endTag = `</${name}>`;
    retVal += `<${name}`
            + `${propsAssembler(comp.props)}`
            + `${nullChildren ? '\n/>' : '\n>'}`
            + `${textChildren ? comp.children : ''}`
            + `${nestedChildren ? assembler(comp.children) : ''}`
            + `${nullChildren ? '' : endTag}`;
  });
  return retVal;
};

const jsonObject = (obj: any): string => {
  if (typeof obj === 'string') {
    return obj;
  }
  return JSON.stringify(obj);
};

export function componentFile(data: ComponentContextData) {
  HandleBars.registerHelper('assembler', (context) => assembler(context));
  HandleBars.registerHelper('json', (context) => jsonObject(context));
  const code = HandleBars.compile(tmpl)(data);
  return prettier.format(code, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    bracketSameLine: false,
    singleAttributePerLine: true,
  });
}
