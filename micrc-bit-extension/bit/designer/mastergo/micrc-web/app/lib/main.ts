/**
 * api 主文件
 */
import { UIEvent, PluginEvent, sendMsgToUI } from '@messages/sender';
import mergeDeep from 'lodash.merge';
import pick from 'lodash.pick';

mg.showUI(
  __html__,
  {
    visible: false,
    width: 240,
    height: mg.viewport.bound.height,
  },
);

mg.ui.moveTo(
  mg.ui.viewport.x - mg.viewport.bound.width + 240 + 12,
  mg.ui.viewport.y - 12,
);

const names = mg.document.name.split('-');
if (names.length !== 3) {
  throw Error('name of design file must be format of [domain]-design-[type:atoms|components|modules|clientends]');
}
const type = names[2];
const targetComponentSetName = mg.document.currentPage.name.replaceAll('/', '-');
const [category, name, version] = targetComponentSetName.split('-');

const adaptData = (componentSet: ComponentSetNode): object => {
  let data: any = {};
  const stringValue = componentSet.getPluginData(`${type}-${targetComponentSetName}`);
  if (stringValue) {
    data = JSON.parse(stringValue);
  }
  const componentProps = componentSet.componentPropertyValues;
  console.log(componentProps)
  /* @ts-ignore */
  const componentDefaultProps: VariantProperty[] = componentSet.children[0].variantProperties;
  console.log(componentDefaultProps);
  // props处理
  if (!data.props) {
    data.props = {};
  }
  if (!data.defaultProps) {
    data.defaultProps = {};
  }
  const pickProps: string[] = [];
  componentProps.forEach((it) => {
    const id = `${it.type}-${it.name}`;
    pickProps.push(id);
    if (data.props[id]) {
      mergeDeep(data.props[id], it);
    } else {
      data.props[id] = {
        ...it,
        key: '',
        dataType: '',
      };
    }

    const value = componentDefaultProps.find((item) => `VARIANT-${item.property}` === id)?.value || '';
    if (data.defaultProps[id]) {
      mergeDeep(
        data.defaultProps[id],
        {
          ...it,
          value,
        },
      );
    } else {
      data.defaultProps[id] = {
        ...it,
        key: '',
        dataType: '',
        dataValue: '',
        value,
      };
    }
  });
  data.props = pick(data.props, pickProps);
  data.defaultProps = pick(data.defaultProps, pickProps);

  console.log('adapted data: ', data);
  return {
    intro: {
      category,
      name,
      version,
      status: data.intro?.version || 'designing',
    },
    ...data,
  };
};

mg.on('selectionchange', (selections: string[]) => {
  if (selections.length !== 1) {
    mg.ui.hide();
    return;
  }
  const node = mg.getNodeById(selections[0]);
  if (node?.type === 'COMPONENT_SET' && node.name === targetComponentSetName) {
    const data = adaptData(node);
    mg.ui.show();
    sendMsgToUI({
      event: PluginEvent.LOAD,
      data: {
        ...data,
        type,
        stage: 'define',
      },
    });
    return;
  }
  if (node?.type === 'COMPONENT') {
    const { parent } = node;
    if (parent?.type === 'COMPONENT_SET' && parent?.name === targetComponentSetName) {
      mg.ui.show();
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
  mg.ui.hide(); // 其他节点选中, 隐藏UI
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
