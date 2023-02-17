/**
 * micrc web component template
 */
// import path from 'path';
import { ComponentTemplate, ComponentContext } from '@teambit/generator';

import { ComponentMeta, ComponentContextData, parse } from './_parse';

import { indexFile } from './files/index-file';
import { componentFile } from './files/component-file';

const meta: ComponentMeta = {
  types: {
    custom: {
      DataType: {
        type: 'interface',
        props: {
          key: 'string',
          name: 'string',
          age: 'number',
          address: 'string',
          tags: 'string[]',
        },
      },
    },
    normal: {
      ReactNode: 'react',
      ColumnsType: 'antd/es/table',
    },
  },
  props:{
    children?:' ReactNode',
    columns:'ColumnsType<DataType>',
    data:'DataType[]',
    onSelect?:'(record, selected, selectedRows, nativeEvent)=> void',
    onChange:(page, pageSize)=> void,
  },
  components: {
    Space: 'antd/lib/space',
    AntTable: 'antd/lib/table',
    Tag: 'antd/lib/tag',
    Button: 'antd/lib/button',
    Card: 'antd/lib/card',
    Input: 'antd/lib/input',
    Pagination: 'antd/lib/pagination',
  },
}; // 元数据定义

export const componentTemplate: ComponentTemplate = {
  name: 'micrc-web-component',
  description: 'test for micrc web',
  generateFiles: (context: ComponentContext) => {
    // const nodeModulesPath = path.resolve(
    //  require.resolve('@micrc/bit.generators.component.micrc-web'), '../../../../');
    // console.log('获取node_modules目录', nodeModulesPath);
    // console.log('该组件的文件名', context.componentId.toStringWithoutVersion().replace('/', '_'));
    // node_modules/.cache/micrc/schema中放置一个组件id命名的空json文件
    // 这里先读取这个空文件，什么都不做
    // 用micrc-system generator生成一个demo-system-design的workspace
    // 用这个generator在workspace中生成一个组件，然后样板化编写组件
    // 将样板化组件中变化的东西抽取出来，组织成base-ui（通用组件）的元数据
    // 将元数据写入第一步创建的空文件中
    // 修改这里逻辑，解析元数据文件，带上context组织起来传给生成组件文件的方法
    const data: ComponentContextData = parse(meta, context);
    return [
      // index file
      {
        relativePath: 'index.ts',
        isMain: true,
        content: indexFile(data),
      },
      // component file
      {
        relativePath: `${context.name}.tsx`,
        content: componentFile(data),
      },
    ];
  },
};
