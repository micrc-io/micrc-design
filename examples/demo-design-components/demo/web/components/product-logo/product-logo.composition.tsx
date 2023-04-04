// product-logo composition
import React from 'react';

import { Default, Test } from './product-logo.stories';

export const DefaultStory = () => <Default {...Default.args} />;
export const TestStory = () => <Test {...Test.args} />;
