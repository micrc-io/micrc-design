
import { WorkspaceContext } from '@teambit/generator';

export default (context: WorkspaceContext) => {
  const defaultScope = context.defaultScope;
  if (!defaultScope)
    throw new Error('default scope must be set by -d/--default-scope.');
  const accountAndScopeArray = defaultScope.split('.');
  if (accountAndScopeArray.length != 2)
    throw new Error('default scope set by -d/--default-scope must be format with account.scope');
  return {
    account: accountAndScopeArray[0],
    scope: accountAndScopeArray[1],
  };
};
