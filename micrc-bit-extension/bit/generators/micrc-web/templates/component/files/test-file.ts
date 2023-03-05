/**
 * test file
 */
import { ComponentContextData } from '../_parse';

export function testFile(data: ComponentContextData) {
  return `// ${data.context.name} test
it('dummy', () => {
  expect(true).toBeTruthy();
});
`;
}
