/**
 * test file
 */
import { ComponentContextData } from '../_parse';

export function compositionFile(data: ComponentContextData) {
  return `// ${data.context.name} composition
import React from 'react';

import { Default } from './${data.context.name}.stories';

export const DefaultView = () => <Default {...Default.args} />;
`;
}
