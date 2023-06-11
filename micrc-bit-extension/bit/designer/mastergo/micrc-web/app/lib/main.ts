/**
 * api 主文件
 */
import { UIEvent, PluginEvent, sendMsgToUI } from '@messages/sender';

mg.showUI(
  __html__,
  {
    visible: false,
    width: 260,
    height: mg.viewport.bound.height,
  },
);

mg.ui.moveTo(
  mg.ui.viewport.x + 12,
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
  let retVal = {};
  const stringValue = componentSet.getPluginData(`${type}-targetComponentSetName`);
  if (stringValue) {
    retVal = JSON.parse(stringValue);
  }
  const componentProps = componentSet.componentPropertyValues;
  // todo 状态属性至少有一个且名为example, 不存在添加, 默认值为default;存在, 默认值必须是default
  // todo 可以存在一个children属性且类型必须是INSTANCE_SWAP, 若存在但类型为其他则自动修改
  // todo 任何类型的所有属性不能重名, 若重名保留第一个
  const props = {};
  return {
    id: {
      category,
      name,
      version,
    },
    ...retVal,
    props,
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
