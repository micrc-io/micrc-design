/**
 * spec file
 */
import { ModuleContextData } from '../_parse';

export function testFile(data: ModuleContextData) {
  return `// ${data.context.name} test
it('dummy', () => {
  expect(true).toBeTruthy();
});
`;
}
