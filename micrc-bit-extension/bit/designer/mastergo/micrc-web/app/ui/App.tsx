/**
 * App entry
 */
import React, { useState, useEffect } from 'react';

// import { sendMsgToPlugin, UIMessage } from '@messages/sender';

import './App.css';

type MicrcWebDesignerProps = {
  type: string | null,
  stage: string | null,
};

const MicrcWebDesigner = ({ type, stage }: MicrcWebDesignerProps) => {
  console.log(type);
  console.log(stage);
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
    type: null,
    stage: null,
  });

  useEffect(() => {
    const messageListener = async (event: any) => {
      setState({
        ...state,
        type: event.data.type,
        stage: event.data.stage,
      });
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
