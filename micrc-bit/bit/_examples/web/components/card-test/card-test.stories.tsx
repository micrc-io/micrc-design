// card-test stories
import React from 'react';

import type { CardTestProps } from './card-test';
import { CardTest } from './card-test';

export default {
  component: CardTest,
  title: 'micrc.bit/_examples/web/components/card-test',
};

const Template = (props: CardTestProps) => <CardTest {...props} />;
