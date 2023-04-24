/**
 * 模版helper, 递归装配, 对象json字符串
 */
import HandleBars from 'handlebars';

const actionsPropTmpl = `
{
(
  {{#each params}}
  {{{this}}}: any,
  {{/each}}
) => {
  const actions = async () => {
    {{#each actions}}
    await {{{this.action}}}(
      {{#if this.expr}}
      {{{ json this.expr }}},
      {{else}}
      {
        {{#each ../params}}
        {{{this}}},
        {{/each}}
      },
      {{/if}}
      '{{{this.inputPath}}}'
    );
    {{/each}}
  };
  actions()
}
}
`;

const actionsTmpl = `
const {{{name}}} = async () => {
  {{#each actions}}
  await {{{this}}};
  {{/each}}
};`;

/**
 * 根据组件props对象生成props字符串表达
 * 可处理原子值, 以_val命名的对象值, 函数表达式, 函数对象, 组件对象, 组件对象数组
 *
 * @param props 组件props对象
 * @returns props对象字符串
 */
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
    // eslint-disable-next-line no-nested-ternary
    // const propObj = objProp
    //   // eslint-disable-next-line no-underscore-dangle, no-nested-ternary, no-prototype-builtins
    //   ? typeof prop._val === 'string' ? `{${prop._val}}` : `{${JSON.stringify(prop._val)}}`
    //   : '';
    // eslint-disable-next-line no-nested-ternary
    const propObj = objProp
      // eslint-disable-next-line no-underscore-dangle, array-callback-return
      ? typeof prop._val === 'string' || typeof prop._val === 'number'
        // eslint-disable-next-line no-underscore-dangle
        ? `{${prop._val}}`
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-use-before-define
        : `{${jsonObject(prop._val)}}` : '';
    // eslint-disable-next-line @typescript-eslint/no-redeclare
    // 函数表达式类型的prop, 用于简单的事件响应函数
    const exprProp = typeof prop === 'string' && (prop.startsWith('bind') || /\(.*\) => action/.test(prop));
    const propExpr = exprProp ? `{${prop}}` : '';
    // action对象类型的prop, 用于需要传参的或者执行一组action的情况
    const exprObjProp = typeof prop === 'object'
      && !objProp && prop.params !== undefined && prop.actions !== undefined;
    const propExprObj = exprObjProp ? HandleBars.compile(actionsPropTmpl)(prop) : '';
    // 组件类型的prop, 用于给prop传递组件
    const compProp = typeof prop === 'object' && !objProp && !exprObjProp && prop.assemblies !== undefined;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const propComp = compProp ? `{(${assembler(prop.assemblies)})}` : '';
    // 组件数组类型的prop, 用于给prop传递组件数组
    const arrayProp = Array.isArray(prop);
    let propCompArray = '';
    if (arrayProp) {
      propCompArray += '{[';
      prop.forEach((comp) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        propCompArray += `${assembler(comp.assemblies)},`;
      });
      propCompArray += ']}';
    }
    retVal += ` ${name}=${propStr}${propObj}${propExpr}${propComp}${propCompArray}${propExprObj}`;
  });
  return retVal;
};

/**
 * 根据组件对象装配树, 创建组件的字符串表达
 *
 * @param components 组件对象树
 * @returns 组件字符串
 */
export const assembler = (
  components: Array<{ name: string, children: any, props: object }>,
): string => {
  let retVal = '<>';
  components.forEach((comp) => {
    const nullChildren: boolean = !comp.children;
    const textChildren: boolean = comp.children && typeof comp.children === 'string';
    const nestedChildren: boolean = comp.children
      && typeof comp.children === 'object' && comp.children.assemblies !== undefined;
    const endTag = `</${comp.name}>`;
    retVal += `<${comp.name}`
              + `${propsAssembler(comp.props)}`
              + `${nullChildren ? '\n/>' : '\n>'}`
              + `${textChildren ? comp.children : ''}`
              + `${nestedChildren ? assembler(comp.children.assemblies) : ''}`
              + `${nullChildren ? '' : endTag}`;
  });
  return `${retVal}</>`;
};

