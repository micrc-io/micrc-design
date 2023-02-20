/**
 * 配置命令
 * 执行intall, compile, link, status等命令配置workspace
 * 下载(局部clone当前仓库)schema目录中的元数据文件, 放在node_modules/.cache/micrc/schema中
 * 读取schema中的context信息，判断当前是system还是domain，system仅允许atom, component类型组件和clientend客户端
 * domain仅允许module和state两类组件，检查schema中的目录，确定符合条件
 */
import { Command, CommandOptions } from '@teambit/cli';

export class ConfigureCmd implements Command {
  name = 'micrc:conf';

  description = 'configure workspace and download file of meta data';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    // 执行bit install && bit install && bit compile && bit compile && bit link && bit status命令并输出结果
    // 使用git命令获取当前仓库地址，获取fetch的地址
    // 使用git浅克隆仓库的schema分支，放在本地node_modules/.cache/micrc-schema中
    // 使用git checkout下载schema目录
    return Promise.resolve(`${this.name} complete`);
  }
}
