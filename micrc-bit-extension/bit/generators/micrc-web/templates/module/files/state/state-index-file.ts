/**
 * state/index.ts
 */
export function stateIndexFile() {
  return `// state entry
import { create } from 'zustand';
import { apis, states, validators } from './impl/impl';

import JSONBigIntConfig from 'json-bigint';
const JSONBigInt = JSONBigIntConfig({
  strict: true,
  useNativeBigInt: true,
});

JSON.parse = JSONBigInt.parse;
JSON.stringify = JSONBigInt.stringify;

export const useStore = create((set, get) => ({
  _apis: apis(get, set),
  _validators: validators(),
  ...states(),
  set,
}));
`;
}
