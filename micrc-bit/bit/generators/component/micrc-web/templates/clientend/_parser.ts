/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

// 元数据定义
type ClientendMeta = {
  intro: Record<string, string>,
  modules: Record<string, { package: string, version: string }>,
};

export type ClientendContextData = {
  context: ComponentContext,
  intro: Record<string, string>,
  dependencies?: Record<string, string>, // 端口附加的依赖，包括模块依赖，组件依赖，key为包名，value为版本
};

const handleDependencies = (meta: ClientendMeta) => {
  const retVal = {};
  Object.keys(meta.modules).forEach((name) => {
    retVal[meta.modules[name].package] = meta.modules[name].version;
  });
  return retVal;
};

export const parse = (meta: ClientendMeta, context: ComponentContext): ClientendContextData => {
  const dependencies = handleDependencies(meta);
  const intro = {
    ...meta.intro,
    account: `@${context.componentId.scope.split('.')[0]}`,
    scope: context.componentId.scope.split('.')[1],
    fullname: context.componentId.fullName.replace(/\//g, '.'),
    appId: `@${context.componentId.scope.replace('.', '/')}.${context.componentId.fullName.replace(/\//, '.')}`,
  };
  console.log(intro);
  const data: ClientendContextData = {
    context,
    intro,
    dependencies,
  };
  return data;
};
