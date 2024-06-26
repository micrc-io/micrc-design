/**
 * micrc generate command
 */
import { Command, CommandOptions } from '@teambit/cli';

import log from 'loglevel';

import { generate } from '../jobs';

log.setLevel('INFO');

export class GenerateCmd implements Command {
  name = 'micrc:web:gen';

  description = 'generate component from schema';

  extendedDescription = '';

  alias = '';

  loader = true;

  group = 'micrc';

  options = [] as CommandOptions;

  async report(): Promise<string> {
    log.info('');
    await generate();
    return Promise.resolve(`${this.name} complete`);
  }
}
