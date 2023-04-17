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
    textPropType: 'Node' | 'string'
    pointerText: { key: string, str: string },
    currentKey: string,
  },
) => {
  if (!target) {
    return null;
  }
  const mergeProps = { ...target.props };
  const highlight = pointerText.key === currentKey;
  if (textPropType === 'Node' && highlight) {
    // todo 优化节点类型的反馈方式
    mergeProps[textPropName] = <span style={{ color: 'red' }}>{pointerText.str}</span>;
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
    isHighlight,
  }: {
    target: ReactElement,
    visiblePropName: string,
    pointers: Array<string>,
    currentKey: string,
    isHighlight: {
      default: boolean,
      props: {
        textPropName: string,
        textPropType: 'Node' | 'string'
        pointerText: { key: string, str: string },
        currentKey: string,
      }
    }
  },
) => {
  if (!target) {
    return null;
  }

  // 隐藏的modal 中 的tilte 需要 被高亮显示 要用到I18NVisibleProxy，I18NHighlight
  if (isHighlight.default) {
    const obj = Object.assign(isHighlight.props, { target: target.props.children });
    const child = I18NHighlight(obj);
    const childProps = { ...child.props };
    childProps[visiblePropName] = child.props[visiblePropName]
    || pointers.includes(currentKey);
    return React.cloneElement(child, childProps);
  }
  const mergeProps = { ...target.props.children.props };
  mergeProps[visiblePropName] = target.props.children.props[visiblePropName]
  || pointers.includes(currentKey);
  return React.cloneElement(target, mergeProps);
};
