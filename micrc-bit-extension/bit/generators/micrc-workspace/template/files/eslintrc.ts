// eslintrc
export function eslintrc() {
  return `// noinspection JSUnresolvedVariable
module.exports = {
  extends: ['@teambit/eslint-config-bit-react'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    "react/jsx-props-no-spreading": "off",
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/jsx-curly-newline': 'off',
  },
}
`;
}
