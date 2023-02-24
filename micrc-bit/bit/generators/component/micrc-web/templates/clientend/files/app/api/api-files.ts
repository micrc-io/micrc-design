/**
 * app/pages/400.ts、i18n.ts、tracker.ts、menu.ts、authz.ts
 */
import fs from 'fs';
import path from 'path';

import type { ClientendContextData } from '../../../_parser';

const api400 = `// 响应代理因无法获取x-host转发的400请求
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(400).end();
}
`;

const apiI18n = `// 独立运行时, 代理语言包获取请求
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).end();
}
`;

const apiMenu = `// 独立运行时, 代理菜单获取请求
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).end();
}
`;

const apiToken = `// 独立运行时, 代理token请求
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).end();
}`;

export function apiFiles(data: ClientendContextData) {
  const apiBasePath = path.resolve(data.intro.sourceDir, 'app', 'pages', 'api');
  if (!fs.existsSync(apiBasePath)) {
    fs.mkdirSync(apiBasePath, { recursive: true });
  }
  fs.writeFileSync(path.resolve(apiBasePath, '400.ts'), api400);
  fs.writeFileSync(path.resolve(apiBasePath, 'i18n.ts'), apiI18n);
  fs.writeFileSync(path.resolve(apiBasePath, 'menu.ts'), apiMenu);
  fs.writeFileSync(path.resolve(apiBasePath, 'authc.ts'), apiToken);
  return 'api files';
}
