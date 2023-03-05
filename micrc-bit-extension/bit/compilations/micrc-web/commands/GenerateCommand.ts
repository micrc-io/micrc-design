/**
 * 生成组件和app
 * 依次读取atom, component, state, module, clientend几种类型组件的元数据
 * 循环使用bit generator命令，使用不同的模版，通过元数据创建组件。若组件已经存在，则删除重新创建
 * 这里并不处理版本，pub命令处理tag和version问题，并被ci使用
 */
import fs from 'fs';
import { Command, CommandOptions } from '@teambit/cli';

export class GenerateCmd implements Command {
  name = 'micrc-web:gen';

  description = 'generate atom, component, module, state and clientend from meta-data';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  designSystemGen = (): Promise<string> => {
    // todo 处理atom组件
    // todo 处理component组件
    // 读取components目录下的所有文件并循环处理
    // fs.readdirSync('').
    // todo 处理端口
    // 查找atoms目录下所有文件，文件名为组件id，通过id截取组件name，调用bit create micrc-web-atom name创建组件
    // 同上创建components目录下的组件
    // 同上创建states目录下的状态组件
    // 同上创建modules目录下的组件
    // 同上创建clientend目录下的app组件
    // 输出创建的结果，涉及哪些组件，哪些是新建的，哪些是重建（修改）的
  };

  domainDesignGen = (): Promise<string> => {};

  async report(): Promise<string> {
    // todo 读取schema下的context-info.json文件，判断isDesignSystem
    const isDesignSystem = true;
    if (isDesignSystem) {
      return this.designSystemGen();
    }
    return this.domainDesignGen();
  }
}
