/**
 * i18n 支撑组件
 */
import React, { ReactElement } from 'react';

// i18n 隐藏元素代理组件
export const I18NVisibleProxy = (
  {
    target,
    visiblePropName,
    pointers,
    currentKey,
  }: {
    target: ReactElement,
    visiblePropName: string,
    pointers: Array<string>,
    currentKey: string,
  },
) => {
  const mergeProps = { ...target.props };
  mergeProps[visiblePropName] = pointers.includes(currentKey);
  return React.cloneElement(target, mergeProps);
};

// i18n 高亮组件
export const I18NHighlight = (
  {
    target,
    textPropName,
    textPropType,
    pointerText,
    currentKey,
  }: {
    target: ReactElement,
    textPropName: string,
    textPropType: 'Node' | 'String'
    pointerText: { key: string, str: string },
    currentKey: string,
  },
) => {
  const mergeProps = { ...target.props };
  const highlight = pointerText.key === currentKey;
  if (textPropType === 'Node' && highlight) {
    mergeProps[textPropName] = <b>{pointerText.str}</b>;
  }
  if (textPropType === 'String' && highlight) {
    mergeProps[textPropName] = `i18n: ${pointerText.str}`;
  }
  return React.cloneElement(target, mergeProps);
};
