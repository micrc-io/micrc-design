/**
 * copy msw service worker task
 */
import path from 'path';
import fs from 'fs';
import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';

const ENV_TEMPLATE_PATH = ['artifacts', 'env-template', 'public'];
const ENV_COMPONENT = ['micrc.bit/envs/micrc-web', 'micrc.bit/envs/micrc-mini', 'micrc.bit/envs/micrc-app'];

export class MicrcMswServiceWorkerTask implements BuildTask {
  constructor(readonly aspectId: string) {}

  readonly name = 'MicrcMswServiceWorkerTask';

  // eslint-disable-next-line class-methods-use-this
  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const componentsResults: ComponentResult[] = [];
    const capsules = context.capsuleNetwork.originalSeedersCapsules;
    capsules.forEach((capsule) => {
      const errors: Error[] = [];
      const componentId = capsule.component.id.toStringWithoutVersion();
      const capsuleDir = capsule.path;

      if (ENV_COMPONENT.includes(componentId)) { // 仅envs组件打包msw service worker文件
        try {
          const dest = path.join(capsuleDir, ...ENV_TEMPLATE_PATH);
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.copyFileSync(
            path.join(__dirname, '../../tasks', 'mockServiceWorker.js'),
            path.join(dest, 'mockServiceWorker.js'),
          );
        } catch (err: any) {
          errors.push(err);
        }
      }
      componentsResults.push({ component: capsule.component, errors });
    });

    return {
      artifacts: [],
      componentsResults,
    };
  }
}
