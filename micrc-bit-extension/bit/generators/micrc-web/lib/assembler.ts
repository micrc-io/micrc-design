/**
 * 模版helper, 递归装配, 对象json字符串
 */
import HandleBars from 'handlebars';

const actionTmpl = `
{
(
  {{#each _params}}
  {{{this}}}: any,
  {{/each}}
) => {
  const actions = async () => {
    {{#each _actions}}
    await {{{this.action}}}(
      {
        {{#each ../_params}}
        {{{this}}},
        {{/each}}
      },
      '{{{this.inputPath}}}'
    );
    {{/each}}
  };
  actions()
}
}
`;

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
    // eslint-disable-next-line no-underscore-dangle
    const propObj = objProp ? `{${JSON.stringify(prop._val)}}` : '';
    // 函数表达式类型的prop, 用于简单的事件响应函数
    const exprProp = typeof prop === 'string' && (prop.startsWith('bind') || /\(.*\) => action/.test(prop));
    const propExpr = exprProp ? `{${prop}}` : '';
    // action对象类型的prop, 用于需要传参的或者执行一组action的情况
    // eslint-disable-next-line no-underscore-dangle
    const exprObjProp = typeof prop === 'object' && !objProp && prop._params !== undefined && prop._actions !== undefined;
    const propExprObj = exprObjProp ? HandleBars.compile(actionTmpl)(prop) : '';
    // 组件类型的prop, 用于给prop传递组件
    const compProp = typeof prop === 'object' && !objProp && !Array.isArray(prop) && !exprObjProp;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const propComp = compProp ? `{(${assembler(prop)})}` : '';
    // 组件数组类型的prop, 用于给prop传递组件数组
    const arrayProp = Array.isArray(prop);
    let propCompArray = '';
    if (arrayProp) {
      propCompArray += '{[(';
      prop.forEach((comp) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        propCompArray += `${assembler(comp)}`;
      });
      propCompArray += '),]}';
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
export const assembler = (components: object): string => {
  let retVal = '<>';
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
  return `${retVal}</>`;
};

const checkCompObj = (obj: object): boolean => {
  if (Object.keys(obj).length === 0) {
    return false;
  }
  let isCompObj = true;
  Object.keys(obj).forEach((it) => {
    isCompObj = isCompObj && obj[it].children !== undefined && obj[it].props !== undefined;
  });
  return isCompObj;
};

const checkFuncCompObj = (obj: any): boolean => obj.params !== undefined
  && obj.layout !== undefined
  && obj.props !== undefined;

/**
 * 处理复杂对象, 包括原子类型值, 普通数组和对象, 追加组件对象、组件数组对象、组件函数对象处理
 *
 * @param obj 待处理对象
 * @returns 对象的字符串表达
 */
export const jsonObject = (obj: any): string => {
  // 首先处理组件对象数组, 只有数组中所有对象都为组件对象, 才判定为组件数组, 否则认为是普通数组
  // 目前认为不存在数组中混合普通数据和组件数据的情况
  if (Array.isArray(obj) && obj.length !== 0) {
    let isCompObjArray = true;
    obj.forEach((it) => {
      isCompObjArray = isCompObjArray && checkCompObj(it);
    });
    if (isCompObjArray) {
      return `[${obj.map((it) => assembler(it)).join(', ')}]`;
    }
  }
  // 处理普通数组
  if (Array.isArray(obj)) {
    const retVal = [];
    obj.forEach((it) => {
      retVal.push(jsonObject(it));
    });
    return `[${retVal.join(', ')}]`;
  }
  // 处理对象, 注意数组本身也是对象, 所以顺序不能变, 这个应该放在最下面
  if (typeof obj === 'object') {
    if (obj === null) {
      return 'null';
    }
    if (checkCompObj(obj)) { // 组件对象
      return assembler(obj);
    }
    if (checkFuncCompObj(obj)) { // 函数组件对象 (param) => <组件 {...param} />
      return `(${obj.params.join(', ')}) => (<${obj.layout} ${propsAssembler(obj.props)} />)`;
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
  // 原子类型值处理
  return JSON.stringify(obj);
};
