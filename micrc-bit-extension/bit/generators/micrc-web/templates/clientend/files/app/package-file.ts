/**
 * app/package.json
 */
import HandleBars from 'handlebars';
import { format } from 'prettier-package-json';

import type { ClientendContextData } from '../../_parser';

const tmpl = `{
  "name": "{{context.name}}",
  "version": "{{intro.version}}",
  "private": true,
  "scripts": {
    "dev": "next dev -p 4004",
    "build": "next build",
    "start": "next start -p 8000",
    "lint": "next lint"
  },
  "dependencies": {
    "@mdx-js/loader": "2.1.2",
    "@mdx-js/react": "2.1.2",
    "@micrc/bit.runtimes.micrc-web": "0.0.47",
    {{#each dependencies}}
    "{{@key}}": "{{this}}",
    {{/each}}
    "@next/mdx": "12.1.6",
    "babel-plugin-import": "1.13.5",
    "cookies": "0.8.0",
    "http-proxy-middleware": "2.0.6",
    "msw": "1.1.0",
    "next": "12.1.6",
    "next-compose-plugins": "2.2.1",
    "next-transpile-modules": "9.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/cookies": "0.7.7",
    "@types/express": "4.17.17",
    "@types/node": "18.0.0",
    "@types/react": "18.2.14",
    "@types/react-dom": "18.2.6",
    "eslint": "7.32.0",
    "eslint-config-next": "12.1.6",
    "eslint-config-prettier": "8.5.0",
    "less": "4.1.3",
    "less-loader": "11.0.0",
    "next-with-less": "2.0.5",
    "sass": "1.62.1",
    "typescript": "4.7.4"
  }
}
`;

export function appPackageFile(data: ClientendContextData) {
  return format(JSON.parse(HandleBars.compile(tmpl)(data)));
}
