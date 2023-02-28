// 必须这样写注释
    // 必须这样写注释
      import React from 'react';
      import { render } from '@testing-library/react';
      import { BasicDemo } from './demo.composition';
      
      it('should render with the correct text', () => {
        const { getByText } = render(<BasicDemo />);
        const rendered = getByText('hello world! -- basic');
        expect(rendered).toBeTruthy();
      });
    