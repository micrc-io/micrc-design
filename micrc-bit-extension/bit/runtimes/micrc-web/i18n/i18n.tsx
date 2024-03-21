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
    ...restProps
  }: {
    target: ReactElement,
    textPropName: string,
    textPropType: 'Node' | 'string',
    pointerText: { key: string, str: string, id: string },
    currentKey: string,
    [key:string]:any
  },
// eslint-disable-next-line consistent-return
) => {
  if (!target || !pointerText) {
    return null;
  }
  const mergeProps = { ...target.props, ...restProps };
  const highlight = `${pointerText.id}/${pointerText.key}` === currentKey;
  if (textPropType === 'Node' && highlight) {
    const targetPropName = {};
    if (mergeProps[textPropName] && mergeProps[textPropName].props) {
      Object.keys(mergeProps[textPropName].props).forEach((item) => {
        if (item.startsWith('on') || item === 'className') {
          targetPropName[item] = mergeProps[textPropName].props[item];
        }
      });
    }
    // todo 优化节点类型的反馈方式
    mergeProps[textPropName] = <span key={currentKey} {...targetPropName} style={{ color: 'red' }}>{pointerText.str}</span>;
  }
  if (textPropType === 'string' && highlight) {
    // todo 优化字符串类型的反馈方式
    mergeProps[textPropName] = `i18n:{ ${pointerText.str} }`;
  }
  return React.cloneElement(target, {
    ...mergeProps,
    onChange: (...args) => {
      target?.props?.onChange?.(...args);
      restProps?.onChange?.(...args);
    },
    value: restProps?.value,
  });
};

// i18n 隐藏元素代理组件
export const I18NVisibleProxy = (
  {
    target,
    visiblePropName = '',
    pointers = [],
    currentKey = '',
    id = '',
  }: {
    target: ReactElement,
    visiblePropName: string,
    pointers: Array<string>,
    currentKey: string,
    id: string
  },
) => {
  if (!target) {
    return null;
  }
  const mergeProps = { ...target.props };
  mergeProps[visiblePropName] = target.props[visiblePropName]
    || pointers.map((it) => `${id}/${it}`).includes(currentKey);
  return React.cloneElement(target, mergeProps);
};
