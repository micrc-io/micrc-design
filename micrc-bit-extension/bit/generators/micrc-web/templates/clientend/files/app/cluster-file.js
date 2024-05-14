/**
 * app/Cluster
 */

export function appClusterFile() {
  return `
'use strict';

const cluster = require('cluster');
const process = require('process');
const { cpus } = require('os');

const numCpus = process.env.CPU_NUM || cpus().length;

if (cluster.isPrimary) {
  console.info(\`Primary \${process.pid} is running\`);
  cluster.setupPrimary({
    exec: require.resolve('./server.js'),
    args: [...process.argv.slice(2)],
    stdio: 'inherit',
    shell: true,
  });

  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.info(\`Worker \${worker.process.pid} died. Restarting...\`, { code, signal });
    cluster.fork();
  });
}

`;
}
