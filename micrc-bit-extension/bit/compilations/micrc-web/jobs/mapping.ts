import path from 'path';
import fs from 'fs';

// 设计子域组件-元数据文件映射
const mappingDesign = (contextPath: string): Record<string, string> => {
  const mappingInfo = {};
  const atomsPath = path.join(contextPath, 'atoms');
  if (fs.existsSync(atomsPath)) {
    fs.readdirSync(atomsPath).forEach((atom) => {
      mappingInfo[atom.replace('.json', '')] = path.join(atomsPath, atom);
    });
  }
  const componentsPath = path.join(contextPath, 'components');
  if (fs.existsSync(componentsPath)) {
    fs.readdirSync(componentsPath).forEach((component) => {
      mappingInfo[component.replace('.json', '')] = path.join(atomsPath, component);
    });
  }
  const clientendsPath = path.join(contextPath, 'clientends');
  if (fs.existsSync(clientendsPath)) {
    fs.readdirSync(clientendsPath).forEach((clientend) => {
      mappingInfo[clientend.replace('.json', '')] = path.join(atomsPath, clientend);
    });
  }
  return mappingInfo;
};

const handleMapping = (userCasePath: string): Record<string, string> => {
  const mappingInfo = {};
  const modulesPath = path.join(userCasePath, 'modules');
  if (fs.existsSync(modulesPath)) {
    fs.readdirSync(modulesPath).forEach((module) => {
      mappingInfo[module.replace('.json', '')] = path.join(modulesPath, module);
    });
  }
  const statesPath = path.join(userCasePath, 'states');
  if (fs.existsSync(statesPath)) {
    fs.readdirSync(statesPath).forEach((state) => {
      mappingInfo[state.replace('.json', '')] = path.join(statesPath, state);
    });
  }
  const atomsPath = path.join(userCasePath, 'atoms');
  if (fs.existsSync(atomsPath)) {
    fs.readdirSync(atomsPath).forEach((atom) => {
      mappingInfo[atom.replace('.json', '')] = path.join(atomsPath, atom);
    });
  }
  const componentsPath = path.join(userCasePath, 'components');
  if (fs.existsSync(componentsPath)) {
    fs.readdirSync(componentsPath).forEach((component) => {
      mappingInfo[component.replace('.json', '')] = path.join(componentsPath, component);
    });
  }
  return mappingInfo;
};

// 业务子域组件-元数据映射
const mappingDomain = (contextPath: string): Record<string, string> => {
  const mappingInfo = {};
  const userCasesPath = path.join(contextPath, 'usercases');
  if (fs.existsSync(userCasesPath)) {
    fs.readdirSync(userCasesPath).forEach((userCase) => {
      const userCasePath = path.join(userCasesPath, userCase);
      if (fs.statSync(userCasePath).isDirectory()) {
        Object.assign(mappingInfo, handleMapping(userCasePath));
      }
    });
  }
  return mappingInfo;
};

// 生成组件-元数据文件地址映射
export const mapping = () => {
  // 读取子域元数据, 判断是否设计子域或业务子域
  const gitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
    '../', // git根目录
  );
  const bitBasePath = path.resolve(
    require.resolve('@micrc/bit.compilations.micrc-web'),
    '../../../../', // node_modules目录,
    '../', // bit workspace根目录
  );
  const workspaceFilePath = path.join(bitBasePath, 'workspace.jsonc');
  const domainFilePath = path.join(gitBasePath, 'schema', 'domain-info.json');
  const domainInfo = JSON.parse(fs.readFileSync(domainFilePath, { encoding: 'utf8' }));
  const workspaceInfo = JSON.parse(fs.readFileSync(workspaceFilePath, { encoding: 'utf8' }));
  const contextName = workspaceInfo['teambit.workspace/workspace'].defaultScope.split('.')[1];
  const contextPath = path.join(gitBasePath, 'schema', contextName);
  const mappingFilePath = path.join(contextPath, 'mapping.json');
  const { isDesign } = domainInfo;
  let mappingInfo: Record<string, string>;
  if (isDesign) {
    mappingInfo = mappingDesign(contextPath);
  } else {
    mappingInfo = mappingDomain(contextPath);
  }
  fs.writeFileSync(mappingFilePath, JSON.stringify(mappingInfo));
};
