/**
 * 鉴权逻辑
 * resource:operation
 */
import { useGlobalStore } from '../store/global';

const contains = (has: string, need: string): boolean => {
  if (!need) {
    return true;
  }
  if (!has) {
    return false;
  }
  const [needResource, needOperation] = need.split(':');
  if (!needResource || !needOperation) {
    throw Error('un-excepted permission expression. it must format of [resource]:[operation]');
  }
  const [hasResource, hasOperation] = has.split(':');
  if (!hasResource || !hasOperation) {
    throw Error('un-excepted permission expression. it must format of [resource]:[operation]');
  }
  if (hasResource === needResource || hasResource === '*') {
    if (hasOperation === needOperation || hasOperation === '*') {
      return true;
    }
    return false;
  }
  return false;
};

export const hasPermission = (permissions: Array<string>): boolean => {
  const global: any = useGlobalStore.getState();
  const subjectPermissions: Array<string> = global.subject.permissions;
  if (!permissions) {
    return true;
  }
  if (!subjectPermissions) {
    return false;
  }
  let retVal: boolean = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const need of permissions) {
    if (retVal === false) {
      break;
    }
    retVal = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const has of subjectPermissions) {
      if (contains(has, need)) {
        retVal = true;
        break;
      }
    }
  }
  return retVal;
};
