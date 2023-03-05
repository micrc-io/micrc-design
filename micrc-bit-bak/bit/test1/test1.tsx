import React, { ReactNode } from 'react';

export type Test1Props = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Test1({ children }: Test1Props) {
  return (
    <div>
      {children}
    </div>
  );
}
