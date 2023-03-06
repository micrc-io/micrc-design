/**
 * micrc configure command
 * 1. 获取github上schema分支最新内容并合并到当前分支.
 * 2. 将schema中所有内容copy到node_modules/.cache/micrc/schema中.
 * 3. 通过workspace名称确定上下文目录名称(两者同名), 依次处理每个文件代表的组件.
 * 3.1. 依赖处理, 对于clientends组件, 其依赖在generator中通过创建package.json逻辑自行处理;
 *               对于atoms组件, 其只能使用固定的三方组件/lib库, 由workspace固定安装, 所以无需处理;
 *               对于components组件, 其只能依赖atoms组件或三方组件, 需根据其对atoms组件的依赖关系, 通过bit deps set进行设置;
 *               对于modules组件, 其只能依赖components组件, 需根据其对components组件的依赖关系, 通过bit deps set进行设置.
 * 3.2. 源代码, 当组件状态为设计中(designing), 删除已经对应存在的组件, 使用元数据重新生成, 然后进行调试.
 * 3.3. 发布处理, 当组件状态为发布中(tagging), 首先重新生成代码, 然后使用bit tag --soft对组件打tag.
 *               分支合入后, 由CI进行发布并标记组件为完成状态, 此时该组件可以作为依赖项.
 * 3.4. 重建, 当前组件标记为重建时, 需获取组件ID为目录, 版本号为文件名的所有被依赖版本的组件元数据, 依次使用bit tag创建版本,
 *            随后使用bit remove -r在remote scope删除该组件, 最后将创建的组件版本使用bit export推给remote scope完成重建.
 * 4. 执行bit install、bit compile、bit link完成workspace依赖安装和配置.
 */
import { Command, CommandOptions } from '@teambit/cli';

import log from 'loglevel';

import { checkout, copy, init, generate } from '../jobs';

log.setLevel('INFO');

export class ConfigureCmd implements Command {
  name = 'micrc-web:conf';

  description = 'merge meta file from schema and generate component';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    log.info('');
    await checkout(); // 合并schema分支中的元数据文件
    await copy(); // 将元数据copy到.cache/micrc/schema中
    await generate(); // 生成组件代码并处理依赖, 或配置组件发布, 处理组件历史版本重建
    await init(); // 安装依赖并初始化配置workspace
    return Promise.resolve(`${this.name} complete`);
  }
}
