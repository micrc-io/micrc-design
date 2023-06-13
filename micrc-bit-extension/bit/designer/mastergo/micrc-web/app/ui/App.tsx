/**
 * App entry
 */
import React, { useState, useEffect } from 'react';

import { PluginEvent, sendMsgToPlugin } from '@messages/sender';

import './App.css';

type MicrcWebDesignerProps = {
  type: string | null,
  stage: string | null,
  intro: object | null,
  props: object | null,
  defaultProps: object | null,
  states: object | null,
};

const MicrcWebDesigner = ({
  type, stage, intro, props, defaultProps, states,
}: MicrcWebDesignerProps) => {
  console.log('props: ', {
    type, stage, intro, props, defaultProps, states,
  });
  return (
    <div>
      <p>
        处理组件类型:
        <code>{JSON.stringify(type, null, 2)}</code>
      </p>
      <p>
        处理阶段:
        <code>{JSON.stringify(stage, null, 2)}</code>
      </p>
      <p>
        组件intro:
        <code>{JSON.stringify(intro, null, 2)}</code>
      </p>
      <p>
        组件props:
        <code>{JSON.stringify(props, null, 2)}</code>
      </p>
      <p>
        组件defaultProps:
        <code>{JSON.stringify(defaultProps, null, 2)}</code>
      </p>
      <p>
        组件states:
        <code>{JSON.stringify(states, null, 2)}</code>
      </p>
    </div>
  );
};

export const App = () => {
  const [state, setState] = useState<MicrcWebDesignerProps>({
    type: null,
    stage: null,
    intro: null,
    props: null,
    defaultProps: null,
    states: null,
  });

  useEffect(() => {
    const messageListener = async (msg: any) => {
      const { event, data } = msg.data;
      switch (event) {
        case PluginEvent.LOAD:
          setState({
            ...state,
            type: data.type,
            stage: data.stage,
            intro: data.intro,
            props: data.props,
            defaultProps: data.defaultProps,
            states: data.states,
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  return (
    <MicrcWebDesigner {...state} />
  );
};
