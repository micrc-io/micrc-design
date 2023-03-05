/**
 * 元数据解析，构造模版渲染上下文数据
 */
import fs from 'fs';
import path from 'path';

import { ComponentContext } from '@teambit/generator';

const SCHEMA_PATH = ['.cache', 'micrc', 'schema'];

// 元数据定义
type ModuleMeta = {
  intro: {
    version: string, // 组件版本, 同时作为协议版本, 用于合并协议文件
    aggreName: string, // 聚合名称, 用于查找聚合文件
    caseName: string, // 用例名称, 用于合并协议文件
  },
  comment: Array<string>,
  integration: {
    rpc: {
      protocols: Array<string>, // 协议文件名, 用于查找并copy协议文件
      url: string, // api url前缀, /api/v1/xxx, 用于合并协议文件
      host: string, // 集成主机, http://xxx.svc.localhost, 用于合并协议文件
    },
    ws: {
      protocols: Array<string>, // 协议文件名
      url: string, // 监听url前缀
      host: string, // 监听host
    }
  }
};

export type ModuleContextData = {
  context: ComponentContext,
  intro: {
    version: string, // 组件版本, 同时作为协议版本, 用于合并协议文件
    aggreName: string, // 聚合名称, 用于查找聚合文件
    caseName: string, // 用例名称, 用于合并协议文件
    metaBasePath: string, // 组件的元数据目录
    sourceDir: string, // 组件源代码目录
  },
  comment: Array<string>,
  integration: {
    rpc: {
      protocols: Array<string>, // 协议文件名, 用于查找并copy协议文件
      url: string, // api url前缀, /api/v1/xxx, 用于合并协议文件
      host: string, // 集成主机, http://xxx.svc.localhost, 用于合并协议文件
    },
    ws: {
      protocols: Array<string>, // 协议文件名
      url: string, // 监听url前缀
      host: string, // 监听host
    }
  }
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

export const parse = (meta: ModuleMeta, context: ComponentContext): ModuleContextData => {
  const intro = {
    ...meta.intro,
    metaBasePath: path.resolve(
      path.resolve(
        require.resolve('@micrc/bit.generators.component.micrc-web'),
        '../../../../',
      ),
      ...SCHEMA_PATH,
      context.componentId.scope.split('.')[1], // 上下文名称, 如: order-design
      'states', // 组件类型名称, 如: atoms, components, clientends, modules
      context.componentId.toStringWithoutVersion().replace(/\//g, '-'),
    ),
    sourceDir: handleSourceDir(context),
  };
  const data: ModuleContextData = {
    context,
    comment: meta.comment,
    intro,
    integration: meta.integration,
  };
  return data;
};
