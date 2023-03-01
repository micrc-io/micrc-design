/**
 * 模版helper, 递归装配, 对象json字符串
 */
import HandleBars from 'handlebars';

const actionTmpl = `
{
(
  {{#each _params}}
  {{{this}}},
  {{/each}}
) => {
  const params = {
    {{#each _params}}
    {{{this}}},
    {{/each}}
  };
  const actions = async () => {
    {{#each _actions}}
    await {{{this.action}}}(params, '{{{this.inputPath}}}')
    {{/each}}
  };
  actions();
}
}
`;

export const propsAssembler = (props: object): string => {
  let retVal = '';
  Object.keys(props).forEach((name) => {
    const prop = props[name];
    // 字符串类型的prop
    const strProp = typeof prop === 'string' && !prop.startsWith('bind') && !/\(.*\) => action/.test(prop);
    const propStr = strProp ? `'${prop}'` : '';
    // 对象类型的prop
    // eslint-disable-next-line no-underscore-dangle
    const objProp = typeof prop === 'object' && prop._val;
    // eslint-disable-next-line no-underscore-dangle
    const propObj = objProp ? `{${JSON.stringify(prop._val)}}` : '';
    // 函数表达式类型的prop, 用于简单的事件响应函数
    const exprProp = typeof prop === 'string' && (prop.startsWith('bind') || /\(.*\) => action/.test(prop));
    const propExpr = exprProp ? `{${prop}}` : '';
    // action对象类型的prop, 用于需要传参的或者执行一组action的情况
    // eslint-disable-next-line no-underscore-dangle
    const exprObjProp = typeof prop === 'object' && !objProp && prop._params && prop._actions;
    const propExprObj = exprObjProp ? HandleBars.compile(actionTmpl)(prop) : '';
    // 组件类型的prop, 用于给prop传递组件
    const compProp = typeof prop === 'object' && !objProp && !Array.isArray(prop) && !exprObjProp;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const propComp = compProp ? `{(<>${assembler(prop)}</>)}` : '';
    // 组件数组类型的prop, 用于给prop传递组件数组
    const arrayProp = Array.isArray(prop);
    let propCompArray = '';
    if (arrayProp) {
      propCompArray += '{[(';
      prop.forEach((comp) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        propCompArray += `<>${assembler(comp)}</>`;
      });
      propCompArray += '),]}';
    }
    retVal += ` ${name}=${propStr}${propObj}${propExpr}${propComp}${propCompArray}${propExprObj}`;
  });
  return retVal;
};

export const assembler = (components: object): string => {
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

export const jsonObject = (obj: any): string => {
  if (typeof obj === 'string') {
    return obj;
  }
  return JSON.stringify(obj);
};

export const arrayJoin = (obj: any): string => {
  if (Array.isArray(obj)) {
    return obj.join(',');
  }
  return JSON.stringify(obj);
};
