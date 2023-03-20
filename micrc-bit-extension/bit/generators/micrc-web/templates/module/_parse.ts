/**
 * 元数据解析，构造模版渲染上下文数据
 */
import path from 'path';
import fs from 'fs';

import { ComponentContext } from '@teambit/generator';

// 类型定义
type TypeDefinition = {
  interface: boolean, // 是否接口，如果是定义为interface，否则定义为type
  props: Record<string, string>, // 类型属性
};

// 类型导入
type ImportContent = {
  default: string | null, // 默认导入
  types: Array<string>, // 命名导入
};

// 装配结构
type Assembly = {
  name: string,
  children: string | { assemblies: Array<Assembly> },
  props: Record<string, PropType>,
};

type ModuleAssembly = {
  layout: string,
  props: Record<string, PropType>,
};

type PropType = string
| { _val: any }
| { assemblies: Array<Assembly> }
| Array<{ assemblies: Array<Assembly> }>
| { params: Array<string>, actions: Array<{ action: string, inputPath: string }> };

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

// 模块文档
type ModuleDoc = {
  title: string, // 标题, 文档头部显示的内容
  labels: Array<string>, // 模块label, 用于模块搜索
  desc: string, // 模块详细描述
  prototype: string, // 原型(高保真)的链接(原型工具提供, 可以直接浏览器打开, 嵌入到文档的iframe中)
};

// 元数据定义
type ModuleMeta = {
  intro: {
    version: string,
    state: string,
    modelFilePath: string,
  },
  permissions: Record<string, Array<string>>,
  i18n: Record<string, I18nPointerMeta>,
  integration: IntegrationMeta,
  comment: Array<string>,
  doc: ModuleDoc,
  types?: {
    definitions?: Record<string, TypeDefinition>,
    imports?: Record<string, { default: boolean, packages: string }>
  },
  components: Record<string, { version: string, packages: string }>,
  localState?: Record<string, any>,
  remoteState: {
    rpc: {
      protocols: Array<string>, // 协议文件路径(相对于上下文目录), 用于查找并copy协议文件
      url: string, // api url前缀, /api/v1/xxx, 用于合并协议文件
      host: string, // 集成主机, http://xxx.svc.localhost, 用于合并协议文件
    },
    ws: {
      protocols: Array<string>, // 协议文件路径(相对于上下文目录), 用于查找并copy协议文件
      url: string, // 监听url前缀
      host: string, // 监听host
    }
  },
  actions?: Record<string, { op: string, path: string, value: any }>,
  entry: {
    mount: {
      actions: Array<string>,
    },
    unmount: {
      actions: Array<string>,
    },
  }, // 组件入口, useEffect
  assembly: ModuleAssembly,
};

export type ModuleContextData = {
  intro: { // 自省信息
    version: string, // 组件版本, 同时作为协议版本, 用于合并协议文件
    state: string, // 组件状态(设计, 发布, 完成)
    modelFilePath: string, // 聚合模型元数据文件路径(相对于上下文目录)
    sourceDir: string, // 组件源代码目录
    metaBasePath: string, // 元数据根目录, schema下的上下文目录
  },
  permissions: Array<string>, // 模块权限组
  i18n: Record<string, I18nPointerMeta>, // 国际化点位
  integration: IntegrationDataContext, // 行为集成
  typeDefinitions?: Record<string, TypeDefinition>, // 类型定义，以定义的类型名为key
  context: ComponentContext, // 组件上下文，包括id，scope，namespace，name信息
  comment: Array<string>, // 组件注释
  doc: ModuleDoc,
  props: Record<string, string>, // 模块props, 仅有router, integration两个固定prop
  defaultProps: Record<string, any>, // props默认值
  reactImports: Record<string, ImportContent>, // react库导入
  typeImports?: Record<string, ImportContent>, // 类型导入，以导入包为key
  componentImports: Record<string, string>, // 组件导入，以导入名为key, 模块只能使用通用组件, 不必描述default导入
  localState?: Record<string, any>, // 组件本地状态，以名称为key，初始值为值
  remoteState?: { // 远程状态, 调用api
    rpc: {
      protocols: Array<string>, // 协议文件路径(相对于上下文目录), 用于查找并copy协议文件
      url: string, // api url前缀, /api/v1/xxx, 用于合并协议文件
      host: string, // 集成主机, http://xxx.svc.localhost, 用于合并协议文件
    },
    ws: {
      protocols: Array<string>, // 协议文件路径(相对于上下文目录), 用于查找并copy协议文件
      url: string, // 监听url前缀
      host: string, // 监听host
    }
  }
  actions?: Record<string, { op: string, path: string, value: any }>, // 预先定义所有的action, 受限于hooks规则
  entry: {
    mount: {
      actions: Array<string>,
    },
    unmount: {
      actions: Array<string>,
    },
  },
  assembly: ModuleAssembly, // 组件装配结构，以导入的组件名为key
};

