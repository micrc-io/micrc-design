// 插件发出的消息
export enum PluginEvent {
  LOAD,
}

// UI发出的消息
export enum UIEvent {
  DEMO,
}

type MessageType = {
  event: UIEvent | PluginEvent,
  data?: any;
};

/**
 * 向UI发送消息
 */
export const sendMsgToUI = (data: MessageType) => {
  mg.ui.postMessage(data, '*');
};

/**
 * 向插件发送消息
 */
export const sendMsgToPlugin = (data: MessageType) => {
  // eslint-disable-next-line no-restricted-globals
  parent.postMessage(data, '*');
};
