/**
 * api 主文件
 */
import { UIEvent, PluginEvent, sendMsgToUI } from '@messages/sender';
import mergeDeep from 'lodash.merge';
import pick from 'lodash.pick';

mg.showUI(
  __html__,
  {
    visible: true,
    width: 240,
    height: mg.viewport.bound.height,
  },
);

mg.ui.moveTo(
  mg.ui.viewport.x - (mg.viewport.bound.width * mg.viewport.zoom) + 240 + 12,
  mg.ui.viewport.y - 12,
);

const names = mg.document.name.split('-');
if (names.length !== 3) {
  throw Error('name of design file must be format of [domain]-design-[type:atoms|components|modules|clientends]');
}
const type = names[2];
// const targetComponentSetName = mg.document.currentPage.name.replaceAll('/', '-');
const list = mg.document.currentPage.name.split('/');
const targetComponentSetName = `${list[1]}@${list[2]}`;

const category = list[0];
const [name, version] = targetComponentSetName.split('@');

const adaptProps = (data: any, id: string, prop: ComponentPropertyValue) => {
  if (data.props[id]) {
    mergeDeep(data.props[id], prop);
  } else {
    // eslint-disable-next-line no-param-reassign
    data.props[id] = {
      ...prop,
      key: '',
      dataType: '',
    };
  }
};

const adaptPropDefaultValues = (
  data: any, id: string, prop: ComponentPropertyValue, components: ComponentNode[],
) => {
  const componentDefaultProps: VariantProperty[] = components[0].variantProperties || [];
  const value = componentDefaultProps.find((defaultProp) => `VARIANT-${defaultProp.property}` === id)?.value || '';
  if (data.defaultProps[id]) {
    mergeDeep(
      data.defaultProps[id],
      {
        ...prop,
        value,
      },
    );
  } else {
    // eslint-disable-next-line no-param-reassign
    data.defaultProps[id] = {
      ...prop,
      key: '',
      dataType: '',
      dataValue: '',
      value,
    };
  }
};

const adaptPropExampleValues = (
  data: any, id: string, prop: ComponentPropertyValue, components: ComponentNode[],
) => {
  components.filter((_it, idx) => idx !== 0).forEach((comp: ComponentNode) => {
    if (!data.examples[comp.name]) {
      // eslint-disable-next-line no-param-reassign
      data.examples[comp.name] = {
        name: '',
        propValues: {},
      };
    }
    const exampleValue = comp.variantProperties?.find((example) => `VARIANT-${example.property}` === id)?.value || '';
    if (data.examples[comp.name].propValues[id]) {
      mergeDeep(
        data.examples[comp.name].propValues[id],
        {
          ...prop,
          exampleValue,
        },
      );
    } else {
      // eslint-disable-next-line no-param-reassign
      data.examples[comp.name].propValues[id] = {
        ...prop,
        key: '',
        dataType: '',
        dataValue: '',
        exampleValue,
      };
    }
  });
};

const adaptData = (componentSet: ComponentSetNode): object => {
  let data: any = {};
  const stringValue = componentSet.getPluginData(`${type}-${targetComponentSetName}`);
  if (stringValue) {
    data = JSON.parse(stringValue);
  }

  if (!data.props) {
    data.props = {};
  }
  if (!data.defaultProps) {
    data.defaultProps = {};
  }
  if (!data.examples) {
    data.examples = {};
  }
  const pickProps: string[] = [];
  componentSet.componentPropertyValues.forEach((prop) => {
    const id = `${prop.type}-${prop.name}`;
    pickProps.push(id);
    adaptProps(data, id, prop);
    /* @ts-ignore */
    adaptPropDefaultValues(data, id, prop, componentSet.children);
    /* @ts-ignore */
    adaptPropExampleValues(data, id, prop, componentSet.children);
  });
  // clear prop removed
  data.props = pick(data.props, pickProps);
  data.defaultProps = pick(data.defaultProps, pickProps);
  /* @ts-ignore */
  componentSet.children.filter((_it, idx) => idx !== 0).forEach((comp: ComponentNode) => {
    data.examples[comp.name].propValues = pick(data.examples[comp.name].propValues, pickProps);
  });

  console.log('adapted data: ', data);
  return {
    intro: {
      category,
      name,
      version,
      status: data.intro?.status || 'designing',
    },
    ...data,
  };
};

mg.on('selectionchange', (selections: string[]) => {
  console.log('selections---', selections);
  // if (selections.length !== 1) {
  //   mg.ui.hide();
  //   return;
  // }
  const node = mg.getNodeById(selections[0]);
  // eslint-disable-next-line no-console
  console.log(targetComponentSetName, 'node-------', node);
  // eslint-disable-next-line max-len
  const filterProperties = (data:any) => data.map((item: { name: any; children: string | any[]; id: any; type: any; }) => ({
    name: item.name,
    children:
      item.children && item.children.length > 0
        ? filterProperties(item.children)
        : undefined,
    id: item.id,
    type: item.type,
  }));

  if (node?.type === 'COMPONENT_SET' && node.name === targetComponentSetName) {
    const data = adaptData(node);
    mg.ui.show();
    sendMsgToUI({
      event: PluginEvent.LOAD,
      data: {
        ...data,
        type,
        stage: 'define',
        example: node.children[0].name,
      },
    });
    return;
  }
  if (node?.type === 'COMPONENT') {
    const { parent } = node;
    if (parent?.type === 'COMPONENT_SET' && parent?.name === targetComponentSetName) {
      const data = adaptData(parent);
      mg.ui.show();
      sendMsgToUI({
        event: PluginEvent.LOAD,
        data: {
          ...data,
          type,
          stage: 'define',
          example: node.name,
        },
      });
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const test_data = filterProperties(node.children);

      // eslint-disable-next-line no-console
      console.log('COMPONENT----', node.children, test_data);
      return;
    }
  }
  if (node?.type === 'INSTANCE') {
    const { parent } = node;
    if (parent?.type === 'COMPONENT' && parent.parent?.type === 'COMPONENT_SET') {
      mg.ui.show();
      return;
    }
  }
  mg.ui.hide(); // 其他非关注节点选中, 隐藏UI避免影响用户操作
});

mg.ui.onmessage = (msg: { event: UIEvent, data: any }) => {
  const { event, data } = msg;
  switch (event) {
    case UIEvent.DEMO:
      break;
    default:
      throw Error(`un-excepted message.\nType: ${event}\nData:\n${JSON.stringify(data, null, 2)}`);
  }
};
