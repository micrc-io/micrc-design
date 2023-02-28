// 必须这样写注释
    // 必须这样写注释
      import React from 'react';
      import { render } from '@testing-library/react';
      import { BasicLayout } from './layout.composition';
      
      it('should render with the correct text', () => {
        const { getByText } = render(<BasicLayout />);
        const rendered = getByText('hello world! -- basic');
        expect(rendered).toBeTruthy();
      });
    