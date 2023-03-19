/**
 * 校验name和scope
 */
import { WorkspaceContext } from '@teambit/generator';

const TYPES = ['atoms', 'components', 'modules', 'apps'];

export default (context: WorkspaceContext) => {
  const { name, defaultScope } = context;
  if (!defaultScope) {
    throw new Error('default scope must be set by -d/--default-scope.');
  }
  const accountAndScopeArray = defaultScope.split('.');
  if (accountAndScopeArray.length !== 2) {
    throw new Error('default scope set by -d/--default-scope must be format with account.scope');
  }
  const scope = accountAndScopeArray[1];
  const nameArray = name.split('-');
  if (nameArray.length !== 3 || nameArray[0] !== scope || nameArray[1] !== 'design' || !TYPES.includes(nameArray[2])) {
    throw new Error('workspace name must be format with [scope]-design-[componentType]s.'
      + `componentType: ${JSON.stringify(TYPES)}`
      + 'for examples: system-design-apps, ');
  }
  return {
    account: accountAndScopeArray[0],
    scope,
    type: nameArray[2],
  };
};
