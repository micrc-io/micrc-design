/**
 * app/.babelrc
 */

export function appBabelFile() {
  return `{
  "presets": ["next/babel"],
  "plugins": ["transform-remove-console"]
}
`;
}
