// product-logo1 composition
import React from 'react';

import { Default, Test } from './product-logo1.stories';

export const DefaultStory = () => <Default {...Default.args} />;
export const TestStory = () => <Test {...Test.args} />;
