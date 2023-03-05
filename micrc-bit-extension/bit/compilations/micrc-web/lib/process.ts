// 封装child_process
import { spawn, exec } from 'child_process';
import log from 'loglevel';

log.setLevel('INFO');

export const invoke = (
  cmd: string, cwd: string,
): Promise<string> => new Promise((resolve, reject) => {
  exec(cmd, { cwd }, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }
    resolve(stdout || stderr);
  });
});

export const execCmd = (
  cmd: string, args: Array<string>, cwd: string,
) => new Promise((resolve, reject) => {
  const process = spawn(cmd, args, { cwd });
  process.stdout.on('data', (data) => {
    log.info(`${data}`);
  });
  process.stderr.on('data', (data) => {
    log.error(`${data}`);
  });
  process.on('close', (code) => {
    resolve(code);
  });
  process.on('exit', (code) => {
    resolve(code);
  });
  process.on('error', (err) => {
    reject(err);
  });
});
