export function tsconfig() {
  return `{
  "extends": "./node_modules/@teambit/react/typescript/tsconfig.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "noEmit": true
  },
  "exclude": [
    "dist", "**/_apps"
  ]
}
`;
}
