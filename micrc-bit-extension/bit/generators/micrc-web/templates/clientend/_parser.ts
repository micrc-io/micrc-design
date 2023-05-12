/**
 * 元数据解析，构造模版渲染上下文数据
 */
import path from 'path';
import fs from 'fs';

import { ComponentContext } from '@teambit/generator';

type ClientendIntro = {
  version: string,
  state: string,
  favicon: string,
  namespace: string,
  metaBasePath: string,
  sourceDir: string,
  account: string,
  accountPackageReg: string,
  appId: string,
  context: {
    ownerDomain: string,
    global: {
      integration: {
        proxyServerUrl: string,
        registry: string,
        gitopsRepo: string,
      },
      production: {
        proxyServerUrl: string,
        registry: string,
        gitopsRepo: string,
      },
    },
    gateway: {
      entry: string,
      host: string,
      rule: {},
    }
  },
};

type Assembly = {
  children: string | { assemblies: Array<Assembly> },
  props: Record<string, PropType>,
};

type PageAssembly = {
  layout: string,
  props: Record<string, PropType>,
};

type PropType = string
| { _val: any }
| { assemblies: Array<Assembly> }
| Array<{ assemblies: Array<Assembly> }>;

type ClientendEntry = {
  moduleImports: Record<string, string>,
  componentImports: Record<string, string>,
  layouts: Record<string, {
    uris: Array<string>,
    props: Record<string, PropType>
  }>,
};

