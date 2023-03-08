/**
 * test file
 */
import { AtomContextData } from '../_parse';

export function testFile(data: AtomContextData) {
  return `// ${data.context.name} test
it('dummy', () => {
  expect(true).toBeTruthy();
});
`;
}
