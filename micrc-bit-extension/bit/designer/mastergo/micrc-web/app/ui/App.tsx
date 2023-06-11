/**
 * App entry
 */
import React, { useState, useEffect } from 'react';

import { PluginEvent, sendMsgToPlugin } from '@messages/sender';

import './App.css';

type MicrcWebDesignerProps = {
  id: {
    category: string,
    name: string,
    version: string,
  } | null,
  type: string | null,
  stage: string | null,
  intro: object | null,
  props: object | null,
  states: object | null,
};

const MicrcWebDesigner = (props: MicrcWebDesignerProps) => {
  console.log(props);
  return (
    <div>
      <span>各种类型和阶段的面板</span>
      <p>
        atoms-define,components-define,modules-define,clientends-define
      </p>
      <p>
        atoms-design,components-design,modules-design,clientends-design
      </p>
    </div>
  );
};

export const App = () => {
  const [state, setState] = useState<MicrcWebDesignerProps>({
    id: null,
    type: null,
    stage: null,
    intro: null,
    props: null,
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
            id: data.id,
            props: data.props,
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
