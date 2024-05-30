
'use strict';

const http = require('http');
const cluster = require('cluster');
const process = require('process');
const { cpus } = require('os');

const numCpus = process.env.CPU_NUM || cpus().length;
const remotes = process.env.REMOTES || '';
const errors = new Set();

cluster.on('fork', async (worker) => {
  Promise.all(remotes.trim().split(',').map(it => new Promise((resolve) => {
    if (!it) {
      resolve();
    }
    const remote = it.trim().split('@');
    const hosts = remote[1].split('|');
    const host = hosts[1] ?? hosts[0];
    http.get(host).on('error', () => {
      errors.add(`Unable connection to ${host}`);
      resolve();
    });
  }))).then(() => {
    if (errors.size > 0) {
      worker.process.exitCode = -1
      worker.kill();
    }
  });
});

if (cluster.isPrimary) {
  cluster.setupPrimary({
    exec: require.resolve('./server.js'),
    args: [...process.argv.slice(2)],
    stdio: 'inherit',
    shell: true,
  });

  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    if (worker.id === numCpus.length) {
      console.info('\x1b[32m%s\x1b[0m', `Primary ${process.pid} is running`);
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    if (code !== -1) {
      console.info(`Worker ${worker.process.pid} died. Restarting...`, { code, signal });
      cluster.fork();
    } else {
      if (Object.keys(cluster.workers).length === 0) {
        console.error('\x1b[31m%s\x1b[0m', `startup failure:\n${Array.from(errors).join('\n')}`)
      }
    }
  });
}

