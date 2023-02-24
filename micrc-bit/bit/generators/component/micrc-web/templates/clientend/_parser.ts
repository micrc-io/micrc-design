/**
 * 元数据解析，构造模版渲染上下文数据
 */
import path from 'path';
import fs from 'fs';

import { ComponentContext } from '@teambit/generator';

type ClientendIntro = {
  version: string,
  sourceDir: string,
  account: string,
  accountPackageReg: string,
  appId: string,
};

type ClientendEntry = {
  moduleImports: Record<string, string>,
  componentImports: Record<string, string>,
  layouts: Record<string, {
    uris: Array<string>,
    props: Record<string, string | { _val: any } | Record<string, Assembly>>
  }>,
};

type Assembly = {
  layout: string,
  props: Record<string, string | { _val: any } | Record<string, Assembly>>,
};

// 元数据定义
type ClientendMeta = {
  intro: Record<string, string>,
  entry: {
    modules: Record<string, { package: string, version: string }>,
    components: Record<string, { package: string, version: string }>,
    layouts: Record<string, {
      uris: Array<string>,
      props: Record<string, string | { _val: any } | Record<string, Assembly>>,
    }>,
  },
  pages: Record<string, {
    comment: Array<string>,
    modules: Record<string, { package: string, version: string }>,
    components: Record<string, { package: string, version: string }>,
    assembly: Assembly,
  }>,
};

export type ClientendContextData = {
  context: ComponentContext,
  intro: ClientendIntro, // 自省数据
  entry: ClientendEntry, // app入口
  pages: Record<string, {
    moduleImports: Record<string, string>,
    componentImports: Record<string, string>,
    assembly: Assembly,
  }>, // 页面数据，以uri为key，值包括模块、组件导入信息和装配信息
  dependencies?: Record<string, string>, // 端口附加的依赖，包括模块依赖，组件依赖，key为包名，value为版本
};

const handleSourceDir = (context: ComponentContext) => {
  const basePath = path.resolve(
    require.resolve('@micrc/bit.generators.component.micrc-web'),
    '../../../../../',
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
    pages[uri] = { assembly: meta.pages[uri].assembly };
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

export const parse = (meta: ClientendMeta, context: ComponentContext): ClientendContextData => {
  const intro = {
    version: meta.intro.version,
    sourceDir: handleSourceDir(context),
    account: `@${context.componentId.scope.split('.')[0]}`,
    accountPackageReg: `/^(.+?[\\\\/]node_modules)[\\\\/]((?!@${context.componentId.scope.split('.')[0]})).*[\\\\/]*/`,
    appId: `@${context.componentId.scope.replace('.', '/')}.${context.componentId.fullName.replace(/\//g, '.')}`,
  };
  const { entryDependencies, entry } = handleEntry(meta);
  const { pageDependencies, pages } = handlePages(meta);
  const data: ClientendContextData = {
    context,
    intro,
    entry,
    pages,
    dependencies: { ...entryDependencies, ...pageDependencies },
  };
  return data;
};
