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
  children: string | Record<string, Assembly>,
  props: Record<string, PropType>,
};

type ModuleAssembly = {
  layout: string,
  props: Record<string, PropType>,
};

type PropType = string
| { _val: any }
| Record<string, Assembly>
| Array<Record<string, Assembly>>
| { _params: Array<string>, _actions: Array<{ action: string, inputPath: string }> };

// 国际化点位
type I18nPointerMeta = {
  key: string, // 国际化key, 不包含页面uri和模块id, 仅仅只是模块内部定义的key
  desc: string, // 一段国际化点位描述, 可以表达点位位置等信息
  defaults: {
    zh: string, // 中文默认值
    en: string, // 英文默认值
  },
};

// 行为集成的驱动方/生产方
type Producer = {
  pageUri: string, // 页面uri
  moduleId: string, // 模块id
  // todo 暂时留空(不校验)
  schema: object, // 附带数据的schema结构, 使用json schema表达, 用于校验生成方数据符合规格
};

// 行为集成的绑定方/消费方
type Consumer = {
  pageUri: string, // 页面uri
  moduleId: string, // 模块id
  schema: string, // 一段带表达式的json对象字符串, 用于动态映射, 如: let obj; eval('obj = schema')
  state: object, // 由schema映射转换产生的数据, 用于消费方绑定
};

// 行为集成主题, 所有行为集成基于全局唯一的topic, 可以有一个生产方和一到多个消费方
type IntegrationTopic = {
  name: string, // 主题名称
  producer: Producer, // 生产者
  consumers: Array<Consumer>, // 一组消费者, 当数量为1时, 表示P2P模式, 用于如页面跳转, 因为不可能同时跳转多个页面
};

// 行为集成
type IntegrationMeta = {
  produce: Record<string, IntegrationTopic>, // 模块自身为生产方的集成主题, 需要生成模拟的消费方
  consume: Record<string, IntegrationTopic>, // 模块自身为消费方的集成主题, 需要生成模拟的生成方
};

// 行为集成主题数据(行为集成主题中的consumers是数组, 不方便消费方bind, 转换为使用uri+moduleId作为可以)
type IntegrationTopicDataContext = {
  name: string,
  producer: Producer,
  consumers: Record<string, Consumer>, // 转换后的consumer
};

// 行为集成数据
type IntegrationDataContext = {
  init: Record<string, IntegrationTopicDataContext>,
  simulation: { // 用于模拟集成的结构, 通过props传给模块, 模块判断数据是否存在, 渲染集成模拟器
    produce: Record<string, IntegrationTopicDataContext>,
    consume: Record<string, IntegrationTopicDataContext>,
  },
};

type ModuleDoc = {
  title: string, // 标题, 文档头部显示的内容
  labels: Array<string>, // 模块label, 用于模块搜索
  desc: string, // 模块详细描述
  prototype: string, // 原型(高保真)的链接(原型工具提供, 可以直接浏览器打开, 嵌入到文档的iframe中)
};

// 元数据定义
type ModuleMeta = {
  i18n: I18nPointerMeta,
  comment: Array<string>,
  types?: {
    definitions?: Record<string, TypeDefinition>,
    imports?: Record<string, { default: boolean, packages: string }>
  },
  store: { name: string, package: string, version: string },
  components: Record<string, { version: string, packages: string }>,
  innerState?: Record<string, any>,
  actions?: Record<string, { op: string, path: string, value: any }>,
  assembly: ModuleAssembly,
  integration: IntegrationMeta,
  doc: ModuleDoc,
};

export type ModuleContextData = {
  i18n: I18nPointerMeta, // 国际化点位
  typeDefinitions?: Record<string, TypeDefinition>, // 类型定义，以定义的类型名为key
  context: ComponentContext, // 组件上下文，包括id，scope，namespace，name信息
  comment: Array<string>, // 组件注释
  reactImports: Record<string, ImportContent>, // react库导入
  typeImports?: Record<string, ImportContent>, // 类型导入，以导入包为key
  componentImports: Record<string, string>, // 组件导入，以导入名为key, 模块只能使用通用组件, 不必描述default导入
  storeImport: Record<string, string>, // 状态组件, 每个模块有且仅有一个状态组件
  innerState?: Record<string, any>, // 组件内部state，以名称为key，初始值为值
  actions?: Record<string, { op: string, path: string, value: any }>, // 预先定义所有的action, 受限于hooks规则
  assembly: ModuleAssembly, // 组件装配结构，以导入的组件名为key
  integration: IntegrationDataContext, // 行为集成
  props: Record<string, string>, // 模块props, 仅有router, integration两个固定prop
  doc: ModuleDoc,
};

const reactImports = (meta: ModuleMeta): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {
    react: {
      default: 'React',
      types: [],
    },
  };
  // 根据inner state定义，确定是否导入useState
  if (meta.innerState && Object.keys(meta.innerState).length > 0) {
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

// 任意类型导入
const typeImports = (meta: ModuleMeta): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {};
  Object.keys(meta.types.imports).forEach((name) => {
    const pkg = meta.types.imports[name];
    handleImports(name, pkg, retVal);
  });
  return retVal;
};

// 组件导入
const componentImports = (meta: ModuleMeta): Record<string, string> => {
  const retVal: Record<string, string> = {};
  Object.keys(meta.components).forEach((name) => {
    retVal[name] = meta.components[name].packages;
  });
  return retVal;
};

const handleIntegration = (meta: ModuleMeta): IntegrationDataContext => {
  const retVal: IntegrationDataContext = {
    init: {},
    simulation: {
      produce: {},
      consume: {},
    },
  };
  Object.keys(meta.integration.produce).forEach((topic) => {
    retVal.simulation.produce[topic] = {
      name: meta.integration.produce[topic].name,
      producer: meta.integration.produce[topic].producer,
      consumers: {},
    };
    meta.integration.produce[topic].consumers.forEach((consumer) => {
      const key = `${consumer.pageUri.replace(/\//g, '_')}:${consumer.moduleId.replace(/\//g, '_')}`;
      retVal.simulation.produce[topic].consumers[key] = consumer;
    });
    retVal.init[topic] = retVal.simulation.produce[topic];
  });
  Object.keys(meta.integration.consume).forEach((topic) => {
    retVal.simulation.consume[topic] = {
      name: meta.integration.consume[topic].name,
      producer: meta.integration.consume[topic].producer,
      consumers: {},
    };
    meta.integration.consume[topic].consumers.forEach((consumer) => {
      const key = `${consumer.pageUri.replace(/\//g, '_')}:${consumer.moduleId.replace(/\//g, '_')}`;
      retVal.simulation.consume[topic].consumers[key] = consumer;
    });
    retVal.init[topic] = retVal.simulation.consume[topic];
  });
  return retVal;
};

export const parse = (meta: ModuleMeta, context: ComponentContext): ModuleContextData => {
  const data: ModuleContextData = {
    context,
    i18n: meta.i18n,
    comment: meta.comment,
    reactImports: reactImports(meta),
    typeDefinitions: meta.types.definitions || {},
    props: { router: 'any', integration: 'object' },
    typeImports: typeImports(meta),
    componentImports: componentImports(meta),
    storeImport: { [meta.store.name]: meta.store.package },
    innerState: meta.innerState || {},
    actions: meta.actions || {},
    assembly: meta.assembly,
    integration: handleIntegration(meta),
    doc: meta.doc,
  };
  return data;
};
