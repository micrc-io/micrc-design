/**
 * index.ts
 */
import HandleBars from 'handlebars';

import { ComponentContextData } from '../_parse';

const tmpl = `
import React, { useState } from 'react';

{{#each meta.types.normal}}
import {{@key}} from '{{this}}';
{{/each}}

{{#each meta.components}}
import {{@key}} from '{{this}}';
{{/each}}

{{#each meta.types.custom}}
{{this.type }} {{@key}}{
  {{#each this.props}}
   {{@key}} :{{this}}
  {{/each}}
}
  
{{/each}}

`;

export function componentFile(data: ComponentContextData) {
  return HandleBars.compile(tmpl)(data);

//   return `// 必须这样写注释
// import React from 'react';

// import styles from './${data.context.name}.module.scss';

// export type ${data.context.namePascalCase}Props = {
// /**
//  * a text to be rendered in the component.
//  */
// text: string
// };

// export function ${data.context.namePascalCase}({ text }: ${data.context.namePascalCase}Props) {
// return (
// <div className={styles.text}>
//   {text}
// </div>
// );
// }
// `;
}
