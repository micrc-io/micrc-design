/**
 * app/.eslintrc.json
 */

export function appEslintFile() {
  return `{
  "extends": ["next/core-web-vitals", "prettier"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
`;
}
