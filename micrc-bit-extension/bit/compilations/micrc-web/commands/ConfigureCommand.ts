/**
 * micrc configure command
 * 1. 获取github上schema分支最新内容并合并到当前分支.
 * 2. 将schema中所有内容copy到node_modules/.cache/micrc/schema中.
 * 3. 执行bit install、bit compile、bit link完成workspace依赖安装和配置.
 */
import { Command, CommandOptions } from '@teambit/cli';

import log from 'loglevel';

import { checkout, copy, init } from '../jobs';
import { repo } from '../jobs/config-npm-repo';

log.setLevel('INFO');

export class ConfigureCmd implements Command {
  name = 'micrc:web:conf';

  description = 'merge meta file from schema branch';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    log.info('');
    await init(); // 安装依赖并初始化配置workspace
    // await checkout(); // 合并schema分支中的元数据文件
    await copy(); // 将元数据copy到.cache/micrc/schema中
    await repo(); // 在workspace.jsonc中配置组件的npm仓库
    return Promise.resolve(`${this.name} complete`);
  }
}