const checkCompObj = (obj: any): boolean =>
  obj.assemblies !== undefined && Array.isArray(obj.assemblies);

const checkFuncCompObj = (obj: any): boolean => obj.params !== undefined
  && obj.layout !== undefined
  && obj.props !== undefined;

const checkFuncAssemblyObj = (obj: any): boolean => obj.params !== undefined
  && obj.assembly !== undefined;

const checkFuncActionsObj = (obj: any): boolean => obj.actions !== undefined
  && obj.name !== undefined
  && Array.isArray(obj.actions);

const checkFuncDebugObj = (obj: any): boolean => obj.params !== undefined
  && obj.alert !== undefined;
const checkImgObj = (obj: any): boolean => obj.imageName !== undefined;
// 处理特殊类型对象: null对象, 组件对象(布局/装配), 函数组件对象, 调试函数对象
const handleSpecObj = (obj: any): string => {
  if (obj === null) {
    return 'null';
  }
  // 判断图片类型
  if (checkImgObj(obj)) {
    return obj.imageName;
  }
  if (checkCompObj(obj)) { // 组件对象
    return assembler(obj.assemblies);
  }
  if (checkFuncCompObj(obj)) { // 函数组件对象 (param) => <组件 {...param} />
    return `(${obj.params.join(', ')}) => (<${obj.layout} ${propsAssembler(obj.props)} />)`;
  }
  if (checkFuncAssemblyObj(obj)) { // 函数组件对象 (param) => <组件 {...param} />
    return `(${obj.params.join(', ')}) => ${assembler(obj.assembly.assemblies)}`;
  }

  if (checkFuncActionsObj(obj)) {
    return HandleBars.compile(actionsTmpl)(obj);
  }
  if (checkFuncDebugObj(obj)) { // 函数对象, 用于调试函数 (param) => console.log(`params: ${param}`);
    const log = obj.params.map((it: string) => `\`${it}: \${${it}}\``).join(', ');
    const alert = obj.params.map((it: string) => `\`${it}: \${JSON.stringify(${it})}\``).join(', ');
    if (obj.alert) {
      return `(${obj.params.join(', ')}) => alert(${alert})`;
    }
    return `(${obj.params.join(', ')}) => console.log(${log})`;
  }
  return '';
};

/**
 * 处理复杂对象, 包括原子类型值, 普通数组和对象, 追加组件对象、组件数组对象、组件函数对象处理
 *
 * @param obj 待处理对象
 * @returns 对象的字符串表达
 */
export const jsonObject = (obj: any): string => {
  // 首先处理组件对象数组, 只有数组中所有对象都为组件对象, 才判定为组件数组, 否则按普通数组处理
  if (Array.isArray(obj) && obj.length !== 0) {
    let isCompObjArray = true;
    obj.forEach((it) => {
      isCompObjArray = isCompObjArray && checkCompObj(it);
    });
    if (isCompObjArray) {
      return `[${obj.map((it) => assembler(it.assemblies)).join(', ')}]`;
    }
  }
  // 处理普通数组
  if (Array.isArray(obj)) {
    const retVal: Array<string> = [];
    obj.forEach((it) => {
      retVal.push(jsonObject(it));
    });
    return `[${retVal.join(', ')}]`;
  }
  // 处理对象, 注意数组本身也是对象, 所以顺序不能变, 这个应该放在最下面
  if (typeof obj === 'object') {
    const result = handleSpecObj(obj);
    if (result) {
      return result;
    }
    let retVal = '{';
    Object.keys(obj).forEach((it) => {
      retVal += `${it}: `;
      retVal += jsonObject(obj[it]);
      retVal += ', ';
    });
    retVal += '}';
    return retVal;
  }
  if (typeof obj === 'string' && obj.startsWith('bind')) {
    return obj;
  }
  if (typeof obj === 'string' && obj.startsWith('params-')) {
    return obj.split('-')[1];
  }
  // 原子类型值处理
  return JSON.stringify(obj);
};
HandleBars.registerHelper('json', (context) => jsonObject(context));
