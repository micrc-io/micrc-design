/**
 * state/index.ts
 */
export function stateIndexFile() {
  return `// state entry
import { create } from 'zustand';
import { apis, states, validators } from './impl/impl';

export const useStore = create((set, get) => ({
  _apis: apis(get, set),
  _validators: validators(),
  ...states(),
  set,
}));
`;
}
