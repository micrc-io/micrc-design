/**
 * 集成模拟器, 用于模块独立启动时的行为集成模拟
 */
import React, { useState } from 'react';

import { Button, FloatButton, Modal } from 'antd';

import { remoteStore } from '../micrc-web';
import type { IntegrationTopic } from './index';

export const IntegrationSimulator = (
  {
    integration,
  }: {
    integration: {
      produce: Record<string, IntegrationTopic>,
      consume: Record<string, IntegrationTopic>,
    }
  },
) => {
  const [open, setOpen] = useState(false);
  const { action, bind } = remoteStore({}, null, null);
  const produceSimulator = [];
  const consumeSimulator = [];
  if (!integration || (!integration.consume && !integration.produce)) {
    return null;
  }
  // 自身为消费方, 模拟生产方
  // eslint-disable-next-line no-restricted-syntax
  for (const topic of Object.values(integration.consume)) {
    const send = action({
      op: 'integrate',
      path: `/${topic.name}:${topic.producer.pageUri}:${topic.producer.moduleId}`,
      value: topic.producer.exampleState,
    });
    produceSimulator.push(
      <Button key={topic.name} onClick={() => send()}>
        生产者:
        {`${topic.producer.pageUri} -- ${topic.producer.moduleId}`}
      </Button>,
    );
  }
  // 自身为生产方, 模拟展示各消费方绑定的数据
  // eslint-disable-next-line no-restricted-syntax
  for (const topic of Object.values(integration.produce)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const consumer of Object.values(topic.consumers)) {
      const receive = bind(
        `integrate:///${topic.name}/consumers`
        + `/${consumer.pageUri.replace(/\//g, '~1')}:${consumer.moduleId.replace(/\//g, '~1')}`
        + '/state',
      );
      consumeSimulator.push(
        <div key={`${consumer.pageUri}:${consumer.moduleId}`}>
          <span>{`${consumer.pageUri}:${consumer.moduleId}`}</span>
          <pre>
            <code>
              { JSON.stringify(receive, null, 2) }
            </code>
          </pre>
        </div>,
      );
    }
  }
  return (
    <>
      <FloatButton onClick={() => setOpen(true)} />
      <Modal open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
        <div>
          <div>生产模拟</div>
          { consumeSimulator }
        </div>
        <div>
          <div>消费模拟</div>
          { produceSimulator }
        </div>
      </Modal>
    </>
  );
};
