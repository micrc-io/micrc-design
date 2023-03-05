/*
 * @Author: wuwanping
 * @Date: 2023-02-23 20:58:08
 * @LastEditTime: 2023-02-24 09:46:39
 * @LastEditors: wuwanping
 * @Description: 
 * @FilePath: /micrc-bit/bit/generators/component/micrc-web/templates/module/files/spec-file.ts
 */
import { AtomContextData } from '../_parse';
export function specFile(data: AtomContextData) {
    return `// 必须这样写注释
    // 必须这样写注释
      import React from 'react';
      import { render } from '@testing-library/react';
      import { Basic${data.context.namePascalCase} } from './${data.context.name}.composition';
      
      it('should render with the correct text', () => {
        const { getByText } = render(<Basic${data.context.namePascalCase} />);
        const rendered = getByText('hello world! -- basic');
        expect(rendered).toBeTruthy();
      });
    `;
  }