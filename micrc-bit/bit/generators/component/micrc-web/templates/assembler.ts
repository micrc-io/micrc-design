export const propsAssembler = (props: object): string => {
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
// eslint-disable-next-line eol-last
};