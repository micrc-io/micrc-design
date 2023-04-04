// product-introduction composition
import React from 'react';

import { Default, Test } from './product-introduction.stories';

export const DefaultStory = () => <Default {...Default.args} />;
export const TestStory = () => <Test {...Test.args} />;
