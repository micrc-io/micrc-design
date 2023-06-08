/**
 * api 主文件
 */
import { UIMessage } from '@messages/sender';

// mg.showUI(__html__);

console.log(mg.document.children);
console.log(mg.document.currentPage.selection);

mg.on('selectionchange', (selections: string[]) => {
  if (selections.length !== 1) {
    return;
  }
  const componentNode = mg.getNodeById(selections[0]);
  console.log('选中组件: ', componentNode);
  if (componentNode?.type === 'COMPONENT') {
    console.log(componentNode.componentPropertyValues);
  }
  if (componentNode?.type === 'COMPONENT_SET') {
    console.log(componentNode.componentPropertyValues);
  }
});

mg.ui.onmessage = (msg: { type: UIMessage, data: any }) => {
  const { type, data } = msg;
  if (type === UIMessage.HELLO) {
    const textNode = mg.createText();
    textNode.characters = data;
  }
};
