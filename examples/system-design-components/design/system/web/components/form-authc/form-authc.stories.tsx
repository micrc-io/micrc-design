/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
 * form-authc stories
 */
import React from 'react';

import locale from 'antd/locale/zh_CN'; // todo 根据开发机系统语言动态化

import { ConfigProvider } from 'antd';

import type { FormAuthcProps } from './form-authc';
import { FormAuthc } from './form-authc';

export default {
  component: FormAuthc,
  title: 'colibri-tech.design/system/web/components/form-authc',
};

const Template = (props: FormAuthcProps) => (
  <ConfigProvider locale={locale}>
    <FormAuthc {...props} />
  </ConfigProvider>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  micrc: {
    type: 'web',
  },
};
export const SystemAccountAogin = Template.bind({});
SystemAccountAogin.args = {
  userName: { label: '用户名', placeholder: '请输入用户名' },
  userNameMsg: '请输入正确的用户名',
  userNameStatus: 'error',
  passWord: { label: '密码', placeholder: '请输入密码' },
  passWordMsg: '请输入正确的用户名',
  passWordStatus: 'warning',
  authCode: { label: '验证码', placeholder: '请输入验证码' },
  authCodeMsg: '请输入正确的验证码',
  authCodeStatus: 'success',
  authCodeImg:
    'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAgCAIAAABxdar3AAABa0lEQVR42u2aMQ7CMAxFPfcWHIGBM3AMzgISEzMbM1dhYmLjGJyASpGiyEmctEmcOI3koTIIqY9v+zst7HfTiBUBA0FOcIfTccQcTStOKE3oWGhb7HHtw93ucEhkCrKaVM925Py8qIj59PZ66Bg+bgqCQ8j6BxdfUwoQkVSw7Gspk7rUcLALlpChrbj222LBqWrqS3N03pupOPQjv897DvPazKD43q8ocg09bjuiVUbIzVSczdSEhSJILZ1dNR+nhUZQc5YqUhzCZCd9mKSCo92Js1SdiqPzmhpnv4PEFsCjODpftCS57QiaCcRkSFFcJLgSgxgYJkP8cMiuuHLeBQptprbKIu3I6h7HvBcDg9yCVs4JjlCcbzh0u6v68jGlSivRN1hVpp/TEeeS71z4Y3pcDwY4aD70F7KDy75y0etXJyfA/IedUPcm5T4DggYlU0g7YgzwRl+BqHhqKOJp7FDcsr9wgBtvK1WKP4T/sf2S2p5bAAAAAElFTkSuQmCC',
  btnName: '登陆',
  loading: false,
  submit: (param) => console.log(`param: ${param}`),
  changeUserName: (value) => console.log(`value: ${value}`),
  changePassWord: (value) => console.log(`value: ${value}`),
  changeAuthCode: (value) => console.log(`value: ${value}`),
  changeAuthCodeImg: (value) => console.log(`value: ${value}`),
};
SystemAccountAogin.parameters = {
  micrc: {
    type: 'web',
  },
};
