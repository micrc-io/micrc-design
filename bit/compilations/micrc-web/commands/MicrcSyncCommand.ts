import { Command } from '@teambit/cli';

export class MicrcSyncCmd implements Command {
  name = 'sync';

  description = 'micrc meta-schema sync '
    + 'from current git repo and schema branch with schema folder '
    + 'to node_modules/.cache/micrc-schema';

  alias = '';

  group = 'micrc';

  options = [];

  async report(): Promise<string> {
    // 使用git命令获取当前仓库地址，获取fetch的地址
    // 使用git浅克隆仓库的schema分支，放在本地node_modules/.cache/micrc-schema中
    // 使用git checkout下载schema目录
    return Promise.resolve(`${this.name} complete`);
  }
}
