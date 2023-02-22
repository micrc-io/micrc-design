/**
 * micrc web generator
 */
import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect, ComponentContext } from '@teambit/generator';
import { MicrcWebAspect } from './micrc-web.aspect';

import { componentTemplate } from './templates/component';
import { moduleTemplate } from './templates/module';

export class MicrcWebMain {
  static slots = [];

  static dependencies = [GeneratorAspect];

  static runtime = MainRuntime;

  static async provider([generator]: [GeneratorMain]) {
    generator.registerComponentTemplate([
      componentTemplate,
      moduleTemplate,
      {
        name: 'micrc-web',
        description: 'react component for web of pc based antd component lib',
        generateFiles: (context: ComponentContext) => [
          // index file
          {
            relativePath: 'index.ts',
            isMain: true,
            content:
`// 必须这样写注释
export { ${context.namePascalCase} } from './${context.name}';
export type { ${context.namePascalCase}Props } from './${context.name}';
`,
          },

          // component file
          {
            relativePath: `${context.name}.tsx`,
            content:
`/**
 * 写注释
 */
import React from 'react';

import styles from './${context.name}.module.scss';

export type ${context.namePascalCase}Props = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function ${context.namePascalCase}({ text }: ${context.namePascalCase}Props) {
  return (
    <div className={styles.text}>
      {text}
    </div>
  );
}
`,
          },

          // scss file
          {
            relativePath: `${context.name}.module.scss`,
            content:
`
.text {
  font-size: 24px;
  color: tomato;
}
`,
          },

          // docs file
          {
            relativePath: `${context.name}.docs.mdx`,
            content:
`
---
description: 'A React Component for rendering text.'
labels: ['text', 'ui']
---

import 'antd/dist/antd.less';
import { ${context.namePascalCase} } from './${context.name}';
`,
          },

          // composition file
          {
            relativePath: `${context.name}.composition.tsx`,
            content:
`// 必须这样写注释
import React from 'react';

import { Basic } from './${context.name}.stories';

export const Basic${context.namePascalCase} = () => <Basic {...Basic.args} />;
`,
          },

          // stories file
          {
            relativePath: `${context.name}.stories.tsx`,
            content:
`// 必须这样写注释
import React from 'react';

import { ${context.namePascalCase}, ${context.namePascalCase}Props } from './${context.name}';

export default {
  component: ${context.namePascalCase},
  title: '${context.componentId}/${context.namePascalCase}'
};

const Template = (props:${context.namePascalCase}Props) => <${context.namePascalCase} {...props} />;

export const Basic = Template.bind({});
Basic.args = {
  text: 'hello world! -- basic'
};
`,
          },

          // test file
          {
            relativePath: `${context.name}.spec.tsx`,
            content:
`// 必须这样写注释
import React from 'react';
import { render } from '@testing-library/react';
import { Basic${context.namePascalCase} } from './${context.name}.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<Basic${context.namePascalCase} />);
  const rendered = getByText('hello world! -- basic');
  expect(rendered).toBeTruthy();
});
`,
          },

          // meta file
          {
            relativePath: 'meta.json',
            content: '{}',
          },
        ],
      },
    ]);

    return new MicrcWebMain();
  }
}

MicrcWebAspect.addRuntime(MicrcWebMain);
