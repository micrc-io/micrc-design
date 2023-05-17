// picture composition
import React from 'react';

import { Default, Admin, Authc } from './picture.stories';

export const DefaultStory = () => <Default {...Default.args} />;
export const AdminStory = () => <Admin {...Admin.args} />;
export const AuthcStory = () => <Authc {...Authc.args} />;
