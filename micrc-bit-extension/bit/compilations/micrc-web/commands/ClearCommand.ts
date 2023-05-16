/**
 * micrc clear command
 */
import { Command, CommandOptions } from '@teambit/cli';

import log from 'loglevel';

import { clear } from '../jobs/clear';

log.setLevel('INFO');

export class ClearCmd implements Command {
  name = 'micrc:web:clear';

  description = 'clear components in workspace';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    log.info('');
    await clear();
    return Promise.resolve(`${this.name} complete`);
  }
}
