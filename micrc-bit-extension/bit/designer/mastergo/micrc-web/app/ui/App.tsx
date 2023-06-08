/**
 * App entry
 */
import React, { useState, useEffect } from 'react';
import './App.css';
import { sendMsgToPlugin, UIMessage } from '@messages/sender';

function App() {
  const [mg] = useState('MasterGo');

  useEffect(() => {
    sendMsgToPlugin({
      type: UIMessage.HELLO,
      data: 'hello',
    });
  }, []);

  return (
    <div className="hello">
      Hello
      {mg}
    </div>
  );
}
export default App;
