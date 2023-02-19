/**
 * 元数据解析，构造模版渲染上下文数据
 */
import { ComponentContext } from '@teambit/generator';

// 类型定义
type TypeDefinition = {
  interface: boolean, // 是否接口，如果是定义为interface，否则定义为type
  props: Record<string, string>, // 类型属性
};

// 类型导入
type ImportContent = {
  default: string, // 默认导入
  types: Array<string>, // 命名导入
};

// 装配结构
type Assembly = {
  children?: Record<string, Assembly> | string,
  props: Record<string, string | { _val: any } | Record<string, Assembly>>,
};

export type ComponentContextData = {
  comment: Array<string>, // 组件注释
  typeDefinitions?: Record<string, TypeDefinition>, // 类型定义，以定义的类型名为key
  typeImports?: Record<string, ImportContent>, // 类型导入，以导入包为key
  props: Record<string, string>, // 组件props类型定义
  componentImports: Record<string, ImportContent>, // 组件导入，以导入包为key
  innerState?: Record<string, any>, // 组件内部state，以名称为key，初始值为值
  assembly: Record<string, Assembly>, // 组件装配结构，以导入的组件名为key
  context: ComponentContext // 组件上下文，包括id，scope，namespace，name信息
};

export const parse = (meta: any, context: ComponentContext): ComponentContextData => {
  // todo 解析meta得到下面几个数据
  const comment = ['组件', '注释'];
  const typeDefinitions = {
    DataType: {
      interface: true,
      props: {
        key: 'string',
        name: 'string',
        age: 'number',
        address: 'string',
        tags: 'string[]',
      },
    },
  };
  const typeImports = {
    react: {
      default: 'React', // 默认增加这个
      types: ['ReactNode', 'useState'], // 检查innerState，如果存在，需要追加useState
    },
    'antd/es/table': {
      default: null,
      types: ['ColumnsType'],
    },
  };
  const props = {
    children: 'ReactNode',
    columns: 'ColumnsType<DataType>',
    data: 'Array<DataType>',
    onSelect: '(input: any)=> void',
    onChange: '(input: any)=> void',
  };
  const componentImports = {
    'antd/lib/space': {
      default: 'Space',
      types: [],
    },
    'antd/lib/pagination': {
      default: 'Pagination',
      types: [],
    },
    antd: {
      default: null,
      types: ['Table as AntTable', 'Tag', 'Button', 'Card', 'Modal', 'Input'],
    },
  };
  const innerState = {
    show: false,
    message: {
      value: 'initial value',
    },
    columns: [],
  };
  const assembly = {
    Button: {
      children: '修改State',
      props: {
        onClick: '() => action([{op: \'replace\', path: \'states@show:///\', value: true}])()',
        type: 'dashed',
      },
    },
    AntTable: {
      children: null,
      props: {
        columns: 'bind(\'states@columns:///\')',
        dataSource: 'bind(\'props:///data\')',
      },
    },
    Pagination: {
      children: null,
      props: {
        defaultCurrent: {
          _val: 1,
        },
        total: {
          _val: 50,
        },
      },
    },
    Modal: {
      children: {
        Card: {
          children: {
            Input: {
              children: null,
              props: {},
            },
            Button: {
              children: '{bind(\'states@message:///value\')}',
              props: {
                type: 'primary',
              },
            },
          },
          props: {
            title: 'example card',
            style: {
              _val: { width: 300 },
            },
            extra: {
              Button: {
                children: 'More',
                props: {
                  type: 'link',
                },
              },
            },
          },
        },
      },
      props: {
        title: '用这个modal模拟原子组件"条件渲染"',
        visible: 'bind(\'states@show:///\')',
        onOk: '() => action([{op: \'replace\', path: \'states@show:///\', value: false}])()',
        onCancel: '() => action([{op: \'replace\', path: \'states@show:///\', value: false}])()',
      },
    },
  };

  const data: ComponentContextData = {
    context,
    comment,
    typeDefinitions,
    typeImports,
    props,
    componentImports,
    innerState,
    assembly,
  };
  return data;
};
