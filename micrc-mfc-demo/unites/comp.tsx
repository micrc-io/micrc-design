import React, { Suspense, lazy } from 'react';

import { Spin } from 'antd';

const CompUnite = lazy(() => import('remote1/comp'));

export default function Comp() {
  // 包装remote业务单元，两种状态需要考虑
  // 1. 正在载入
  // 2. 载入失败/或压根就没上线 - 这里可以实现产品预发布，问卷等功能，想象空间很大
  //    对suspense进行包装，分三种情况，design子域自己发业务单元，属于设计预览，甚至支持简单的在线设计
  //    运营子域发问卷，可以针对性市场调研
  //    相应业务子域发业务单元，默认就是建设中及预计发布时间
  return (
    <Suspense fallback={<Spin />}>
      <CompUnite />
    </Suspense>
  );
}
