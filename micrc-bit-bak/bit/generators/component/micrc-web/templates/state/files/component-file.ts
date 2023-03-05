/**
 * component.ts
 */

export function componentFile() {
  return `// entry
import create from 'zustand';
import { apis, states, validators } from './generated/port-protocol.impl';

export const useStore = create((set, get) => ({
  _apis: apis(get, set),
  _validators: validators(),
  ...states(),
  set,
}));
`;
}
