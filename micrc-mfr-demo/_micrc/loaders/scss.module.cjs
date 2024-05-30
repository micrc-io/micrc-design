'use strict'

const fs = require('fs');
const path = require('path');

const transform = require('lightningcss').transform;

const basePath = path.resolve(__dirname, '../../');
const outputPath = path.join(basePath, '.next');

module.exports = function loader(source, map, meta) {
  if (this.previousRequest) {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    fs.writeFileSync(path.join(outputPath, '.micrc.scss.module.tmp'), source);
    this.callback(null, source, map, meta)
    return;
  }
  const src = eval(source);
  const styles = transform({code: fs.readFileSync(path.join(outputPath, '.micrc.scss.module.tmp')), minify: true}).code;
  fs.unlinkSync(path.join(outputPath, '.micrc.scss.module.tmp'));
  const css = Object.keys(src).reduce(
    (prev, curr) => prev.replace(curr, src[curr]),
    styles.toString(),
  );
  src['micrc-cache-styles'] = css
  const output = JSON.stringify(src);
  // return source;
  return `// Exports\nmodule.exports = ${output}\n`;
};
