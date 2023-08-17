export * from './global';

// 行为集成的驱动方/生产方
type Producer = {
  pageUri: string, // 页面uri
  moduleId: string, // 模块id
  exampleState?: any, // 发送数据样例, 用于模块独立启动且为消费方时的驱动方模拟
  // todo 暂时留空(不校验)
  schema: object, // 附带数据的schema结构, 使用json schema表达, 用于校验生成方数据符合规格
};

// 行为集成的绑定方/消费方
type Consumer = {
  pageUri: string; // 页面uri
  moduleId: string; // 模块id
  schema: string; // 一段带表达式的json对象字符串, 用于动态映射, 如: let obj; eval('obj = schema')
  state: object; // 由schema映射转换产生的数据, 用于消费方绑定
  isRouter: boolean; // 集成发生 是否为路由跳转页面，另一种是通过windows打开页面
};

export type IntegrationTopic = {
  name: string,
  producer: Producer,
  consumers: Record<string, Consumer>,
};

export type I18nPointer = {
  key: string,
  desc: string,
  defaults: Record<string, string>,
};

// 计算集成值路径
export const integratePath = (
  router: any, id: string, bindingPath: string, fix: string,
): string => {
  const [topicScope, path] = bindingPath.split('://');
  if (!id) { // 模块独立启动时, 集成模拟器使用
    return `/integration${path}`;
  }
  if (!topicScope || !path) {
    throw Error(`Illegal binding path: ${bindingPath}. It must format of [integrate@topic]://[json pointer]`);
  }
  const [scope, topic] = topicScope.split('@');
  if (!scope || !topic) {
    throw Error(`Illegal binding path: ${bindingPath}. It must format of [integrate@topic]://[json pointer]`);
  }
  let pagePath = '#';
  if (!fix) {
    pagePath = (router?.pathname || '#').replace(/\//g, '~1');
  }
  const modulePath = id.replace(/\//g, '~1');
  const newPath = path === '/' ? '' : path;
  return `/integration/${topic}/consumers/${pagePath}:${modulePath}/state${newPath}`;
};
