/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

// 类型导入
type ImportContent = {
  default: string, // 默认导入
  types: Array<string>, // 命名导入
};

// 元数据定义
type AtomMeta = {
  comment: Array<string>, // 注释
  reactImports: Record<string, ImportContent>, // react库导入, 包括useState, useEffect等
  typeImports?: Record<string, { default: boolean, packages: string }>, // 类型导入, 按元数据规范生成, 不直接用代码
  componentImports?: Record<string, { default: boolean, packages: string }> // 组件导入, 同类型导入
  typeDefinitions?: string, // 类型定义, 直接使用代码
  props: string, // props定义, 直接使用代码
  innerState?: string, // 状态定义, 直接使用代码
  logic?: string, // 组件逻辑定义, 直接使用代码
  assembly: string, // 装配逻辑定义, 直接使用代码
};

export type AtomContextData = {
  context: ComponentContext, // 组件上下文，包括id，scope，namespace，name信息
  comment: Array<string>, // 组件注释
  reactImports: Record<string, ImportContent>, // react库导入
  typeImports?: Record<string, ImportContent>, // 类型导入，以导入包为key
  componentImports?: Record<string, ImportContent>, // 组件导入，以导入包为key
  typeDefinitions?: string, // 类型定义, 直接使用代码
  props: string, // 组件props定义, 直接使用代码
  innerState?: string, // 组件内部state, 直接使用代码
  logic?: string, // 组件逻辑定义, 直接使用代码
  assembly: string, // 装配逻辑定义, 直接使用代码
};

const handleImports = (
  name: string, pkg: { default: boolean, packages: string }, retVal: Record<string, ImportContent>,
) => {
  // react包在reactImports中已经处理过了，这里的类型导入需要排除
  if (pkg.packages !== 'react') {
    const item = retVal[pkg.packages];
    // 在同一个包里，导入两个不同的default，是有问题的
    if (item && item.default && pkg.default && item.default !== name) {
      throw Error(`package: ${pkg.packages} has too many default import. just one allowed`);
    }
    if (!item) {
      // eslint-disable-next-line no-param-reassign
      retVal[pkg.packages] = {
        default: pkg.default ? name : null,
        types: pkg.default ? [] : [name],
      };
    } else if (pkg.default) {
      item.default = name;
    } else {
      item.types.push(name);
    }
  }
};

const typeOrComponentImports = (
  meta: AtomMeta, type: string,
): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {};
  // eslint-disable-next-line no-nested-ternary
  let imports = type === 'types' ? meta.typeImports : {};
  imports = type === 'components' ? meta.componentImports : imports;
  Object.keys(imports).forEach((name) => {
    const pkg = imports[name];
    handleImports(name, pkg, retVal);
  });
  return retVal;
};

export const parse = (meta: AtomMeta, context: ComponentContext): AtomContextData => {
  const data: AtomContextData = {
    context,
    comment: meta.comment,
    reactImports: meta.reactImports,
    typeDefinitions: meta.typeDefinitions,
    typeImports: typeOrComponentImports(meta, 'types'),
    props: meta.props,
    componentImports: typeOrComponentImports(meta, 'components'),
    innerState: meta.innerState,
    assembly: meta.assembly,
  };
  return data;
};
