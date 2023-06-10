/**
 * api 主文件
 */
import { UIMessage } from '@messages/sender';

mg.showUI(
  __html__,
  {
    visible: true,
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

const onComponentSelected = (component: ComponentNode) => {
  const { parent } = component;
  if (!parent) { // 没有父组件集, 需要默认创建一个examples状态属性
    // todo 创建一个examples属性，默认值为default
    mg.ui.show();
    return;
  }
  if (parent && parent.type === 'COMPONENT_SET') { // 存在父组件集, 选中组件样例
    mg.ui.show();
    return;
  }
  mg.ui.hide();
};

const onComponentSetSelected = (componentSet: ComponentSetNode) => {
  console.log(componentSet.name);
  // todo 名称与页面名称相同, 认为是有效组件集
  // todo 在pluginData中获取intro信息
  // todo 在pluginData中获取私有属性信息
  // todo 获取组件集公有属性信息
  mg.ui.show();
};

const onInstanceSelected = (instance: InstanceNode) => {
  const { parent } = instance;
  if (parent && parent.type === 'COMPONENT') {
    const parentSet = parent.parent;
    if (parentSet && parentSet.type === 'COMPONENT_SET') {
      console.log(parentSet.name);
      // todo 组件集名称与页面名称相同, 认为是有效组件集
      // todo 获取实例的公有属性信息
      mg.ui.show();
      return;
    }
  }
  mg.ui.hide();
};

mg.on('selectionchange', (selections: string[]) => {
  if (selections.length !== 1) {
    mg.ui.hide();
    return;
  }
  const node = mg.getNodeById(selections[0]);
  if (node?.type === 'COMPONENT') {
    onComponentSelected(node);
    return;
  }
  if (node?.type === 'COMPONENT_SET') { // 选中组件集, 打开组件定义面板
    onComponentSetSelected(node);
    return;
  }
  if (node?.type === 'INSTANCE') { // 选中组件实例, 判定为当前设计的组件, 打开组件设计面板
    onInstanceSelected(node);
    return;
  }
  mg.ui.hide(); // 其他节点选中, 隐藏UI
});

mg.ui.onmessage = (msg: { type: UIMessage, data: any }) => {
  const { type, data } = msg;
  if (type === UIMessage.HELLO) {
    const textNode = mg.createText();
    textNode.characters = data;
  }
};