type I18nPointerMeta = {
  key: string, // 国际化key, 不包含页面uri和模块id, 仅仅只是模块内部定义的key
  desc: string, // 一段国际化点位描述, 可以表达点位位置等信息
  defaults: {
    zh_CN: string, // 中文默认值
    en_US: string, // 英文默认值
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

type IntegrationTopic = {
  name: string, // 主题名称
  producer: Producer, // 生产者
  consumers: Array<Consumer>, // 一组消费者, 当数量为1时, 表示P2P模式, 用于如页面跳转, 因为不可能同时跳转多个页面
};

// 元数据定义
type ClientendMeta = {
  intro: {
    version: string,
    state: string,
    favicon: string,
    namespace:string,
    languages: Array<{ code: string, name: string }>,
    context: {
      ownerDomain: string,
      global: {
        integration: {
          proxyServerUrl: string,
          registry: string,
          gitopsRepo: string,
        },
        production: {
          proxyServerUrl: string,
          registry: string,
          gitopsRepo: string,
        },
      },
      gateway: {
        entry: string,
        host: string,
        rule: {},
      }
    }
  },
  doc: {
    title: string,
    labels: Array<string>,
    showcase: string,
    desc: string,
  },
  integration: Record<string, IntegrationTopic>,
  entry: {
    modules: Record<string, {
      package: string,
      version: string,
      i18n: Record<string, I18nPointerMeta>,
      // todo tracker
    }>,
    components: Record<string, { package: string, version: string }>,
    layouts: Record<string, {
      uris: Array<string>,
      props: Record<string, PropType>,
    }>,
  },
  pages: Record<string, {
    // todo tracker
    i18n : Record<string, I18nPointerMeta>,
    permissions: Record<string, Array<string>>,
    comment: Array<string>,
    modules: Record<string, {
      package: string,
      version: string,
      i18n: Record<string, I18nPointerMeta>,
      // todo tracker
    }>,
    components: Record<string, { package: string, version: string }>,
    assembly: PageAssembly,
  }>,
};

type SubmissionI18n = {
  sourceService: { serviceName: string, serviceType: 'CLIENT' },
  initData: {
    data: {
      language: Array<{ code: string, name: string }>
      pointers: Array<{
        code: string,
        locate: string,
        translations: Array<{ langTypeCode: string, trans: string }>
      }>
    }
  }
};

type I18nDataContext = {
  init: Record<string, Record<string, I18nPointerMeta | Record<string, I18nPointerMeta>>>,
  submission: SubmissionI18n,
};

// 行为集成主题数据(行为集成主题中的consumers是数组, 不方便消费方bind, 转换为使用uri+moduleId作为可以)
type IntegrationTopicDataContext = {
  name: string,
  producer: Producer,
  consumers: Record<string, Consumer>, // 转换后的consumer
};

// todo 定义数据context
type TrackerDataContext = {
  init: {},
  submission: {},
};

export type ClientendContextData = {
  i18n: I18nDataContext,
  tracker: TrackerDataContext, // todo 完善埋点点位
  integration: Record<string, IntegrationTopicDataContext>,
  intro: ClientendIntro, // 自省数据
  doc: {
    title: string,
    labels: Array<string>,
    desc: string,
  },
  context: ComponentContext,
  entry: ClientendEntry, // app入口
  pages: Record<string, {
    permissions: Array<string>,
    moduleImports: Record<string, string>,
    componentImports: Record<string, string>,
    assembly: PageAssembly,
  }>, // 页面数据，以uri为key，值包括模块、组件导入信息和装配信息
  dependencies?: Record<string, string>, // 端口附加的依赖，包括模块依赖，组件依赖，key为包名，value为版本
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

const handleEntry = (meta: ClientendMeta) => {
  const entryDependencies = {};
  const entry: ClientendEntry = {
    moduleImports: {},
    componentImports: {},
    layouts: meta.entry.layouts,
  };
  Object.keys(meta.entry.modules).forEach((name) => {
    const module = meta.entry.modules[name];
    entryDependencies[module.package] = module.version;
    entry.moduleImports[name] = module.package;
  });
  Object.keys(meta.entry.components).forEach((name) => {
    const component = meta.entry.components[name];
    entryDependencies[component.package] = component.version;
    entry.componentImports[name] = component.package;
  });
  return {
    entryDependencies,
    entry,
  };
};

const handlePages = (meta: ClientendMeta) => {
  const pageDependencies = {};
  const pages = {};
  Object.keys(meta.pages).forEach((uri) => {
    pages[uri] = {
      permissions: Object.values(meta.pages[uri].permissions || {})
        .reduce((pre, cur) => pre.concat(cur), []),
      moduleImports: {},
      componentImports: {},
      assembly: meta.pages[uri].assembly,
    };
    const { modules } = meta.pages[uri];
    Object.keys(modules).forEach((name) => {
      pageDependencies[modules[name].package] = modules[name].version;
      pages[uri].moduleImports[name] = modules[name].package;
    });
    const { components } = meta.pages[uri];
    Object.keys(components).forEach((name) => {
      pageDependencies[components[name].package] = components[name].version;
      pages[uri].componentImports[name] = components[name].package;
    });
  });
  return {
    pageDependencies,
    pages,
  };
};

const handleI18n = (meta: ClientendMeta, context: ComponentContext): I18nDataContext => {
  const packToId = (pack: string): string => {
    const [account, fullName] = pack.split('/');
    const nameArray = fullName.split('.');
    const scope = nameArray.shift();
    return `${account.replace('@', '')}.${scope}/${nameArray.join('/')}`;
  };
  const retVal: I18nDataContext = {
    init: {},
    submission: {
      sourceService: {
        serviceName: context.name,
        serviceType: 'CLIENT',
      },
      initData: {
        data: {
          language: meta.intro.languages,
          pointers: [],
        },
      },
    },
  };
  const pushPointer = (pointer: I18nPointerMeta, pageUri: string = '#', mId: string = '#') => {
    retVal.submission.initData.data.pointers.push({
      code: `${context.name}`
        + `:${pageUri}`
        + `:${mId}`
        + `:${pointer.key}`,
      locate: `${pointer.desc}`,
      translations: Object.keys(pointer.defaults)
        .map((lang) => ({
          langTypeCode: lang,
          trans: pointer.defaults[lang],
        })),
    });
  };
  // 首先处理entry中模块的i18n点位
  Object.keys(meta.entry.modules).forEach((name) => {
    const mId = packToId(meta.entry.modules[name].package);
    if (!retVal.init['#']) {
      retVal.init['#'] = {}; // 端口布局中使用的模块的点位, 页面用#表达
    }
    retVal.init['#'][mId] = meta.entry.modules[name].i18n;
    Object.values(meta.entry.modules[name].i18n).forEach((it) => {
      pushPointer(it, '#', mId);
    });
  });
  // 处理页面中的点位
  Object.keys(meta.pages).forEach((pageUri) => {
    if (!retVal.init[pageUri]) {
      retVal.init[pageUri] = {};
    }
    retVal.init[pageUri]['#'] = meta.pages[pageUri].i18n; // 用#表达模块页面的点位
    Object.values(meta.pages[pageUri].i18n).forEach((it) => {
      pushPointer(it, pageUri, '#');
    });
    Object.keys(meta.pages[pageUri].modules).forEach((name) => {
      const mId = packToId(meta.pages[pageUri].modules[name].package);
      retVal.init[pageUri][mId] = meta.pages[pageUri].modules[name].i18n;
      Object.values(meta.pages[pageUri].modules[name].i18n).forEach((it) => {
        pushPointer(it, pageUri, mId);
      });
    });
  });
  return retVal;
};

// todo 解析埋点点位元数据, 生成用于初始化和报送的点位信息
const handleTracker = () => ({
  init: {},
  submission: {},
});

const handleIntegration = (meta: ClientendMeta): Record<string, IntegrationTopicDataContext> => {
  const retVal = {};
  Object.values(meta.integration).forEach((it) => {
    retVal[it.name] = {
      name: it.name,
      producer: it.producer,
      consumers: {},
    };
    it.consumers.forEach((consumer) => {
      const key = `${consumer.pageUri}:${consumer.moduleId}`;
      retVal[it.name].consumers[key] = consumer;
    });
  });
  return retVal;
};

export const parse = (meta: ClientendMeta, context: ComponentContext): ClientendContextData => {
  const intro = {
    ...meta.intro,
    metaBasePath: '',
    sourceDir: handleSourceDir(context),
    account: `@${context.componentId.scope.split('.')[0]}`,
    accountPackageReg: `/^(.+?[\\\\/]node_modules)[\\\\/]((?!@${context.componentId.scope.split('.')[0]})).*[\\\\/]*/`,
    appId: `@${context.componentId.scope.replace('.', '/')}.${context.componentId.fullName.replace(/\//g, '.')}`,
  };
  if (!intro.favicon) {
    throw Error('Icon of favicon must exists.');
  }

  const { entryDependencies, entry } = handleEntry(meta);
  const { pageDependencies, pages } = handlePages(meta);
  const data: ClientendContextData = {
    i18n: handleI18n(meta, context),
    tracker: handleTracker(),
    integration: handleIntegration(meta),
    context,
    intro,
    doc: meta.doc,
    entry,
    pages,
    dependencies: { ...entryDependencies, ...pageDependencies },
  };
  return data;
};
