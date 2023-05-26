/**
 * app/.eslintrc.json
 */

export function appEslintFile() {
  return `{
  "root": true,
  "extends": ["next/core-web-vitals", "prettier"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
`;
}
