// input-test stories
import React from 'react';

import type { InputTestProps } from './input-test';
import { InputTest } from './input-test';

export default {
  component: InputTest,
  title: 'micrc.bit/_examples/web/components/input-test',
};

const Template = (props: InputTestProps) => <InputTest {...props} />;
