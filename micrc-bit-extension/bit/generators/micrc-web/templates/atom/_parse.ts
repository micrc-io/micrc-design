/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

type TypeDefinition = {
  interface: boolean, // 是否接口，如果是定义为interface，否则定义为type
  props: Record<string, string>, // 类型属性
};

// 类型导入
type ImportContent = {
  default: string, // 默认导入
  types: Array<string>, // 命名导入
};

// 装配
type Assembly = {
  children?: string | { assemblies: Array<Assembly> },
  props: Record<string, PropType>,
};

// 属性类型, 字符串(表达式), _val特殊对象, 嵌套的组件装配, 嵌套的组件装配数组
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
type AtomMeta = {
  intro: {
    version: string;
    state: string; // 组件状态
  };
  comment: Array<string>; // 注释
  reactImports: Record<string, ImportContent>; // react库导入, 包括useState, useEffect等
  typeImports?: Record<string, ImportContent>; // 类型导入, 按元数据规范生成, 不直接用代码
  componentImports?: Record<string, ImportContent>; // 组件/库导入, 只能导入已经支持的
  insideComponents: Record<string, { version: string; packages: string }>;
  typeDefinitions?: Record<string, TypeDefinition>; // 类型定义
  props: Record<string, { type: string; description: string }>; // props定义
  defaultProps: Record<string, any>; // 组件默认props
  stories: {
    componentImports: Record<string, ImportContent>;
    insideComponents: Record<string, { version: string; packages: string }>;
    atomImports: Record<string, string>; // 原子组件导入, 以导入名为key, 包名为值
    examples: Record<string, { desc: string; props: Record<string, any> }>;
  };
  doc: ComponentDoc; // 组件文档
  css?: string;
  localState?: Record<string, any>; // 状态定义
  assembly: { assemblies: Array<Assembly> }; // 装配逻辑
  outerLogic?: string; // 组件外的逻辑代码, 可以使用yaml多行文本转json得到
  innerLogic?: string; // 组件内的逻辑代码
};

export type AtomContextData = {
  intro: {
    version: string;
    state: string;
    metaBasePath: string;
  };
  context: ComponentContext; // 组件上下文，包括id，scope，namespace，name信息
  comment: Array<string>; // 组件注释
  reactImports: Record<string, ImportContent>; // react库导入
  typeImports?: Record<string, ImportContent>; // 类型导入，以导入包为key
  componentImports?: Record<string, ImportContent>; // 组件导入，以导入包为key
  insideComponentsImports: Record<string, string>; // 内部组件导入（将三方组件包一层i18n）, 以导入名为key, 包名为值
  typeDefinitions?: Record<string, TypeDefinition>; // 类型定义
  props: Record<string, { type: string; description: string }>; // 组件props定义
  defaultProps: Record<string, any>; // 组件默认props
  stories: {
    componentImports: Record<string, ImportContent>;
    insideComponentsImports: Record<string, string>; // 内部组件导入（将三方组件包一层i18n）, 以导入名为key, 包名为值
    examples: Record<string, { desc: string; props: Record<string, any> }>;
  };
  doc: ComponentDoc; // 组件文档
  css: string; // 组件样式表
  localState?: Record<string, any>; // 组件内部state, 直接使用代码
  assembly: { assemblies: Array<Assembly> }; // 装配逻辑
  outerLogic?: string; // 组件外的逻辑代码, 可以使用yaml多行文本转json得到
  innerLogic?: string; // 组件内的逻辑代码
};

const insideComponentsImports = (
  insideComponents: Record<string, { version: string; packages: string }>,
): Record<string, string> => {
  const retVal: Record<string, string> = {};
  Object.keys(insideComponents).forEach((name) => {
    retVal[name] = insideComponents[name].packages;
  });
  return retVal;
};

export const parse = (meta: AtomMeta, context: ComponentContext): AtomContextData => {
  const data: AtomContextData = {
    intro: {
      ...meta.intro,
      metaBasePath: '',
    },
    context,
    comment: meta.comment,
    reactImports: meta.reactImports,
    typeDefinitions: meta.typeDefinitions,
    typeImports: meta.typeImports,
    props: meta.props,
    defaultProps: meta.defaultProps,
    stories: {
      componentImports: meta.stories.componentImports,
      examples: meta.stories.examples,
      insideComponentsImports: insideComponentsImports(
        meta.stories.insideComponents || {},
      ),
    },
    doc: meta.doc,
    css: meta.css || '',
    componentImports: meta.componentImports,
    insideComponentsImports: insideComponentsImports(
      meta.insideComponents || {},
    ),
    localState: meta.localState,
    assembly: meta.assembly,
    outerLogic: meta.outerLogic,
    innerLogic: meta.innerLogic,
  };
  return data;
};
