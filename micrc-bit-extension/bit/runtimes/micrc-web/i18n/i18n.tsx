/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * i18n 支撑组件
 */
import React, { ReactElement } from 'react';

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
    textPropType: 'Node' | 'string',
    pointerText: { key: string, str: string, id: string },
    currentKey: string,
  },
// eslint-disable-next-line consistent-return
) => {
  if (!target) {
    return null;
  }
  const mergeProps = { ...target.props };
  const highlight = pointerText.key === currentKey;
  if (textPropType === 'Node' && highlight) {
    // todo 优化节点类型的反馈方式
    mergeProps[textPropName] = <span style={{ color: 'red', fontSize: '18px' }}>{pointerText.str}</span>;
  }
  if (textPropType === 'string' && highlight) {
    // todo 优化字符串类型的反馈方式
    mergeProps[textPropName] = `i18n:{ ${pointerText.str} }`;
  }
  return React.cloneElement(target, mergeProps);
};

// i18n 隐藏元素代理组件
export const I18NVisibleProxy = (
  {
    target,
    visiblePropName = '',
    pointers = [],
    currentKey = '',
  }: {
    target: ReactElement,
    visiblePropName: string,
    pointers: Array<string>,
    currentKey: string,
  },
) => {
  if (!target) {
    return null;
  }
  const mergeProps = { ...target.props };
  mergeProps[visiblePropName] = target.props[visiblePropName]
  || pointers.includes(currentKey);
  return React.cloneElement(target, mergeProps);
};
