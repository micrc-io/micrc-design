/**
 * app/.npmrc
 */

export function appNpmRcFile() {
  return `
//node.bitsrc.io/:_authToken=\${NPM_TOKEN}
//node.bit.cloud/:_authToken=\${NPM_TOKEN}
`;
}
