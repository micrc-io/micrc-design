// list stories
import React from 'react';

import type { ListProps } from './list';
import { List } from './list';

export default {
  component: List,
  title: 'micrc.bit/_examples/web/components/list',
};

const Template = (props: ListProps) => <List {...props} />;
