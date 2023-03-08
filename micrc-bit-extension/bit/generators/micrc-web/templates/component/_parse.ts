/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

// 类型定义
type TypeDefinition = {
  interface: boolean, // 是否接口，如果是定义为interface，否则定义为type
  props: Record<string, string>, // 类型属性
};

// 类型导入
type ImportContent = {
  default: string, // 默认导入
  types: Array<string>, // 命名导入
};

// 装配结构
type Assembly = {
  children?: string | { assemblies: Array<Assembly> },
  props: Record<string, PropType>,
};

type PropType = string
| { _val: any }
| { assemblies: Array<Assembly> }
| Array<{ assemblies: Array<Assembly> }>;

type ComponentDoc = {
  title: string, // 标题, 文档头部显示的内容
  labels: Array<string>, // label, 组件label, 用于组件搜索
  prototype: string, // 原型(高保真)的链接(原型工具提供, 可以直接浏览器打开, 嵌入到文档的iframe中)
};

// 元数据定义
type ComponentMeta = {
  intro: {
    version: string,
    state: string,
  },
  comment: Array<string>,
  types?: {
    definitions?: Record<string, TypeDefinition>,
    imports?: Record<string, { default: boolean, packages: string }>
  },
  props: Record<string, string>,
  defaultProps: Record<string, any>,
  stories: {
    components: Record<string, { default: boolean, packages: string }>,
    atoms: Record<string, { version: string, packages: string }>,
    examples: Record<string, { desc: string, props: Record<string, any> }>,
  },
  doc: ComponentDoc,
  localState?: Record<string, any>,
  components: Record<string, { default: boolean, packages: string }>,
  atoms: Record<string, { version: string, packages: string }>,
  assembly: { assemblies: Array<Assembly> },
};

export type ComponentContextData = {
  intro: {
    version: string, // 组件版本
    state: string, // 组件状态(设计, 发布, 完成)
    metaBasePath: string,
  },
  context: ComponentContext, // 组件上下文，包括id，scope，namespace，name信息
  comment: Array<string>, // 组件注释
  reactImports: Record<string, ImportContent>, // react库导入
  typeDefinitions?: Record<string, TypeDefinition>, // 类型定义，以定义的类型名为key
  typeImports?: Record<string, ImportContent>, // 类型导入，以导入包为key
  props: Record<string, string>, // 组件props类型定义
  defaultProps: Record<string, any>, // 组件默认props
  stories: {
    componentImports: Record<string, ImportContent>,
    atomImports: Record<string, string>, // 原子组件导入, 以导入名为key, 包名为值
    examples: Record<string, { desc: string, props: Record<string, any> }>,
  },
  doc: ComponentDoc, // 组件文档
  componentImports: Record<string, ImportContent>, // 组件导入，以导入包为key
  atomImports: Record<string, string>, // 原子组件导入, 以导入名为key, 包名为值
  localState?: Record<string, any>, // 组件内部state，以名称为key，初始值为值
  assembly: { assemblies: Array<Assembly> }, // 组件装配结构
};

const reactImports = (meta: ComponentMeta): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {
    react: {
      default: 'React',
      types: [],
    },
  };
  // 根据inner state定义，确定是否导入useState
  if (meta.localState && Object.keys(meta.localState).length > 0) {
    retVal.react.types.push('useState');
  }
  // 将类型导入中的react类型的导入，放入react的imports中
  if (meta.types && meta.types.imports) {
    const { types: { imports } } = meta;
    Object.keys(imports).forEach((name) => {
      if (imports[name].packages === 'react') {
        retVal.react.types.push(name);
      }
    });
  }
  return retVal;
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
  meta: ComponentMeta, type: string,
): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {};
  // eslint-disable-next-line no-nested-ternary
  let imports = type === 'types' ? meta.types.imports : {};
  imports = type === 'components' ? meta.components : imports;
  Object.keys(imports).forEach((name) => {
    const pkg = imports[name];
    handleImports(name, pkg, retVal);
  });
  return retVal;
};

const atomsImports = (
  atoms: Record<string, { version: string, packages: string }>,
): Record<string, string> => {
  const retVal: Record<string, string> = {};
  Object.keys(atoms).forEach((name) => {
    retVal[name] = atoms[name].packages;
  });
  return retVal;
};

const handleStories = (meta: ComponentMeta) => {
  const componentImports: Record<string, ImportContent> = {};
  Object.keys(meta.stories.components).forEach((name) => {
    const pkg = meta.stories.components[name];
    handleImports(name, pkg, componentImports);
  });
  return {
    componentImports,
    atomImports: atomsImports(meta.stories.atoms),
    examples: {
      Default: {
        desc: 'default usage',
        props: {},
      },
      ...meta.stories.examples,
    },
  };
};

export const parse = (meta: ComponentMeta, context: ComponentContext): ComponentContextData => {
  const data: ComponentContextData = {
    intro: {
      ...meta.intro,
      metaBasePath: '',
    },
    context,
    comment: meta.comment,
    reactImports: reactImports(meta),
    typeDefinitions: meta.types.definitions || {},
    typeImports: typeOrComponentImports(meta, 'types'),
    props: meta.props,
    defaultProps: meta.defaultProps,
    componentImports: typeOrComponentImports(meta, 'components'),
    atomImports: atomsImports(meta.atoms),
    localState: meta.localState || {},
    assembly: meta.assembly,
    stories: handleStories(meta),
    doc: meta.doc,
  };
  return data;
};
