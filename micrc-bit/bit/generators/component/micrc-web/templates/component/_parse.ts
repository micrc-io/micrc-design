/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

export type ComponentMeta = {
  props: Record<string, string>,
  types: any,
  components: any,
};

export type ComponentContextData = {
  meta: ComponentMeta
  context: ComponentContext
};

export const parse = (meta: ComponentMeta, context: ComponentContext): ComponentContextData => {
  console.log('meta: ', meta);
  console.log('context: ', context);
  // 解析程序
  const data: ComponentContextData = {
    meta,
    context,
  };
  return data;
};
