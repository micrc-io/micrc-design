// vscode launch.json
export function vscodeLaunch() {
  return `
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "test",
      "program": "\${workspaceFolder}/node_modules/@teambit/bit/dist/app.js",
      "args": ["test"],
      "resolveSourceMapLocations": [
        "\${workspaceFolder}/node_modules/@xian/**/*.js"
      ],
      "outFiles": [
        "\${workspaceFolder}/node_modules/@xian/**/*.js"
      ],
      "console": "integratedTerminal",
      "sourceMaps": true,
      "internalConsoleOptions": "neverOpen",
      "cwd": "\${workspaceFolder}"
    }
  ]
}
`;
}
