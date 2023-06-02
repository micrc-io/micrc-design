// form-authc composition
import React from 'react';

import { Default, SystemAccountAogin } from './form-authc.stories';

export const DefaultStory = () => <Default {...Default.args} />;
export const SystemAccountAoginStory = () => (
  <SystemAccountAogin {...SystemAccountAogin.args} />
);