const reactImports = (meta: ModuleMeta): Record<string, ImportContent> => {
  const retVal: Record<string, ImportContent> = {
    react: {
      default: 'React',
      types: [],
    },
  };
  // 根据local state定义，确定是否导入useState
  if (meta.localState && Object.keys(meta.localState).length > 0) {
    retVal.react.types.push('useState');
  }
  // 根据entry的定义, 确定是否导入useEffect
  if (meta.entry && meta.entry.mount && meta.entry.mount.actions.length > 0) {
    retVal.react.types.push('useEffect');
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
  Object.keys(meta?.types?.imports || {}).forEach((name) => {
    // @ts-ignore
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

const handleIntegration = (meta: ModuleMeta, context: ComponentContext): IntegrationDataContext => {
  const pageUri = '#';
  const moduleId = context.componentId.toStringWithoutVersion();
  const retVal: IntegrationDataContext = {
    init: {},
    simulation: {
      produce: {},
      consume: {},
    },
  };
  // 处理自身是生产方的情况
  Object.keys(meta.integration.produce).forEach((topic) => {
    retVal.simulation.produce[topic] = {
      name: meta.integration.produce[topic].name,
      producer: {
        ...meta.integration.produce[topic].producer,
        // topic唯一且只有一个生产者, 模块独立启动时, 没有router信息, 替换页面为#表示任意页面, 替换组件id为当前组件id
        // runtime库当判断router为空时, 使用相同逻辑查找#
        pageUri,
        moduleId,
      },
      consumers: {},
    };
    // 自身是生产方, 在模块独立启动时, 仅模拟消费方绑定数据, 所以pageUri不必处理
    // 模拟器可以通过元数据正确绑定到消费方状态
    meta.integration.produce[topic].consumers.forEach((consumer) => {
      const key = `${consumer.pageUri}:${consumer.moduleId}`;
      retVal.simulation.produce[topic].consumers[key] = consumer;
    });
    retVal.init[topic] = retVal.simulation.produce[topic];
  });
  // 处理自身是消费方的情况
  Object.keys(meta.integration.consume).forEach((topic) => {
    retVal.simulation.consume[topic] = {
      name: meta.integration.consume[topic].name,
      // 自身是消费方, 在模块独立启动时, 仅使用元数据模拟生产方, 不必处理pageUri
      producer: meta.integration.consume[topic].producer,
      consumers: {},
    };
    // 模块的集成元数据, 自身为消费方时, 只写自己一个消费方即可, 因为只涉及自身一个模块
    // 如果一个模块在多个页面绑定了同一个topic, 那么其消费逻辑也是一样的, 这里可以覆盖
    // 所以将moduleId相同的消费方pageUri替换为#, 表示任意页面, 以符合runtime库的逻辑
    meta.integration.consume[topic].consumers.forEach((consumer) => {
      const replaceConsumer = consumer;
      if (consumer.moduleId === moduleId) {
        replaceConsumer.pageUri = pageUri;
      }
      const key = `${replaceConsumer.pageUri}:${replaceConsumer.moduleId}`;
      retVal.simulation.consume[topic].consumers[key] = replaceConsumer;
    });
    retVal.init[topic] = retVal.simulation.consume[topic];
  });
  return retVal;
};

const handleSourceDir = (context: ComponentContext) => {
  const basePath = path.resolve(
    require.resolve('react', { paths: [process.cwd()] }),
    '../../../../../../',
  );
  const sourceDir = `${basePath}${path.sep}${context.componentId.toStringWithoutVersion().split('.')[1]}`;
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
  return sourceDir;
};

export const parse = (meta: ModuleMeta, context: ComponentContext): ModuleContextData => {
  const intro = {
    ...meta.intro,
    sourceDir: handleSourceDir(context),
    metaBasePath: '',
  };
  const data: ModuleContextData = {
    intro,
    context,
    permissions: Object.values(meta.permissions || {}).reduce((pre, cur) => pre.concat(cur), []),
    i18n: meta.i18n,
    comment: meta.comment,
    reactImports: reactImports(meta),
    typeDefinitions: meta?.types?.definitions || {},
    props: { router: 'any' },
    defaultProps: { router: null },
    typeImports: typeImports(meta),
    componentImports: componentImports(meta),
    localState: meta.localState || {},
    remoteState: meta.remoteState,
    actions: meta.actions || {},
    entry: meta.entry || {
      mount: { actions: [] },
      unmount: { actions: [] },
    },
    assembly: meta.assembly,
    integration: handleIntegration(meta, context),
    doc: meta.doc,
  };
  return data;
};
