export * from './global';

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

export type IntegrationTopic = {
  name: string,
  producer: Producer,
  consumers: Record<string, Consumer>,
};

// 计算集成值路径
export const integratePath = (router: any, id: string, bindingPath: string): string => {
  if (!id) {
    return bindingPath;
  }
  const [topicScope, path] = bindingPath.split('://');
  if (!topicScope || !path) {
    throw Error(`Illegal binding path: ${bindingPath}. It must format of [integrate@topic]://[json pointer]`);
  }
  const [scope, topic] = topicScope.split('@');
  if (!scope || !topic) {
    throw Error(`Illegal binding path: ${bindingPath}. It must format of [integrate@topic]://[json pointer]`);
  }
  const pagePath = (router?.pathname || '#').replace(/\//g, '~1');
  const modulePath = id.replace(/\//g, '~1');
  return `/integration/${topic}/consumers/${pagePath}:${modulePath}/state${path}`;
};
