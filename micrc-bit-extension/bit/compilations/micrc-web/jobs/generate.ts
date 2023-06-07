/* eslint-disable array-callback-return */
/**
 * 生成组件
 */
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import log from 'loglevel';

import { execCmd } from '../lib/process';
import { nodeModulesBasePath, bitBasePath, TYPES, parseWorkspaceConfig } from '../lib/workspace-config';

log.setLevel('INFO');

const SCHEMA_LOCATION = ['.cache', 'micrc', 'schema'];

const generateAtom = async (metaData: any, componentPath: string) => {
  try {
    await execCmd(
      'bit', ['remove', '-s', '-f', componentPath], bitBasePath,
    );
  } catch (e) { /* leave it! */ }
  try {
    await execCmd(
      'bit', ['create', 'micrc-web-atom', componentPath], bitBasePath,
    );
  } catch (e) {
    const msg = `component: ${componentPath} of type: atoms - create error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  const { intro: { state, version } } = metaData;
  if (state === 'tagging') {
    try {
      await execCmd('bit', ['checkout', 'head', `${componentPath}`], bitBasePath);
      await execCmd(
        'bit',
        ['tag', '--soft', '-v', version, '--skip-auto-tag', '--ignore-newest-version', componentPath],
        bitBasePath,
      );
    } catch (e) {
      const msg = `component: ${componentPath} of type: atoms - tagging error: ${e}`;
      log.error(chalk.red(msg));
      throw new Error(msg);
    }
  }
};

const generateComponent = async (metaData: any, componentPath: string, account: string,
  scope: string) => {
  try {
    await execCmd(
      'bit', ['remove', '-s', '-f', componentPath], bitBasePath,
    );
  } catch (e) { /* leave it! */ }

  try {
    await execCmd(
      'bit', ['create', 'micrc-web-component', componentPath], bitBasePath,
    );
  } catch (e) {
    const msg = `component: ${componentPath} of type: components - create error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  try {
    await execCmd(
      'bit', ['deps', 'set', `${account}.${scope}/${componentPath}`, '@micrc/bit.runtimes.micrc-web@^0.0.25', '--peer'], bitBasePath,
    );
    await execCmd('bit', ['install'], bitBasePath);
  } catch (e) {
    log.error(chalk.red(e));
    throw new Error(e);
  }

  try {
    const { atoms } = metaData;
    const deps = Object.values(atoms)
      .map((it: any) => `${it.packages}@${it.version}`)
      .join(' ');
    if (deps) {
      await execCmd('bit', ['deps', 'set', componentPath, deps], bitBasePath);
      await execCmd('bit', ['install'], bitBasePath);
    }
  } catch (e) {
    const msg = `component: ${componentPath} of type: atoms - dependencies handle error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  const { intro: { state, version } } = metaData;
  if (state === 'tagging') {
    try {
      await execCmd('bit', ['checkout', 'head', `${componentPath}`], bitBasePath);
      await execCmd(
        'bit',
        ['tag', '--soft', '-v', version, '--skip-auto-tag', '--ignore-newest-version', componentPath],
        bitBasePath,
      );
    } catch (e) {
      const msg = `component: ${componentPath} of type: components - tagging error: ${e}`;
      log.error(chalk.red(msg));
      throw new Error(msg);
    }
  }
};

const generateModule = async (metaData: any, componentPath: string, account: string,
  scope: string) => {
  try {
    await execCmd(
      'bit', ['remove', '-s', '-f', componentPath], bitBasePath,
    );
  } catch (e) { /* leave it! */ }

  try {
    await execCmd(
      'bit', ['create', 'micrc-web-module', componentPath], bitBasePath,
    );
  } catch (e) {
    const msg = `component: ${componentPath} of type: modules - create error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  try {
    await execCmd(
      'bit', ['deps', 'set', `${account}.${scope}/${componentPath}`, '@micrc/bit.runtimes.micrc-web@^0.0.25', '--peer'], bitBasePath,
    );
    await execCmd('bit', ['install'], bitBasePath);
  } catch (e) {
    log.error(chalk.red(e));
    throw new Error(e);
  }

  try {
    const { components } = metaData;
    const deps: string[] = Object.values(components)
      .map((it: any) => `${it.packages}@${it.version}`);
    if (deps) {
      await execCmd('bit', ['deps', 'set', componentPath, ...deps], bitBasePath);
      await execCmd('bit', ['install'], bitBasePath);
    }
  } catch (e) {
    const msg = `component: ${componentPath} of type: modules - dependencies handle error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  const { intro: { state, version } } = metaData;
  if (state === 'tagging') {
    try {
      await execCmd('bit', ['checkout', 'head', `${componentPath}`], bitBasePath);
      await execCmd(
        'bit',
        ['tag', '--soft', '-v', version, '--skip-auto-tag', '--ignore-newest-version', componentPath],
        bitBasePath,
      );
    } catch (e) {
      const msg = `component: ${componentPath} of type: modules - tagging error: ${e}`;
      log.error(chalk.red(msg));
      throw new Error(msg);
    }
  }
};

const generateClientend = async (
  metaData: any, componentPath: string, contextMetaData: any, componentAbsPath: string,
) => {
  try {
    await execCmd(
      'bit', ['remove', '-s', '-f', componentPath], bitBasePath,
    );
  } catch (e) { /* leave it! */ }
  try {
    await execCmd(
      'bit', ['create', 'micrc-web-clientend', componentPath], bitBasePath,
    );
  } catch (e) {
    const msg = `component: ${componentPath} of type: clientends - create error: ${e}`;
    log.error(chalk.red(msg));
    throw new Error(msg);
  }

  const { intro: { state, version } } = metaData;
  if (state === 'tagging') {
    try {
      await execCmd('bit', ['checkout', 'head', `${componentPath}`], bitBasePath);
      await execCmd(
        'bit',
        ['tag', '--soft', '-v', version, '--skip-auto-tag', '--ignore-newest-version', componentPath],
        bitBasePath,
      );
    } catch (e) {
      const msg = `component: ${componentPath} of type: clientends - tagging error: ${e}`;
      log.error(chalk.red(msg));
      throw new Error(msg);
    }
  }

  await execCmd('npm', ['i'], componentAbsPath);
};

export const generate = async () => {
  const { contextName, contextSubName, account, scope, componentType } = parseWorkspaceConfig();
  const schemaLocation = path.join(nodeModulesBasePath, ...SCHEMA_LOCATION);
  const contextMetaData = JSON.parse(fs.readFileSync(path.join(schemaLocation, 'intro.json'), { encoding: 'utf8' }));
  const metaFiles = fs.readdirSync(
    path.join(schemaLocation, contextSubName, componentType),
  );
  log.info(chalk.green(`Find ${metaFiles.length} components of type ${componentType}...`));
  // eslint-disable-next-line no-restricted-syntax
  for (const metaFile of metaFiles) {
    const metaFilePath = path.join(schemaLocation, contextSubName, componentType, metaFile);
    const fullMetaFilePath = `${schemaLocation}/${account}.${scope}#${contextName}#web#${componentType}#${metaFile}`;
    // eslint-disable-next-line no-await-in-loop
    await execCmd(
      '/bin/cp',
      [metaFilePath, fullMetaFilePath],
      bitBasePath,
    );
    const metaData = JSON.parse(fs.readFileSync(fullMetaFilePath, { encoding: 'utf8' }));
    switch (componentType) {
      case TYPES.ATOMS:
        // eslint-disable-next-line no-await-in-loop
        await generateAtom(
          metaData,
          `${contextName}/web/atoms/${metaFile.replace('.json', '')}`,
        );
        break;
      case TYPES.COMPONENTS:
        // eslint-disable-next-line no-await-in-loop
        await generateComponent(
          metaData,
          `${contextName}/web/components/${metaFile.replace('.json', '')}`,
          account,
          scope,
        );
        break;
      case TYPES.MODULES: {
        metaData.intro.context = {
          ownerDomain: contextMetaData.ownerDomain,
          contextName: contextMetaData.contextName,
          namespace: contextMetaData.namespace,
          clientend: contextMetaData.clientend,
        };
        metaData.intro.modelFilePath = `./aggregations/${metaData.remoteState.aggregations}/model.json`;
        metaData.remoteState.operationIds.map((item) => {
          metaData.remoteState.rpc.protocols.push(`./cases/${metaData.remoteState.casesId}/protocol/api/${item}.json`);
        });
        fs.writeFileSync(fullMetaFilePath, JSON.stringify(metaData, null, 2), { encoding: 'utf8' });
        // eslint-disable-next-line no-await-in-loop
        await generateModule(
          metaData,
          `${contextName}/web/modules/${metaFile.replace('.json', '')}`,
          account,
          scope,
        );
        // 把服务端i18ns.json 放在模块/meta下的
        const i18nsPath = path.join(schemaLocation, 'aggregations', metaData.remoteState.aggregations, 'i18ns.json');
        const i18nsMetaData = JSON.parse(fs.readFileSync(i18nsPath, { encoding: 'utf8' }));
        const metaPath = path.join(bitBasePath, scope, contextName, 'web', componentType, metaFile.replace('.json', ''), 'meta', 'i18ns.json');
        fs.writeFileSync(metaPath, JSON.stringify(i18nsMetaData, null, 2), { encoding: 'utf8' });
        break;
      }
      case TYPES.CLIENTENDS: {
        metaData.intro.context = {
          ownerDomain: contextMetaData.ownerDomain,
          clientend: contextMetaData.clientend,
          global: contextMetaData.global,
          gateway: contextMetaData.gateway,
        };
        fs.writeFileSync(fullMetaFilePath, JSON.stringify(metaData, null, 2), { encoding: 'utf8' });
        // eslint-disable-next-line no-await-in-loop
        await generateClientend(
          metaData,
          `${contextName}/web/clientends/${metaFile.replace('.json', '')}`,
          contextMetaData,
          path.join(bitBasePath, `${scope}/${contextName}/web/clientends/${metaFile.replace('.json', '')}/app`),
        );
        // 把i18ns.json 放在模块/meta下
        const i18nsPath = path.join(schemaLocation, 'i18ns.json');
        const i18nsMetaData = JSON.parse(fs.readFileSync(i18nsPath, { encoding: 'utf8' }));
        const metaPath = path.join(bitBasePath, scope, contextName, 'web', componentType, metaFile.replace('.json', ''), 'app', 'meta', 'i18ns.json');
        fs.writeFileSync(metaPath, JSON.stringify(i18nsMetaData, null, 2), { encoding: 'utf8' });
        break;
      }
      default:
        log.error(chalk.red('un-excepted type of component'));
        break;
    }
    const metaPath = path.join(bitBasePath, scope, contextName, 'web', componentType, metaFile.replace('.json', ''), 'meta.json');
    fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2), { encoding: 'utf8' });
  }
};
